const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;

let usuarioAtual = null;
let modoConvidado = false;
let favoritos = new Set();
let mostrarSoFavoritos = false;
let conversaAtualId = null;
let historicoChat = [];
let TERMOS = [];
let categoriaAtiva = 'todos';
let quizPerguntas = [];
let quizIndice = 0;
let quizPontuacao = 0;
let anexosSelecionados = [];
let menuAnexo = null;
let falandoAtualmente = null;
let envioEmAndamento = false;
let versaoConversaAtual = 0;

const LIMITE_ANEXOS = 5;
const LIMITE_TAMANHO_ANEXO = 8 * 1024 * 1024;
const LIMITE_TOTAL_ANEXOS = 8 * 1024 * 1024;

const ICONES = {
  positiva: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
  negativa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>',
  copiar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  ouvir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  refazer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>'
};

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (caractere) => {
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

function sanitizarHTML(html) {
  const documento = new DOMParser().parseFromString(
    String(html || ''),
    'text/html'
  );

  const permitidas = new Set([
    'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'DEL',
    'BLOCKQUOTE', 'UL', 'OL', 'LI',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'PRE', 'CODE', 'A', 'HR',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'
  ]);

  function limparElemento(elemento) {
    Array.from(elemento.children).forEach((filho) => {
      limparElemento(filho);

      if (!permitidas.has(filho.tagName)) {
        filho.replaceWith(...Array.from(filho.childNodes));
        return;
      }

      const atributos = Array.from(filho.attributes);

      atributos.forEach((atributo) => {
        const nome = atributo.name.toLowerCase();

        if (
          filho.tagName === 'A' &&
          ['href', 'title'].includes(nome)
        ) {
          if (nome === 'href') {
            try {
              const url = new URL(atributo.value, window.location.origin);

              if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) {
                filho.removeAttribute('href');
              }
            } catch {
              filho.removeAttribute('href');
            }
          }

          return;
        }

        if (
          ['PRE', 'CODE'].includes(filho.tagName) &&
          nome === 'class' &&
          /^[a-zA-Z0-9 _-]+$/.test(atributo.value)
        ) {
          return;
        }

        filho.removeAttribute(atributo.name);
      });

      if (filho.tagName === 'A' && filho.hasAttribute('href')) {
        filho.setAttribute('target', '_blank');
        filho.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  limparElemento(documento.body);

  return documento.body.innerHTML;
}

function renderizarMarkdown(elemento, texto) {
  if (!elemento) return;

  if (typeof marked === 'undefined') {
    elemento.textContent = String(texto || '');
    return;
  }

  const html = marked.parse(String(texto || ''));

  elemento.innerHTML = sanitizarHTML(html);

  destacarCodigo(elemento);
}

function destacarCodigo(elemento) {
  if (!elemento || typeof hljs === 'undefined') return;

  elemento.querySelectorAll('pre code').forEach((bloco) => {
    if (!bloco.dataset.highlighted) {
      try {
        hljs.highlightElement(bloco);
      } catch {}
    }

    const pre = bloco.parentElement;
    if (pre && !pre.dataset.hasToolbar && pre.tagName === 'PRE') {
      pre.dataset.hasToolbar = 'true';

      let lang = 'código';
      bloco.classList.forEach((cls) => {
        if (cls.startsWith('language-')) {
          lang = cls.replace('language-', '');
        }
      });

      const toolbar = document.createElement('div');
      toolbar.className = 'codigo-bloco-toolbar';
      toolbar.innerHTML = `
        <div class="codigo-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <span class="codigo-linguagem">${escaparHTML(lang)}</span>
        <button type="button" class="btn-copiar-codigo-bloco" title="Copiar código" aria-label="Copiar código">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>Copiar</span>
        </button>
      `;

      const btnCopiar = toolbar.querySelector('.btn-copiar-codigo-bloco');
      btnCopiar.addEventListener('click', (e) => {
        e.stopPropagation();
        const textoParaCopiar = bloco.textContent || '';
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(textoParaCopiar).then(() => {
            btnCopiar.classList.add('copiado');
            btnCopiar.querySelector('span').textContent = 'Copiado! ✓';
            setTimeout(() => {
              btnCopiar.classList.remove('copiado');
              btnCopiar.querySelector('span').textContent = 'Copiar';
            }, 1800);
          });
        }
      });

      pre.insertAdjacentElement('beforebegin', toolbar);
      const wrapper = document.createElement('div');
      wrapper.className = 'codigo-bloco-wrapper';
      pre.parentNode.insertBefore(wrapper, toolbar);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(pre);
    }
  });
}

async function carregarFavoritos() {
  if (!usuarioAtual) return;

  const { data, error } = await supabaseClient
    .from('favoritos')
    .select('termo_nome')
    .eq('user_id', usuarioAtual.id);

  if (error) {
    console.error('Erro ao carregar favoritos:', error);
    return;
  }

  favoritos = new Set(
    (data || []).map((item) => item.termo_nome)
  );
}

async function toggleFavorito(nome, botao) {
  if (!usuarioAtual) {
    alert('Crie uma conta para favoritar termos.');
    return;
  }

  const jaFavoritado = favoritos.has(nome);

  botao.disabled = true;

  try {
    if (jaFavoritado) {
      const { error } = await supabaseClient
        .from('favoritos')
        .delete()
        .eq('user_id', usuarioAtual.id)
        .eq('termo_nome', nome);

      if (error) throw error;

      favoritos.delete(nome);
      botao.classList.remove('ativo');
    } else {
      const { error } = await supabaseClient
        .from('favoritos')
        .insert({
          user_id: usuarioAtual.id,
          termo_nome: nome
        });

      if (error) throw error;

      favoritos.add(nome);
      botao.classList.add('ativo');
    }

    if (mostrarSoFavoritos) {
      filtrar();
    }
  } catch (erro) {
    console.error('Erro ao atualizar favorito:', erro);
    alert('Não foi possível atualizar esse favorito.');
  } finally {
    botao.disabled = false;
  }
}

function abrirTermoRelacionado(nome) {
  categoriaAtiva = 'todos';

  document.querySelectorAll('#filtros .chip[data-cat]').forEach((chip) => {
    chip.classList.remove('ativo');
  });

  document
    .querySelector('#filtros .chip[data-cat="todos"]')
    ?.classList.add('ativo');

  mostrarSoFavoritos = false;

  const btnFiltro = document.getElementById('btn-filtro-favoritos');

  btnFiltro?.classList.remove('ativo');

  const busca = document.getElementById('search');

  if (busca) {
    busca.value = nome;
  }

  filtrar();

  document
    .querySelector('.aba-btn[data-aba="glossario"]')
    ?.click();

  const card = document.querySelector('#lista .card');

  if (card) {
    card.classList.add('aberto');

    card.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function renderizar(termos) {
  const lista = document.getElementById('lista');

  if (!lista) return;

  if (!termos || termos.length === 0) {
    lista.innerHTML = `
      <div class="glossario-vazio">
        <h3>Nenhum termo encontrado</h3>
        <p>Tente pesquisar por outra palavra ou alterar os filtros.</p>
      </div>
    `;

    return;
  }

  lista.innerHTML = termos.map((termo, indice) => `
    <div class="card glossario-card" data-index="${indice}">
      <div class="card-head">
        <button
          class="btn-favorito ${favoritos.has(termo.name) ? 'ativo' : ''}"
          data-termo="${escaparHTML(termo.name)}"
          title="Favoritar"
          type="button"
          aria-label="Favoritar ${escaparHTML(termo.name)}"
        >★</button>

        <div class="glossario-identificacao">
          <div class="nome">${escaparHTML(termo.name)}</div>
          <div class="resumo">${escaparHTML(termo.oneLiner)}</div>
        </div>

        <span class="glossario-categoria">
          ${escaparHTML(termo.tagLabel || termo.cat || 'Geral')}
        </span>
      </div>

      <div class="card-corpo">
        <section class="glossario-secao">
          <div class="glossario-secao-titulo">
            <span class="glossario-secao-icone">📘</span>
            <h3>O que é?</h3>
          </div>

          <p>${escaparHTML(termo.body || 'Não há uma explicação disponível para este termo.')}</p>
        </section>

        ${
          termo.code
            ? `
              <section class="glossario-secao glossario-exemplo">
                <div class="glossario-secao-titulo">
                  <span class="glossario-secao-icone">💻</span>
                  <h3>Exemplo prático</h3>
                </div>

                <div class="glossario-codigo">
                  <div class="glossario-codigo-topo">
                    <span>JavaScript</span>
                    <span class="glossario-codigo-pontos">
                      <i></i><i></i><i></i>
                    </span>
                  </div>

                  <pre><code class="language-javascript">${escaparHTML(termo.code)}</code></pre>
                </div>
              </section>
            `
            : ''
        }

        ${
          Array.isArray(termo.relacionados) && termo.relacionados.length
            ? `
              <section class="glossario-secao glossario-relacionados">
                <div class="glossario-secao-titulo">
                  <span class="glossario-secao-icone">🔗</span>
                  <h3>Você também pode aprender</h3>
                </div>

                <div class="relacionados">
                  ${termo.relacionados.map((relacionado) => `
                    <button
                      class="chip-relacionado"
                      data-termo="${escaparHTML(relacionado)}"
                      type="button"
                    >${escaparHTML(relacionado)} <span>→</span></button>
                  `).join('')}
                </div>
              </section>
            `
            : ''
        }
      </div>
    </div>
  `).join('');

  lista.querySelectorAll('.card-head').forEach((cabecalho) => {
    cabecalho.addEventListener('click', (evento) => {
      if (evento.target.closest('button')) return;

      cabecalho.parentElement.classList.toggle('aberto');
    });
  });

  lista.querySelectorAll('.btn-favorito').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      evento.stopPropagation();

      toggleFavorito(botao.dataset.termo, botao);
    });
  });

  lista.querySelectorAll('.chip-relacionado').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      evento.stopPropagation();

      abrirTermoRelacionado(botao.dataset.termo);
    });
  });

  destacarCodigo(lista);
}

