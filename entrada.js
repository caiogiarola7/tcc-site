const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

let modoCadastro = false;

// Sincroniza a cor de destaque escolhida no App (se houver)
(function aplicarTemaSalvoLogin() {
  const PALETAS = {
    prata: { cor: '#38bdf8', claro: '#e0f2fe', rgb: '56, 189, 248', orb2: '99, 102, 241' },
    azul: { cor: '#3b82f6', claro: '#dbeafe', rgb: '59, 130, 246', orb2: '6, 182, 212' },
    roxo: { cor: '#a855f7', claro: '#f3e8ff', rgb: '168, 85, 247', orb2: '99, 102, 241' },
    esmeralda: { cor: '#10b981', claro: '#d1fae5', rgb: '16, 185, 129', orb2: '20, 184, 166' },
    ambar: { cor: '#f59e0b', claro: '#fef3c7', rgb: '245, 158, 11', orb2: '249, 115, 22' },
    rosa: { cor: '#ec4899', claro: '#fce7f3', rgb: '236, 72, 153', orb2: '168, 85, 247' },
    carmesim: { cor: '#f43f5e', claro: '#ffe4e6', rgb: '244, 63, 94', orb2: '239, 68, 68' }
  };
  try {
    const salvo = localStorage.getItem('codehelper_cor_destaque');
    const p = PALETAS[salvo] || PALETAS.prata;
    const root = document.documentElement;
    root.style.setProperty('--destaque', p.cor);
    root.style.setProperty('--destaque-claro', p.claro);
    root.style.setProperty('--cor-destaque-rgb', p.rgb);
    root.style.setProperty('--cor-orb2-rgb', p.orb2);
  } catch (e) {
    // Fallback silencioso
  }
})();

const formEntrada =
  document.getElementById('form-entrada');

const btnEntrar =
  document.getElementById('btn-entrar');

const toggleTexto =
  document.getElementById('toggle-texto');

const btnToggle =
  document.getElementById('btn-toggle');

const entradaErro =
  document.getElementById('entrada-erro');

const btnConvidado =
  document.getElementById('btn-convidado');

const btnGithub =
  document.getElementById('btn-github');

const btnGoogle =
  document.getElementById('btn-google');

const inputEmail =
  document.getElementById('input-email');

const inputSenha =
  document.getElementById('input-senha');

const btnMostrarSenha =
  document.getElementById('btn-mostrar-senha');

const contaSalva =
  document.getElementById('conta-salva');

const contaSalvaNome =
  document.getElementById('conta-salva-nome');

const contaSalvaEmail =
  document.getElementById('conta-salva-email');

const contaSalvaProvider =
  document.getElementById('conta-salva-provider');

const contaSalvaAvatarImg =
  document.getElementById('conta-salva-avatar-img');

const contaSalvaAvatarInicial =
  document.getElementById('conta-salva-avatar-inicial');

const btnContinuarConta =
  document.getElementById('btn-continuar-conta');

const btnOutraConta =
  document.getElementById('btn-outra-conta');

const previewCard =
  document.querySelector('.preview-codehelper');

const previewPerguntaTexto =
  document.getElementById('preview-pergunta-texto');

const previewRespostaTexto =
  document.getElementById('preview-resposta-texto');

const previewCodigo =
  document.getElementById('preview-codigo');

const previewExplicacao =
  document.getElementById('preview-explicacao');

const previewContador =
  document.getElementById('preview-contador');

const previewProgressoFill =
  document.getElementById('preview-progresso-fill');

const btnPreviewAnt =
  document.getElementById('btn-preview-ant');

const btnPreviewProx =
  document.getElementById('btn-preview-prox');

if (btnMostrarSenha && inputSenha) {
  btnMostrarSenha.addEventListener('click', () => {
    const visivel = inputSenha.type === 'text';
    inputSenha.type = visivel ? 'password' : 'text';
    btnMostrarSenha.style.color = visivel ? '' : '#ffffff';
  });
}

