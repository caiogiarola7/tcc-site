
const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

let modoCadastro = false;

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

function aplicarPreviewAleatoria() {
  if (
    !previewPerguntaTexto ||
    !previewRespostaTexto ||
    !previewCodigo ||
    !previewExplicacao
  ) {
    return;
  }

  const indice =
    Math.floor(
      Math.random() * previewsEntrada.length
    );

  const preview =
    previewsEntrada[indice];

  previewPerguntaTexto.textContent =
    preview.pergunta;

  previewRespostaTexto.textContent =
    preview.resposta;

  previewCodigo.textContent =
    preview.codigo;

  previewExplicacao.innerHTML =
    preview.explicacao;

  animarPreview();
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
        opacity: 0,
        transform: 'translateY(10px) scale(0.99)'
      },
      {
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      }
    ],
    {
      duration: 480,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    }
  );
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