function filtrar() {
  const busca = document.getElementById('search');

  const texto = (busca?.value || '').toLowerCase();

  const filtrados = TERMOS.filter((termo) => {
    const bateCategoria =
      categoriaAtiva === 'todos' ||
      termo.cat === categoriaAtiva;

    const bateBusca = [
      termo.name,
      termo.oneLiner,
      termo.body,
      termo.tagLabel,
      ...(termo.relacionados || [])
    ].some((valor) => String(valor || '').toLowerCase().includes(texto));

    const bateFavorito =
      !mostrarSoFavoritos ||
      favoritos.has(termo.name);

    return bateCategoria && bateBusca && bateFavorito;
  });

  renderizar(filtrados);
}

document.getElementById('search')?.addEventListener('input', filtrar);

document.querySelectorAll('#filtros .chip[data-cat]').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#filtros .chip[data-cat]').forEach((item) => {
      item.classList.remove('ativo');
    });

    chip.classList.add('ativo');
    categoriaAtiva = chip.dataset.cat;

    filtrar();
  });
});

const btnFiltroFavoritos = document.getElementById('btn-filtro-favoritos');

btnFiltroFavoritos?.addEventListener('click', () => {
  if (!usuarioAtual) {
    alert('Crie uma conta para ver seus favoritos.');
    return;
  }

  mostrarSoFavoritos = !mostrarSoFavoritos;

  btnFiltroFavoritos.classList.toggle('ativo', mostrarSoFavoritos);

  filtrar();
});

function embaralhar(array) {
  const copia = [...array];

  for (let indice = copia.length - 1; indice > 0; indice--) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));

    [copia[indice], copia[aleatorio]] = [
      copia[aleatorio],
      copia[indice]
    ];
  }

  return copia;
}

function gerarPerguntasQuiz(quantidade) {
  return embaralhar(TERMOS)
    .slice(0, quantidade)
    .map((termo) => {
      const outros = TERMOS.filter((item) => item.name !== termo.name);

      const distratores = embaralhar(outros)
        .slice(0, 3)
        .map((item) => item.name);

      return {
        pergunta: termo.oneLiner,
        correta: termo.name,
        opcoes: embaralhar([
          termo.name,
          ...distratores
        ]),
        explicacao: termo.body || termo.oneLiner,
        termo: termo.name
      };
    });
}