const previewsEntrada = [
  {
    pergunta: 'Por que meu loop não para?',
    resposta: 'Seu loop não para porque a condição continua sendo verdadeira.',
    codigo: `let i = 0;

while (i < 5) {
  console.log(i);
  i++;
}`,
    explicacao: '✓ O valor de <strong>i</strong> agora aumenta a cada repetição.'
  },
  {
    pergunta: 'Por que esse if está dando erro?',
    resposta: 'A condição do if precisa estar completamente entre parênteses.',
    codigo: `let idade = 18;

if (idade >= 18) {
  console.log("Maior de idade");
}`,
    explicacao: '✓ O parêntese da condição foi fechado corretamente.'
  },
  {
    pergunta: 'Qual a diferença entre let e const?',
    resposta: 'Use let quando o valor pode mudar e const quando ele não será reatribuído.',
    codigo: `let pontos = 10;
pontos = 20;

const nome = "CodeHelper";`,
    explicacao: '✓ <strong>let</strong> pode receber outro valor; <strong>const</strong> não.'
  },
  {
    pergunta: 'Como eu crio uma função?',
    resposta: 'Uma função agrupa instruções que podem ser executadas sempre que necessário.',
    codigo: `function saudacao(nome) {
  return "Olá, " + nome;
}

saudacao("Ana");`,
    explicacao: '✓ A função recebe um parâmetro e devolve um resultado.'
  },
  {
    pergunta: 'Como adiciono algo em um array?',
    resposta: 'Você pode usar push() para adicionar um novo item ao final do array.',
    codigo: `const frutas = [
  "maçã",
  "banana"
];

frutas.push("uva");`,
    explicacao: '✓ <strong>push()</strong> adiciona um elemento ao final da lista.'
  },
  {
    pergunta: 'Qual a diferença entre map e forEach?',
    resposta: 'forEach percorre o array. map percorre e cria um novo array com os resultados.',
    codigo: `const numeros = [1, 2, 3];

const dobro = numeros.map(
  numero => numero * 2
);`,
    explicacao: '✓ <strong>map()</strong> retorna um novo array.'
  },
  {
    pergunta: 'Pra que serve async e await?',
    resposta: 'Eles ajudam a trabalhar com operações assíncronas de uma forma mais fácil de ler.',
    codigo: `async function carregar() {
  const resposta =
    await fetch("/api/dados");

  return resposta.json();
}`,
    explicacao: '✓ <strong>await</strong> espera a Promise terminar antes de continuar.'
  },
  {
    pergunta: 'null e undefined são a mesma coisa?',
    resposta: 'Não. undefined geralmente indica falta de valor, enquanto null representa uma ausência definida intencionalmente.',
    codigo: `let usuario;

console.log(usuario);
// undefined

usuario = null;`,
    explicacao: '✓ Os dois representam ausência de valor, mas em situações diferentes.'
  },
  {
    pergunta: 'Como pego um valor de um objeto?',
    resposta: 'Você pode acessar uma propriedade usando ponto ou colchetes.',
    codigo: `const pessoa = {
  nome: "Ana",
  idade: 20
};

console.log(pessoa.nome);`,
    explicacao: '✓ <strong>pessoa.nome</strong> acessa a propriedade nome.'
  },
  {
    pergunta: 'Pra que serve uma classe?',
    resposta: 'Uma classe funciona como um molde para criar objetos com a mesma estrutura.',
    codigo: `class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }
}

const p1 = new Pessoa("Ana");`,
    explicacao: '✓ O <strong>constructor</strong> define os valores iniciais do objeto.'
  },
  {
    pergunta: 'Como tratar um erro em JavaScript?',
    resposta: 'Você pode usar try e catch para tentar executar algo e capturar possíveis erros.',
    codigo: `try {
  JSON.parse("texto inválido");
} catch (erro) {
  console.log(
    "Algo deu errado"
  );
}`,
    explicacao: '✓ O <strong>catch</strong> é executado quando ocorre um erro no try.'
  },
  {
    pergunta: 'Como transformar JSON em objeto?',
    resposta: 'Use JSON.parse() quando você possui um JSON em formato de texto.',
    codigo: `const texto =
  '{"nome":"Ana"}';

const usuario =
  JSON.parse(texto);

console.log(usuario.nome);`,
    explicacao: '✓ <strong>JSON.parse()</strong> transforma o texto em um objeto JavaScript.'
  },
  {
    pergunta: 'Qual a diferença entre == e ===?',
    resposta: 'O operador === compara valor e tipo, evitando conversões automáticas.',
    codigo: `5 == "5";
// true

5 === "5";
// false`,
    explicacao: '✓ Em JavaScript moderno, normalmente é melhor usar <strong>===</strong>.'
  },
  {
    pergunta: 'O que é uma arrow function?',
    resposta: 'É uma sintaxe mais curta para escrever determinadas funções em JavaScript.',
    codigo: `const dobro = numero => {
  return numero * 2;
};

console.log(dobro(5));`,
    explicacao: '✓ A seta <strong>=&gt;</strong> cria uma arrow function.'
  },
  {
    pergunta: 'Como buscar dados de uma API?',
    resposta: 'Você pode usar fetch() para fazer uma requisição HTTP e receber os dados.',
    codigo: `async function buscarDados() {
  const resposta =
    await fetch("/api/termos");

  const dados =
    await resposta.json();

  console.log(dados);
}`,
    explicacao: '✓ <strong>fetch()</strong> permite fazer requisições para APIs.'
  }
];

function escaparHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function realcarSintaxePreview(codigo) {
  const tokens = [];
  const salvar = (html) => {
    const id = `@@TOK_${tokens.length}@@`;
    tokens.push(html);
    return id;
  };

  let texto = escaparHTML(codigo);

  // Comentários
  texto = texto.replace(/(\/\/[^\n]*)/g, (m) => salvar(`<span class="tok-cm">${m}</span>`));
  // Strings
  texto = texto.replace(/(".*?"|'.*?')/g, (m) => salvar(`<span class="tok-str">${m}</span>`));
  // Palavras-chave JS
  texto = texto.replace(
    /\b(let|const|var|function|return|if|else|while|for|async|await|try|catch|class|constructor|new|this|null|undefined|true|false)\b/g,
    (m) => salvar(`<span class="tok-kw">${m}</span>`)
  );
  // Funções e métodos
  texto = texto.replace(
    /\b(console|log|push|map|forEach|fetch|json|JSON|parse)\b/g,
    (m) => salvar(`<span class="tok-fn">${m}</span>`)
  );
  // Números
  texto = texto.replace(/\b(\d+)\b/g, (m) => salvar(`<span class="tok-num">${m}</span>`));

  return texto.replace(/@@TOK_(\d+)@@/g, (_, idx) => tokens[Number(idx)]);
}

let indicePreviewAtual = Math.floor(Math.random() * previewsEntrada.length);
let previewPausado = false;
let progressoPreview = 0;
const DURACAO_CICLO_MS = 5800;

function mostrarPreviewPorIndice(indice) {
  if (
    !previewPerguntaTexto ||
    !previewRespostaTexto ||
    !previewCodigo ||
    !previewExplicacao
  ) {
    return;
  }

  indicePreviewAtual = (indice + previewsEntrada.length) % previewsEntrada.length;
  const preview = previewsEntrada[indicePreviewAtual];

  previewPerguntaTexto.textContent = preview.pergunta;
  previewRespostaTexto.textContent = preview.resposta;
  previewCodigo.innerHTML = realcarSintaxePreview(preview.codigo);
  previewExplicacao.innerHTML = preview.explicacao;

  if (previewContador) {
    previewContador.textContent = `${indicePreviewAtual + 1} / ${previewsEntrada.length}`;
  }

  progressoPreview = 0;
  if (previewProgressoFill) {
    previewProgressoFill.style.width = '0%';
  }

  animarPreview();
}

function aplicarPreviewAleatoria() {
  mostrarPreviewPorIndice(indicePreviewAtual);
}

