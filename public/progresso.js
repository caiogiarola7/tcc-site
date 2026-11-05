
if (window.__codehelperProgressoInicializado) {
  throw new Error('O sistema de progresso já foi inicializado.');
}

window.__codehelperProgressoInicializado = true;

if (!document.querySelector('link[href*="quiz-melhoria.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'quiz-melhoria.css';
  document.head.appendChild(link);
}

if (!document.getElementById('quiz-resultado-estilos')) {
  const estilos = document.createElement('style');
  estilos.id = 'quiz-resultado-estilos';
  estilos.textContent = `
    #quiz-fim {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }

    #quiz-resultado-texto {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 30px;
      margin: 20px 0;
      border: 1px solid var(--border-color, rgba(128,128,128,.2));
      border-radius: 20px;
      background: var(--card-bg, rgba(128,128,128,.06));
      text-align: center;
      box-sizing: border-box;
    }

    .quiz-resultado-topo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .quiz-resultado-percentual {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 124px;
      height: 124px;
      border-radius: 50%;
      border: 7px solid var(--accent-color, #6366f1);
      color: var(--accent-color, #6366f1);
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -2px;
      margin-bottom: 8px;
    }

    .quiz-resultado-titulo {
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 800;
      color: var(--text-color, inherit);
    }

    .quiz-resultado-descricao {
      max-width: 520px;
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary, #888);
    }

    .quiz-resultado-acertos {
      margin-top: 8px;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-color, inherit);
    }

    .quiz-resultado-dados {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
      gap: 12px;
      width: 100%;
      margin-top: 18px;
    }

    .quiz-resultado-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 9px;
      min-height: 95px;
      padding: 17px;
      border: 1px solid var(--border-color, rgba(128,128,128,.2));
      border-radius: 14px;
      background: var(--bg-secondary, rgba(128,128,128,.07));
      text-align: left;
      box-sizing: border-box;
    }

    .quiz-resultado-card span {
      font-size: 12px;
      color: var(--text-secondary, #888);
      line-height: 1.4;
    }

    .quiz-resultado-card strong {
      font-size: 25px;
      font-weight: 800;
      color: var(--text-color, inherit);
    }

    .quiz-revisao {
      width: 100%;
      margin: 30px 0 20px;
    }

    .quiz-revisao-cabecalho {
      margin-bottom: 20px;
    }

    .quiz-revisao-cabecalho h3 {
      margin: 0 0 7px;
      font-size: 22px;
      font-weight: 800;
      color: var(--text-color, inherit);
    }

    .quiz-revisao-cabecalho p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary, #888);
    }

    .quiz-lista-erros {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    .quiz-erro-item {
      display: flex;
      flex-direction: column;
      gap: 18px;
      width: 100%;
      padding: 20px;
      border: 1px solid var(--border-color, rgba(128,128,128,.2));
      border-radius: 16px;
      background: var(--card-bg, rgba(128,128,128,.05));
      box-sizing: border-box;
    }

    .quiz-erro-informacoes {
      display: flex;
      flex-direction: column;
      gap: 11px;
      min-width: 0;
    }

    .quiz-erro-numero {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      padding: 5px 10px;
      border-radius: 7px;
      background: rgba(239, 68, 68, .12);
      color: #ef6464;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .4px;
      text-transform: uppercase;
    }

    .quiz-erro-pergunta {
      display: block;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.6;
      color: var(--text-color, inherit);
      overflow-wrap: anywhere;
    }

    .quiz-erro-respostas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 9px;
    }

    .quiz-erro-resposta {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 12px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    .quiz-erro-resposta-errada {
      background: rgba(239, 68, 68, .09);
      color: #e56b6b;
    }

    .quiz-erro-resposta-correta {
      background: rgba(34, 197, 94, .09);
      color: #32b879;
    }

    .quiz-erro-resposta strong {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .4px;
    }

    .quiz-erro-explicacao-titulo {
      margin: 3px 0 -5px;
      font-size: 13px;
      font-weight: 800;
      color: var(--text-color, inherit);
    }

    .quiz-explicacao {
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-secondary, #888);
      overflow-wrap: anywhere;
    }

    .quiz-btn-revisar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      width: fit-content;
      min-height: 43px;
      padding: 0 17px;
      border: 1px solid var(--accent-color, #6366f1) !important;
      border-radius: 10px !important;
      background: var(--accent-color, #6366f1) !important;
      color: #fff !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      font-family: inherit;
      cursor: pointer;
      transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
      box-shadow: 0 4px 12px rgba(99, 102, 241, .18);
    }

    .quiz-btn-revisar:hover {
      filter: brightness(1.12);
      transform: translateY(-2px);
      box-shadow: 0 7px 18px rgba(99, 102, 241, .25);
    }

    .quiz-btn-revisar:active {
      transform: translateY(0);
    }

    .quiz-revisao-perfeito {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border: 1px solid rgba(34, 197, 94, .25);
      border-radius: 14px;
      background: rgba(34, 197, 94, .08);
      color: #32b879;
      font-size: 15px;
      font-weight: 700;
    }

    #btn-refazer-quiz {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 45px;
      padding: 0 22px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: transform .2s ease, filter .2s ease;
    }

    #btn-refazer-quiz:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }

    @media (max-width: 600px) {
      #quiz-resultado-texto {
        padding: 22px 15px;
      }

      .quiz-resultado-percentual {
        width: 105px;
        height: 105px;
        font-size: 30px;
      }

      .quiz-resultado-dados {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .quiz-erro-item {
        padding: 15px;
      }

      .quiz-btn-revisar {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(estilos);
}

const quizInicioProgresso = document.getElementById('quiz-inicio');
const quizJogoProgresso = document.getElementById('quiz-jogo');
const quizFimProgresso = document.getElementById('quiz-fim');
const quizResultadoTextoProgresso = document.getElementById('quiz-resultado-texto');
const quizOpcoesProgresso = document.getElementById('quiz-opcoes');
const quizPerguntaProgresso = document.getElementById('quiz-pergunta');
const btnIniciarQuizProgresso = document.getElementById('btn-iniciar-quiz');
const btnProximaQuizProgresso = document.getElementById('btn-proxima-pergunta');
const btnRefazerQuizProgresso = document.getElementById('btn-refazer-quiz');

let resultadoAtualJaSalvo = false;
let salvandoResultado = false;
let errosQuizAtual = [];
let respostaAtualProcessada = false;
let quizAtivo = false;

function criarConfiguracoesQuiz() {
  if (!btnIniciarQuizProgresso?.parentNode) return;

  const configuracoes = document.createElement('div');
  configuracoes.id = 'quiz-configuracoes';
  configuracoes.className = 'quiz-configuracoes';
  configuracoes.innerHTML = `
    <div class="quiz-configuracao">
      <label for="quiz-categoria">Categoria</label>
      <select id="quiz-categoria">
        <option value="todos">Todas as categorias</option>
        <option value="controle">Estruturas de controle</option>
        <option value="funcao">Funções</option>
        <option value="dados">Variáveis e dados</option>
        <option value="poo">Orientação a objetos</option>
        <option value="avancado">Avançado</option>
      </select>
    </div>
    <div class="quiz-configuracao">
      <label for="quiz-quantidade">Perguntas</label>
      <select id="quiz-quantidade">
        <option value="5">5 perguntas</option>
        <option value="10" selected>10 perguntas</option>
        <option value="15">15 perguntas</option>
        <option value="20">20 perguntas</option>
      </select>
    </div>
  `;

  btnIniciarQuizProgresso.parentNode.insertBefore(configuracoes, btnIniciarQuizProgresso);
}

function criarBarraProgressoQuiz() {
  if (!quizJogoProgresso || document.getElementById('quiz-barra-container')) return;

  const progresso = quizJogoProgresso.querySelector('.quiz-progresso');
  if (!progresso) return;

  const container = document.createElement('div');
  container.id = 'quiz-barra-container';
  container.className = 'quiz-barra-container';
  container.innerHTML = '<div id="quiz-barra" class="quiz-barra"></div>';
  progresso.insertAdjacentElement('afterend', container);
}

function criarFeedbackQuiz() {
  if (!quizOpcoesProgresso || document.getElementById('quiz-feedback')) return;

  const feedback = document.createElement('div');
  feedback.id = 'quiz-feedback';
  feedback.className = 'quiz-feedback';
  quizOpcoesProgresso.insertAdjacentElement('afterend', feedback);
}

function criarAreaRevisao() {
  if (!btnRefazerQuizProgresso?.parentNode || document.getElementById('quiz-revisao')) return;

  const revisao = document.createElement('div');
  revisao.id = 'quiz-revisao';
  revisao.className = 'quiz-revisao';
  btnRefazerQuizProgresso.parentNode.insertBefore(revisao, btnRefazerQuizProgresso);
}

criarConfiguracoesQuiz();
criarBarraProgressoQuiz();
criarFeedbackQuiz();
criarAreaRevisao();

function embaralharQuiz(array) {
  const copia = [...array];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function atualizarBarraQuiz() {
  const barra = document.getElementById('quiz-barra');
  if (!barra || !Array.isArray(quizPerguntas) || !quizPerguntas.length) return;

  barra.style.width = `${((quizIndice + 1) / quizPerguntas.length) * 100}%`;
}

function limparFeedbackQuiz() {
  const feedback = document.getElementById('quiz-feedback');
  if (!feedback) return;

  feedback.replaceChildren();
  feedback.className = 'quiz-feedback';
}

function atualizarBotaoProxima() {
  if (!btnProximaQuizProgresso || !Array.isArray(quizPerguntas)) return;

  btnProximaQuizProgresso.textContent =
    quizIndice === quizPerguntas.length - 1
      ? 'Ver resultado'
      : 'Próxima pergunta';
}

function atualizarInterfaceQuiz() {
  respostaAtualProcessada = false;
  atualizarBarraQuiz();
  atualizarBotaoProxima();
  limparFeedbackQuiz();

  if (btnProximaQuizProgresso) {
    btnProximaQuizProgresso.style.display = 'none';
    btnProximaQuizProgresso.disabled = true;
  }
}

function gerarQuizPersonalizado() {
  if (!Array.isArray(TERMOS) || TERMOS.length < 4) {
    alert('Não existem termos suficientes para gerar o quiz.');
    return false;
  }

  const categoria = document.getElementById('quiz-categoria')?.value || 'todos';
  const quantidadeSelecionada = Number(document.getElementById('quiz-quantidade')?.value || 10);

  let disponiveis = TERMOS.filter(termo =>
    termo &&
    typeof termo.name === 'string' &&
    termo.name.trim() &&
    typeof termo.oneLiner === 'string' &&
    termo.oneLiner.trim()
  );

  if (categoria !== 'todos') {
    disponiveis = disponiveis.filter(termo => termo.cat === categoria);
  }

  if (disponiveis.length < 4) {
    alert('Essa categoria não possui termos suficientes para gerar perguntas com alternativas.');
    return false;
  }

  if (disponiveis.length < quantidadeSelecionada) {
    alert(`Essa seleção possui apenas ${disponiveis.length} termos disponíveis. O quiz será gerado com todos eles.`);
  }

  const quantidade = Math.min(quantidadeSelecionada, disponiveis.length);
  const escolhidos = embaralharQuiz(disponiveis).slice(0, quantidade);

  quizPerguntas = escolhidos.map(termo => {
    const distratores = embaralharQuiz(
      TERMOS.filter(outro =>
        outro &&
        outro.name !== termo.name &&
        typeof outro.name === 'string' &&
        outro.name.trim()
      )
    ).slice(0, 3);

    return {
      pergunta: termo.oneLiner,
      correta: termo.name,
      opcoes: embaralharQuiz([
        termo.name,
        ...distratores.map(outro => outro.name)
      ]),
      explicacao: String(termo.body || termo.oneLiner || 'Consulte o glossário para revisar este conceito.').trim(),
      categoria: termo.cat || '',
      termo: termo.name
    };
  });

  quizIndice = 0;
  quizPontuacao = 0;
  errosQuizAtual = [];
  resultadoAtualJaSalvo = false;
  salvandoResultado = false;
  respostaAtualProcessada = false;
  quizAtivo = true;

  quizInicioProgresso.style.display = 'none';
  quizFimProgresso.style.display = 'none';
  quizJogoProgresso.style.display = 'block';

  mostrarPerguntaQuizAtual();
  atualizarInterfaceQuiz();

  return true;
}

function mostrarFeedbackResposta(botao) {
  const atual = quizPerguntas[quizIndice];
  if (!atual || !botao) return;

  const resposta = botao.textContent.trim();
  const acertou = resposta === atual.correta;
  const feedback = document.getElementById('quiz-feedback');

  if (!feedback) return;

  if (acertou) {
    quizPontuacao++;
    botao.classList.add('correta');
    feedback.className = 'quiz-feedback quiz-feedback-correto';
  } else {
    botao.classList.add('errada');
    feedback.className = 'quiz-feedback quiz-feedback-errado';

    errosQuizAtual.push({
      indice: quizIndice,
      pergunta: atual.pergunta,
      resposta,
      correta: atual.correta,
      explicacao: atual.explicacao,
      termo: atual.termo
    });

    quizOpcoesProgresso.querySelectorAll('.quiz-opcao').forEach(opcao => {
      if (opcao.textContent.trim() === atual.correta) {
        opcao.classList.add('correta');
      }
    });
  }

  quizOpcoesProgresso.querySelectorAll('.quiz-opcao').forEach(opcao => {
    opcao.disabled = true;
  });

  feedback.replaceChildren();

  const titulo = document.createElement('strong');
  titulo.textContent = acertou ? '✓ Resposta correta!' : '✕ Resposta incorreta';

  const respostaCorreta = document.createElement('p');
  respostaCorreta.className = 'quiz-resposta-correta';
  respostaCorreta.textContent = `Resposta correta: ${atual.correta}`;

  const explicacaoTitulo = document.createElement('strong');
  explicacaoTitulo.className = 'quiz-explicacao-titulo';
  explicacaoTitulo.textContent = 'Entenda o conceito';

  const explicacao = document.createElement('p');
  explicacao.className = 'quiz-explicacao';
  explicacao.textContent = atual.explicacao;

  feedback.append(titulo, respostaCorreta, explicacaoTitulo, explicacao);

  atualizarBotaoProxima();

  if (btnProximaQuizProgresso) {
    btnProximaQuizProgresso.disabled = false;
    btnProximaQuizProgresso.style.display = 'inline-flex';
  }

  atualizarBarraQuiz();
}

if (quizOpcoesProgresso) {
  quizOpcoesProgresso.addEventListener('click', evento => {
    const botao = evento.target instanceof Element
      ? evento.target.closest('.quiz-opcao')
      : null;

    if (!quizAtivo || !botao || !quizOpcoesProgresso.contains(botao)) return;

    evento.preventDefault();
    evento.stopPropagation();
    evento.stopImmediatePropagation();

    if (respostaAtualProcessada) return;

    respostaAtualProcessada = true;
    mostrarFeedbackResposta(botao);
  }, true);
}

if (btnIniciarQuizProgresso) {
  btnIniciarQuizProgresso.addEventListener('click', evento => {
    evento.preventDefault();
    evento.stopPropagation();
    gerarQuizPersonalizado();
  }, true);
}

async function obterUsuarioProgresso() {
  try {
    if (typeof supabaseClient === 'undefined' || !supabaseClient?.auth) return null;

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;

    return data?.session?.user || null;
  } catch (erro) {
    console.error('Erro ao identificar usuário do quiz:', erro);
    return null;
  }
}

async function salvarResultadoQuiz() {
  if (resultadoAtualJaSalvo || salvandoResultado || !quizPerguntas.length) return;

  const usuario = await obterUsuarioProgresso();
  if (!usuario) return;

  const acertos = Number(quizPontuacao);
  const total = quizPerguntas.length;

  if (!Number.isInteger(acertos) || acertos < 0 || acertos > total) return;

  salvandoResultado = true;

  try {
    const percentual = Math.round((acertos / total) * 100);

    const { error } = await supabaseClient
      .from('quiz_resultados')
      .insert({
        user_id: usuario.id,
        acertos,
        total,
        percentual
      });

    if (error) throw error;

    resultadoAtualJaSalvo = true;

    if (typeof atualizarDashboard === 'function') {
      await atualizarDashboard();
    }
  } catch (erro) {
    console.error('Erro ao salvar resultado do quiz:', erro);
  } finally {
    salvandoResultado = false;
  }
}

function obterMensagemDesempenho(percentual) {
  if (percentual === 100) {
    return ['Perfeito! Você gabaritou!', 'Você acertou todas as perguntas e demonstrou excelente domínio dos conceitos.'];
  }

  if (percentual >= 90) {
    return ['Excelente resultado!', 'Você demonstrou um ótimo domínio dos conceitos deste quiz. Continue nesse ritmo.'];
  }

  if (percentual >= 70) {
    return ['Muito bom!', 'Você acertou a maior parte das perguntas. Revise os pequenos detalhes que ficaram para trás.'];
  }

  if (percentual >= 50) {
    return ['Bom começo!', 'Você já conhece vários conceitos, mas ainda existem pontos importantes para revisar.'];
  }

  return ['Hora de reforçar o aprendizado', 'Revise os conceitos que você errou no glossário e tente novamente.'];
}

async function atualizarResultadoVisual() {
  if (!quizResultadoTextoProgresso) return;

  const total = quizPerguntas.length;
  const acertos = Number(quizPontuacao);
  const erros = total - acertos;
  const percentual = total ? Math.round((acertos / total) * 100) : 0;
  const desempenho = obterMensagemDesempenho(percentual);

  let melhorResultado = null;
  let totalQuizzes = null;
  const usuario = await obterUsuarioProgresso();

  if (usuario) {
    try {
      const { data, error } = await supabaseClient
        .from('quiz_resultados')
        .select('acertos, total, percentual, created_at')
        .eq('user_id', usuario.id)
        .order('percentual', { ascending: false });

      if (error) throw error;

      if (Array.isArray(data) && data.length) {
        melhorResultado = data[0];
        totalQuizzes = data.length;
      }
    } catch (erro) {
      console.error('Erro ao carregar estatísticas do quiz:', erro);
    }
  }

  quizResultadoTextoProgresso.replaceChildren();

  const topo = document.createElement('div');
  topo.className = 'quiz-resultado-topo';

  const percentualElemento = document.createElement('span');
  percentualElemento.className = 'quiz-resultado-percentual';
  percentualElemento.textContent = `${percentual}%`;

  const titulo = document.createElement('strong');
  titulo.className = 'quiz-resultado-titulo';
  titulo.textContent = desempenho[0];

  const descricao = document.createElement('span');
  descricao.className = 'quiz-resultado-descricao';
  descricao.textContent = desempenho[1];

  const acertosTexto = document.createElement('span');
  acertosTexto.className = 'quiz-resultado-acertos';
  acertosTexto.textContent = `Você acertou ${acertos} de ${total} perguntas.`;

  topo.append(percentualElemento, titulo, descricao, acertosTexto);

  const dados = document.createElement('div');
  dados.className = 'quiz-resultado-dados';

  const itens = [
    ['Acertos', `${acertos}/${total}`],
    ['Erros', String(erros)]
  ];

  if (melhorResultado) {
    itens.push(['Melhor resultado', `${melhorResultado.acertos}/${melhorResultado.total}`]);
  }

  if (totalQuizzes !== null) {
    itens.push(['Quizzes realizados', String(totalQuizzes)]);
  }

  itens.forEach(([label, valor]) => {
    const cartao = document.createElement('div');
    cartao.className = 'quiz-resultado-card';

    const nome = document.createElement('span');
    nome.textContent = label;

    const numero = document.createElement('strong');
    numero.textContent = valor;

    cartao.append(nome, numero);
    dados.appendChild(cartao);
  });

  quizResultadoTextoProgresso.append(topo, dados);
}

function abrirTermoDoQuiz(nomeTermo) {
  if (!nomeTermo) return;

  document.querySelector('.aba-btn[data-aba="glossario"]')?.click();

  const chipTodos = document.querySelector('#filtros .chip[data-cat="todos"]');

  if (chipTodos && !chipTodos.classList.contains('ativo')) {
    chipTodos.click();
  }

  setTimeout(() => {
    const busca = document.getElementById('search');
    if (!busca) return;

    busca.value = nomeTermo;
    busca.dispatchEvent(new Event('input', { bubbles: true }));

    setTimeout(() => {
      document.querySelectorAll('#lista .card').forEach(card => {
        const nome = card.querySelector('.nome')?.textContent?.trim();

        if (nome === nomeTermo) {
          card.classList.add('aberto');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }, 150);
  }, 100);
}

function mostrarRevisaoErros() {
  const revisao = document.getElementById('quiz-revisao');
  if (!revisao) return;

  revisao.replaceChildren();

  const cabecalho = document.createElement('div');
  cabecalho.className = 'quiz-revisao-cabecalho';

  const titulo = document.createElement('h3');
  titulo.textContent = errosQuizAtual.length ? 'Revisão das respostas' : 'Você não errou nenhuma!';

  const descricao = document.createElement('p');
  descricao.textContent = errosQuizAtual.length
    ? `Você errou ${errosQuizAtual.length} ${errosQuizAtual.length === 1 ? 'pergunta' : 'perguntas'}. Revise os conceitos para fixar o conteúdo.`
    : 'Você acertou todas as perguntas deste quiz. Excelente trabalho!';

  cabecalho.append(titulo, descricao);
  revisao.appendChild(cabecalho);

  if (!errosQuizAtual.length) {
    const perfeito = document.createElement('div');
    perfeito.className = 'quiz-revisao-perfeito';
    perfeito.textContent = '✓ Excelente trabalho! Nenhum erro para revisar.';
    revisao.appendChild(perfeito);
    return;
  }

  const lista = document.createElement('div');
  lista.id = 'quiz-lista-erros';
  lista.className = 'quiz-lista-erros';

  errosQuizAtual.forEach((erro, indice) => {
    const item = document.createElement('div');
    item.className = 'quiz-erro-item';

    const informacoes = document.createElement('div');
    informacoes.className = 'quiz-erro-informacoes';

    const numero = document.createElement('span');
    numero.className = 'quiz-erro-numero';
    numero.textContent = `Questão ${erro.indice + 1}`;

    const pergunta = document.createElement('span');
    pergunta.className = 'quiz-erro-pergunta';
    pergunta.textContent = erro.pergunta;

    const respostas = document.createElement('div');
    respostas.className = 'quiz-erro-respostas';

    const respostaErrada = document.createElement('div');
    respostaErrada.className = 'quiz-erro-resposta quiz-erro-resposta-errada';

    const tituloErrada = document.createElement('strong');
    tituloErrada.textContent = 'Sua resposta';

    const textoErrado = document.createElement('span');
    textoErrado.textContent = erro.resposta;

    respostaErrada.append(tituloErrada, textoErrado);

    const respostaCorreta = document.createElement('div');
    respostaCorreta.className = 'quiz-erro-resposta quiz-erro-resposta-correta';

    const tituloCorreta = document.createElement('strong');
    tituloCorreta.textContent = 'Resposta correta';

    const textoCorreto = document.createElement('span');
    textoCorreto.textContent = erro.correta;

    respostaCorreta.append(tituloCorreta, textoCorreto);
    respostas.append(respostaErrada, respostaCorreta);

    const explicacaoTitulo = document.createElement('strong');
    explicacaoTitulo.className = 'quiz-erro-explicacao-titulo';
    explicacaoTitulo.textContent = 'Entenda o conceito';

    const explicacao = document.createElement('p');
    explicacao.className = 'quiz-explicacao';
    explicacao.textContent = erro.explicacao;

    informacoes.append(numero, pergunta, respostas, explicacaoTitulo, explicacao);

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'quiz-btn-revisar';
    botao.textContent = 'Revisar no glossário';
    botao.addEventListener('click', () => {
      abrirTermoDoQuiz(erro.termo || erro.correta);
    });

    item.append(informacoes, botao);
    lista.appendChild(item);
  });

  revisao.appendChild(lista);
}

if (btnProximaQuizProgresso) {
  btnProximaQuizProgresso.addEventListener('click', async evento => {
    evento.preventDefault();

    if (!quizAtivo || !respostaAtualProcessada) return;

    if (quizIndice < quizPerguntas.length - 1) {
      quizIndice++;
      mostrarPerguntaQuizAtual();
      atualizarInterfaceQuiz();
      return;
    }

    quizAtivo = false;
    quizJogoProgresso.style.display = 'none';
    quizFimProgresso.style.display = 'block';

    await salvarResultadoQuiz();
    await atualizarResultadoVisual();
    mostrarRevisaoErros();

    quizFimProgresso.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, true);
}

if (btnRefazerQuizProgresso) {
  btnRefazerQuizProgresso.addEventListener('click', evento => {
    evento.preventDefault();

    resultadoAtualJaSalvo = false;
    salvandoResultado = false;
    errosQuizAtual = [];
    respostaAtualProcessada = false;
    quizAtivo = false;

    limparFeedbackQuiz();

    const revisao = document.getElementById('quiz-revisao');
    if (revisao) revisao.replaceChildren();

    const barra = document.getElementById('quiz-barra');
    if (barra) barra.style.width = '0%';

    quizFimProgresso.style.display = 'none';
    quizJogoProgresso.style.display = 'none';
    quizInicioProgresso.style.display = 'block';
  }, true);
}