function mostrarPerguntaQuizAtual() {
  const atual = quizPerguntas[quizIndice];

  if (!atual) return;

  const contador = document.getElementById('quiz-contador');
  const pontuacao = document.getElementById('quiz-pontuacao');
  const pergunta = document.getElementById('quiz-pergunta');
  const opcoesEl = document.getElementById('quiz-opcoes');
  const btnProxima = document.getElementById('btn-proxima-pergunta');

  if (contador) {
    contador.textContent = `Pergunta ${quizIndice + 1} de ${quizPerguntas.length}`;
  }

  if (pontuacao) {
    pontuacao.textContent = `Pontos: ${quizPontuacao}`;
  }

  if (pergunta) {
    pergunta.textContent = atual.pergunta;
  }

  if (!opcoesEl) return;

  opcoesEl.innerHTML = atual.opcoes.map((opcao) => `
    <button class="quiz-opcao" type="button">${escaparHTML(opcao)}</button>
  `).join('');

  if (btnProxima) {
    btnProxima.style.display = 'none';
    btnProxima.textContent =
      quizIndice === quizPerguntas.length - 1
        ? 'Ver resultado'
        : 'Próxima pergunta';
  }
}

const quizInicio = document.getElementById('quiz-inicio');
const quizJogo = document.getElementById('quiz-jogo');
const quizFim = document.getElementById('quiz-fim');
const btnIniciarQuiz = document.getElementById('btn-iniciar-quiz');
const btnProximaPergunta = document.getElementById('btn-proxima-pergunta');
const btnRefazerQuiz = document.getElementById('btn-refazer-quiz');

const chatMensagens = document.getElementById('chat-mensagens');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const btnEnviar = document.getElementById('btn-enviar');
const secaoConversas = document.getElementById('secao-conversas');
const listaConversas = document.getElementById('lista-conversas');
const btnNovaConversa = document.getElementById('btn-nova-conversa');
const btnAnexo = document.getElementById('btn-anexo');
const inputAnexos = document.getElementById('chat-anexos');
const previewAnexos = document.getElementById('chat-anexos-preview');

function criarEstiloMenuAnexo() {
  if (document.getElementById('estilo-menu-anexo')) return;

  const style = document.createElement('style');

  style.id = 'estilo-menu-anexo';

  style.textContent = `
    .chat-anexo-menu {
      position: fixed;
      z-index: 99999;
      width: 230px;
      padding: 7px;
      border: 1px solid var(--cor-borda);
      border-radius: 12px;
      background: var(--cor-fundo-alt);
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.30);
    }

    .chat-anexo-menu-item {
      width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 0 11px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--cor-texto);
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      text-align: left;
      transition: background 0.13s;
    }

    .chat-anexo-menu-item:hover {
      background: var(--cor-fundo-alt2);
    }

    .chat-anexo-menu-item svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      color: var(--cor-texto-dim);
    }
  `;

  document.head.appendChild(style);
}

function fecharMenuAnexo() {
  menuAnexo?.remove();
  menuAnexo = null;
}

function posicionarMenuAnexo(menu) {
  if (!btnAnexo) return;

  const rect = btnAnexo.getBoundingClientRect();
  const largura = menu.offsetWidth;
  const altura = menu.offsetHeight;

  let esquerda = rect.left;
  let topo = rect.top - altura - 8;

  if (esquerda + largura > window.innerWidth - 10) {
    esquerda = window.innerWidth - largura - 10;
  }

  if (esquerda < 10) {
    esquerda = 10;
  }

  if (topo < 10) {
    topo = rect.bottom + 8;
  }

  menu.style.left = `${esquerda}px`;
  menu.style.top = `${topo}px`;
}

function abrirMenuAnexo() {
  if (menuAnexo) {
    fecharMenuAnexo();
    return;
  }

  criarEstiloMenuAnexo();

  const menu = document.createElement('div');

  menu.className = 'chat-anexo-menu';

  menu.innerHTML = `
    <button type="button" class="chat-anexo-menu-item" data-acao="arquivo">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
      </svg>
      <span>Adicionar fotos e arquivos</span>
    </button>
  `;

  document.body.appendChild(menu);

  menuAnexo = menu;

  posicionarMenuAnexo(menu);

  menu.querySelector('[data-acao="arquivo"]')?.addEventListener('click', (evento) => {
    evento.preventDefault();
    evento.stopPropagation();

    fecharMenuAnexo();
    inputAnexos?.click();
  });
}