function animarPreview() {
  if (!previewCard) {
    return;
  }

  if (
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {
    return;
  }

  previewCard.animate(
    [
      {
        opacity: 0.35,
        transform: 'translateY(8px) scale(0.992)'
      },
      {
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      }
    ],
    {
      duration: 420,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    }
  );
}

if (btnPreviewAnt) {
  btnPreviewAnt.addEventListener('click', () => {
    mostrarPreviewPorIndice(indicePreviewAtual - 1);
  });
}

if (btnPreviewProx) {
  btnPreviewProx.addEventListener('click', () => {
    mostrarPreviewPorIndice(indicePreviewAtual + 1);
  });
}

if (previewCard) {
  previewCard.addEventListener('mouseenter', () => {
    previewPausado = true;
  });
  previewCard.addEventListener('mouseleave', () => {
    previewPausado = false;
  });
}

setInterval(() => {
  if (previewPausado) return;
  progressoPreview += 100 / (DURACAO_CICLO_MS / 100);
  if (previewProgressoFill) {
    previewProgressoFill.style.width = `${Math.min(100, progressoPreview)}%`;
  }
  if (progressoPreview >= 100) {
    mostrarPreviewPorIndice(indicePreviewAtual + 1);
  }
}, 100);

// ==========================================================================
// ANIMAÇÃO DE FUNDO DE ALTA INTENSIDADE (CANVAS NEURAL AST & DEV STREAM)
// ==========================================================================
(function iniciarDevCinemaCanvas() {
  const canvas = document.getElementById('dev-cinema-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let largura = (canvas.width = window.innerWidth);
  let altura = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    largura = canvas.width = window.innerWidth;
    altura = canvas.height = window.innerHeight;
  });

  const LABELS_DEV = [
    '</> CodeHelper',
    'AI Tutor',
    'AST Parser',
    'JS Engine',
    'async / await',
    'Array.map()',
    'Quiz 80+',
    'Debug IA',
    'JSON.parse()',
    'DOM Tree',
    'Promise.all',
    'try / catch',
    'Clean Code',
    'Complexidade O(1)',
    'Playground JS',
    'Tutor Socrático',
    'Closures',
    'Fetch API',
    'Event Loop',
    ' Escopo Léxico'
  ];

  const qtdNos = 22;
  const nos = [];
  for (let i = 0; i < qtdNos; i++) {
    nos.push({
      x: largura * 0.28 + Math.random() * (largura * 0.70),
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      raio: 2.6 + Math.random() * 2.4,
      label: LABELS_DEV[i % LABELS_DEV.length],
      mostrarLabel: i < 12,
      pulso: Math.random() * Math.PI * 2
    });
  }

  // Pacotes de dados (pulsos luminosos) viajando entre nós
  const pacotes = [];
  function criarPacote(origem, destino) {
    pacotes.push({
      origem,
      destino,
      progresso: 0,
      velocidade: 0.014 + Math.random() * 0.018,
      cor: Math.random() > 0.35 ? '56, 189, 248' : '52, 211, 153'
    });
  }

  // Trilhas verticais de código (Code Matrix / Data Streams)
  const trilhas = [];
  const SNIPPETS_TRILHA = [
    '010110',
    'const x = 42;',
    '=> true',
    'await ai()',
    '✓ OK',
    'return res;',
    'if (valid)',
    'node.ast',
    '{ ...obj }'
  ];
  for (let i = 0; i < 16; i++) {
    trilhas.push({
      x: largura * 0.32 + Math.random() * (largura * 0.66),
      y: Math.random() * altura,
      vy: 0.7 + Math.random() * 1.1,
      comprimento: 70 + Math.random() * 110,
      texto: SNIPPETS_TRILHA[i % SNIPPETS_TRILHA.length],
      opacidade: 0.12 + Math.random() * 0.18
    });
  }

  let mouse = { x: largura * 0.68, y: altura * 0.5, ativo: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.ativo = true;
  });

  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);

    // 1. Desenha as trilhas verticais de telemetria / código
    ctx.font = '600 10.5px "JetBrains Mono", monospace';
    for (const t of trilhas) {
      t.y += t.vy;
      if (t.y - t.comprimento > altura) {
        t.y = -30;
        t.x = largura * 0.32 + Math.random() * (largura * 0.66);
      }

      const grad = ctx.createLinearGradient(t.x, t.y - t.comprimento, t.x, t.y);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(1, `rgba(56, 189, 248, ${t.opacidade})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y - t.comprimento);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();

      ctx.fillStyle = `rgba(224, 242, 254, ${t.opacidade * 1.3})`;
      ctx.fillText(t.texto, t.x + 5, t.y);
    }

    // 2. Atualiza e conecta os nós da rede AST / IA
    const distMax = 210;
    for (let i = 0; i < nos.length; i++) {
      const a = nos[i];
      a.x += a.vx;
      a.y += a.vy;
      a.pulso += 0.035;

      const limiteEsq = largura > 860 ? largura * 0.26 : 20;
      if (a.x < limiteEsq || a.x > largura - 20) a.vx *= -1;
      if (a.y < 20 || a.y > altura - 20) a.vy *= -1;

      if (mouse.ativo) {
        const dxm = mouse.x - a.x;
        const dym = mouse.y - a.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 220 && dm > 10) {
          a.x += (dxm / dm) * 0.35;
          a.y += (dym / dm) * 0.35;
        }
      }

      for (let j = i + 1; j < nos.length; j++) {
        const b = nos[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);

        if (dist < distMax) {
          const alfa = (1 - dist / distMax) * 0.32;
          ctx.strokeStyle = `rgba(125, 211, 252, ${alfa})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          if (pacotes.length < 18 && Math.random() < 0.0022) {
            criarPacote(a, b);
          }
        }
      }
    }

    // 3. Desenha os pacotes de dados (pulsos laser) viajando nas conexões
    for (let i = pacotes.length - 1; i >= 0; i--) {
      const p = pacotes[i];
      p.progresso += p.velocidade;
      if (p.progresso >= 1) {
        pacotes.splice(i, 1);
        continue;
      }

      const px = p.origem.x + (p.destino.x - p.origem.x) * p.progresso;
      const py = p.origem.y + (p.destino.y - p.origem.y) * p.progresso;

      const brilho = ctx.createRadialGradient(px, py, 0, px, py, 12);
      brilho.addColorStop(0, `rgba(${p.cor}, 0.95)`);
      brilho.addColorStop(1, `rgba(${p.cor}, 0)`);
      ctx.fillStyle = brilho;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Desenha os nós e rótulos Dev
    ctx.font = '600 11px "JetBrains Mono", monospace';
    for (const n of nos) {
      const escalaPulso = 1 + Math.sin(n.pulso) * 0.25;
      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.raio * 5 * escalaPulso);
      halo.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.raio * 5 * escalaPulso, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.raio, 0, Math.PI * 2);
      ctx.fill();

      if (n.mostrarLabel) {
        ctx.fillStyle = 'rgba(224, 242, 254, 0.42)';
        ctx.fillText(n.label, n.x + 8, n.y + 3);
      }
    }

    requestAnimationFrame(desenhar);
  }

  requestAnimationFrame(desenhar);
})();

