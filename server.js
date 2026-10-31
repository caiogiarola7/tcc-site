
require('dotenv').config();

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const termos = require('./termos.json');

const app = express();

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const limitadorChat = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(429).end('Você mandou muitas perguntas em pouco tempo. Espera um minuto e tenta de novo.');
  }
});

const limitadorAnalisador = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(429).end('Você fez muitas análises em pouco tempo. Espera um minuto e tenta novamente.');
  }
});

app.get('/api/termos', (req, res) => {
  res.json(termos);
});

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizarHistorico(historico) {
  if (!Array.isArray(historico)) {
    return [];
  }

  return historico
    .filter(item =>
      item &&
      (item.role === 'user' || item.role === 'model') &&
      typeof item.text === 'string' &&
      item.text.trim()
    )
    .slice(-16)
    .map(item => ({
      role: item.role,
      parts: [{
        text: item.text.trim().slice(0, 12000)
      }]
    }));
}

const LIMITE_ANEXOS = 5;
const LIMITE_TOTAL_ANEXOS = 8 * 1024 * 1024;

const EXTENSOES_TEXTO = new Set([
  '.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css',
  '.json', '.md', '.py', '.java', '.c', '.cpp', '.cs',
  '.php', '.sql', '.xml', '.csv', '.yaml', '.yml', '.sh',
  '.log'
]);

const TIPOS_INLINE_PERMITIDOS = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
]);

function prepararPartesAnexos(anexos) {
  if (anexos === undefined || anexos === null) {
    return [];
  }

  if (!Array.isArray(anexos)) {
    throw new Error('Os arquivos enviados não estão em um formato válido.');
  }

  if (anexos.length > LIMITE_ANEXOS) {
    throw new Error(`Você pode enviar no máximo ${LIMITE_ANEXOS} arquivos por mensagem.`);
  }

  let totalBytes = 0;
  const partes = [];

  for (const anexo of anexos) {
    if (!anexo || typeof anexo.name !== 'string') {
      throw new Error('Um dos arquivos enviados não é válido.');
    }

    const nome = anexo.name
      .replace(/[\\/]/g, '_')
      .replace(/[\u0000-\u001f]/g, '')
      .trim()
      .slice(0, 150);

    if (!nome) {
      throw new Error('Um dos arquivos está sem nome.');
    }

    const extensao = path.extname(nome).toLowerCase();

    if (anexo.kind === 'text') {
      if (!EXTENSOES_TEXTO.has(extensao) || typeof anexo.text !== 'string') {
        throw new Error(`O arquivo "${nome}" não é um arquivo de texto ou código compatível.`);
      }

      const tamanho = Buffer.byteLength(anexo.text, 'utf8');
      totalBytes += tamanho;

      if (totalBytes > LIMITE_TOTAL_ANEXOS) {
        throw new Error('O tamanho total dos arquivos ultrapassa 8 MB. Remova alguns arquivos ou envie versões menores.');
      }

      partes.push({
        text: `\n\nConteúdo do arquivo "${nome}":\n\n${anexo.text}`
      });

      continue;
    }

    if (anexo.kind === 'inline') {
      const mimeType = typeof anexo.mimeType === 'string'
        ? anexo.mimeType.toLowerCase()
        : '';

      if (!TIPOS_INLINE_PERMITIDOS.has(mimeType)) {
        throw new Error(`O formato do arquivo "${nome}" não é compatível. Use imagens PNG, JPG, WEBP ou GIF, ou arquivos PDF.`);
      }

      if (
        typeof anexo.data !== 'string' ||
        !anexo.data ||
        !/^[A-Za-z0-9+/]+={0,2}$/.test(anexo.data) ||
        anexo.data.length % 4 !== 0
      ) {
        throw new Error(`Não foi possível ler o arquivo "${nome}". Tente anexá-lo novamente.`);
      }

      const tamanho = Buffer.from(anexo.data, 'base64').length;
      totalBytes += tamanho;

      if (totalBytes > LIMITE_TOTAL_ANEXOS) {
        throw new Error('O tamanho total dos arquivos ultrapassa 8 MB. Remova alguns arquivos ou envie versões menores.');
      }

      partes.push({
        text: `Arquivo anexado: "${nome}" (${mimeType}). Analise o conteúdo deste arquivo.`
      });

      partes.push({
        inlineData: {
          mimeType,
          data: anexo.data
        }
      });

      continue;
    }

    throw new Error(`Não foi possível reconhecer o formato do arquivo "${nome}".`);
  }

  return partes;
}