function formatarTamanhoArquivo(bytes) {
  if (!Number.isFinite(bytes)) return '';

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function obterIconeArquivo() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path>
      <path d="M14 2v6h6"></path>
    </svg>
  `;
}

function liberarPreviewAnexo(anexo) {
  if (anexo?.previewUrl) {
    URL.revokeObjectURL(anexo.previewUrl);
  }
}

function limparAnexosSelecionados() {
  anexosSelecionados.forEach(liberarPreviewAnexo);

  anexosSelecionados = [];

  if (previewAnexos) {
    previewAnexos.innerHTML = '';
  }

  if (inputAnexos) {
    inputAnexos.value = '';
  }
}

function renderizarAnexosSelecionados() {
  if (!previewAnexos) return;

  previewAnexos.innerHTML = '';

  anexosSelecionados.forEach((anexo, indice) => {
    const chip = document.createElement('div');

    chip.className = 'chat-anexo-chip';

    const arquivo = anexo.arquivo;

    if (arquivo.type?.startsWith('image/')) {
      const imagem = document.createElement('img');

      imagem.className = 'chat-anexo-miniatura';
      imagem.src = anexo.previewUrl;
      imagem.alt = arquivo.name;

      chip.appendChild(imagem);
    } else {
      const icone = document.createElement('span');

      icone.className = 'chat-anexo-tipo';
      icone.innerHTML = obterIconeArquivo();

      chip.appendChild(icone);
    }

    const dados = document.createElement('div');

    dados.style.minWidth = '0';

    const nome = document.createElement('div');

    nome.className = 'chat-anexo-nome';
    nome.textContent = arquivo.name;
    nome.title = `${arquivo.name} • ${formatarTamanhoArquivo(arquivo.size)}`;

    dados.appendChild(nome);
    chip.appendChild(dados);

    const remover = document.createElement('button');

    remover.type = 'button';
    remover.className = 'chat-anexo-remover';
    remover.title = 'Remover anexo';
    remover.setAttribute('aria-label', `Remover ${arquivo.name}`);
    remover.textContent = '×';

    remover.addEventListener('click', () => {
      const removido = anexosSelecionados.splice(indice, 1)[0];

      liberarPreviewAnexo(removido);
      renderizarAnexosSelecionados();
    });

    chip.appendChild(remover);
    previewAnexos.appendChild(chip);
  });
}

function adicionarArquivosAoChat(arquivos) {
  const novosArquivos = Array.from(arquivos || []);

  for (const arquivo of novosArquivos) {
    if (anexosSelecionados.length >= LIMITE_ANEXOS) {
      alert(`Você pode adicionar no máximo ${LIMITE_ANEXOS} arquivos por mensagem.`);
      break;
    }

    if (arquivo.size > LIMITE_TAMANHO_ANEXO) {
      alert(`O arquivo "${arquivo.name}" passa do limite de 8 MB.`);
      continue;
    }

    const tamanhoAtual = anexosSelecionados.reduce(
      (total, item) => total + item.arquivo.size,
      0
    );

    if (tamanhoAtual + arquivo.size > LIMITE_TOTAL_ANEXOS) {
      alert('O tamanho total dos arquivos por mensagem não pode ultrapassar 8 MB.');
      continue;
    }

    const duplicado = anexosSelecionados.some((item) => (
      item.arquivo.name === arquivo.name &&
      item.arquivo.size === arquivo.size &&
      item.arquivo.lastModified === arquivo.lastModified
    ));

    if (duplicado) continue;

    anexosSelecionados.push({
      arquivo,
      previewUrl: arquivo.type?.startsWith('image/')
        ? URL.createObjectURL(arquivo)
        : null
    });
  }

  renderizarAnexosSelecionados();
}

const EXTENSOES_TEXTO_ANEXO = new Set([
  '.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css',
  '.json', '.md', '.py', '.java', '.c', '.cpp', '.cs',
  '.php', '.sql', '.xml', '.csv', '.yaml', '.yml', '.sh',
  '.log'
]);

const TIPOS_IMAGEM_ANEXO = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
]);

function obterExtensaoAnexo(nome) {
  const ponto = nome.lastIndexOf('.');

  return ponto >= 0 ? nome.slice(ponto).toLowerCase() : '';
}

function arquivoParaBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => {
      const resultado = String(leitor.result || '');
      const separador = resultado.indexOf(',');

      if (separador < 0) {
        reject(new Error(`Não foi possível ler o arquivo "${arquivo.name}".`));
        return;
      }

      resolve(resultado.slice(separador + 1));
    };

    leitor.onerror = () => {
      reject(new Error(`Não foi possível ler o arquivo "${arquivo.name}".`));
    };

    leitor.readAsDataURL(arquivo);
  });
}

async function prepararAnexosParaEnvio(arquivos) {
  return Promise.all(
    Array.from(arquivos || []).map(async (arquivo) => {
      const extensao = obterExtensaoAnexo(arquivo.name);
      const mimeType = String(arquivo.type || '').toLowerCase();

      if (TIPOS_IMAGEM_ANEXO.has(mimeType) || extensao === '.pdf') {
        const tipoFinal = extensao === '.pdf'
          ? 'application/pdf'
          : mimeType;

        return {
          name: arquivo.name,
          kind: 'inline',
          mimeType: tipoFinal,
          data: await arquivoParaBase64(arquivo)
        };
      }

      if (EXTENSOES_TEXTO_ANEXO.has(extensao)) {
        return {
          name: arquivo.name,
          kind: 'text',
          mimeType: 'text/plain',
          text: await arquivo.text()
        };
      }

      throw new Error(
        `O arquivo "${arquivo.name}" não é compatível. Envie uma imagem PNG/JPG/WEBP/GIF, um PDF ou um arquivo de texto/código.`
      );
    })
  );
}

if (btnAnexo && inputAnexos) {
  btnAnexo.addEventListener('click', (evento) => {
    evento.preventDefault();
    evento.stopPropagation();

    abrirMenuAnexo();
  });

  inputAnexos.addEventListener('change', () => {
    adicionarArquivosAoChat(inputAnexos.files);
    inputAnexos.value = '';
  });
}

document.addEventListener('click', (evento) => {
  if (
    menuAnexo &&
    !menuAnexo.contains(evento.target) &&
    !btnAnexo?.contains(evento.target)
  ) {
    fecharMenuAnexo();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    fecharMenuAnexo();
  }
});

window.addEventListener('resize', fecharMenuAnexo);

async function carregarConversas(selecionarPrimeira = true) {
  if (!usuarioAtual || !listaConversas) return;

  const { data, error } = await supabaseClient
    .from('conversas')
    .select('id, titulo, created_at')
    .eq('user_id', usuarioAtual.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar conversas:', error);
    return;
  }

  renderizarListaConversas(data || []);

  if (!selecionarPrimeira) return;

  if (data?.length) {
    await selecionarConversa(data[0].id);
  } else {
    iniciarTelaConversaVazia();
  }
}

function renderizarListaConversas(conversas) {
  if (!listaConversas) return;

  listaConversas.innerHTML = (conversas || []).map((conversa) => `
    <div
      class="item-conversa ${conversa.id === conversaAtualId ? 'ativo' : ''}"
      data-id="${escaparHTML(conversa.id)}"
    >
      <span class="titulo-conversa">${escaparHTML(conversa.titulo)}</span>

      <button
        class="btn-excluir-conversa"
        data-id="${escaparHTML(conversa.id)}"
        title="Excluir"
        type="button"
      >×</button>
    </div>
  `).join('');

  listaConversas.querySelectorAll('.item-conversa').forEach((item) => {
    item.addEventListener('click', () => {
      selecionarConversa(item.dataset.id);
    });
  });

  listaConversas.querySelectorAll('.btn-excluir-conversa').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      evento.stopPropagation();

      excluirConversa(botao.dataset.id);
    });
  });
}

function iniciarTelaConversaVazia() {
  versaoConversaAtual++;
  conversaAtualId = null;
  historicoChat = [];

  limparAnexosSelecionados();
  fecharMenuAnexo();

  renderizarEstadoVazioChat();

  document.querySelectorAll('.item-conversa').forEach((item) => {
    item.classList.remove('ativo');
  });

  chatInput?.focus();
}
function renderizarEstadoVazioChat() {
  if (!chatMensagens) return;
  chatMensagens.innerHTML = '';

  const vazio = document.createElement('div');
  vazio.className = 'chat-estado-vazio';
  vazio.innerHTML = `
    <div class="chat-vazio-avatar">
      <span>&lt;/&gt;</span>
    </div>
    <h2>Como posso te ajudar a programar hoje?</h2>
    <p>Tire dúvidas, envie códigos para correção ou peça explicações de qualquer conceito de programação.</p>
    
    <div class="chat-vazio-sugestoes">
      <button type="button" class="chat-sugestao-card" data-prompt="Por que meu loop while não para de executar? Pode me explicar loops infinitos e como evitar?">
        <span class="chat-sugestao-icone">🔄</span>
        <div class="chat-sugestao-texto">
          <strong>Loop infinito</strong>
          <span>Por que meu loop while não para de executar?</span>
        </div>
        <span class="chat-sugestao-seta">→</span>
      </button>

      <button type="button" class="chat-sugestao-card" data-prompt="Qual a diferença prática entre let, const e var em JavaScript? Mostre exemplos.">
        <span class="chat-sugestao-icone">📦</span>
        <div class="chat-sugestao-texto">
          <strong>let vs const vs var</strong>
          <span>Qual a diferença prática e quando usar cada um?</span>
        </div>
        <span class="chat-sugestao-seta">→</span>
      </button>

      <button type="button" class="chat-sugestao-card" data-prompt="Como funciona o método Array.map() em JavaScript? Me mostre um exemplo simples.">
        <span class="chat-sugestao-icone">⚡</span>
        <div class="chat-sugestao-texto">
          <strong>Métodos de Array</strong>
          <span>Como funciona o Array.map() com exemplos práticos?</span>
        </div>
        <span class="chat-sugestao-seta">→</span>
      </button>

      <button type="button" class="chat-sugestao-card" data-prompt="O que é uma Promise e para que serve o async/await em JavaScript? Explique de forma didática.">
        <span class="chat-sugestao-icone">⏳</span>
        <div class="chat-sugestao-texto">
          <strong>Assincronismo</strong>
          <span>O que é Promise e para que serve async/await?</span>
        </div>
        <span class="chat-sugestao-seta">→</span>
      </button>
    </div>
  `;

  vazio.querySelectorAll('.chat-sugestao-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      if (chatInput && prompt) {
        chatInput.value = prompt;
        chatForm?.requestSubmit();
      }
    });
  });

  chatMensagens.appendChild(vazio);
}


btnNovaConversa?.addEventListener('click', () => {
  iniciarTelaConversaVazia();

  document
    .querySelector('.aba-btn[data-aba="chat"]')
    ?.click();
});

async function selecionarConversa(id) {
  if (!usuarioAtual || !id) return;

  const versaoSelecao = ++versaoConversaAtual;

  conversaAtualId = id;
  historicoChat = [];

  fecharMenuAnexo();
  limparAnexosSelecionados();

  document.querySelectorAll('.item-conversa').forEach((item) => {
    item.classList.toggle('ativo', item.dataset.id === id);
  });

  const { data, error } = await supabaseClient
    .from('mensagens')
    .select('id, pergunta, resposta, avaliacao, created_at')
    .eq('conversa_id', id)
    .eq('user_id', usuarioAtual.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao carregar mensagens da conversa:', error);
    return;
  }

  if (versaoSelecao !== versaoConversaAtual) return;

  chatMensagens.innerHTML = '';

  (data || []).forEach((mensagem) => {
    adicionarMensagem(mensagem.pergunta, 'usuario');

    adicionarMensagem(
      mensagem.resposta,
      'ia',
      mensagem.pergunta,
      mensagem.id,
      mensagem.avaliacao
    );

    historicoChat.push({
      role: 'user',
      text: mensagem.pergunta
    });

    historicoChat.push({
      role: 'model',
      text: mensagem.resposta
    });
  });

  chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

async function excluirConversa(id) {
  if (!usuarioAtual) return;

  const confirmar = confirm(
    'Excluir esta conversa e todo o seu histórico?'
  );

  if (!confirmar) return;

  const { error } = await supabaseClient
    .from('conversas')
    .delete()
    .eq('id', id)
    .eq('user_id', usuarioAtual.id);

  if (error) {
    alert('Erro ao excluir conversa: ' + error.message);
    return;
  }

  const eraAtual = id === conversaAtualId;

  if (eraAtual) {
    iniciarTelaConversaVazia();
  }

  await carregarConversas(eraAtual);
}

function gerarTituloConversa(pergunta) {
  const titulo = String(pergunta || '')
    .replace(/\s+/g, ' ')
    .trim();

  return titulo.length > 40
    ? titulo.slice(0, 40) + '...'
    : titulo;
}

function copiarTexto(texto, botao) {
  if (!navigator.clipboard?.writeText) {
    alert('Não foi possível copiar o texto neste navegador.');
    return;
  }

  navigator.clipboard.writeText(texto).then(() => {
    botao.innerHTML = ICONES.check;
    botao.classList.add('copiado');

    setTimeout(() => {
      botao.innerHTML = ICONES.copiar;
      botao.classList.remove('copiado');
    }, 1500);
  }).catch((erro) => {
    console.error('Erro ao copiar:', erro);
  });
}

function lerEmVozAlta(texto, botao) {
  if (!('speechSynthesis' in window)) {
    alert('A leitura em voz alta não está disponível neste navegador.');
    return;
  }

  if (falandoAtualmente) {
    speechSynthesis.cancel();

    falandoAtualmente.classList.remove('falando');

    if (falandoAtualmente === botao) {
      falandoAtualmente = null;
      return;
    }
  }

  const textoLimpo = String(texto || '')
    .replace(/```[\s\S]*?```/g, ' bloco de código ')
    .replace(/[*#`]/g, '');

  const fala = new SpeechSynthesisUtterance(textoLimpo);

  fala.lang = 'pt-BR';

  fala.onend = () => {
    botao.classList.remove('falando');
    falandoAtualmente = null;
  };

  fala.onerror = () => {
    botao.classList.remove('falando');
    falandoAtualmente = null;
  };

  botao.classList.add('falando');
  falandoAtualmente = botao;

  speechSynthesis.speak(fala);
}