function obterRedirectApp() {
  return new URL(
    'app.html',
    window.location.href
  ).href;
}

function definirErro(mensagem = '') {
  entradaErro.textContent = mensagem;
}

function definirCarregandoSocial(carregando) {
  btnGoogle.disabled = carregando;
  btnGithub.disabled = carregando;
  btnEntrar.disabled = carregando;
}

btnToggle.addEventListener('click', () => {
  modoCadastro = !modoCadastro;

  btnEntrar.textContent =
    modoCadastro ? 'Criar conta' : 'Entrar';

  toggleTexto.textContent =
    modoCadastro ? 'Já tem conta?' : 'Não tem uma conta?';

  btnToggle.textContent =
    modoCadastro ? 'Entrar' : 'Criar conta';

  inputSenha.autocomplete =
    modoCadastro ? 'new-password' : 'current-password';

  definirErro();
});

formEntrada.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  definirErro();

  const email =
    inputEmail.value.trim();

  const senha =
    inputSenha.value;

  btnEntrar.disabled = true;

  btnEntrar.textContent =
    modoCadastro ? 'Criando conta...' : 'Entrando...';

  try {
    const { data, error } =
      modoCadastro
        ? await supabaseClient.auth.signUp({
            email,
            password: senha
          })
        : await supabaseClient.auth.signInWithPassword({
            email,
            password: senha
          });

    if (error) {
      definirErro(error.message);
      return;
    }

    if (modoCadastro && !data.session) {
      definirErro(
        'Conta criada! Verifique seu e-mail para confirmar antes de entrar.'
      );
      return;
    }

    window.location.href = 'app.html';
  } catch (erro) {
    console.error(erro);

    definirErro(
      'Não foi possível entrar agora. Tente novamente.'
    );
  } finally {
    btnEntrar.disabled = false;

    btnEntrar.textContent =
      modoCadastro ? 'Criar conta' : 'Entrar';
  }
});

btnConvidado.addEventListener('click', () => {
  sessionStorage.setItem('convidado', 'true');
  window.location.href = 'app.html';
});

async function entrarComSocial(provider) {
  definirErro();
  definirCarregandoSocial(true);

  try {
    const { error } =
      await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: obterRedirectApp(),
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

    if (error) {
      definirErro(error.message);
      definirCarregandoSocial(false);
    }
  } catch (erro) {
    console.error(erro);

    definirErro(
      'Não foi possível conectar. Tente novamente.'
    );

    definirCarregandoSocial(false);
  }
}

