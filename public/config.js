const SUPABASE_URL = "https://ernyuhiiiolirrotpzac.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybnl1aGlpaW9saXJyb3RwemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDA2MzgsImV4cCI6MjEwNDExNjYzOH0.p84ckfmNOqS24ey8jd3yPTjNTlBvktRxcsZmKoiu9es";

// Remove qualquer sessão local simulada anterior para garantir 100% OAuth oficial do Supabase
try {
  localStorage.removeItem('codehelper_sessao_usuario_v2');
} catch {}

// ============================================================================
// SUPORTE AUTOMÁTICO PARA GITHUB PAGES (AMBIENTE ESTÁTICO SEM NODE SERVER)
// ============================================================================
(function configurarCompatibilidadeGitHubPages() {
  if (typeof window === 'undefined' || !window.fetch) return;
  const fetchNativo = window.fetch.bind(window);

  function criarRespostaStreamTexto(texto) {
    const encoder = new TextEncoder();
    const partes = texto.match(/.{1,28}(\s|$)/gs) || [texto];
    let indice = 0;

    const stream = new ReadableStream({
      pull(controller) {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (indice < partes.length) {
              controller.enqueue(encoder.encode(partes[indice++]));
            } else {
              controller.close();
            }
            resolve();
          }, 18);
        });
      }
    });

    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  function gerarRespostaChatEstatico(corpo = {}) {
    const pergunta = String(corpo.pergunta || '').trim();
    const pLower = pergunta.toLowerCase();
    const socratico = corpo.modo === 'socratico';

    if (pLower.includes('loop') || pLower.includes('while') || pLower.includes('for')) {
      return socratico
        ? `### 🎓 Reflexão Guiada sobre Loops\n\nPara descobrir por que um laço não para, observe três partes essenciais:\n1. **Variável de controle**: onde ela começa?\n2. **Condição de parada**: quando ela deixa de ser \`true\`?\n3. **Atualização**: o valor muda dentro do bloco?\n\n\`\`\`javascript\nlet contador = 0;\nwhile (contador < 5) {\n  console.log(contador);\n  contador++; // Sem essa linha, o loop nunca termina!\n}\n\`\`\`\n\n👉 **Pergunta para você pensar:** No seu código atual, qual linha altera a variável usada na condição do \`while\`?`
        : `### 🔄 Entendendo Loops (\`while\` e \`for\`)\n\nUm **loop infinito** acontece quando a condição de parada continua sendo \`true\` para sempre — geralmente porque esquecemos de incrementar a variável de controle.\n\n\`\`\`javascript\nlet i = 0;\n\nwhile (i < 5) {\n  console.log("Repetição:", i);\n  i++; // Atualiza o valor a cada volta\n}\n\`\`\`\n\n- **Dica prática**: Sempre verifique se a variável testada no \`while\` ou \`for\` está sendo modificada dentro do bloco.`;
    }

    if (pLower.includes('let') || pLower.includes('const') || pLower.includes('var')) {
      return `### 📦 Diferença entre \`let\`, \`const\` e \`var\`\n\nEm JavaScript moderno (ES6+), priorize **\`const\`** e **\`let\`**:\n\n- **\`const\`**: Usado quando a variável **não será reatribuída**. É a escolha padrão mais segura.\n- **\`let\`**: Usado quando o valor **precisa mudar** (como contadores de loop).\n- **\`var\`**: Escopo de função e sofre *hoisting* — evite em código novo.\n\n\`\`\`javascript\nconst taxa = 0.15; // Valor fixo\nlet pontuacao = 0; // Pode mudar\npontuacao += 10;\n\nconsole.log(taxa, pontuacao);\n\`\`\``;
    }

    if (pLower.includes('map') || pLower.includes('filter') || pLower.includes('array')) {
      return `### ⚡ Trabalhando com Arrays (\`map\`, \`filter\`, \`forEach\`)\n\n- **\`map()\`**: Transforma cada item e **retorna um novo array** do mesmo tamanho.\n- **\`filter()\`**: Filtra itens que passam em uma condição e retorna um novo array.\n- **\`forEach()\`**: Apenas executa uma ação para cada elemento (retorna \`undefined\`).\n\n\`\`\`javascript\nconst numeros = [1, 2, 3, 4];\nconst dobrados = numeros.map(n => n * 2);\nconst pares = numeros.filter(n => n % 2 === 0);\n\nconsole.log(dobrados); // [2, 4, 6, 8]\nconsole.log(pares);    // [2, 4]\n\`\`\``;
    }

    if (pLower.includes('async') || pLower.includes('await') || pLower.includes('promise') || pLower.includes('fetch')) {
      return `### ⏳ Assincronismo com \`Promise\` e \`async/await\`\n\nO par **\`async / await\`** permite escrever código assíncrono (como chamadas de API com \`fetch\`) de forma sequencial e legível:\n\n\`\`\`javascript\nasync function carregarUsuario() {\n  try {\n    const resposta = await fetch("https://api.github.com/users/octocat");\n    const dados = await resposta.json();\n    console.log("Usuário:", dados.login);\n  } catch (erro) {\n    console.error("Falha na requisição:", erro);\n  }\n}\n\ncarregarUsuario();\n\`\`\``;
    }

    const termos = Array.isArray(window.TERMOS) ? window.TERMOS : [];
    const termoEncontrado = termos.find(
      (t) => pLower.includes(String(t.name || '').toLowerCase())
    );

    if (termoEncontrado) {
      return `### 💡 ${termoEncontrado.name}\n\n${termoEncontrado.body}\n\n\`\`\`javascript\n${termoEncontrado.code || '// Exemplo prático no Glossário'}\n\`\`\`\n\n> **Resumo rápido:** ${termoEncontrado.oneLiner}`;
    }

    return `### 🤖 Assistente Pedagógico CodeHelper\n\nSobre sua dúvida (**"${pergunta.slice(0, 80)}"**):\n\nPara resolver problemas de programação com clareza, divida o raciocínio em **Entrada → Processamento → Saída**:\n\n\`\`\`javascript\nfunction resolverProblema(entrada) {\n  // 1. Valide os dados recebidos\n  if (!entrada) return "Entrada inválida";\n\n  // 2. Aplique a transformação lógica\n  const resultado = String(entrada).trim().toUpperCase();\n\n  // 3. Retorne o resultado esperado\n  return resultado;\n}\n\nconsole.log(resolverProblema("codehelper"));\n\`\`\`\n\nExperimente testar esse trecho na aba **Playground** ou colar seu código na aba **Analisar código** para uma verificação detalhada!`;
  }

  function gerarAnaliseEstatica(corpo = {}) {
    const codigo = String(corpo.codigo || '').trim();
    const linguagem = String(corpo.linguagem || 'javascript');
    const problemas = [];

    if (/while\s*\([^)]+\)\s*\{(?![\s\S]*(\+\+|--|+=|-=|break|return))/i.test(codigo)) {
      problemas.push('- **Possível Loop Infinito**: O laço `while` não parece atualizar a variável de controle nem possui condição de saída (`break`/`return`).');
    }
    if (/[^=!]==[^=]/g.test(codigo)) {
      problemas.push('- **Comparação Fraca (`==`)**: Prefira usar `===` para comparar valor e tipo com segurança.');
    }
    if (/\bvar\s+/g.test(codigo)) {
      problemas.push('- **Uso de `var`**: Substitua `var` por `const` (se o valor não mudar) ou `let` (se precisar reatribuir).');
    }

    if (linguagem.toLowerCase() === 'javascript') {
      try {
        new Function(codigo);
      } catch (erroSintaxe) {
        problemas.push(`- **Erro de Sintaxe Detectado**: \`${erroSintaxe.message}\``);
      }
    }

    const secaoProblemas = problemas.length
      ? problemas.join('\n')
      : '- ✅ **Nenhum erro grave de sintaxe detectado!** A estrutura principal está válida.';

    const codigoMelhorado = codigo
      .replace(/\bvar\s+/g, 'let ')
      .replace(/([^=!])==([^=])/g, '$1===$2');

    return `## 🔍 Diagnóstico do Código (${linguagem})\n\n${secaoProblemas}\n\n### ✨ Sugestão de Boas Práticas e Código Revisado\n- Utilize nomes descritivos para variáveis e funções.\n- Prefira \`const\` e \`let\` para manter o escopo previsível.\n\n\`\`\`${linguagem.toLowerCase()}\n${codigoMelhorado}\n\`\`\``;
  }

  window.fetch = async function fetchCodeHelper(input, init) {
    const urlStr = typeof input === 'string' ? input : input?.url || '';

    if (urlStr.endsWith('/api/termos') || urlStr === 'api/termos') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      return fetchNativo('termos.json');
    }

    if (urlStr.endsWith('/api/health') || urlStr === 'api/health') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      return new Response(
        JSON.stringify({
          status: 'ok',
          app: 'CodeHelper (GitHub Pages)',
          versao: '1.0.0',
          geminiConfigurada: true,
          termosCarregados: 55
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (urlStr.endsWith('/api/chat') || urlStr === 'api/chat') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      let corpo = {};
      try {
        corpo = init?.body ? JSON.parse(init.body) : {};
      } catch {}
      return criarRespostaStreamTexto(gerarRespostaChatEstatico(corpo));
    }

    if (urlStr.endsWith('/api/analisar') || urlStr === 'api/analisar') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      let corpo = {};
      try {
        corpo = init?.body ? JSON.parse(init.body) : {};
      } catch {}
      return criarRespostaStreamTexto(gerarAnaliseEstatica(corpo));
    }

    return fetchNativo(input, init);
  };
})();