function executarAcaoRapida(tipo) {
  if (envioEmAndamento || btnEnviar?.disabled) return;

  const perguntas = {
    simplificar: 'Me explica isso de um jeito mais fácil.',
    exemplo: 'Me dá um exemplo prático e simples disso.',
    aprofundar: 'Aprofunde essa explicação com mais detalhes técnicos.',
    exercicio: 'Crie um exercício sobre isso para eu praticar, mas não mostre a resposta ainda.'
  };

  const pergunta = perguntas[tipo];

  if (!pergunta) return;

  adicionarMensagem(pergunta, 'usuario');

  enviarPergunta(pergunta);
}

function mostrarCaixaFeedback(bolha, idMensagem, tipo) {
  bolha.querySelector('.caixa-feedback')?.remove();

  const textoPergunta = tipo === 'positiva'
    ? 'O que funcionou bem nessa resposta? (opcional)'
    : 'O que poderia ser melhor nessa resposta? (opcional)';

  const placeholder = tipo === 'positiva'
    ? 'Conte o que te ajudou...'
    : 'Conte o que não funcionou...';

  const caixa = document.createElement('div');

  caixa.className = 'caixa-feedback';

  const pergunta = document.createElement('p');
  pergunta.textContent = textoPergunta;

  const textarea = document.createElement('textarea');
  textarea.placeholder = placeholder;

  const acoes = document.createElement('div');
  acoes.className = 'caixa-feedback-acoes';

  const enviar = document.createElement('button');
  enviar.className = 'btn-enviar-feedback';
  enviar.textContent = 'Enviar feedback';

  const cancelar = document.createElement('button');
  cancelar.className = 'btn-cancelar-feedback';
  cancelar.textContent = 'Cancelar';

  cancelar.addEventListener('click', () => {
    caixa.remove();
  });

  enviar.addEventListener('click', async () => {
    const comentario = textarea.value.trim();

    if (comentario && idMensagem) {
      enviar.disabled = true;

      const { error } = await supabaseClient
        .from('mensagens')
        .update({ comentario })
        .eq('id', idMensagem)
        .eq('user_id', usuarioAtual.id);

      if (error) {
        console.error('Erro ao salvar feedback:', error);
        alert('Não foi possível salvar seu feedback.');
        enviar.disabled = false;
        return;
      }
    }

    caixa.innerHTML = '<p class="feedback-obrigado">Obrigado pelo feedback!</p>';

    setTimeout(() => caixa.remove(), 2000);
  });

  acoes.append(enviar, cancelar);
  caixa.append(pergunta, textarea, acoes);

  bolha.appendChild(caixa);

  chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

async function avaliarMensagem(
  idMensagem,
  valor,
  botaoClicado,
  botaoOposto,
  bolha
) {
  const jaAtivo = botaoClicado.classList.contains('ativo-' + valor);
  const novoValor = jaAtivo ? null : valor;

  if (idMensagem && usuarioAtual) {
    const { error } = await supabaseClient
      .from('mensagens')
      .update({ avaliacao: novoValor })
      .eq('id', idMensagem)
      .eq('user_id', usuarioAtual.id);

    if (error) {
      console.error('Erro ao salvar avaliação:', error);
      return;
    }
  }

  botaoClicado.classList.toggle('ativo-' + valor, !jaAtivo);

  botaoOposto.classList.remove(
    'ativo-positiva',
    'ativo-negativa'
  );

  if (jaAtivo) {
    bolha.querySelector('.caixa-feedback')?.remove();
  } else {
    mostrarCaixaFeedback(bolha, idMensagem, valor);
  }
}

function criarAcoesMensagem(
  bolha,
  textoResposta,
  pergunta,
  idMensagem,
  avaliacaoAtual
) {
  const div = document.createElement('div');

  div.className = 'acoes-mensagem';

  div.innerHTML = `
    <button class="btn-acao btn-positiva ${avaliacaoAtual === 'positiva' ? 'ativo-positiva' : ''}" title="Boa resposta" type="button">${ICONES.positiva}</button>
    <button class="btn-acao btn-negativa ${avaliacaoAtual === 'negativa' ? 'ativo-negativa' : ''}" title="Resposta ruim" type="button">${ICONES.negativa}</button>
    <button class="btn-acao btn-copiar" title="Copiar" type="button">${ICONES.copiar}</button>
    <button class="btn-acao btn-ouvir" title="Ouvir" type="button">${ICONES.ouvir}</button>
    <button class="btn-acao btn-regenerar" title="Gerar outra resposta" type="button">${ICONES.refazer}</button>
    <button class="chip btn-simplificar" type="button">Simplificar</button>
    <button class="chip btn-exemplo" type="button">Dar exemplo</button>
    <button class="chip btn-aprofundar" type="button">Aprofundar</button>
    <button class="chip btn-exercicio" type="button">Gerar exercício</button>
  `;

  const btnPositiva = div.querySelector('.btn-positiva');
  const btnNegativa = div.querySelector('.btn-negativa');

  btnPositiva.addEventListener('click', () => {
    avaliarMensagem(
      idMensagem,
      'positiva',
      btnPositiva,
      btnNegativa,
      bolha
    );
  });

  btnNegativa.addEventListener('click', () => {
    avaliarMensagem(
      idMensagem,
      'negativa',
      btnNegativa,
      btnPositiva,
      bolha
    );
  });

  div.querySelector('.btn-copiar').addEventListener('click', (evento) => {
    copiarTexto(textoResposta, evento.currentTarget);
  });

  div.querySelector('.btn-ouvir').addEventListener('click', (evento) => {
    lerEmVozAlta(textoResposta, evento.currentTarget);
  });

  div.querySelector('.btn-regenerar').addEventListener('click', () => {
    if (pergunta && !envioEmAndamento) {
      enviarPergunta(pergunta);
    }
  });

  div.querySelector('.btn-simplificar').addEventListener('click', () => {
    executarAcaoRapida('simplificar');
  });

  div.querySelector('.btn-exemplo').addEventListener('click', () => {
    executarAcaoRapida('exemplo');
  });

  div.querySelector('.btn-aprofundar').addEventListener('click', () => {
    executarAcaoRapida('aprofundar');
  });

  div.querySelector('.btn-exercicio').addEventListener('click', () => {
    executarAcaoRapida('exercicio');
  });

  return div;
}

function adicionarMensagem(
  texto,
  autor,
  pergunta,
  idMensagem,
  avaliacaoAtual
) {
  const estadoVazio = chatMensagens?.querySelector('.chat-estado-vazio');
  if (estadoVazio) {
    estadoVazio.remove();
  }
  const div = document.createElement('div');

  div.className = 'msg ' + (
    autor === 'usuario'
      ? 'msg-usuario'
      : 'msg-ia'
  );

  if (autor === 'ia') {
    renderizarMarkdown(div, texto);

    div.appendChild(
      criarAcoesMensagem(
        div,
        texto,
        pergunta,
        idMensagem,
        avaliacaoAtual
      )
    );
  } else {
    div.textContent = texto;
  }

  chatMensagens.appendChild(div);

  chatMensagens.scrollTop = chatMensagens.scrollHeight;

  return div;
}

async function salvarMensagem(pergunta, resposta, conversaIdInicial, versaoEnvio) {
  if (!usuarioAtual) return null;

  let idConversa = conversaIdInicial;

  if (!idConversa) {
    const { data: novaConversa, error: erroConversa } = await supabaseClient
      .from('conversas')
      .insert({
        user_id: usuarioAtual.id,
        titulo: gerarTituloConversa(pergunta)
      })
      .select()
      .single();

    if (erroConversa) {
      console.error('Erro ao criar conversa:', erroConversa);
      return null;
    }

    idConversa = novaConversa.id;

    if (versaoEnvio === versaoConversaAtual) {
      conversaAtualId = idConversa;
    }
  }

  const { data, error } = await supabaseClient
    .from('mensagens')
    .insert({
      user_id: usuarioAtual.id,
      conversa_id: idConversa,
      pergunta,
      resposta
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar mensagem:', error);
    return null;
  }

  await carregarConversas(false);

  return data?.id || null;
}

async function enviarPergunta(pergunta, arquivosParaEnviar = []) {
  if (envioEmAndamento || !pergunta) return;

  envioEmAndamento = true;

  if (btnEnviar) {
    btnEnviar.disabled = true;
  }

  const historicoParaIA = historicoChat
    .slice(-16)
    .map((item) => ({
      role: item.role,
      text: item.text
    }));

  const conversaAntesDoEnvio = conversaAtualId;
  const versaoEnvio = versaoConversaAtual;

  const bolha = document.createElement('div');

  bolha.className = 'msg msg-ia msg-pensando';
  bolha.innerHTML = '<div class="pontinho-gradiente"></div>';

  chatMensagens.appendChild(bolha);
  chatMensagens.scrollTop = chatMensagens.scrollHeight;

  let textoRecebido = '';

  try {
    const anexosPayload = await prepararAnexosParaEnvio(arquivosParaEnviar);

    const resposta = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pergunta,
        historico: historicoParaIA,
        anexos: anexosPayload
      })
    });

    if (!resposta.ok) {
      const mensagemErro = await resposta.text();

      throw new Error(
        mensagemErro || 'Não foi possível consultar a IA.'
      );
    }

    if (!resposta.body) {
      throw new Error('O servidor não retornou uma resposta.');
    }

    const leitor = resposta.body.getReader();
    const decodificador = new TextDecoder();

    while (true) {
      const { done, value } = await leitor.read();

      if (done) break;

      textoRecebido += decodificador.decode(value, {
        stream: true
      });

      bolha.classList.remove('msg-pensando');

      renderizarMarkdown(bolha, textoRecebido);

      chatMensagens.scrollTop = chatMensagens.scrollHeight;
    }

    textoRecebido += decodificador.decode();

    if (!textoRecebido.trim()) {
      throw new Error('A IA não retornou uma resposta. Tente novamente.');
    }

    bolha.classList.remove('msg-pensando');

    renderizarMarkdown(bolha, textoRecebido);

    historicoChat.push({
      role: 'user',
      text: pergunta
    });

    historicoChat.push({
      role: 'model',
      text: textoRecebido
    });

    const idMensagem = await salvarMensagem(
      pergunta,
      textoRecebido,
      conversaAntesDoEnvio,
      versaoEnvio
    );

    bolha.appendChild(
      criarAcoesMensagem(
        bolha,
        textoRecebido,
        pergunta,
        idMensagem,
        null
      )
    );

    chatMensagens.scrollTop = chatMensagens.scrollHeight;
  } catch (erro) {
    console.error('Erro ao enviar pergunta:', erro);

    bolha.classList.remove('msg-pensando');
    bolha.classList.add('msg-erro');

    bolha.textContent = erro?.message?.includes('Failed to fetch')
      ? 'Erro de conexão com o servidor. Verifique se o CodeHelper está rodando e tente novamente.'
      : (
          erro?.message ||
          'Não foi possível enviar sua mensagem. Tente novamente.'
        );

    if (versaoEnvio === versaoConversaAtual) {
      historicoChat = historicoChat.filter((item, indice, array) => {
        return !(
          indice === array.length - 1 &&
          item.role === 'user' &&
          item.text === pergunta
        );
      });
    }
  } finally {
    envioEmAndamento = false;

    if (btnEnviar) {
      btnEnviar.disabled = false;
    }

    chatInput?.focus();
  }
}