btnGithub.addEventListener('click', () => {
  entrarComSocial('github');
});

btnGoogle.addEventListener('click', () => {
  entrarComSocial('google');
});

function obterNomeUsuario(usuario) {
  const metadata =
    usuario?.user_metadata || {};

  return (
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    metadata.preferred_username ||
    usuario?.email?.split('@')[0] ||
    'Usuário'
  );
}

function obterAvatarUsuario(usuario) {
  const metadata =
    usuario?.user_metadata || {};

  return (
    metadata.avatar_url ||
    metadata.picture ||
    null
  );
}

function obterProviderUsuario(usuario) {
  const provider =
    usuario?.app_metadata?.provider;

  if (provider === 'google') {
    return 'Google';
  }

  if (provider === 'github') {
    return 'GitHub';
  }

  return 'E-mail';
}

function mostrarContaSalva(usuario) {
  if (!usuario || !contaSalva) {
    return;
  }

  const nome =
    obterNomeUsuario(usuario);

  const avatar =
    obterAvatarUsuario(usuario);

  const provider =
    obterProviderUsuario(usuario);

  if (contaSalvaNome) {
    contaSalvaNome.textContent = nome;
  }

  if (contaSalvaEmail) {
    contaSalvaEmail.textContent =
      usuario.email || '';
  }

  if (contaSalvaProvider) {
    contaSalvaProvider.textContent = provider;
  }

  if (contaSalvaAvatarInicial) {
    contaSalvaAvatarInicial.textContent =
      nome.charAt(0).toUpperCase();
  }

  if (avatar && contaSalvaAvatarImg) {
    contaSalvaAvatarImg.src = avatar;
    contaSalvaAvatarImg.alt = `Foto de ${nome}`;
    contaSalvaAvatarImg.hidden = false;

    if (contaSalvaAvatarInicial) {
      contaSalvaAvatarInicial.hidden = true;
    }
  } else {
    if (contaSalvaAvatarImg) {
      contaSalvaAvatarImg.hidden = true;
      contaSalvaAvatarImg.removeAttribute('src');
    }

    if (contaSalvaAvatarInicial) {
      contaSalvaAvatarInicial.hidden = false;
    }
  }

  contaSalva.hidden = false;
}

function esconderContaSalva() {
  if (contaSalva) {
    contaSalva.hidden = true;
  }
}

if (btnContinuarConta) {
  btnContinuarConta.addEventListener('click', () => {
    window.location.href = 'app.html';
  });
}

if (btnOutraConta) {
  btnOutraConta.addEventListener('click', async () => {
    btnOutraConta.disabled = true;

    try {
      const { error } =
        await supabaseClient.auth.signOut();

      if (error) {
        throw error;
      }

      esconderContaSalva();

      inputEmail.value = '';
      inputSenha.value = '';

      inputEmail.focus();

      definirErro();
    } catch (erro) {
      console.error(erro);

      definirErro(
        'Não foi possível trocar de conta.'
      );
    } finally {
      btnOutraConta.disabled = false;
    }
  });
}

const veioDeRetornoOAuth =
  window.location.hash.includes('access_token') ||
  window.location.search.includes('code=');

async function verificarContaSalva() {
  try {
    const { data, error } =
      await supabaseClient.auth.getSession();

    if (error) {
      esconderContaSalva();
      return;
    }

    const usuario =
      data?.session?.user;

    if (usuario) {
      if (veioDeRetornoOAuth) {
        sessionStorage.removeItem('convidado');
        window.location.replace('app.html');
        return;
      }
      mostrarContaSalva(usuario);
    } else {
      esconderContaSalva();
    }
  } catch (erro) {
    console.error(
      'Erro ao verificar sessão:',
      erro
    );
  }
}

supabaseClient.auth.onAuthStateChange(
  (evento, sessao) => {
    if (sessao?.user) {
      if (veioDeRetornoOAuth || evento === 'SIGNED_IN') {
        sessionStorage.removeItem('convidado');
        if (veioDeRetornoOAuth) {
          window.location.replace('app.html');
          return;
        }
      }
      mostrarContaSalva(sessao.user);
    } else {
      esconderContaSalva();
    }
  }
);

window.addEventListener('pageshow', () => {
  verificarContaSalva();
});

aplicarPreviewAleatoria();
verificarContaSalva();