async function iniciarStreamGemini({
  contents,
  systemInstruction,
  tentativa = 1
}) {
  if (!GEMINI_API_KEY) {
    throw new Error('A chave GEMINI_API_KEY não foi configurada no ambiente.');
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse';

  const corpo = {
    systemInstruction: {
      parts: [{
        text: systemInstruction
      }]
    },
    contents,
    generationConfig: {
      thinkingConfig: {
        thinkingLevel: 'minimal'
      }
    }
  };

  const respostaIA = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(corpo)
  });

  if (
    !respostaIA.ok &&
    respostaIA.status === 503 &&
    tentativa < 3
  ) {
    console.log(`Gemini sobrecarregada. Tentativa ${tentativa + 1}...`);

    await esperar(700 * tentativa);

    return iniciarStreamGemini({
      contents,
      systemInstruction,
      tentativa: tentativa + 1
    });
  }

  return respostaIA;
}

function extrairTextoEvento(evento) {
  const parts = evento?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return '';
  }

  let texto = '';

  for (const parte of parts) {
    if (parte?.thought === true) {
      continue;
    }

    if (typeof parte?.text === 'string') {
      texto += parte.text;
    }
  }

  return texto;
}

function processarEventoSSE(linhas, res) {
  const dados = [];

  for (const linha of linhas) {
    if (linha.startsWith('data:')) {
      dados.push(linha.slice(5).replace(/^ /, ''));
    }
  }

  if (dados.length === 0) {
    return;
  }

  const json = dados.join('\n').trim();

  if (!json || json === '[DONE]') {
    return;
  }

  try {
    const evento = JSON.parse(json);
    const texto = extrairTextoEvento(evento);

    if (texto && !res.destroyed && !res.writableEnded) {
      res.write(texto);
    }
  } catch {
    return;
  }
}

async function transmitirRespostaGemini(respostaIA, res) {
  if (!respostaIA.body) {
    throw new Error('A resposta da Gemini não contém um fluxo de dados.');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Accel-Buffering', 'no');

  const reader = respostaIA.body.getReader();
  const decoder = new TextDecoder();

  let bufferRestante = '';
  let linhasEvento = [];

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      bufferRestante += decoder.decode(value, { stream: true });

      const linhas = bufferRestante.split(/\r\n|\r|\n/);
      bufferRestante = linhas.pop() || '';

      for (const linha of linhas) {
        if (linha === '') {
          processarEventoSSE(linhasEvento, res);
          linhasEvento = [];
        } else {
          linhasEvento.push(linha);
        }
      }
    }

    bufferRestante += decoder.decode();

    if (bufferRestante) {
      linhasEvento.push(bufferRestante);
    }

    if (linhasEvento.length > 0) {
      processarEventoSSE(linhasEvento, res);
    }
  } finally {
    reader.releaseLock();
  }

  if (!res.writableEnded && !res.destroyed) {
    res.end();
  }
}