chatForm?.addEventListener('submit', (evento) => {
  evento.preventDefault();

  if (envioEmAndamento) return;

  const textoDigitado = chatInput.value.trim();

  const arquivosParaEnviar = anexosSelecionados.map(
    (item) => item.arquivo
  );

  if (!textoDigitado && !arquivosParaEnviar.length) {
    return;
  }

  const perguntaBase = textoDigitado ||
    'Analise os arquivos anexados e me explique o que encontrar.';

  const nomesAnexos = arquivosParaEnviar.map(
    (arquivo) => arquivo.name
  );

  const pergunta = nomesAnexos.length
    ? `${perguntaBase}\n\nArquivos anexados: ${nomesAnexos.join(', ')}`
    : perguntaBase;

  adicionarMensagem(pergunta, 'usuario');

  chatInput.value = '';
  chatInput.style.height = 'auto';

  limparAnexosSelecionados();

  enviarPergunta(pergunta, arquivosParaEnviar);
});

chatInput?.addEventListener('keydown', (evento) => {
  if (
    evento.key === 'Enter' &&
    !evento.shiftKey
  ) {
    evento.preventDefault();
    chatForm.requestSubmit();
  }
});

chatInput?.addEventListener('input', () => {
  chatInput.style.height = 'auto';

  chatInput.style.height =
    Math.min(chatInput.scrollHeight, 180) + 'px';
});

