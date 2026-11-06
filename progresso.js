
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
      border: 1px solid var(--cor-borda, rgba(255, 255, 255, 0.08));
      border-radius: 20px;
      background: var(--cor-fundo-alt, #0f1117);
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
      border: 7px solid var(--cor-destaque, #4f46e5);
      color: var(--cor-destaque, #4f46e5);
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
      color: var(--cor-texto-dim, #94a3b8);
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
      border: 1px solid var(--cor-borda, rgba(255, 255, 255, 0.08));
      border-radius: 14px;
      background: var(--cor-fundo-alt2, #151821);
      text-align: left;
      box-sizing: border-box;
    }

    .quiz-resultado-card span {
      font-size: 12px;
      color: var(--cor-texto-dim, #94a3b8);
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
      color: var(--cor-texto-dim, #94a3b8);
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
      border: 1px solid var(--cor-borda, rgba(255, 255, 255, 0.08));
      border-radius: 16px;
      background: var(--cor-fundo-alt, #0f1117);
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
      color: var(--cor-texto-dim, #94a3b8);
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
      border: 1px solid var(--cor-destaque, #4f46e5) !important;
      border-radius: 10px !important;
      background: var(--cor-destaque, #4f46e5) !important;
      color: #fff !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      font-family: inherit;
      cursor: pointer;
      transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.22);
    }

    .quiz-btn-revisar:hover {
      filter: brightness(1.12);
      transform: translateY(-2px);
      box-shadow: 0 7px 18px rgba(79, 70, 229, 0.22);
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
        <option value="25">25 perguntas</option>
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

/* ==========================================================================
   BANCO EXPANDIDO DE QUESTÕES DO QUIZ (MÚLTIPLAS QUESTÕES POR CATEGORIA)
   ========================================================================== */
const BANCO_QUESTOES_QUIZ = [
  // =========================================================================
  // 1. ESTRUTURAS DE CONTROLE (controle)
  // =========================================================================
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'Qual estrutura deve ser usada para executar um bloco de código somente se a idade do usuário for maior ou igual a 18, e outro bloco caso contrário?',
    correta: 'if / else',
    opcoes: ['if / else', 'for', 'while', 'continue'],
    explicacao: 'O if / else avalia uma condição booleana e desvia o fluxo para o bloco verdadeiro (if) ou falso (else).'
  },
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'No trecho "if (nota >= 7) { ... } else if (nota >= 5) { ... } else { ... }", quando o bloco final "else" será executado?',
    correta: 'Apenas quando todas as condições anteriores forem falsas',
    opcoes: [
      'Apenas quando todas as condições anteriores forem falsas',
      'Sempre ao final da verificação, independente da nota',
      'Quando a primeira condição for verdadeira',
      'Apenas se ocorrer um erro de sintaxe'
    ],
    explicacao: 'O bloco else funciona como caminho padrão quando nenhuma das condições if ou else if anteriores é satisfeita.'
  },
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'Qual operador em JavaScript permite escrever uma decisão simples de if / else em uma única linha (ex: idade >= 18 ? "Maior" : "Menor")?',
    correta: 'Operador ternário (? :)',
    opcoes: ['Operador ternário (? :)', 'Operador de coalescência (??)', 'Spread operator (...)', 'Operador módulo (%)'],
    explicacao: 'O operador ternário avalia uma condição seguida de ? (valor se verdadeiro) e : (valor se falso).'
  },
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'Em uma condição "if (usuarioLogado && temPermissao)", quando o bloco interno será executado?',
    correta: 'Somente quando ambas as variáveis forem verdadeiras',
    opcoes: [
      'Somente quando ambas as variáveis forem verdadeiras',
      'Basta que uma das duas variáveis seja verdadeira',
      'Quando ambas as variáveis forem falsas',
      'Sempre que usuarioLogado for diferente de null, ignorando temPermissao'
    ],
    explicacao: 'O operador lógico E (&&) exige que todas as expressões conectadas sejam verdadeiras para retornar true.'
  },
  {
    categoria: 'controle',
    termo: 'for',
    pergunta: 'Na declaração clássica "for (let i = 0; i < 10; i++)", quais são as três partes separadas por ponto e vírgula, respectivamente?',
    correta: 'Inicialização, condição de parada e incremento/atualização',
    opcoes: [
      'Inicialização, condição de parada e incremento/atualização',
      'Condição de parada, incremento e retorno',
      'Declaração de função, parâmetro e escopo',
      'Entrada de dados, processamento e saída'
    ],
    explicacao: 'O cabeçalho do laço for define primeiro a variável de controle, depois o teste lógico a cada volta e por fim o passo de atualização.'
  },
  {
    categoria: 'controle',
    termo: 'for',
    pergunta: 'Quantas vezes o laço "for (let i = 0; i < 5; i++)" executará seu bloco interno?',
    correta: '5 vezes (para i = 0, 1, 2, 3 e 4)',
    opcoes: [
      '5 vezes (para i = 0, 1, 2, 3 e 4)',
      '6 vezes (de 0 até 5 inclusive)',
      '4 vezes (de 1 até 4)',
      'Infinitas vezes'
    ],
    explicacao: 'Começando em 0 e parando antes de 5 (i < 5), os valores assumidos por i são 0, 1, 2, 3 e 4, totalizando 5 repetições.'
  },
  {
    categoria: 'controle',
    termo: 'for',
    pergunta: 'Qual variação moderna do laço "for" em JavaScript é ideal para percorrer diretamente os valores de um array (ex: "for (const item of lista)")?',
    correta: 'for...of',
    opcoes: ['for...of', 'do...while', 'switch...case', 'try...catch'],
    explicacao: 'O laço for...of itera diretamente sobre os elementos de objetos iteráveis como Arrays e Strings.'
  },
  {
    categoria: 'controle',
    termo: 'for',
    pergunta: 'Se você precisa percorrer um array de trás para frente (do último índice até o índice 0), qual configuração de laço for é a correta?',
    correta: 'for (let i = lista.length - 1; i >= 0; i--)',
    opcoes: [
      'for (let i = lista.length - 1; i >= 0; i--)',
      'for (let i = 0; i < lista.length; i++)',
      'for (let i = lista.length; i > 0; i++)',
      'for (let i = -1; i <= lista.length; i--)'
    ],
    explicacao: 'O último elemento de um array está em lista.length - 1, e decrementamos i (i--) enquanto i >= 0.'
  },
  {
    categoria: 'controle',
    termo: 'while',
    pergunta: 'Quando o laço "while" é mais recomendado do que o laço "for" tradicional?',
    correta: 'Quando não sabemos previamente quantas repetições serão necessárias até a condição mudar',
    opcoes: [
      'Quando não sabemos previamente quantas repetições serão necessárias até a condição mudar',
      'Apenas quando queremos percorrer um array de tamanho fixo 10',
      'Quando queremos declarar uma classe orientada a objetos',
      'Somente quando o código não possui variáveis booleanas'
    ],
    explicacao: 'O while é ideal para repetições baseadas em estado ou eventos cujo número de iterações não é conhecido antes do loop iniciar.'
  },
  {
    categoria: 'controle',
    termo: 'while',
    pergunta: 'O que acontece se a condição de um laço "while (condicao)" nunca se tornar falsa e não houver um "break" interno?',
    correta: 'Ocorre um loop infinito, travando a execução do programa',
    opcoes: [
      'Ocorre um loop infinito, travando a execução do programa',
      'O JavaScript encerra o laço automaticamente após 10 voltas',
      'O laço é ignorado e o programa pula para a linha final',
      'A variável de controle é convertida para null automaticamente'
    ],
    explicacao: 'Sem atualizar o estado que torna a condição falsa, o laço while repete indefinidamente (loop infinito).'
  },
  {
    categoria: 'controle',
    termo: 'while',
    pergunta: 'Quantas vezes o bloco interno de "let x = 10; while (x < 5) { x++; }" será executado?',
    correta: 'Nenhuma vez (0 vezes), pois a condição já inicia falsa',
    opcoes: [
      'Nenhuma vez (0 vezes), pois a condição já inicia falsa',
      '1 vez, pois todo laço executa ao menos uma vez',
      '5 vezes',
      '10 vezes'
    ],
    explicacao: 'O while testa a condição antes da primeira execução. Como 10 < 5 é falso, o bloco nunca entra em execução.'
  },
  {
    categoria: 'controle',
    termo: 'do-while',
    pergunta: 'Qual é a diferença fundamental entre o laço "while" e o laço "do-while"?',
    correta: 'O do-while executa o bloco pelo menos uma vez antes de testar a condição',
    opcoes: [
      'O do-while executa o bloco pelo menos uma vez antes de testar a condição',
      'O do-while não precisa de condição lógica para parar',
      'O while só aceita números inteiros, enquanto o do-while aceita strings',
      'O do-while executa o código em paralelo no servidor'
    ],
    explicacao: 'No do-while a verificação fica no final do bloco, garantindo no mínimo uma execução mesmo que a condição seja falsa de início.'
  },
  {
    categoria: 'controle',
    termo: 'do-while',
    pergunta: 'Em qual situação prática o "do-while" se encaixa melhor?',
    correta: 'Exibir um menu interativo ao menos uma vez e repetir enquanto o usuário não escolher "Sair"',
    opcoes: [
      'Exibir um menu interativo ao menos uma vez e repetir enquanto o usuário não escolher "Sair"',
      'Declarar constantes globais de configuração da API',
      'Substituir a importação de módulos externos',
      'Ordenar alfabeticamente as propriedades de um arquivo CSS'
    ],
    explicacao: 'Menus e prompts de validação precisam ser exibidos primeiro para capturar a entrada do usuário e só depois validar se devem repetir.'
  },
  {
    categoria: 'controle',
    termo: 'switch',
    pergunta: 'Qual estrutura condicional é mais organizada para comparar uma mesma variável contra múltiplos valores exatos (como "segunda", "terça", "quarta")?',
    correta: 'switch',
    opcoes: ['switch', 'while', 'continue', 'do-while'],
    explicacao: 'O switch avalia uma expressão uma única vez e compara o resultado com diversas cláusulas case, evitando dezenas de else if.'
  },
  {
    categoria: 'controle',
    termo: 'switch',
    pergunta: 'Para que serve a cláusula "default:" dentro de uma estrutura "switch"?',
    correta: 'Definir o código que será executado se nenhum dos "case" anteriores corresponder ao valor',
    opcoes: [
      'Definir o código que será executado se nenhum dos "case" anteriores corresponder ao valor',
      'Reiniciar o switch desde o primeiro case',
      'Converter todos os casos para letras maiúsculas',
      'Encerrar a execução de todo o arquivo JavaScript'
    ],
    explicacao: 'O bloco default funciona de forma semelhante ao else final, tratando qualquer valor não previsto nos cases.'
  },
  {
    categoria: 'controle',
    termo: 'switch',
    pergunta: 'O que acontece em um "switch" se você esquecer de colocar o comando "break" ao final de um "case" verdadeiro?',
    correta: 'Ocorre o "fall-through": o programa continua executando os próximos cases abaixo dele',
    opcoes: [
      'Ocorre o "fall-through": o programa continua executando os próximos cases abaixo dele',
      'O código gera um erro fatal de compilação e não abre',
      'O switch retorna automaticamente undefined',
      'O navegador apaga a variável testada da memória'
    ],
    explicacao: 'Sem o break, a execução "cai" (fall-through) para o case seguinte até encontrar um break ou o fim do switch.'
  },
  {
    categoria: 'controle',
    termo: 'break',
    pergunta: 'Quando você está procurando um item específico dentro de um laço "for" e já o encontrou na 3ª posição de 10.000 itens, qual comando encerra o laço imediatamente?',
    correta: 'break',
    opcoes: ['break', 'continue', 'switch', 'do-while'],
    explicacao: 'O comando break interrompe imediatamente o laço de repetição mais próximo, economizando processamento desnecessário.'
  },
  {
    categoria: 'controle',
    termo: 'break',
    pergunta: 'No trecho "for (let i = 1; i <= 5; i++) { if (i === 3) break; console.log(i); }", quais números serão impressos?',
    correta: 'Apenas 1 e 2',
    opcoes: ['Apenas 1 e 2', '1, 2, 4 e 5', '1, 2 e 3', 'Apenas 3'],
    explicacao: 'Quando i vale 3, o break encerra completamente o laço antes do console.log, imprimindo somente 1 e 2.'
  },
  {
    categoria: 'controle',
    termo: 'continue',
    pergunta: 'Qual comando dentro de um loop ignora apenas a volta (iteração) atual e pula direto para a próxima repetição do laço?',
    correta: 'continue',
    opcoes: ['continue', 'break', 'return', 'switch'],
    explicacao: 'Diferente do break (que encerra o loop todo), o continue apenas salta o restante do código na volta atual e avança para a próxima.'
  },
  {
    categoria: 'controle',
    termo: 'continue',
    pergunta: 'No trecho "for (let i = 1; i <= 4; i++) { if (i === 2) continue; console.log(i); }", qual será a saída no console?',
    correta: '1, 3 e 4 (pula apenas o número 2)',
    opcoes: [
      '1, 3 e 4 (pula apenas o número 2)',
      'Apenas 1 (para no 2)',
      '1, 2, 3 e 4',
      'Apenas 2'
    ],
    explicacao: 'Quando i é 2, o continue pula o console.log daquela iteração e segue normalmente para i = 3 e i = 4.'
  },
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'Em JavaScript, qual destes valores é considerado "falsy" (avaliado como falso dentro de um "if")?',
    correta: '0 (número zero) ou string vazia ""',
    opcoes: [
      '0 (número zero) ou string vazia ""',
      'Um array vazio []',
      'Um objeto vazio {}',
      'A string "false" com texto dentro'
    ],
    explicacao: 'Em JavaScript, os valores falsy são: false, 0, -0, 0n, "", null, undefined e NaN. Arrays e objetos vazios são truthy.'
  },
  {
    categoria: 'controle',
    termo: 'for',
    pergunta: 'O que é um "laço aninhado" (nested loop) em programação?',
    correta: 'Um laço de repetição colocado dentro de outro laço (ex: um for dentro de outro for)',
    opcoes: [
      'Um laço de repetição colocado dentro de outro laço (ex: um for dentro de outro for)',
      'Um laço que nunca termina de executar',
      'Uma variável que armazena textos e números ao mesmo tempo',
      'Um arquivo JavaScript importado dentro do HTML'
    ],
    explicacao: 'Laços aninhados são muito usados para percorrer matrizes bidimensionais (linhas e colunas) ou comparar pares de elementos.'
  },
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'Para que serve o operador lógico "!" (NÃO / NOT) antes de uma condição, como em "if (!usuarioAtivo)"?',
    correta: 'Inverter o valor booleano da expressão (verdadeiro vira falso e falso vira verdadeiro)',
    opcoes: [
      'Inverter o valor booleano da expressão (verdadeiro vira falso e falso vira verdadeiro)',
      'Multiplicar o valor numérico da variável por -1',
      'Apagar a variável da memória após o if',
      'Transformar a variável em uma constante imutável'
    ],
    explicacao: 'O operador ! nega a expressão lógica: if (!usuarioAtivo) executa quando usuarioAtivo é falso.'
  },
  {
    categoria: 'controle',
    termo: 'if / else',
    pergunta: 'Em uma condição com o operador OU ("if (ehAdmin || ehModerador)"), quando o bloco será executado?',
    correta: 'Basta que pelo menos uma das condições seja verdadeira',
    opcoes: [
      'Basta que pelo menos uma das condições seja verdadeira',
      'Somente se ambas forem falsas',
      'Somente se ambas forem simultaneamente verdadeiras',
      'Apenas na segunda vez que o código rodar'
    ],
    explicacao: 'O operador lógico OU (||) retorna verdadeiro se qualquer um dos lados for verdadeiro.'
  },
  {
    categoria: 'controle',
    termo: 'while',
    pergunta: 'Qual cuidado é indispensável ao usar uma variável contadora dentro de um bloco "while (contador < 10)"?',
    correta: 'Atualizar/incrementar a variável contadora dentro do bloco para evitar loop infinito',
    opcoes: [
      'Atualizar/incrementar a variável contadora dentro do bloco para evitar loop infinito',
      'Declarar a variável contadora com const para que ela nunca mude',
      'Colocar um switch obrigatório dentro de todo while',
      'Converter o contador para string antes de comparar'
    ],
    explicacao: 'Como o while não possui passo de incremento automático no cabeçalho, é preciso atualizar a variável no corpo do laço.'
  },
  {
    categoria: 'controle',
    termo: 'switch',
    pergunta: 'Qual tipo de comparação o comando "switch" do JavaScript realiza entre a expressão e os valores de cada "case"?',
    correta: 'Comparação estrita (===), verificando tanto o valor quanto o tipo do dado',
    opcoes: [
      'Comparação estrita (===), verificando tanto o valor quanto o tipo do dado',
      'Comparação aproximada, ignorando se é número ou texto',
      'Comparação apenas pelo tamanho em bytes da variável',
      'Comparação alfabética insensível a maiúsculas e minúsculas'
    ],
    explicacao: 'No JavaScript, o switch usa igualdade estrita (===): case "1" não bate com o número 1.'
  },

  // =========================================================================
  // 2. FUNÇÕES (funcao)
  // =========================================================================
  {
    categoria: 'funcao',
    termo: 'função',
    pergunta: 'Qual é a principal vantagem de dividir um programa grande em várias funções menores?',
    correta: 'Reutilizar código, facilitar a manutenção e deixar a lógica mais organizada e legível',
    opcoes: [
      'Reutilizar código, facilitar a manutenção e deixar a lógica mais organizada e legível',
      'Impedir que o navegador utilize memória RAM durante a execução',
      'Fazer o código funcionar sem precisar de variáveis',
      'Substituir completamente o uso de estruturas condicionais'
    ],
    explicacao: 'Funções encapsulam tarefas específicas, evitando repetição de código (princípio DRY) e facilitando testes e leitura.'
  },
  {
    categoria: 'funcao',
    termo: 'função',
    pergunta: 'Apenas declarar "function saudar() { console.log(\'Olá\'); }" faz a mensagem aparecer na tela imediatamente?',
    correta: 'Não, a função só é executada quando é invocada/chamada com parênteses: saudar()',
    opcoes: [
      'Não, a função só é executada quando é invocada/chamada com parênteses: saudar()',
      'Sim, toda função declarada executa automaticamente ao carregar o arquivo',
      'Sim, mas apenas se estiver na primeira linha do código',
      'Não, porque funções não podem conter console.log'
    ],
    explicacao: 'Declarar uma função apenas registra sua receita na memória; para executá-la é necessário invocá-la com saudar().'
  },
  {
    categoria: 'funcao',
    termo: 'parâmetro',
    pergunta: 'Qual é a diferença conceitual entre "parâmetro" e "argumento" em uma função?',
    correta: 'Parâmetro é a variável na definição da função; argumento é o valor real enviado na chamada',
    opcoes: [
      'Parâmetro é a variável na definição da função; argumento é o valor real enviado na chamada',
      'Parâmetro só aceita números e argumento só aceita textos',
      'Parâmetro é usado em arrow functions e argumento em funções normais',
      'Não existe nenhuma relação entre eles; parâmetros são laços de repetição'
    ],
    explicacao: 'Em function somar(a, b), "a" e "b" são parâmetros. Ao chamar somar(5, 10), os valores 5 e 10 são os argumentos.'
  },
  {
    categoria: 'funcao',
    termo: 'parâmetro',
    pergunta: 'O que faz a sintaxe "function cumprimentar(nome = \'Visitante\')" no parâmetro da função?',
    correta: 'Define um valor padrão caso a função seja chamada sem passar esse argumento',
    opcoes: [
      'Define um valor padrão caso a função seja chamada sem passar esse argumento',
      'Impede que a função receba qualquer outro nome diferente de "Visitante"',
      'Gera um erro caso o usuário passe um argumento na chamada',
      'Transforma a função em um laço de repetição'
    ],
    explicacao: 'Parâmetros padrão (default parameters) atribuem um valor inicial automaticamente quando o argumento é omitido ou undefined.'
  },
  {
    categoria: 'funcao',
    termo: 'parâmetro',
    pergunta: 'Como uma função em JavaScript pode receber uma quantidade variável de argumentos agrupados em um array (ex: "function somarTudo(...numeros)")?',
    correta: 'Usando o Rest Parameter (...)',
    opcoes: [
      'Usando o Rest Parameter (...)',
      'Usando o comando break dentro dos parênteses',
      'Declarando 100 parâmetros manualmente',
      'Usando a palavra-chave switch nos parâmetros'
    ],
    explicacao: 'O operador rest (...) na lista de parâmetros empacota todos os argumentos extras passados em um único Array.'
  },
  {
    categoria: 'funcao',
    termo: 'return',
    pergunta: 'O que acontece com as linhas de código escritas logo abaixo de um "return resultado;" dentro do mesmo bloco de uma função?',
    correta: 'Nunca são executadas, pois o return encerra a função imediatamente',
    opcoes: [
      'Nunca são executadas, pois o return encerra a função imediatamente',
      'São executadas normalmente depois de devolver o valor',
      'São executadas antes do return por causa do hoisting',
      'Fazem a função rodar duas vezes seguidas'
    ],
    explicacao: 'O comando return devolve o valor ao chamador e finaliza instantaneamente a execução da função.'
  },
  {
    categoria: 'funcao',
    termo: 'return',
    pergunta: 'Qual valor uma função em JavaScript devolve por padrão quando ela NÃO possui a instrução "return"?',
    correta: 'undefined',
    opcoes: ['undefined', 'null', '0', 'false'],
    explicacao: 'Toda função sem return explícito (ou com um return vazio "return;") retorna automaticamente undefined.'
  },
  {
    categoria: 'funcao',
    termo: 'return',
    pergunta: 'Por que usar "return" em vez de apenas "console.log()" dentro de uma função de cálculo?',
    correta: 'Porque o return devolve o valor para ser salvo em variáveis ou usado em outras expressões',
    opcoes: [
      'Porque o return devolve o valor para ser salvo em variáveis ou usado em outras expressões',
      'Porque o console.log apaga os dados do banco de dados',
      'Porque funções com console.log não aceitam parâmetros',
      'Porque o return imprime o texto em fonte maior no navegador'
    ],
    explicacao: 'console.log apenas exibe uma mensagem no painel de desenvolvedor; return entrega o dado para que o programa continue trabalhando com ele.'
  },
  {
    categoria: 'funcao',
    termo: 'arrow function',
    pergunta: 'Na arrow function concisa "const dobrar = n => n * 2;", por que não foi necessário escrever a palavra "return"?',
    correta: 'Porque arrow functions sem chaves {} possuem retorno implícito da expressão',
    opcoes: [
      'Porque arrow functions sem chaves {} possuem retorno implícito da expressão',
      'Porque arrow functions nunca retornam valores',
      'Porque o operador * já funciona como comando return em qualquer função',
      'Porque variáveis const retornam seu próprio nome automaticamente'
    ],
    explicacao: 'Quando o corpo da arrow function é uma única expressão sem chaves {}, o resultado dessa expressão é retornado implicitamente.'
  },
  {
    categoria: 'funcao',
    termo: 'arrow function',
    pergunta: 'Se uma arrow function usar chaves "{ }", como em "const somar = (a, b) => { a + b }", o que ela retornará se não colocarmos a palavra "return"?',
    correta: 'undefined, pois ao usar chaves {} o comando return passa a ser obrigatório',
    opcoes: [
      'undefined, pois ao usar chaves {} o comando return passa a ser obrigatório',
      'A soma de a + b normalmente',
      'Um objeto literal contendo a e b',
      'O número 0'
    ],
    explicacao: 'Em arrow functions, abrir chaves {} define um bloco de instruções, exigindo a palavra-chave return explícita para devolver um valor.'
  },
  {
    categoria: 'funcao',
    termo: 'arrow function',
    pergunta: 'Como uma arrow function lida com a palavra-chave "this" em comparação a uma função tradicional?',
    correta: 'Ela não cria seu próprio "this", herdando o "this" do escopo externo onde foi criada',
    opcoes: [
      'Ela não cria seu próprio "this", herdando o "this" do escopo externo onde foi criada',
      'Ela apaga o "this" de todas as classes do projeto',
      'Ela obriga o desenvolvedor a passar "this" como primeiro parâmetro',
      'Ela só permite usar "this" dentro de laços while'
    ],
    explicacao: 'Arrow functions possuem escopo léxico de this, o que as torna excelentes para callbacks dentro de métodos e eventos.'
  },
  {
    categoria: 'funcao',
    termo: 'função anônima',
    pergunta: 'O que caracteriza uma "função anônima" em JavaScript?',
    correta: 'Uma função declarada sem nome próprio, geralmente atribuída a uma variável ou passada como callback',
    opcoes: [
      'Uma função declarada sem nome próprio, geralmente atribuída a uma variável ou passada como callback',
      'Uma função que oculta o endereço IP do usuário',
      'Uma função que não pode receber parâmetros nem retornar valores',
      'Uma função criptografada pelo banco de dados'
    ],
    explicacao: 'Funções anônimas não possuem identificador após a palavra function (ou são arrow functions) e costumam ser passadas diretamente como argumento.'
  },
  {
    categoria: 'funcao',
    termo: 'função anônima',
    pergunta: 'No código "setTimeout(function() { console.log(\'Pronto!\'); }, 1000);", o primeiro argumento passado para setTimeout é:',
    correta: 'Uma função anônima usada como callback',
    opcoes: [
      'Uma função anônima usada como callback',
      'Uma classe orientada a objetos com herança',
      'Um laço de repetição infinito',
      'Uma variável global constante'
    ],
    explicacao: 'A função passada diretamente dentro de setTimeout não tem nome próprio, sendo executada após 1000 milissegundos.'
  },
  {
    categoria: 'funcao',
    termo: 'escopo',
    pergunta: 'Se você declara "let segredo = 42;" dentro de uma função "calcular()", o que acontece ao tentar acessar "segredo" fora dessa função?',
    correta: 'Ocorre um erro (ReferenceError), pois a variável pertence apenas ao escopo local da função',
    opcoes: [
      'Ocorre um erro (ReferenceError), pois a variável pertence apenas ao escopo local da função',
      'O valor 42 é exibido normalmente em qualquer lugar do projeto',
      'O valor 42 é convertido para 0 fora da função',
      'O navegador cria automaticamente uma cópia global da variável'
    ],
    explicacao: 'Variáveis declaradas dentro de uma função têm escopo local (de função/bloco) e não são visíveis fora dela.'
  },
  {
    categoria: 'funcao',
    termo: 'escopo',
    pergunta: 'Por que o uso excessivo de variáveis no "escopo global" é considerado uma má prática de programação?',
    correta: 'Porque qualquer parte do código pode alterar essas variáveis acidentalmente, gerando conflitos e bugs difíceis de rastrear',
    opcoes: [
      'Porque qualquer parte do código pode alterar essas variáveis acidentalmente, gerando conflitos e bugs difíceis de rastrear',
      'Porque variáveis globais não aceitam números nem textos',
      'Porque o JavaScript proíbe mais de duas variáveis globais por arquivo',
      'Porque variáveis globais apagam o CSS da página'
    ],
    explicacao: 'Manter variáveis no menor escopo necessário evita colisões de nomes e efeitos colaterais inesperados entre funções.'
  },
  {
    categoria: 'funcao',
    termo: 'escopo',
    pergunta: 'Qual é a diferença de escopo entre variáveis declaradas com "var" e variáveis declaradas com "let" ou "const"?',
    correta: 'let e const têm escopo de bloco { }, enquanto var ignora blocos como if/for e tem escopo de função',
    opcoes: [
      'let e const têm escopo de bloco { }, enquanto var ignora blocos como if/for e tem escopo de função',
      'var só funciona dentro de blocos if, enquanto let funciona em todo o computador',
      'Não há diferença de escopo; mudam apenas as cores no editor',
      'const tem escopo global obrigatório, enquanto var é sempre privado'
    ],
    explicacao: 'let e const respeitam qualquer bloco delimitado por chaves {}, evitando que variáveis vazem de dentro de um if ou for.'
  },
  {
    categoria: 'funcao',
    termo: 'função',
    pergunta: 'O que significa dizer que uma função é uma "função pura" (pure function)?',
    correta: 'Para os mesmos argumentos, ela sempre retorna o mesmo resultado e não causa efeitos colaterais externos',
    opcoes: [
      'Para os mesmos argumentos, ela sempre retorna o mesmo resultado e não causa efeitos colaterais externos',
      'Ela não possui parâmetros nem comando return',
      'Ela só utiliza variáveis globais e modifica o DOM diretamente',
      'Ela foi escrita sem usar espaços em branco'
    ],
    explicacao: 'Funções puras são previsíveis e fáceis de testar porque dependem apenas de seus parâmetros e não alteram estados externos.'
  },
  {
    categoria: 'funcao',
    termo: 'função',
    pergunta: 'O que acontece em JavaScript se você chamar uma função "somar(a, b)" passando apenas um argumento "somar(5)"?',
    correta: 'O segundo parâmetro "b" receberá o valor undefined',
    opcoes: [
      'O segundo parâmetro "b" receberá o valor undefined',
      'O navegador fechará a aba imediatamente',
      'O parâmetro "b" assumirá automaticamente o mesmo valor de "a" (5)',
      'A função não será executada'
    ],
    explicacao: 'Em JavaScript, parâmetros que não recebem argumento correspondente na chamada ficam com valor undefined (a menos que tenham valor padrão).'
  },
  {
    categoria: 'funcao',
    termo: 'return',
    pergunta: 'Como uma função em JavaScript pode retornar múltiplos valores de uma só vez (por exemplo, o menor e o maior número de uma lista)?',
    correta: 'Retornando um Array (ex: return [menor, maior]) ou um Objeto (ex: return { menor, maior })',
    opcoes: [
      'Retornando um Array (ex: return [menor, maior]) ou um Objeto (ex: return { menor, maior })',
      'Escrevendo dois comandos return seguidos um abaixo do outro',
      'Separando os valores por ponto e vírgula após o return',
      'Não é possível devolver mais de uma informação em nenhuma linguagem'
    ],
    explicacao: 'Como o return encerra a função na primeira execução, agrupamos múltiplos dados dentro de um objeto ou array para retorná-los juntos.'
  },
  {
    categoria: 'funcao',
    termo: 'arrow function',
    pergunta: 'Qual cuidado sintático é necessário para uma arrow function retornar diretamente um objeto literal de forma implícita?',
    correta: 'Envolver o objeto entre parênteses: const criar = () => ({ nome: "Ana" })',
    opcoes: [
      'Envolver o objeto entre parênteses: const criar = () => ({ nome: "Ana" })',
      'Usar colchetes no lugar das chaves do objeto',
      'Escrever a palavra class antes da seta =>',
      'Colocar ponto e vírgula dentro das chaves do objeto'
    ],
    explicacao: 'Sem os parênteses ao redor de ({ ... }), o JavaScript interpreta as chaves {} como o bloco de código da função e não como um objeto.'
  },

  // =========================================================================
  // 3. VARIÁVEIS E DADOS (dados)
  // =========================================================================
  {
    categoria: 'dados',
    termo: 'variável',
    pergunta: 'Qual destes nomes de variável segue a convenção "camelCase" recomendada em JavaScript?',
    correta: 'totalDePontosUsuario',
    opcoes: ['totalDePontosUsuario', 'total-de-pontos-usuario', '2totalPontos', 'total de pontos'],
    explicacao: 'No padrão camelCase, a primeira palavra começa com letra minúscula e cada palavra seguinte começa com letra maiúscula, sem espaços ou hifens.'
  },
  {
    categoria: 'dados',
    termo: 'const e let',
    pergunta: 'O que acontece ao tentar reatribuir uma variável declarada com "const", como em "const PI = 3.14; PI = 3.1415;"?',
    correta: 'Ocorre um erro (TypeError: Assignment to constant variable)',
    opcoes: [
      'Ocorre um erro (TypeError: Assignment to constant variable)',
      'O valor é atualizado normalmente para 3.1415',
      'O JavaScript ignora a segunda linha sem avisar',
      'A variável PI é apagada da memória'
    ],
    explicacao: 'Variáveis declaradas com const não permitem que sua referência seja reatribuída após a inicialização.'
  },
  {
    categoria: 'dados',
    termo: 'const e let',
    pergunta: 'Se um array é declarado com "const frutas = [\'Maçã\'];", é permitido executar "frutas.push(\'Banana\')"?',
    correta: 'Sim, pois const impede reatribuir a variável, mas permite alterar o conteúdo interno de arrays e objetos',
    opcoes: [
      'Sim, pois const impede reatribuir a variável, mas permite alterar o conteúdo interno de arrays e objetos',
      'Não, qualquer array declarado com const fica totalmente bloqueado para push ou pop',
      'Sim, mas apenas se o array tiver menos de 3 elementos',
      'Não, porque push só funciona com variáveis declaradas com var'
    ],
    explicacao: 'Em objetos e arrays, const protege a referência na memória (frutas = outroArray daria erro), mas os elementos internos continuam mutáveis.'
  },
  {
    categoria: 'dados',
    termo: 'array',
    pergunta: 'No array "const cores = [\'azul\', \'verde\', \'roxo\'];", qual expressão acessa o primeiro elemento ("azul") e qual acessa o último ("roxo")?',
    correta: 'cores[0] e cores[2] (ou cores[cores.length - 1])',
    opcoes: [
      'cores[0] e cores[2] (ou cores[cores.length - 1])',
      'cores[1] e cores[3]',
      'cores.first() e cores.last()',
      'cores[-1] e cores[0]'
    ],
    explicacao: 'Arrays em JavaScript têm indexação baseada em zero: o primeiro item fica no índice 0 e o último em length - 1.'
  },
  {
    categoria: 'dados',
    termo: 'array',
    pergunta: 'Qual método de Array cria um NOVO array contendo apenas os elementos que passam em um teste lógico (ex: números maiores que 10)?',
    correta: 'filter()',
    opcoes: ['filter()', 'push()', 'pop()', 'join()'],
    explicacao: 'O método .filter() percorre o array e retorna uma nova lista apenas com os itens para os quais a função callback retornou true.'
  },
  {
    categoria: 'dados',
    termo: 'array',
    pergunta: 'Qual método de Array transforma cada elemento de uma lista e retorna um NOVO array do mesmo tamanho com os resultados transformados?',
    correta: 'map()',
    opcoes: ['map()', 'filter()', 'shift()', 'includes()'],
    explicacao: 'O método .map() aplica uma função a cada item do array original e devolve um novo array com os valores retornados.'
  },
  {
    categoria: 'dados',
    termo: 'array',
    pergunta: 'Quais métodos de Array adicionam um item ao final da lista e removem o último item da lista, respectivamente?',
    correta: 'push() e pop()',
    opcoes: ['push() e pop()', 'shift() e unshift()', 'slice() e splice()', 'map() e reduce()'],
    explicacao: 'push() insere elementos no fim do array, enquanto pop() remove e retorna o último elemento do array.'
  },
  {
    categoria: 'dados',
    termo: 'string',
    pergunta: 'Qual recurso do JavaScript permite inserir variáveis diretamente dentro de um texto usando crases, como em `Olá, ${nome}!`?',
    correta: 'Template Literals (Template Strings)',
    opcoes: [
      'Template Literals (Template Strings)',
      'JSON.stringify()',
      'Expressões Regulares',
      'Hoisting de texto'
    ],
    explicacao: 'Template literals usam crases (` `) e permitem interpolar variáveis e expressões com ${...}, além de suportar múltiplas linhas.'
  },
  {
    categoria: 'dados',
    termo: 'string',
    pergunta: 'O que retorna a expressão `"CodeHelper".toLowerCase().includes("code")`?',
    correta: 'true (verdadeiro)',
    opcoes: ['true (verdadeiro)', 'false (falso)', '"code"', '4'],
    explicacao: 'toLowerCase() converte o texto para "codehelper", e includes("code") verifica se a substring "code" está presente, retornando true.'
  },
  {
    categoria: 'dados',
    termo: 'number',
    pergunta: 'Qual é o resultado da expressão `"5" + 3` em JavaScript e por que isso ocorre?',
    correta: '"53" (string), pois o operador + com uma string realiza concatenação de texto',
    opcoes: [
      '"53" (string), pois o operador + com uma string realiza concatenação de texto',
      '8 (number), pois o JavaScript sempre converte textos para números automaticamente',
      'NaN, pois não é possível usar o operador + com tipos diferentes',
      '15, pois ele multiplica os valores'
    ],
    explicacao: 'Quando um dos operandos do + é uma string, o JavaScript converte o outro para string e concatena. Para somar, usa-se Number("5") + 3.'
  },
  {
    categoria: 'dados',
    termo: 'number',
    pergunta: 'Para que serve o operador módulo "%" (como em "numero % 2 === 0")?',
    correta: 'Obter o resto da divisão inteira (muito usado para descobrir se um número é par ou ímpar)',
    opcoes: [
      'Obter o resto da divisão inteira (muito usado para descobrir se um número é par ou ímpar)',
      'Calcular porcentagens financeiras automaticamente',
      'Dividir dois números arredondando para cima',
      'Converter um número decimal em binário'
    ],
    explicacao: 'O operador % retorna o resto da divisão. Se numero % 2 === 0, a divisão por 2 é exata, logo o número é par.'
  },
  {
    categoria: 'dados',
    termo: 'boolean',
    pergunta: 'Qual é a diferença essencial entre os operadores de igualdade "==" e "===" em JavaScript?',
    correta: '=== compara valor e tipo estritamente; == tenta converter os tipos antes de comparar',
    opcoes: [
      '=== compara valor e tipo estritamente; == tenta converter os tipos antes de comparar',
      '== compara valor e tipo; === serve apenas para atribuir valores a constantes',
      '=== só funciona com textos e == só funciona com números',
      'Não existe diferença; ambos produzem sempre o mesmo resultado'
    ],
    explicacao: 'Com ==, "5" == 5 resulta em true por coerção de tipo. Com ===, "5" === 5 resulta em false porque um é string e o outro é number.'
  },
  {
    categoria: 'dados',
    termo: 'null e undefined',
    pergunta: 'Qual é a diferença prática entre "undefined" e "null" em JavaScript?',
    correta: 'undefined indica que uma variável foi declarada mas ainda não recebeu valor; null representa ausência intencional de valor',
    opcoes: [
      'undefined indica que uma variável foi declarada mas ainda não recebeu valor; null representa ausência intencional de valor',
      'null ocorre apenas em números e undefined ocorre apenas em strings',
      'undefined é um erro de sintaxe que trava o código e null é o número zero',
      'São palavras sinônimas que apontam para o número -1'
    ],
    explicacao: 'O motor do JS atribui undefined para variáveis não inicializadas; já null é atribuído pelo programador para indicar "vazio/sem objeto".'
  },
  {
    categoria: 'dados',
    termo: 'objeto literal',
    pergunta: 'Dado o objeto "const aluno = { nome: \'Caio\', curso: \'ADS\' };", como podemos acessar o valor "ADS"?',
    correta: 'aluno.curso ou aluno["curso"]',
    opcoes: [
      'aluno.curso ou aluno["curso"]',
      'aluno[1]',
      'aluno->curso()',
      'Object.get(aluno, 2)'
    ],
    explicacao: 'Propriedades de objetos em JavaScript podem ser acessadas pela notação de ponto (aluno.curso) ou de colchetes (aluno["curso"]).'
  },
  {
    categoria: 'dados',
    termo: 'objeto literal',
    pergunta: 'O que faz a sintaxe de desestruturação (destructuring) "const { nome, idade } = usuario;"?',
    correta: 'Extrai as propriedades "nome" e "idade" de dentro do objeto "usuario" para variáveis independentes',
    opcoes: [
      'Extrai as propriedades "nome" e "idade" de dentro do objeto "usuario" para variáveis independentes',
      'Apaga as propriedades "nome" e "idade" de dentro do objeto original',
      'Transforma o objeto "usuario" em uma string JSON',
      'Cria uma classe vazia chamada usuario'
    ],
    explicacao: 'O destructuring permite desempacotar propriedades de objetos ou elementos de arrays diretamente em variáveis de forma limpa.'
  },
  {
    categoria: 'dados',
    termo: 'JSON',
    pergunta: 'Quais métodos nativos do JavaScript convertem um Objeto para texto JSON e um texto JSON de volta para Objeto, respectivamente?',
    correta: 'JSON.stringify() e JSON.parse()',
    opcoes: [
      'JSON.stringify() e JSON.parse()',
      'JSON.toText() e JSON.toObject()',
      'Object.encode() e Object.decode()',
      'String.fromJSON() e JSON.compile()'
    ],
    explicacao: 'JSON.stringify(obj) serializa o objeto em uma string JSON; JSON.parse(texto) reconstrói o objeto JavaScript a partir da string.'
  },
  {
    categoria: 'dados',
    termo: 'JSON',
    pergunta: 'Qual regra de sintaxe é OBRIGATÓRIA em um arquivo ou texto no formato JSON puro?',
    correta: 'Os nomes das chaves (propriedades) devem estar sempre entre aspas duplas ("chave")',
    opcoes: [
      'Os nomes das chaves (propriedades) devem estar sempre entre aspas duplas ("chave")',
      'Todas as linhas devem terminar com ponto e vírgula',
      'Os textos devem usar obrigatoriamente crases (`)',
      'Todo JSON precisa conter ao menos uma função dentro dele'
    ],
    explicacao: 'No padrão JSON, chaves precisam estar entre aspas duplas e tipos como funções ou undefined não são permitidos.'
  },
  {
    categoria: 'dados',
    termo: 'array',
    pergunta: 'Para que serve o operador Spread "..." ao criar um array como "const copia = [...original, 4]"?',
    correta: 'Espalhar/copiar todos os elementos do array original dentro do novo array e adicionar o 4 ao final',
    opcoes: [
      'Espalhar/copiar todos os elementos do array original dentro do novo array e adicionar o 4 ao final',
      'Multiplicar todos os itens do array original por 4',
      'Remover os 3 primeiros elementos do array original',
      'Transformar o array em um texto separado por três pontos'
    ],
    explicacao: 'O operador spread (...) expande os itens de um array ou propriedades de um objeto, facilitando cópias rasas e combinações imutáveis.'
  },
  {
    categoria: 'dados',
    termo: 'number',
    pergunta: 'O que significa o valor especial "NaN" em JavaScript (por exemplo, ao tentar calcular `Number("abc") * 2`)?',
    correta: 'Not-a-Number: representa o resultado de uma operação matemática inválida',
    opcoes: [
      'Not-a-Number: representa o resultado de uma operação matemática inválida',
      'Null-and-Negative: representa um número negativo nulo',
      'New-Array-Node: indica que um novo array foi criado',
      'Indica que a memória do navegador chegou ao limite'
    ],
    explicacao: 'NaN (Not-a-Number) surge quando uma função ou operação aritmética falha ao tentar produzir um número válido.'
  },
  {
    categoria: 'dados',
    termo: 'objeto literal',
    pergunta: 'Qual método retorna um array com todos os nomes das chaves (propriedades) próprias de um objeto "produto"?',
    correta: 'Object.keys(produto)',
    opcoes: [
      'Object.keys(produto)',
      'produto.length()',
      'Array.fromObject(produto)',
      'JSON.keys(produto)'
    ],
    explicacao: 'Object.keys(obj) retorna um array contendo as chaves do objeto, enquanto Object.values(obj) retorna os valores.'
  },

  // =========================================================================
  // 4. ORIENTAÇÃO A OBJETOS (poo)
  // =========================================================================
  {
    categoria: 'poo',
    termo: 'classe',
    pergunta: 'Na Programação Orientada a Objetos, qual é a melhor analogia para explicar a diferença entre "Classe" e "Objeto"?',
    correta: 'A Classe é o molde/planta arquitetônica; o Objeto é a casa concreta construída a partir desse molde',
    opcoes: [
      'A Classe é o molde/planta arquitetônica; o Objeto é a casa concreta construída a partir desse molde',
      'A Classe é uma variável numérica e o Objeto é um laço de repetição',
      'O Objeto é o molde abstrato e a Classe é o banco de dados SQL',
      'Não há diferença: ambos são arquivos CSS de estilização'
    ],
    explicacao: 'A classe define os atributos e métodos que suas instâncias terão; cada objeto criado com "new" é uma instância concreta.'
  },
  {
    categoria: 'poo',
    termo: 'objeto',
    pergunta: 'Qual palavra-chave é utilizada em JavaScript para criar uma nova instância (objeto) a partir de uma classe, como em "const conta = ___ ContaBancaria()"?',
    correta: 'new',
    opcoes: ['new', 'class', 'extends', 'super'],
    explicacao: 'O operador new aloca um novo objeto na memória, vincula o protótipo da classe e executa o método constructor().'
  },
  {
    categoria: 'poo',
    termo: 'construtor',
    pergunta: 'Quando o método especial "constructor()" de uma classe é executado?',
    correta: 'Automaticamente no exato momento em que uma nova instância da classe é criada com "new"',
    opcoes: [
      'Automaticamente no exato momento em que uma nova instância da classe é criada com "new"',
      'Somente quando o objeto é excluído da memória',
      'Apenas quando o usuário clica em um botão HTML',
      'Quando o servidor reinicia o banco de dados'
    ],
    explicacao: 'O construtor serve para inicializar as propriedades do recém-criado objeto com os argumentos recebidos no new.'
  },
  {
    categoria: 'poo',
    termo: 'construtor',
    pergunta: 'Dentro dos métodos e do construtor de uma classe, a que se refere a palavra-chave "this"?',
    correta: 'À instância (objeto atual) que está executando aquele método ou sendo construída',
    opcoes: [
      'À instância (objeto atual) que está executando aquele método ou sendo construída',
      'Sempre ao documento HTML inteiro (document)',
      'Ao arquivo package.json do servidor Node.js',
      'À última variável declarada fora da classe'
    ],
    explicacao: 'Em POO, this aponta para o próprio objeto instanciado, permitindo acessar seus atributos (ex: this.nome) e métodos.'
  },
  {
    categoria: 'poo',
    termo: 'método',
    pergunta: 'O que é um "método" dentro de uma classe?',
    correta: 'Uma função associada à classe que define um comportamento ou ação que o objeto sabe realizar',
    opcoes: [
      'Uma função associada à classe que define um comportamento ou ação que o objeto sabe realizar',
      'Um comentário de documentação ignorado pelo interpretador',
      'Uma constante global declarada fora de qualquer arquivo',
      'Um erro lançado quando falta memória'
    ],
    explicacao: 'Enquanto atributos guardam o estado/dados do objeto (ex: saldo), métodos definem suas ações (ex: depositar(), sacar()).'
  },
  {
    categoria: 'poo',
    termo: 'método',
    pergunta: 'O que caracteriza um método estático ("static") em uma classe JavaScript?',
    correta: 'Ele é chamado diretamente na própria Classe (ex: Matematica.somar(2, 3)) sem precisar instanciar um objeto com "new"',
    opcoes: [
      'Ele é chamado diretamente na própria Classe (ex: Matematica.somar(2, 3)) sem precisar instanciar um objeto com "new"',
      'Ele nunca pode receber parâmetros nem retornar valores',
      'Ele congela o navegador por 5 segundos antes de rodar',
      'Ele só pode ser executado uma única vez durante toda a execução do programa'
    ],
    explicacao: 'Métodos static pertencem à classe em si e não às instâncias individuais, sendo ideais para funções utilitárias.'
  },
  {
    categoria: 'poo',
    termo: 'herança',
    pergunta: 'Qual palavra-chave é usada em JavaScript para indicar que a classe "Cachorro" herda atributos e métodos da classe "Animal"?',
    correta: 'extends (class Cachorro extends Animal)',
    opcoes: [
      'extends (class Cachorro extends Animal)',
      'implements (class Cachorro implements Animal)',
      'imports (class Cachorro imports Animal)',
      'includes (class Cachorro includes Animal)'
    ],
    explicacao: 'A palavra-chave extends estabelece a relação de herança entre a subclasse (filha) e a superclasse (mãe).'
  },
  {
    categoria: 'poo',
    termo: 'herança',
    pergunta: 'Em uma subclasse que possui seu próprio "constructor()", para que serve a chamada "super()"?',
    correta: 'Para invocar o construtor da classe mãe (superclasse) antes de usar "this" na classe filha',
    opcoes: [
      'Para invocar o construtor da classe mãe (superclasse) antes de usar "this" na classe filha',
      'Para apagar todos os métodos herdados da classe mãe',
      'Para transformar a classe filha em uma função anônima',
      'Para aumentar a velocidade de processamento da placa de vídeo'
    ],
    explicacao: 'Em JavaScript, subclasses que definem constructor() devem chamar super(...) primeiro para inicializar a parte herdada da superclasse.'
  },
  {
    categoria: 'poo',
    termo: 'encapsulamento',
    pergunta: 'Qual é o objetivo principal do pilar de "Encapsulamento" na Orientação a Objetos?',
    correta: 'Proteger os dados internos de um objeto, permitindo que sejam lidos ou alterados apenas por métodos controlados',
    opcoes: [
      'Proteger os dados internos de um objeto, permitindo que sejam lidos ou alterados apenas por métodos controlados',
      'Compactar todos os arquivos do site em um único arquivo .zip',
      'Permitir que qualquer parte do sistema altere o saldo de uma conta para um valor negativo livremente',
      'Substituir todas as classes por variáveis globais'
    ],
    explicacao: 'O encapsulamento oculta detalhes internos de implementação e garante que regras de validação sejam respeitadas ao modificar o estado.'
  },
  {
    categoria: 'poo',
    termo: 'encapsulamento',
    pergunta: 'No JavaScript moderno (ES2022+), qual símbolo colocado no início do nome de um atributo (ex: "#saldo = 0") o torna verdadeiramente privado dentro da classe?',
    correta: 'Cerquilha / Hashtag (#saldo)',
    opcoes: [
      'Cerquilha / Hashtag (#saldo)',
      'Arroba (@saldo)',
      'Ponto de exclamação (!saldo)',
      'Porcentagem (%saldo)'
    ],
    explicacao: 'Campos prefixados com # (como #saldo) têm privacidade imposta pela própria linguagem e não podem ser acessados fora da classe.'
  },
  {
    categoria: 'poo',
    termo: 'encapsulamento',
    pergunta: 'Para que servem os métodos "Getters" (get) e "Setters" (set) em uma classe?',
    correta: 'Para interceptar a leitura e a gravação de uma propriedade, permitindo validar ou formatar o dado com segurança',
    opcoes: [
      'Para interceptar a leitura e a gravação de uma propriedade, permitindo validar ou formatar o dado com segurança',
      'Para fazer requisições HTTP GET e POST automaticamente para um servidor externo',
      'Para criar laços de repetição infinitos dentro do construtor',
      'Para deletar a classe após o primeiro uso'
    ],
    explicacao: 'Getters permitem calcular ou expor valores de forma controlada, e Setters permitem validar um novo valor antes de salvá-lo no atributo privado.'
  },
  {
    categoria: 'poo',
    termo: 'polimorfismo',
    pergunta: 'O que significa "Polimorfismo" na Programação Orientada a Objetos?',
    correta: 'A capacidade de objetos de classes diferentes responderem ao mesmo método (ex: calcularArea()) cada um com sua própria implementação',
    opcoes: [
      'A capacidade de objetos de classes diferentes responderem ao mesmo método (ex: calcularArea()) cada um com sua própria implementação',
      'A proibição de criar mais de uma classe no mesmo arquivo',
      'A conversão automática de código JavaScript para Python',
      'O bloqueio de herança entre classes de um mesmo sistema'
    ],
    explicacao: 'Com polimorfismo, classes como Circulo e Retangulo podem sobrescrever o método calcularArea() mantendo a mesma assinatura.'
  },
  {
    categoria: 'poo',
    termo: 'polimorfismo',
    pergunta: 'Quando uma classe filha redefine um método que já existia na classe mãe com o mesmo nome para mudar seu comportamento, damos a isso o nome de:',
    correta: 'Sobrescrita de método (Method Overriding)',
    opcoes: [
      'Sobrescrita de método (Method Overriding)',
      'Desestruturação de array (Destructuring)',
      'Hoisting de variável',
      'Recursão infinita'
    ],
    explicacao: 'A sobrescrita (overriding) permite especializar na classe filha um comportamento herdado da superclasse.'
  },
  {
    categoria: 'poo',
    termo: 'interface',
    pergunta: 'Em arquitetura de software e POO (como em TypeScript, Java ou C#), qual é o papel de uma "Interface"?',
    correta: 'Definir um contrato (quais métodos e propriedades uma classe deve ter) sem ditar como eles serão implementados',
    opcoes: [
      'Definir um contrato (quais métodos e propriedades uma classe deve ter) sem ditar como eles serão implementados',
      'Desenhar botões coloridos e animações CSS na tela do usuário',
      'Armazenar senhas criptografadas no localStorage',
      'Executar queries SQL diretamente no navegador'
    ],
    explicacao: 'Uma interface garante que diferentes classes sigam o mesmo formato e disponibilizem os mesmos métodos esperados pelo sistema.'
  },
  {
    categoria: 'poo',
    termo: 'objeto',
    pergunta: 'Qual operador em JavaScript verifica se um objeto "meuCarro" foi criado a partir da classe "Veiculo" (ou de uma subclasse dela)?',
    correta: 'instanceof (meuCarro instanceof Veiculo)',
    opcoes: [
      'instanceof (meuCarro instanceof Veiculo)',
      'typeof (typeof meuCarro === Veiculo)',
      'in (meuCarro in Veiculo)',
      'extends (meuCarro extends Veiculo)'
    ],
    explicacao: 'O operador instanceof testa se o protótipo de um construtor aparece na cadeia de protótipos de um objeto.'
  },
  {
    categoria: 'poo',
    termo: 'classe',
    pergunta: 'Quais são os 4 pilares clássicos da Programação Orientada a Objetos (POO)?',
    correta: 'Abstração, Encapsulamento, Herança e Polimorfismo',
    opcoes: [
      'Abstração, Encapsulamento, Herança e Polimorfismo',
      'Variáveis, Funções, Condicionais e Loops',
      'HTML, CSS, JavaScript e Banco de Dados',
      'Compilação, Execução, Depuração e Deploy'
    ],
    explicacao: 'Os 4 pilares fundamentais da POO são Abstração, Encapsulamento, Herança e Polimorfismo.'
  },
  {
    categoria: 'poo',
    termo: 'classe',
    pergunta: 'Na POO, em que consiste o pilar da "Abstração"?',
    correta: 'Representar uma entidade do mundo real no código focando apenas nos atributos e ações relevantes para o sistema',
    opcoes: [
      'Representar uma entidade do mundo real no código focando apenas nos atributos e ações relevantes para o sistema',
      'Escrever códigos sem nomes de variáveis para economizar espaço',
      'Transformar todo o código em números binários manualmente',
      'Ocultar o arquivo HTML do navegador'
    ],
    explicacao: 'Abstrair significa modelar apenas o essencial de um objeto para o contexto do problema, ignorando detalhes irrelevantes.'
  },
  {
    categoria: 'poo',
    termo: 'herança',
    pergunta: 'Em design orientado a objetos, quando é preferível usar "Composição" (um objeto ter outro) em vez de "Herança" (uma classe estender outra)?',
    correta: 'Quando a relação é do tipo "tem-um" (ex: Carro tem um Motor) em vez de "é-um" (ex: Cachorro é um Animal)',
    opcoes: [
      'Quando a relação é do tipo "tem-um" (ex: Carro tem um Motor) em vez de "é-um" (ex: Cachorro é um Animal)',
      'Quando o código não utiliza funções nem métodos',
      'Apenas quando programamos em HTML puro',
      'Quando queremos bloquear o uso de construtores'
    ],
    explicacao: 'Herança modela relações "é-um", enquanto composição modela relações "tem-um", oferecendo maior flexibilidade e menor acoplamento.'
  },

  // =========================================================================
  // 5. AVANÇADO (avancado)
  // =========================================================================
  {
    categoria: 'avancado',
    termo: 'recursão',
    pergunta: 'O que é indispensável em toda função recursiva para que ela não cause o erro "Maximum call stack size exceeded" (estouro de pilha)?',
    correta: 'Um caso base (condição de parada) que encerre as chamadas recursivas',
    opcoes: [
      'Um caso base (condição de parada) que encerre as chamadas recursivas',
      'Uma variável global declarada com var',
      'Um bloco switch com pelo menos 5 casos',
      'O uso obrigatório de async/await em todas as linhas'
    ],
    explicacao: 'Sem um caso base alcançável, a função chama a si mesma infinitamente até esgotar a pilha de chamadas (call stack).'
  },
  {
    categoria: 'avancado',
    termo: 'closure',
    pergunta: 'O que acontece quando uma função interna é retornada por uma função externa e continua conseguindo acessar as variáveis locais da função externa?',
    correta: 'Forma-se uma Closure (fechamento), preservando o escopo léxico na memória',
    opcoes: [
      'Forma-se uma Closure (fechamento), preservando o escopo léxico na memória',
      'Ocorre um vazamento de sintaxe que apaga todas as variáveis locais',
      'O JavaScript converte a função interna em uma string JSON',
      'A função externa é executada novamente a cada segundo'
    ],
    explicacao: 'Uma closure permite que uma função "lembre" e acesse variáveis do ambiente léxico onde foi criada, mesmo após a função externa ter terminado.'
  },
  {
    categoria: 'avancado',
    termo: 'callback',
    pergunta: 'No código "botao.addEventListener(\'click\', aoClicar)", por que passamos "aoClicar" SEM parênteses?',
    correta: 'Para passar a referência da função como callback, deixando o navegador executá-la apenas quando o clique ocorrer',
    opcoes: [
      'Para passar a referência da função como callback, deixando o navegador executá-la apenas quando o clique ocorrer',
      'Porque funções em JavaScript nunca podem usar parênteses',
      'Porque addEventListener só aceita strings e números',
      'Para executar a função imediatamente antes mesmo do usuário clicar'
    ],
    explicacao: 'Se escrevêssemos aoClicar(), a função seria executada imediatamente no registro do evento em vez de aguardar o clique.'
  },
  {
    categoria: 'avancado',
    termo: 'higher-order function',
    pergunta: 'Por que métodos como ".map()", ".filter()" e ".reduce()" são classificados como Higher-Order Functions (Funções de Ordem Superior)?',
    correta: 'Porque eles recebem outra função (callback) como argumento para operar sobre os itens',
    opcoes: [
      'Porque eles recebem outra função (callback) como argumento para operar sobre os itens',
      'Porque eles só podem ser escritos na primeira linha do arquivo',
      'Porque eles exigem permissão de administrador do sistema operacional',
      'Porque eles substituem o banco de dados relacional'
    ],
    explicacao: 'Qualquer função que receba uma função como argumento ou retorne uma nova função é uma Higher-Order Function.'
  },
  {
    categoria: 'avancado',
    termo: 'promise',
    pergunta: 'Quais são os 3 estados possíveis de uma Promise em JavaScript?',
    correta: 'Pending (pendente), Fulfilled (resolvida com sucesso) e Rejected (rejeitada com erro)',
    opcoes: [
      'Pending (pendente), Fulfilled (resolvida com sucesso) e Rejected (rejeitada com erro)',
      'Start (iniciada), Pausing (pausada) e Deleted (excluída)',
      'True (verdadeira), False (falsa) e Null (nula)',
      'Open (aberta), Closed (fechada) e Locked (bloqueada)'
    ],
    explicacao: 'Uma Promise inicia em estado pending e, ao concluir a operação assíncrona, transita para fulfilled (.then) ou rejected (.catch).'
  },
  {
    categoria: 'avancado',
    termo: 'promise',
    pergunta: 'Qual método utilitário permite aguardar várias Promises em paralelo e só resolve quando TODAS elas terminam com sucesso?',
    correta: 'Promise.all([p1, p2, p3])',
    opcoes: [
      'Promise.all([p1, p2, p3])',
      'Promise.forEach([p1, p2, p3])',
      'Promise.loop([p1, p2, p3])',
      'Promise.sync([p1, p2, p3])'
    ],
    explicacao: 'Promise.all dispara ou aguarda múltiplas Promises simultaneamente e retorna um array com todos os resultados assim que todas concluem.'
  },
  {
    categoria: 'avancado',
    termo: 'async/await',
    pergunta: 'Para utilizar a palavra-chave "await" antes de uma chamada `fetch()` dentro de uma função, o que é obrigatório na declaração dessa função?',
    correta: 'Declarar a função com a palavra-chave "async" (ex: async function carregarDados())',
    opcoes: [
      'Declarar a função com a palavra-chave "async" (ex: async function carregarDados())',
      'Colocar a função dentro de um laço do-while',
      'Declarar todas as variáveis internas como var',
      'Remover todos os blocos try/catch da função'
    ],
    explicacao: 'O operador await pausa a execução da função assíncrona até a Promise resolver e deve ser usado dentro de funções marcadas com async (ou top-level em módulos ES).'
  },
  {
    categoria: 'avancado',
    termo: 'try/catch',
    pergunta: 'Em uma estrutura "try { ... } catch (erro) { ... } finally { ... }", quando o bloco "finally" é executado?',
    correta: 'Sempre ao final, independentemente de ter ocorrido erro ou de tudo ter dado certo',
    opcoes: [
      'Sempre ao final, independentemente de ter ocorrido erro ou de tudo ter dado certo',
      'Somente quando o bloco try falha e o catch também falha',
      'Apenas quando não ocorre nenhum erro no bloco try',
      'Somente quando o usuário atualiza a página (F5)'
    ],
    explicacao: 'O bloco finally executa sempre após try/catch, sendo ideal para desativar estados de carregamento (loading) ou fechar conexões.'
  },
  {
    categoria: 'avancado',
    termo: 'API',
    pergunta: 'Em uma API RESTful acessada via HTTP, qual é a finalidade semântica dos métodos GET, POST, PUT/PATCH e DELETE, respectivamente?',
    correta: 'Buscar dados, criar novo registro, atualizar registro existente e remover registro',
    opcoes: [
      'Buscar dados, criar novo registro, atualizar registro existente e remover registro',
      'Apagar dados, reiniciar o servidor, estilizar páginas e compilar código',
      'Conectar ao Wi-Fi, criptografar senhas, criar classes e abrir modais',
      'Ordenar listas, filtrar números, mapear strings e reduzir arrays'
    ],
    explicacao: 'Os verbos HTTP padronizam as operações CRUD (Create = POST, Read = GET, Update = PUT/PATCH, Delete = DELETE) em APIs web.'
  },
  {
    categoria: 'avancado',
    termo: 'algoritmo',
    pergunta: 'Qual é a definição mais precisa de um "Algoritmo" na Ciência da Computação?',
    correta: 'Uma sequência finita, lógica e bem definida de instruções passo a passo para resolver um problema',
    opcoes: [
      'Uma sequência finita, lógica e bem definida de instruções passo a passo para resolver um problema',
      'Qualquer código que utilize inteligência artificial generativa',
      'Um componente físico da placa-mãe do computador',
      'Uma tabela exclusiva de bancos de dados relacionais'
    ],
    explicacao: 'Todo algoritmo recebe uma entrada, executa passos não ambíguos em tempo finito e produz uma saída que soluciona o problema proposto.'
  },
  {
    categoria: 'avancado',
    termo: 'complexidade (Big O)',
    pergunta: 'Ao analisar algoritmos com a notação Big O, qual complexidade representa um acesso instantâneo em tempo constante (como acessar `lista[0]`), independentemente do tamanho da lista?',
    correta: 'O(1) — Complexidade Constante',
    opcoes: [
      'O(1) — Complexidade Constante',
      'O(n) — Complexidade Linear',
      'O(n²) — Complexidade Quadrática',
      'O(2ⁿ) — Complexidade Exponencial'
    ],
    explicacao: 'O(1) significa que o tempo de execução não cresce mesmo que a coleção passe de 10 para 10 milhões de elementos.'
  },
  {
    categoria: 'avancado',
    termo: 'complexidade (Big O)',
    pergunta: 'Se uma função percorre um array de tamanho "n" com um único laço "for" simples do início ao fim, qual é a sua complexidade de tempo no pior caso?',
    correta: 'O(n) — Complexidade Linear',
    opcoes: [
      'O(n) — Complexidade Linear',
      'O(1) — Complexidade Constante',
      'O(log n) — Complexidade Logarítmica',
      'O(n!) — Complexidade Fatorial'
    ],
    explicacao: 'Em O(n), o número de operações cresce proporcionalmente ao número de itens n da entrada.'
  },
  {
    categoria: 'avancado',
    termo: 'módulo (import/export)',
    pergunta: 'Em ES Modules (JavaScript moderno), quantos "export default" um único arquivo `.js` pode ter?',
    correta: 'Apenas 1 export default por arquivo (mas pode ter vários named exports)',
    opcoes: [
      'Apenas 1 export default por arquivo (mas pode ter vários named exports)',
      'Ilimitados export default no mesmo arquivo',
      'Nenhum, pois o JavaScript só aceita named exports',
      'Exatamente 2: um para variáveis e outro para funções'
    ],
    explicacao: 'Cada módulo pode definir no máximo uma exportação padrão (export default), acompanhada de quantas exportações nomeadas (export const/function) desejar.'
  },
  {
    categoria: 'avancado',
    termo: 'framework',
    pergunta: 'Qual princípio diferencia fundamentalmente um "Framework" de uma "Biblioteca" (Library)?',
    correta: 'Inversão de Controle: você chama a biblioteca quando quer, mas é o framework que controla o fluxo e chama o seu código',
    opcoes: [
      'Inversão de Controle: você chama a biblioteca quando quer, mas é o framework que controla o fluxo e chama o seu código',
      'Bibliotecas são pagas e frameworks são sempre gratuitos',
      'Frameworks só funcionam no back-end e bibliotecas só funcionam no front-end',
      'Bibliotecas exigem banco de dados e frameworks não aceitam variáveis'
    ],
    explicacao: 'Em uma biblioteca você está no comando do fluxo; em um framework (como Angular ou Next.js), a arquitetura dita o ciclo de vida e invoca suas funções.'
  },
  {
    categoria: 'avancado',
    termo: 'imutabilidade',
    pergunta: 'Qual destas abordagens respeita o princípio da "Imutabilidade" ao atualizar um objeto de estado `usuario`?',
    correta: 'Criar um novo objeto copiando os dados: const novoUsuario = { ...usuario, ativo: true }',
    opcoes: [
      'Criar um novo objeto copiando os dados: const novoUsuario = { ...usuario, ativo: true }',
      'Alterar diretamente a propriedade: usuario.ativo = true; delete usuario.nome;',
      'Usar uma variável global var e limpá-la com while',
      'Converter o objeto para número antes de salvar'
    ],
    explicacao: 'Na programação imutável, não modificamos o objeto ou array original; geramos uma nova cópia com as alterações desejadas.'
  },
  {
    categoria: 'avancado',
    termo: 'hoisting',
    pergunta: 'Por que uma função declarada com `function somar(a, b) { ... }` pode ser chamada em uma linha ANTES de sua declaração no arquivo, enquanto `const somar = (a, b) => ...` gera erro se chamada antes?',
    correta: 'Porque declarações "function" sofrem Hoisting completo, enquanto "const" e "let" ficam na Zona Morta Temporal (TDZ) até a linha de declaração',
    opcoes: [
      'Porque declarações "function" sofrem Hoisting completo, enquanto "const" e "let" ficam na Zona Morta Temporal (TDZ) até a linha de declaração',
      'Porque arrow functions não são funções reais em JavaScript',
      'Porque o navegador lê o arquivo de baixo para cima quando encontra const',
      'Porque const só pode ser usada dentro de arquivos HTML'
    ],
    explicacao: 'O motor do JavaScript eleva (hoists) declarações de função completas para o topo do escopo, mas impede o acesso a variáveis let/const antes de sua linha de inicialização.'
  }
];

const CHAVE_HISTORICO_QUIZ_RECENTES = 'codehelper_quiz_recentes_v2';

function obterPerguntasRecentesQuiz(categoria) {
  try {
    const salvo = JSON.parse(sessionStorage.getItem(CHAVE_HISTORICO_QUIZ_RECENTES) || '{}');
    return Array.isArray(salvo[categoria]) ? salvo[categoria] : [];
  } catch {
    return [];
  }
}

function registrarPerguntasRecentesQuiz(categoria, perguntasUsadas) {
  try {
    const salvo = JSON.parse(sessionStorage.getItem(CHAVE_HISTORICO_QUIZ_RECENTES) || '{}');
    const atuais = Array.isArray(salvo[categoria]) ? salvo[categoria] : [];
    const novas = [...atuais, ...perguntasUsadas];
    salvo[categoria] = novas.slice(-60);
    sessionStorage.setItem(CHAVE_HISTORICO_QUIZ_RECENTES, JSON.stringify(salvo));
  } catch {}
}

function construirPoolCompletoQuestoes(categoria) {
  const pool = [];
  const perguntasAdicionadas = new Set();

  function adicionarQuestaoAoPool(item) {
    if (!item || !item.pergunta || !item.correta || !Array.isArray(item.opcoes) || item.opcoes.length < 4) return;
    const chave = item.pergunta.trim().toLowerCase();
    if (perguntasAdicionadas.has(chave)) return;
    perguntasAdicionadas.add(chave);
    pool.push({
      pergunta: item.pergunta.trim(),
      correta: item.correta.trim(),
      opcoes: embaralharQuiz(item.opcoes.map(o => String(o).trim())),
      explicacao: String(item.explicacao || 'Consulte o glossário para revisar este conceito.').trim(),
      categoria: item.categoria || 'todos',
      termo: item.termo || item.correta
    });
  }

  // 1. Adiciona questões curadas do Banco Expandido
  BANCO_QUESTOES_QUIZ.forEach((q) => {
    if (categoria === 'todos' || q.categoria === categoria) {
      adicionarQuestaoAoPool(q);
    }
  });

  // 2. Gera múltiplas variações dinâmicas a partir dos termos do Glossário (TERMOS)
  if (Array.isArray(TERMOS) && TERMOS.length >= 4) {
    const termosValidos = TERMOS.filter(t => t && typeof t.name === 'string' && t.name.trim() && typeof t.oneLiner === 'string' && t.oneLiner.trim());
    const termosDaCategoria = categoria === 'todos'
      ? termosValidos
      : termosValidos.filter(t => t.cat === categoria);

    termosDaCategoria.forEach((termo) => {
      const mesmosCat = termosValidos.filter(o => o.name !== termo.name && o.cat === termo.cat);
      const outrosCat = termosValidos.filter(o => o.name !== termo.name && o.cat !== termo.cat);
      const candidatosDistratores = [...embaralharQuiz(mesmosCat), ...embaralharQuiz(outrosCat)];
      const distratoresNomes = candidatosDistratores.slice(0, 3).map(o => o.name);

      // Variação A: Definição direta -> Qual é o termo?
      adicionarQuestaoAoPool({
        categoria: termo.cat || categoria,
        termo: termo.name,
        pergunta: `Qual conceito da programação corresponde à seguinte definição: "${termo.oneLiner}"?`,
        correta: termo.name,
        opcoes: [termo.name, ...distratoresNomes],
        explicacao: String(termo.body || termo.oneLiner).trim()
      });

      // Variação B: Termo -> Qual é a finalidade/resumo correto?
      const distratoresResumos = candidatosDistratores
        .filter(o => o.oneLiner && o.oneLiner !== termo.oneLiner)
        .slice(0, 3)
        .map(o => o.oneLiner);

      if (distratoresResumos.length === 3) {
        adicionarQuestaoAoPool({
          categoria: termo.cat || categoria,
          termo: termo.name,
          pergunta: `Em programação, qual alternativa descreve corretamente o conceito de "${termo.name}"?`,
          correta: termo.oneLiner,
          opcoes: [termo.oneLiner, ...distratoresResumos],
          explicacao: String(termo.body || termo.oneLiner).trim()
        });
      }

      // Variação C: Exemplo de código prático (quando o termo possui código)
      if (termo.code && typeof termo.code === 'string' && termo.code.trim().length > 10) {
        const primeiraLinhaUtil = termo.code
          .split('\n')
          .map(l => l.trim())
          .find(l => l && !l.startsWith('//') && l.length > 4);

        if (primeiraLinhaUtil) {
          const distratoresCod = embaralharQuiz(candidatosDistratores).slice(0, 3).map(o => o.name);
          adicionarQuestaoAoPool({
            categoria: termo.cat || categoria,
            termo: termo.name,
            pergunta: `Qual estrutura ou conceito principal está sendo demonstrado na linha de código: \`${primeiraLinhaUtil}\`?`,
            correta: termo.name,
            opcoes: [termo.name, ...distratoresCod],
            explicacao: String(termo.body || termo.oneLiner).trim()
          });
        }
      }
    });
  }

  return pool;
}

function gerarQuizPersonalizado() {
  const categoria = document.getElementById('quiz-categoria')?.value || 'todos';
  const quantidadeSelecionada = Number(document.getElementById('quiz-quantidade')?.value || 10);

  const poolTotal = construirPoolCompletoQuestoes(categoria);

  if (poolTotal.length < 4) {
    alert('Não existem perguntas suficientes para gerar o quiz.');
    return false;
  }

  const recentes = new Set(obterPerguntasRecentesQuiz(categoria));
  const ineditas = embaralharQuiz(poolTotal.filter(q => !recentes.has(q.pergunta)));
  const jaVistas = embaralharQuiz(poolTotal.filter(q => recentes.has(q.pergunta)));

  const quantidade = Math.min(quantidadeSelecionada, poolTotal.length);
  let escolhidas = [];

  if (ineditas.length >= quantidade) {
    escolhidas = ineditas.slice(0, quantidade);
  } else {
    try {
      const salvo = JSON.parse(sessionStorage.getItem(CHAVE_HISTORICO_QUIZ_RECENTES) || '{}');
      salvo[categoria] = [];
      sessionStorage.setItem(CHAVE_HISTORICO_QUIZ_RECENTES, JSON.stringify(salvo));
    } catch {}
    escolhidas = [...ineditas, ...jaVistas.slice(0, quantidade - ineditas.length)];
  }

  registrarPerguntasRecentesQuiz(categoria, escolhidas.map(q => q.pergunta));

  quizPerguntas = embaralharQuiz(escolhidas).map(q => ({
    ...q,
    opcoes: embaralharQuiz(q.opcoes)
  }));

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
