
const playgroundCodigo = document.getElementById('playground-codigo');
const playgroundSaida = document.getElementById('playground-saida');
const playgroundStatus = document.getElementById('playground-status');
const btnExecutarCodigo = document.getElementById('btn-executar-codigo');
const btnLimparCodigo = document.getElementById('btn-limpar-codigo');
const btnLimparSaida = document.getElementById('btn-limpar-saida');

let workerAtual = null;
let timeoutExecucao = null;
let urlWorkerAtual = null;
let identificadorExecucao = 0;

function formatarValor(valor) {
  if (typeof valor === 'string') return valor;
  if (valor === undefined) return 'undefined';
  if (valor === null) return 'null';
  if (typeof valor === 'function') return valor.toString();
  if (typeof valor === 'bigint') return `${valor}n`;
  if (typeof valor === 'symbol') return valor.toString();

  try {
    return JSON.stringify(valor, null, 2);
  } catch {
    try {
      return String(valor);
    } catch {
      return '[valor não exibível]';
    }
  }
}

function definirStatus(texto, tipo = '') {
  playgroundStatus.textContent = texto;
  playgroundStatus.className = 'playground-status';

  if (tipo) {
    playgroundStatus.classList.add('status-' + tipo);
  }
}

function limparSaida() {
  playgroundSaida.innerHTML =
    '<span class="playground-placeholder">A saída do seu código aparecerá aqui.</span>';

  definirStatus('Pronto');
}

function adicionarSaida(tipo, valores) {
  const placeholder = playgroundSaida.querySelector('.playground-placeholder');

  if (placeholder) {
    placeholder.remove();
  }

  const linha = document.createElement('div');
  linha.className = 'playground-linha playground-' + tipo;
  linha.textContent = valores.map(formatarValor).join(' ');

  playgroundSaida.appendChild(linha);
  playgroundSaida.scrollTop = playgroundSaida.scrollHeight;
}

function liberarWorker() {
  if (timeoutExecucao) {
    clearTimeout(timeoutExecucao);
    timeoutExecucao = null;
  }

  if (workerAtual) {
    workerAtual.terminate();
    workerAtual = null;
  }

  if (urlWorkerAtual) {
    URL.revokeObjectURL(urlWorkerAtual);
    urlWorkerAtual = null;
  }
}

function criarWorker(codigoUsuario) {
  const codigoWorker = `
    let houveErro = false;
    const contadores = new Map();

    function prepararValor(valor) {
      if (valor === undefined) return 'undefined';
      if (valor === null) return null;
      if (typeof valor === 'function') return valor.toString();
      if (typeof valor === 'symbol') return valor.toString();
      if (typeof valor === 'bigint') return valor.toString() + 'n';

      if (valor instanceof Error) {
        return {
          nome: valor.name,
          mensagem: valor.message,
          pilha: valor.stack
        };
      }

      if (valor instanceof Date) {
        return valor.toISOString();
      }

      const vistos = new WeakSet();

      try {
        return JSON.parse(JSON.stringify(valor, (chave, item) => {
          if (typeof item === 'bigint') {
            return item.toString() + 'n';
          }

          if (typeof item === 'function') {
            return item.toString();
          }

          if (typeof item === 'symbol') {
            return item.toString();
          }

          if (item instanceof Error) {
            return {
              nome: item.name,
              mensagem: item.message
            };
          }

          if (item && typeof item === 'object') {
            if (vistos.has(item)) {
              return '[Referência circular]';
            }

            vistos.add(item);
          }

          return item;
        }));
      } catch {
        try {
          return String(valor);
        } catch {
          return '[valor não exibível]';
        }
      }
    }

    function enviar(tipo, valores) {
      try {
        self.postMessage({
          tipo,
          valores: Array.from(valores).map(prepararValor)
        });
      } catch {
        self.postMessage({
          tipo: 'error',
          valores: ['Não foi possível exibir o resultado no console.']
        });
      }
    }

    console.log = function() {
      enviar('log', arguments);
    };

    console.info = function() {
      enviar('info', arguments);
    };

    console.debug = function() {
      enviar('info', arguments);
    };

    console.warn = function() {
      enviar('warn', arguments);
    };

    console.error = function() {
      houveErro = true;
      enviar('error', arguments);
    };

    console.dir = function(valor) {
      enviar('log', [valor]);
    };

    console.table = function(valor) {
      enviar('info', [valor]);
    };

    console.assert = function(condicao) {
      if (!condicao) {
        houveErro = true;
        enviar('error', ['Assertion failed:', ...Array.from(arguments).slice(1)]);
      }
    };

    console.count = function(rotulo = 'default') {
      const atual = (contadores.get(rotulo) || 0) + 1;
      contadores.set(rotulo, atual);
      enviar('info', [rotulo + ': ' + atual]);
    };

    console.countReset = function(rotulo = 'default') {
      contadores.delete(rotulo);
    };

    console.clear = function() {
      self.postMessage({ tipo: 'clear' });
    };

    self.onerror = function(mensagem, arquivo, linha, coluna, erro) {
      houveErro = true;

      self.postMessage({
        tipo: 'error',
        valores: [
          erro?.name
            ? erro.name + ': ' + erro.message
            : mensagem,
          linha ? 'Linha: ' + linha : ''
        ]
      });

      return true;
    };

    self.onunhandledrejection = function(evento) {
      houveErro = true;
      enviar('error', ['Promise rejeitada:', evento.reason]);
    };

    async function executar() {
      try {
        const funcao = new Function(${JSON.stringify(codigoUsuario)});
        const resultado = funcao();

        if (
          resultado !== null &&
          resultado !== undefined &&
          typeof resultado.then === 'function'
        ) {
          await resultado;
        }

        self.postMessage({
          tipo: houveErro ? 'finalizadoComErro' : 'finalizado'
        });
      } catch (erro) {
        houveErro = true;

        self.postMessage({
          tipo: 'error',
          valores: [
            (erro.name || 'Erro') + ': ' + (erro.message || 'Erro desconhecido.')
          ]
        });

        self.postMessage({
          tipo: 'finalizadoComErro'
        });
      }
    }

    executar();
  `;

  const blob = new Blob(
    [codigoWorker],
    { type: 'application/javascript' }
  );

  const url = URL.createObjectURL(blob);

  try {
    return {
      worker: new Worker(url),
      url
    };
  } catch (erro) {
    URL.revokeObjectURL(url);
    throw erro;
  }
}