const authArea = document.getElementById('auth-area');

function renderAuthArea() {
  if (!authArea) return;

  if (usuarioAtual) {
    authArea.innerHTML = `
      <span class="email-usuario">
        ${escaparHTML(usuarioAtual.email)}
      </span>

      <button id="btn-logout" type="button">Sair</button>
    `;

    document.getElementById('btn-logout')?.addEventListener('click', async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        alert('Não foi possível sair da conta.');
        return;
      }

      window.location.href = 'index.html';
    });

    return;
  }

  if (modoConvidado) {
    authArea.innerHTML = `
      <span class="email-usuario">Modo convidado</span>
      <button id="btn-sair-convidado" type="button">Entrar</button>
    `;

    document.getElementById('btn-sair-convidado')?.addEventListener('click', () => {
      sessionStorage.removeItem('convidado');
      window.location.href = 'index.html';
    });
  }
}

const toggleTema = document.getElementById('toggle-tema');

function aplicarTema(tema) {
  const claro = tema === 'claro';

  document.body.classList.toggle('tema-claro', claro);

  if (toggleTema) {
    toggleTema.checked = claro;
  }
}

function iniciarTema() {
  const salvo = localStorage.getItem('tema') || 'escuro';

  aplicarTema(salvo);
}

toggleTema?.addEventListener('change', () => {
  const novoTema = toggleTema.checked ? 'claro' : 'escuro';

  localStorage.setItem('tema', novoTema);

  aplicarTema(novoTema);
});

