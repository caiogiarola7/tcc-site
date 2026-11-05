
const analisadorCodigo = document.getElementById('analisador-codigo');
const analisadorLinguagem = document.getElementById('analisador-linguagem');
const analisadorResultado = document.getElementById('analisador-resultado');
const analisadorStatus = document.getElementById('analisador-status');
const analisadorContador = document.getElementById('analisador-contador');
const btnAnalisarCodigo = document.getElementById('btn-analisar-codigo');
const btnLimparAnalise = document.getElementById('btn-limpar-analise');

let requisicaoAnalisador = null;
let identificadorAnalise = 0;

if (
  analisadorCodigo &&
  analisadorLinguagem &&
  analisadorResultado &&
  analisadorStatus &&
  btnAnalisarCodigo &&
  btnLimparAnalise
) {
  function atualizarContadorAnalisador() {
    if (!analisadorContador) return;

    analisadorContador.textContent =
      `${analisadorCodigo.value.length} caracteres`;
  }

  function definirStatusAnalisador(texto, tipo = '') {
    analisadorStatus.textContent = texto;
    analisadorStatus.className = 'analisador-status';

    if (tipo) {
      analisadorStatus.classList.add(`status-${tipo}`);
    }
  }

  function escaparHTMLAnalisador(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => {
      const entidades = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      return entidades[caractere];
    });
  }

  function sanitizarHTMLAnalisador(html) {
    if (typeof DOMParser === 'undefined') {
      return escaparHTMLAnalisador(html);
    }

    const documento = new DOMParser().parseFromString(
      html,
      'text/html'
    );

    const elementosPermitidos = new Set([
      'P',
      'BR',
      'STRONG',
      'B',
      'EM',
      'I',
      'DEL',
      'BLOCKQUOTE',
      'UL',
      'OL',
      'LI',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'PRE',
      'CODE',
      'TABLE',
      'THEAD',
      'TBODY',
      'TR',
      'TH',
      'TD',
      'A',
      'HR',
      'SPAN'
    ]);

    const elementosProibidos = new Set([
      'SCRIPT',
      'STYLE',
      'IFRAME',
      'OBJECT',
      'EMBED',
      'FORM',
      'INPUT',
      'BUTTON',
      'SVG',
      'MATH',
      'VIDEO',
      'AUDIO',
      'SOURCE',
      'META',
      'LINK',
      'BASE',
      'TEMPLATE'
    ]);

    function limparElemento(elemento) {
      Array.from(elemento.children).forEach(filho => {
        if (elementosProibidos.has(filho.tagName)) {
          filho.remove();
          return;
        }

        if (!elementosPermitidos.has(filho.tagName)) {
          limparElemento(filho);
          filho.replaceWith(...filho.childNodes);
          return;
        }

        Array.from(filho.attributes).forEach(atributo => {
          const nome = atributo.name.toLowerCase();

          if (
            nome.startsWith('on') ||
            nome === 'style' ||
            nome === 'src' ||
            nome === 'srcdoc'
          ) {
            filho.removeAttribute(atributo.name);
            return;
          }

          if (
            nome === 'class' &&
            ['CODE', 'PRE', 'SPAN'].includes(filho.tagName)
          ) {
            const classes = atributo.value
              .split(/\s+/)
              .filter(classe =>
                /^(language-[a-z0-9_-]+|hljs|hljs-[a-z0-9_-]+)$/.test(classe)
              );

            if (classes.length) {
              filho.className = classes.join(' ');
            } else {
              filho.removeAttribute('class');
            }

            return;
          }

          if (
            filho.tagName === 'A' &&
            ['href', 'title'].includes(nome)
          ) {
            return;
          }

          filho.removeAttribute(atributo.name);
        });

        if (filho.tagName === 'A') {
          const endereco = filho.getAttribute('href');

          if (endereco) {
            try {
              const url = new URL(endereco, window.location.origin);

              if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
                filho.removeAttribute('href');
              } else if (
                url.protocol === 'http:' ||
                url.protocol === 'https:'
              ) {
                filho.setAttribute('target', '_blank');
                filho.setAttribute('rel', 'noopener noreferrer');
              }
            } catch {
              filho.removeAttribute('href');
            }
          }
        }

        limparElemento(filho);
      });
    }

    limparElemento(documento.body);

    return documento.body.innerHTML;
  }

  function renderizarMarkdownAnalisador(texto) {
    if (typeof marked === 'undefined' || typeof marked.parse !== 'function') {
      analisadorResultado.textContent = texto;
      return;
    }

    try {
      const html = marked.parse(texto);

      if (typeof html !== 'string') {
        analisadorResultado.textContent = texto;
        return;
      }

      analisadorResultado.innerHTML =
        sanitizarHTMLAnalisador(html);
    } catch {
      analisadorResultado.textContent = texto;
    }
  }

  function destacarResultadoAnalisador() {
    if (
      typeof hljs === 'undefined' ||
      typeof hljs.highlightElement !== 'function'
    ) {
      return;
    }

    analisadorResultado
      .querySelectorAll('pre code')
      .forEach(bloco => {
        try {
          hljs.highlightElement(bloco);
        } catch {
          return;
        }
      });
  }

  async function analisarCodigo() {
    const codigo = analisadorCodigo.value.trim();
    const linguagem = analisadorLinguagem.value;

    if (!codigo) {
      definirStatusAnalisador('Código vazio', 'erro');

      analisadorResultado.innerHTML = `
        <p class="analisador-erro">
          Cole algum código antes de analisar.
        </p>
      `;

      return;
    }

    if (requisicaoAnalisador) {
      requisicaoAnalisador.abort();
    }

    const identificadorAtual = ++identificadorAnalise;
    const controlador = new AbortController();

    requisicaoAnalisador = controlador;
    btnAnalisarCodigo.disabled = true;

    definirStatusAnalisador('Analisando...', 'analisando');

    analisadorResultado.innerHTML = `
      <div class="analisador-carregando">
        <span></span>
        Analisando seu código...
      </div>
    `;

    let textoRecebido = '';

    try {
      const resposta = await fetch('/api/analisar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigo,
          linguagem
        }),
        signal: controlador.signal
      });

      if (identificadorAtual !== identificadorAnalise) return;

      if (!resposta.ok) {
        let mensagemErro = 'Não foi possível analisar o código.';

        try {
          const erro = await resposta.text();

          if (erro.trim()) {
            mensagemErro = erro;
          }
        } catch {
          mensagemErro = 'O servidor retornou um erro.';
        }

        throw new Error(mensagemErro);
      }

      if (!resposta.body) {
        throw new Error('O servidor não retornou uma resposta válida.');
      }

      const leitor = resposta.body.getReader();
      const decodificador = new TextDecoder();

      analisadorResultado.innerHTML = '';

      while (true) {
        const { done, value } = await leitor.read();

        if (identificadorAtual !== identificadorAnalise) {
          await leitor.cancel();
          return;
        }

        if (done) break;

        textoRecebido += decodificador.decode(value, {
          stream: true
        });

        renderizarMarkdownAnalisador(textoRecebido);

        analisadorResultado.scrollTop =
          analisadorResultado.scrollHeight;
      }

      textoRecebido += decodificador.decode();

      if (!textoRecebido.trim()) {
        throw new Error('A análise retornou vazia. Tente novamente.');
      }

      renderizarMarkdownAnalisador(textoRecebido);
      destacarResultadoAnalisador();

      definirStatusAnalisador('Análise concluída', 'sucesso');

    } catch (erro) {
      if (
        erro.name === 'AbortError' ||
        identificadorAtual !== identificadorAnalise
      ) {
        return;
      }

      console.error('Erro no analisador:', erro);

      analisadorResultado.textContent =
        erro.message || 'Erro de conexão com o servidor.';

      definirStatusAnalisador('Erro', 'erro');

    } finally {
      if (identificadorAtual === identificadorAnalise) {
        btnAnalisarCodigo.disabled = false;
        requisicaoAnalisador = null;
      }
    }
  }

  function limparAnalisador() {
    identificadorAnalise++;

    if (requisicaoAnalisador) {
      requisicaoAnalisador.abort();
      requisicaoAnalisador = null;
    }

    analisadorCodigo.value = '';

    analisadorResultado.innerHTML = `
      <p class="analisador-placeholder">
        A análise aparecerá aqui.
      </p>
    `;

    definirStatusAnalisador('Aguardando código');

    btnAnalisarCodigo.disabled = false;

    atualizarContadorAnalisador();

    analisadorCodigo.focus();
  }

  analisadorCodigo.addEventListener(
    'input',
    atualizarContadorAnalisador
  );

  btnAnalisarCodigo.addEventListener(
    'click',
    analisarCodigo
  );

  btnLimparAnalise.addEventListener(
    'click',
    limparAnalisador
  );

  analisadorCodigo.addEventListener('keydown', evento => {
    if (evento.key === 'Tab') {
      evento.preventDefault();
      const inicio = analisadorCodigo.selectionStart;
      const fim = analisadorCodigo.selectionEnd;
      analisadorCodigo.value = analisadorCodigo.value.substring(0, inicio) + '  ' + analisadorCodigo.value.substring(fim);
      analisadorCodigo.selectionStart = analisadorCodigo.selectionEnd = inicio + 2;
      atualizarContadorAnalisador();
      return;
    }
      if (evento.key === 'Enter' && evento.ctrlKey) {
        evento.preventDefault();
        analisarCodigo();
      }
    }
  );

  atualizarContadorAnalisador();
}