function finalizarExecucao(comErro, identificadorAtual) {
  if (identificadorAtual !== identificadorExecucao) return;

  liberarWorker();
  btnExecutarCodigo.disabled = false;

  if (!playgroundSaida.querySelector('.playground-linha')) {
    adicionarSaida('info', ['Código executado sem nenhuma saída no console.']);
  }

  definirStatus(
    comErro ? 'Finalizado com erros' : 'Finalizado',
    comErro ? 'erro' : 'sucesso'
  );
}

function executarCodigo() {
  const codigo = playgroundCodigo.value.trim();

  if (!codigo) {
    playgroundSaida.innerHTML =
      '<div class="playground-linha playground-warn">Digite algum código antes de executar.</div>';

    definirStatus('Sem código', 'erro');
    return;
  }

  identificadorExecucao++;
  const identificadorAtual = identificadorExecucao;

  liberarWorker();
  playgroundSaida.innerHTML = '';

  definirStatus('Executando...', 'executando');
  btnExecutarCodigo.disabled = true;

  if (
    typeof Worker === 'undefined' ||
    typeof Blob === 'undefined' ||
    typeof URL.createObjectURL !== 'function'
  ) {
    adicionarSaida('error', [
      'Seu navegador não oferece suporte à execução isolada de código.'
    ]);

    btnExecutarCodigo.disabled = false;
    definirStatus('Não suportado', 'erro');
    return;
  }

  try {
    const resultado = criarWorker(codigo);

    workerAtual = resultado.worker;
    urlWorkerAtual = resultado.url;

    workerAtual.onmessage = function(evento) {
      if (identificadorAtual !== identificadorExecucao) return;

      const dados = evento.data;

      if (dados.tipo === 'clear') {
        playgroundSaida.innerHTML = '';
        return;
      }

      if (
        ['log', 'info', 'warn', 'error'].includes(dados.tipo)
      ) {
        adicionarSaida(dados.tipo, dados.valores || []);
        return;
      }

      if (dados.tipo === 'finalizado') {
        finalizarExecucao(false, identificadorAtual);
        return;
      }

      if (dados.tipo === 'finalizadoComErro') {
        finalizarExecucao(true, identificadorAtual);
      }
    };

    workerAtual.onerror = function(erro) {
      if (identificadorAtual !== identificadorExecucao) return;

      adicionarSaida('error', [
        erro.message || 'Erro desconhecido durante a execução.'
      ]);

      finalizarExecucao(true, identificadorAtual);
    };

    workerAtual.onmessageerror = function() {
      if (identificadorAtual !== identificadorExecucao) return;

      adicionarSaida('error', [
        'Não foi possível interpretar uma mensagem do código executado.'
      ]);

      finalizarExecucao(true, identificadorAtual);
    };

    timeoutExecucao = setTimeout(() => {
      if (identificadorAtual !== identificadorExecucao) return;

      adicionarSaida('error', [
        'Execução interrompida: o código ultrapassou o limite de 4 segundos.'
      ]);

      liberarWorker();
      btnExecutarCodigo.disabled = false;
      definirStatus('Interrompido', 'erro');
    }, 4000);

  } catch (erro) {
    liberarWorker();

    adicionarSaida('error', [
      erro.message || 'Não foi possível iniciar o ambiente de execução.'
    ]);

    btnExecutarCodigo.disabled = false;
    definirStatus('Erro ao executar', 'erro');
  }
}

function limparCodigo() {
  identificadorExecucao++;
  liberarWorker();

  btnExecutarCodigo.disabled = false;
  playgroundCodigo.value = '';
  playgroundCodigo.focus();

  definirStatus('Pronto');
}

function limparResultado() {
  identificadorExecucao++;
  liberarWorker();

  btnExecutarCodigo.disabled = false;
  limparSaida();
}

btnExecutarCodigo.addEventListener('click', executarCodigo);
btnLimparCodigo.addEventListener('click', limparCodigo);
btnLimparSaida.addEventListener('click', limparResultado);

playgroundCodigo.addEventListener('keydown', evento => {
  if (evento.key === 'Tab') {
    evento.preventDefault();
    const inicio = playgroundCodigo.selectionStart;
    const fim = playgroundCodigo.selectionEnd;
    playgroundCodigo.value = playgroundCodigo.value.substring(0, inicio) + '  ' + playgroundCodigo.value.substring(fim);
    playgroundCodigo.selectionStart = playgroundCodigo.selectionEnd = inicio + 2;
    return;
  }
  if (evento.key === 'Enter' && evento.ctrlKey) {
    evento.preventDefault();
    executarCodigo();
  }
});