app.post('/api/chat', limitadorChat, async (req, res) => {
  const corpo = req.body && typeof req.body === 'object' ? req.body : {};

  const {
    pergunta,
    historico,
    anexos
  } = corpo;

  if (typeof pergunta !== 'string' || !pergunta.trim()) {
    return res.status(400).json({
      erro: 'Envie uma pergunta.'
    });
  }

  if (pergunta.length > 12000) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    return res.status(400).end(
      'A mensagem é muito grande. Envie um trecho menor.'
    );
  }

  let partesAnexos;

  try {
    partesAnexos = prepararPartesAnexos(anexos);
  } catch (erro) {
    return res.status(400).json({
      erro: erro.message || 'Um dos arquivos anexados não é válido.'
    });
  }

  const systemInstruction = `
Você é o CodeHelper, um assistente e tutor de programação para iniciantes.

Sua função é ajudar o usuário a aprender programação, entender códigos, encontrar erros e resolver dúvidas. Quando houver arquivos anexados, analise o conteúdo deles junto com a pergunta do usuário.

REGRAS:

- Responda normalmente em português do Brasil.
- Use TODO o histórico da conversa para entender referências como "isso", "esse código", "o exemplo anterior", "explica melhor" e "faz em Python".
- Nunca peça novamente um conteúdo que já esteja disponível no histórico.
- Responda diretamente ao que foi pedido.
- Evite introduções desnecessárias.
- Se o usuário pedir para simplificar algo, explique novamente o assunto anterior de forma mais simples e completa.
- Explique conceitos primeiro de maneira simples.
- Quando necessário, aprofunde tecnicamente.
- Quando o usuário enviar código, analise o código enviado.
- Se houver erro, diga onde está, explique por que acontece e mostre a correção.
- Diferencie erro de sintaxe, lógica e execução quando for relevante.
- Nunca diga que executou um código se você não executou.
- Quando mostrar código, use blocos Markdown e informe a linguagem.
- Se o usuário pedir um exercício, não entregue a solução imediatamente, a menos que ele peça.
- Seja didático, direto e objetivo.
- O foco principal é programação e desenvolvimento de software.
  `.trim();

  const contents = normalizarHistorico(historico);

  contents.push({
    role: 'user',
    parts: [
      {
        text: pergunta.trim()
      },
      ...partesAnexos
    ]
  });

  try {
    const respostaIA = await iniciarStreamGemini({
      contents,
      systemInstruction
    });

    if (!respostaIA.ok) {
      console.error('Erro Gemini:', respostaIA.status);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      return res.status(502).end(
        'A IA está indisponível agora. Tente novamente em alguns segundos.'
      );
    }

    await transmitirRespostaGemini(respostaIA, res);
  } catch (erro) {
    console.error('Erro no chat:', erro);

    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      return res.status(500).end(
        'Erro ao consultar a IA.'
      );
    }

    if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
});

app.post('/api/analisar', limitadorAnalisador, async (req, res) => {
  const corpo = req.body && typeof req.body === 'object' ? req.body : {};

  const {
    codigo,
    linguagem
  } = corpo;

  if (typeof codigo !== 'string' || !codigo.trim()) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    return res.status(400).end(
      'Cole algum código para analisar.'
    );
  }

  if (codigo.length > 20000) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    return res.status(400).end(
      'O código é muito grande. Envie um trecho menor.'
    );
  }

  const linguagemSelecionada = typeof linguagem === 'string'
    ? linguagem.slice(0, 50)
    : 'Não informada';

  const systemInstruction = `
Você é o analisador de código do CodeHelper.

Seu trabalho é revisar códigos enviados principalmente por estudantes e programadores iniciantes.

Analise somente o código realmente enviado. Não invente erros.

Responda em português do Brasil.

Organize a análise usando exatamente estas seções quando forem aplicáveis:

## Resumo
Explique em poucas frases o que o código faz.

## Problemas encontrados
Liste erros de sintaxe, execução ou lógica encontrados.
Se não houver erros aparentes, diga claramente que não encontrou erros evidentes.

## Como corrigir
Explique de forma simples como resolver os problemas encontrados.

## Código corrigido
Se houver algo para corrigir, mostre uma versão corrigida em um bloco Markdown usando a linguagem correta.

## Melhorias opcionais
Dê poucas sugestões de legibilidade, organização ou boas práticas, somente quando forem realmente úteis.

REGRAS:

- Não diga que executou o código.
- Não invente resultado de execução.
- Não transforme sugestões de estilo em erros.
- Diferencie erro real de melhoria opcional.
- Seja direto e didático.
- Considere a linguagem informada pelo usuário.
- Se a linguagem informada parecer incorreta, avise.
  `.trim();

  const prompt = `
Linguagem informada: ${linguagemSelecionada}

Código para análise:

${codigo}
  `.trim();

  const contents = [
    {
      role: 'user',
      parts: [{
        text: prompt
      }]
    }
  ];

  try {
    const respostaIA = await iniciarStreamGemini({
      contents,
      systemInstruction
    });

    if (!respostaIA.ok) {
      console.error('Erro no analisador:', respostaIA.status);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      return res.status(502).end(
        'Não foi possível analisar o código agora. Tente novamente em alguns segundos.'
      );
    }

    await transmitirRespostaGemini(respostaIA, res);
  } catch (erro) {
    console.error('Erro ao analisar código:', erro);

    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');

      return res.status(500).end(
        'Erro ao analisar o código.'
      );
    }

    if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`CodeHelper rodando em http://localhost:${PORT}`);
});