const formPerfil = document.getElementById('form-perfil');
const perfilNome = document.getElementById('perfil-nome');
const perfilEmail = document.getElementById('perfil-email');
const perfilStatus = document.getElementById('perfil-status');

function preencherPerfil() {
  if (!formPerfil) return;

  if (!usuarioAtual) {
    formPerfil.querySelectorAll('input, button').forEach((elemento) => {
      elemento.disabled = true;
    });

    if (perfilStatus) {
      perfilStatus.textContent = 'Crie uma conta para editar seu perfil.';
    }

    return;
  }

  formPerfil.querySelectorAll('input, button').forEach((elemento) => {
    elemento.disabled = false;
  });

  if (perfilEmail) {
    perfilEmail.value = usuarioAtual.email || '';
  }

  if (perfilNome) {
    perfilNome.value = usuarioAtual.user_metadata?.nome || '';
  }
}

formPerfil?.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (!usuarioAtual) return;

  perfilStatus.textContent = 'Salvando...';

  const { data, error } = await supabaseClient.auth.updateUser({
    email: perfilEmail.value.trim(),
    data: {
      nome: perfilNome.value.trim()
    }
  });

  if (error) {
    perfilStatus.textContent = 'Erro: ' + error.message;
    return;
  }

  usuarioAtual = data.user;

  perfilStatus.textContent = 'Alterações salvas.';

  renderAuthArea();
});

const btnApagarHistorico = document.getElementById('btn-apagar-historico');

btnApagarHistorico?.addEventListener('click', async () => {
  if (!usuarioAtual) return;

  const confirmar = confirm(
    'Tem certeza que quer apagar TODAS as suas conversas e o histórico? Essa ação não pode ser desfeita.'
  );

  if (!confirmar) return;

  btnApagarHistorico.disabled = true;

  const { error } = await supabaseClient
    .from('conversas')
    .delete()
    .eq('user_id', usuarioAtual.id);

  btnApagarHistorico.disabled = false;

  if (error) {
    alert('Erro ao apagar histórico: ' + error.message);
    return;
  }

  iniciarTelaConversaVazia();

  await carregarConversas();

  alert('Histórico apagado.');
});

async function iniciar() {
  iniciarTema();

  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    if (data.session) {
      usuarioAtual = data.session.user;
    } else if (sessionStorage.getItem('convidado') === 'true') {
      modoConvidado = true;

      if (secaoConversas) {
        secaoConversas.style.display = 'none';
      }
    } else {
      window.location.href = 'index.html';
      return;
    }

    renderAuthArea();

    if (usuarioAtual) {
      await carregarFavoritos();
      await carregarConversas();
    } else {
      iniciarTelaConversaVazia();
    }

    await carregarTermos();

    preencherPerfil();
  } catch (erro) {
    console.error('Erro ao iniciar o CodeHelper:', erro);

    alert('Não foi possível carregar sua sessão. Entre novamente.');

    window.location.href = 'index.html';
  }
}

iniciar();