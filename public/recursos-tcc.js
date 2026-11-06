/* ==========================================================================
   RECURSOS AVANÇADOS DO TCC — CODEHELPER
   1. Modo Tutor Socrático & Exportação de Caderno de Estudos (.md)
   2. Flashcards 3D de Repetição Ativa & Sistema de Conquistas (Gamificação)
   3. Comparador Visual de Código (Diff Antes × Depois) & Command Palette (Ctrl+K)
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     ESTADO GLOBAL DOS NOVOS RECURSOS
     ======================================================================== */
  const CHAVE_MODO_CHAT = 'codehelper_modo_chat';
  const CHAVE_CONQUISTAS = 'codehelper_conquistas_v1';
  const CHAVE_FLASHCARDS_DOMINADOS = 'codehelper_flashcards_dominados_v1';

  window.modoChatCodeHelper = localStorage.getItem(CHAVE_MODO_CHAT) || 'direto';

  /* ========================================================================
     1. SISTEMA DE CONQUISTAS (GAMIFICAÇÃO)
     ======================================================================== */
  const CATALOGO_CONQUISTAS = [
    {
      id: 'primeiro_chat',
      icone: '🚀',
      titulo: 'Primeiro Passo',
      descricao: 'Enviou a primeira dúvida para o assistente de IA.'
    },
    {
      id: 'tutor_socratico',
      icone: '🎓',
      titulo: 'Mente Socrática',
      descricao: 'Estudou com o Modo Tutor Socrático guiado por perguntas.'
    },
    {
      id: 'explorador_glossario',
      icone: '📚',
      titulo: 'Explorador Conceitual',
      descricao: 'Consultou termos técnicos no Glossário de programação.'
    },
    {
      id: 'curador_favoritos',
      icone: '⭐',
      titulo: 'Curador de Estudos',
      descricao: 'Favoritou conceitos importantes para revisão rápida.'
    },
    {
      id: 'memoria_ativa',
      icone: '🎴',
      titulo: 'Memória Ativa',
      descricao: 'Praticou repetição espaçada com os Flashcards 3D.'
    },
    {
      id: 'auditor_codigo',
      icone: '🔍',
      titulo: 'Auditor de Código',
      descricao: 'Analisou um código em busca de bugs e melhorias.'
    },
    {
      id: 'mao_na_massa',
      icone: '💻',
      titulo: 'Mão na Massa',
      descricao: 'Executou um algoritmo prático no Playground JS.'
    },
    {
      id: 'mestre_quiz',
      icone: '🏆',
      titulo: 'Desafiante do Quiz',
      descricao: 'Testou seus conhecimentos no Quiz interativo.'
    }
  ];

  function obterConquistasSalvas() {
    try {
      const bruto = localStorage.getItem(CHAVE_CONQUISTAS);
      const parsed = bruto ? JSON.parse(bruto) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function salvarConquistas(mapa) {
    try {
      localStorage.setItem(CHAVE_CONQUISTAS, JSON.stringify(mapa));
    } catch {
      // ignora erro de quota
    }
  }

  function mostrarToastConquista(conquista) {
    let container = document.getElementById('tcc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'tcc-toast-container';
      container.className = 'tcc-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'tcc-toast-conquista';
    toast.innerHTML = `
      <div class="tcc-toast-icone">${conquista.icone}</div>
      <div class="tcc-toast-corpo">
        <span class="tcc-toast-tag">Nova Conquista Desbloqueada!</span>
        <strong>${conquista.titulo}</strong>
        <p>${conquista.descricao}</p>
      </div>
    `;

    toast.style.cursor = "pointer";
    toast.addEventListener("click", abrirModalConquistas);
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visivel');
    });

    setTimeout(() => {
      toast.classList.remove('visivel');
      setTimeout(() => toast.remove(), 350);
    }, 4200);
  }

  function desbloquearConquista(id, silencioso = false) {
    const conquista = CATALOGO_CONQUISTAS.find((item) => item.id === id);
    if (!conquista) return;

    const salvas = obterConquistasSalvas();
    if (salvas[id]) return;

    salvas[id] = {
      desbloqueadaEm: new Date().toISOString()
    };

    salvarConquistas(salvas);
    renderizarSecaoConquistasDashboard();

    if (!silencioso) {
      mostrarToastConquista(conquista);
    }
  }

  window.desbloquearConquistaCodeHelper = desbloquearConquista;

  function sincronizarConquistasExistentes() {
    try {
      if (typeof favoritos !== 'undefined' && favoritos.size > 0) {
        desbloquearConquista('curador_favoritos', true);
      }
      if (typeof historicoChat !== 'undefined' && historicoChat.length > 0) {
        desbloquearConquista('primeiro_chat', true);
      }
      const visitados = localStorage.getItem('codehelper_termos_visitados');
      if (visitados && JSON.parse(visitados).length >= 1) {
        desbloquearConquista('explorador_glossario', true);
      }
      const dominados = obterFlashcardsDominados();
      if (dominados.size > 0) {
        desbloquearConquista('memoria_ativa', true);
      }
    } catch {
      // ignora
    }
  }

  function obterNivelConquistas(total) {
    if (total >= 8) return '🏅 Mestre CodeHelper';
    if (total >= 5) return '🚀 Desenvolvedor Avançado';
    if (total >= 3) return '⚡ Praticante Dedicado';
    if (total >= 1) return '🌱 Aprendiz em Evolução';
    return '👋 Iniciante';
  }

  function criarBotaoEModalConquistas() {
    // Remove eventual seção antiga no dashboard
    document.getElementById('dashboard-secao-conquistas')?.remove();

    // Cria o botão de ícone de troféu fixo no canto superior direito
    if (!document.getElementById('btn-abrir-conquistas-topo')) {
      const btnTrofeu = document.createElement('button');
      btnTrofeu.type = 'button';
      btnTrofeu.id = 'btn-abrir-conquistas-topo';
      btnTrofeu.className = 'tcc-btn-trofeu-topo';
      btnTrofeu.title = 'Ver suas Conquistas de Aprendizado';
      btnTrofeu.setAttribute('aria-label', 'Abrir painel de conquistas');
      btnTrofeu.innerHTML = `
        <span class="tcc-trofeu-icone">🏆</span>
        <span id="tcc-trofeu-contador" class="tcc-trofeu-contador">0/8</span>
      `;
      btnTrofeu.addEventListener('click', abrirModalConquistas);
      document.body.appendChild(btnTrofeu);
    }

    // Cria o modal dedicado de conquistas
    if (!document.getElementById('tcc-conquistas-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'tcc-conquistas-overlay';
      overlay.className = 'tcc-conquistas-overlay';
      overlay.hidden = true;

      overlay.innerHTML = `
        <div class="tcc-conquistas-modal" role="dialog" aria-modal="true" aria-label="Galeria de Conquistas">
          <div class="tcc-conquistas-modal-topo">
            <div class="tcc-conquistas-modal-titulo">
              <span class="tcc-conquistas-modal-trofeu">🏆</span>
              <div>
                <h2>Conquistas de Aprendizado</h2>
                <p id="tcc-conquistas-nivel">Nível: Iniciante</p>
              </div>
            </div>
            <button type="button" class="tcc-conquistas-fechar" id="btn-fechar-conquistas" aria-label="Fechar">×</button>
          </div>

          <div class="tcc-conquistas-modal-progresso">
            <div class="tcc-conquistas-progresso-info">
              <span>Progresso geral na plataforma</span>
              <strong id="tcc-conquistas-progresso-texto">0 de 8 desbloqueadas (0%)</strong>
            </div>
            <div class="tcc-conquistas-barra-trilho">
              <div id="tcc-conquistas-barra-modal" class="tcc-conquistas-barra-preenchimento" style="width: 0%"></div>
            </div>
          </div>

          <div id="tcc-conquistas-modal-grid" class="tcc-conquistas-grid"></div>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fecharModalConquistas();
      });

      document.getElementById('btn-fechar-conquistas')?.addEventListener('click', fecharModalConquistas);
    }
  }

  function abrirModalConquistas() {
    criarBotaoEModalConquistas();
    renderizarSecaoConquistasDashboard();
    const overlay = document.getElementById('tcc-conquistas-overlay');
    if (overlay) overlay.hidden = false;
  }

  function fecharModalConquistas() {
    const overlay = document.getElementById('tcc-conquistas-overlay');
    if (overlay) overlay.hidden = true;
  }

  function renderizarSecaoConquistasDashboard() {
    criarBotaoEModalConquistas();

    const salvas = obterConquistasSalvas();
    const totalDesbloqueadas = CATALOGO_CONQUISTAS.filter((c) => Boolean(salvas[c.id])).length;
    const percentual = Math.round((totalDesbloqueadas / CATALOGO_CONQUISTAS.length) * 100);

    const contadorTopo = document.getElementById('tcc-trofeu-contador');
    if (contadorTopo) {
      contadorTopo.textContent = `${totalDesbloqueadas}/${CATALOGO_CONQUISTAS.length}`;
    }

    const nivelEl = document.getElementById('tcc-conquistas-nivel');
    if (nivelEl) {
      nivelEl.textContent = obterNivelConquistas(totalDesbloqueadas);
    }

    const textoProg = document.getElementById('tcc-conquistas-progresso-texto');
    if (textoProg) {
      textoProg.textContent = `${totalDesbloqueadas} de ${CATALOGO_CONQUISTAS.length} desbloqueadas (${percentual}%)`;
    }

    const barra = document.getElementById('tcc-conquistas-barra-modal');
    if (barra) {
      barra.style.width = `${percentual}%`;
    }

    const grid = document.getElementById('tcc-conquistas-modal-grid');
    if (grid) {
      grid.innerHTML = CATALOGO_CONQUISTAS.map((conquista) => {
        const ativa = Boolean(salvas[conquista.id]);
        return `
          <div class="tcc-conquista-card ${ativa ? 'desbloqueada' : 'bloqueada'}">
            <div class="tcc-conquista-icone">${conquista.icone}</div>
            <div class="tcc-conquista-info">
              <div class="tcc-conquista-linha-titulo">
                <strong>${conquista.titulo}</strong>
                <span class="tcc-conquista-status">${ativa ? '✓ Conquistada' : 'Bloqueada'}</span>
              </div>
              <p>${conquista.descricao}</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  /* ========================================================================
     2. MODO TUTOR SOCRÁTICO & EXPORTAÇÃO DE CONVERSA NO CHAT
     ======================================================================== */
  function configurarBarraSuperiorChat() {
    const painelChat = document.getElementById('painel-chat');
    const chatMensagens = document.getElementById('chat-mensagens');
    if (!painelChat || !chatMensagens || document.getElementById('chat-barra-pedagogica')) {
      return;
    }

    const barra = document.createElement('div');
    barra.id = 'chat-barra-pedagogica';
    barra.className = 'chat-barra-pedagogica';

    barra.innerHTML = `
      <div class="chat-modo-grupo" role="group" aria-label="Modo de ensino da IA">
        <button
          type="button"
          id="btn-modo-direto"
          class="chat-modo-btn ${window.modoChatCodeHelper === 'direto' ? 'ativo' : ''}"
          title="A IA responde diretamente com explicações completas e código corrigido"
        >
          <span class="chat-modo-icone">⚡</span>
          <span>Modo Direto</span>
        </button>

        <button
          type="button"
          id="btn-modo-socratico"
          class="chat-modo-btn ${window.modoChatCodeHelper === 'socratico' ? 'ativo' : ''}"
          title="Método Socrático: a IA atua como mentora fazendo perguntas que estimulam você a descobrir a solução"
        >
          <span class="chat-modo-icone">🎓</span>
          <span>Tutor Socrático</span>
        </button>
      </div>

      <div class="chat-barra-direita">
        <span id="chat-modo-dica" class="chat-modo-dica"></span>

        <button
          type="button"
          id="btn-exportar-chat"
          class="chat-util-btn"
          title="Baixar conversa atual como Caderno de Estudos (.md)"
        >
          <span>📥</span>
          <span>Exportar Estudo (.md)</span>
        </button>
      </div>
    `;

    painelChat.insertBefore(barra, chatMensagens);

    const btnDireto = document.getElementById('btn-modo-direto');
    const btnSocratico = document.getElementById('btn-modo-socratico');
    const btnExportar = document.getElementById('btn-exportar-chat');
    const btnCmd = document.getElementById('btn-abrir-command-chat');

    btnDireto?.addEventListener('click', () => alterarModoChat('direto'));
    btnSocratico?.addEventListener('click', () => alterarModoChat('socratico'));
    btnExportar?.addEventListener('click', exportarConversaMarkdown);
    btnCmd?.addEventListener('click', abrirCommandPalette);

    atualizarUIMoDoChat();
  }

  function alterarModoChat(novoModo) {
    window.modoChatCodeHelper = novoModo === 'socratico' ? 'socratico' : 'direto';
    localStorage.setItem(CHAVE_MODO_CHAT, window.modoChatCodeHelper);
    atualizarUIMoDoChat();

    if (window.modoChatCodeHelper === 'socratico') {
      desbloquearConquista('tutor_socratico');
    }
  }

  function atualizarUIMoDoChat() {
    const btnDireto = document.getElementById('btn-modo-direto');
    const btnSocratico = document.getElementById('btn-modo-socratico');
    const dica = document.getElementById('chat-modo-dica');
    const chatInput = document.getElementById('chat-input');

    const ehSocratico = window.modoChatCodeHelper === 'socratico';

    btnDireto?.classList.toggle('ativo', !ehSocratico);
    btnSocratico?.classList.toggle('ativo', ehSocratico);

    if (dica) {
      dica.textContent = ehSocratico
        ? '🎓 Guia com perguntas reflexivas'
        : '⚡ Respostas diretas';
      dica.classList.toggle('socratico-ativo', ehSocratico);
    }

    if (chatInput) {
      chatInput.placeholder = ehSocratico
        ? 'Modo Tutor Socrático: conte sua dúvida ou cole seu código para raciocinarmos juntos...'
        : 'Pergunte algo ou cole seu código aqui...';
    }
  }

  function exportarConversaMarkdown() {
    const mensagens = typeof historicoChat !== 'undefined' && Array.isArray(historicoChat)
      ? historicoChat
      : [];

    if (mensagens.length === 0) {
      alert('Ainda não há mensagens nesta conversa para exportar. Envie uma pergunta primeiro!');
      return;
    }

    const dataFormatada = new Date().toLocaleString('pt-BR');
    let conteudo = `# 📘 Caderno de Estudos — CodeHelper\n`;
    conteudo += `> Exportado em: ${dataFormatada}\n`;
    conteudo += `> Modo de Ensino: ${window.modoChatCodeHelper === 'socratico' ? 'Tutor Socrático 🎓' : 'Modo Direto ⚡'}\n\n---\n\n`;

    for (let i = 0; i < mensagens.length; i++) {
      const msg = mensagens[i];
      if (msg.role === 'user') {
        conteudo += `## 🧑‍💻 Minha Dúvida\n\n${msg.text}\n\n`;
      } else {
        conteudo += `## 🤖 Resposta do CodeHelper\n\n${msg.text}\n\n---\n\n`;
      }
    }

    const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caderno-estudos-codehelper-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  /* ========================================================================
     3. FLASHCARDS 3D INTERATIVOS NO GLOSSÁRIO
     ======================================================================== */
  let flashcardsAtivos = false;
  let listaFlashcards = [];
  let indiceFlashcard = 0;
  let flashcardVirado = false;
  let filtroFlashcard = 'todos'; // 'todos' | 'favoritos' | 'revisar'

  function obterFlashcardsDominados() {
    try {
      const bruto = localStorage.getItem(CHAVE_FLASHCARDS_DOMINADOS);
      const arr = bruto ? JSON.parse(bruto) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function salvarFlashcardsDominados(conjunto) {
    try {
      localStorage.setItem(CHAVE_FLASHCARDS_DOMINADOS, JSON.stringify(Array.from(conjunto)));
    } catch {
      // ignora
    }
  }

  function configurarFlashcardsGlossario() {
    const painelGlossario = document.getElementById('painel-glossario');
    const inputBusca = document.getElementById('search');
    if (!painelGlossario || !inputBusca || document.getElementById('glossario-barra-estudo')) {
      return;
    }

    const barraTopo = document.createElement('div');
    barraTopo.id = 'glossario-barra-estudo';
    barraTopo.className = 'glossario-barra-estudo';

    barraTopo.innerHTML = `
      <div class="glossario-barra-texto">
        <h2>Glossário de Programação</h2>
        <p>Consulte conceitos fundamentais ou pratique com repetição ativa usando Flashcards 3D.</p>
      </div>
      <div class="glossario-barra-acoes">
        <span id="flashcards-progresso-pill" class="flashcards-progresso-pill">0 dominados</span>
        <button type="button" id="btn-alternar-flashcards" class="botao-principal btn-flashcards-toggle">
          <span>🎴</span>
          <span>Estudar com Flashcards 3D</span>
        </button>
      </div>
    `;

    painelGlossario.insertBefore(barraTopo, inputBusca);

    const containerFlashcards = document.createElement('div');
    containerFlashcards.id = 'flashcards-container';
    containerFlashcards.className = 'flashcards-container';
    containerFlashcards.hidden = true;

    painelGlossario.insertBefore(containerFlashcards, inputBusca);

    document.getElementById('btn-alternar-flashcards')?.addEventListener('click', () => {
      alternarModoFlashcards(!flashcardsAtivos);
    });

    atualizarPillDominados();
  }

  function atualizarPillDominados() {
    const pill = document.getElementById('flashcards-progresso-pill');
    if (!pill) return;
    const dominados = obterFlashcardsDominados();
    const total = typeof TERMOS !== 'undefined' && Array.isArray(TERMOS) ? TERMOS.length : 45;
    pill.textContent = `✓ ${dominados.size}/${total} dominados`;
  }

  function alternarModoFlashcards(ativar) {
    flashcardsAtivos = Boolean(ativar);

    const container = document.getElementById('flashcards-container');
    const inputBusca = document.getElementById('search');
    const filtros = document.getElementById('filtros');
    const lista = document.getElementById('lista');
    const btnToggle = document.getElementById('btn-alternar-flashcards');

    if (!container) return;

    container.hidden = !flashcardsAtivos;
    if (inputBusca) inputBusca.style.display = flashcardsAtivos ? 'none' : '';
    if (filtros) filtros.style.display = flashcardsAtivos ? 'none' : '';
    if (lista) lista.style.display = flashcardsAtivos ? 'none' : '';

    if (btnToggle) {
      btnToggle.innerHTML = flashcardsAtivos
        ? '<span>📖</span><span>Voltar à Lista do Glossário</span>'
        : '<span>🎴</span><span>Estudar com Flashcards 3D</span>';
    }

    if (flashcardsAtivos) {
      desbloquearConquista('memoria_ativa');
      montarBaralhoFlashcards();
      renderizarFlashcardAtual();
    }
  }

  function montarBaralhoFlashcards() {
    const todos = typeof TERMOS !== 'undefined' && Array.isArray(TERMOS) ? [...TERMOS] : [];
    const dominados = obterFlashcardsDominados();

    if (filtroFlashcard === 'favoritos') {
      const favs = typeof favoritos !== 'undefined' ? favoritos : new Set();
      listaFlashcards = todos.filter((t) => favs.has(t.name));
    } else if (filtroFlashcard === 'revisar') {
      listaFlashcards = todos.filter((t) => !dominados.has(t.name));
    } else {
      listaFlashcards = todos;
    }

    indiceFlashcard = 0;
    flashcardVirado = false;
  }

  function escaparTextoSeguro(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function renderizarFlashcardAtual() {
    const container = document.getElementById('flashcards-container');
    if (!container) return;

    const dominados = obterFlashcardsDominados();
    const totalBaralho = listaFlashcards.length;

    if (totalBaralho === 0) {
      container.innerHTML = `
        <div class="flashcards-topo-controles">
          <div class="flashcards-filtros">
            <button type="button" class="chip ${filtroFlashcard === 'todos' ? 'ativo' : ''}" data-fc-filtro="todos">Todos os termos</button>
            <button type="button" class="chip ${filtroFlashcard === 'revisar' ? 'ativo' : ''}" data-fc-filtro="revisar">Pendentes de domínio</button>
            <button type="button" class="chip ${filtroFlashcard === 'favoritos' ? 'ativo' : ''}" data-fc-filtro="favoritos">★ Apenas Favoritos</button>
          </div>
        </div>
        <div class="flashcards-vazio">
          <h3>Nenhum termo neste filtro</h3>
          <p>${filtroFlashcard === 'favoritos' ? 'Favorite alguns termos no glossário para estudá-los aqui!' : 'Parabéns! Você já marcou todos os termos como dominados.'}</p>
          <button type="button" class="botao-principal" id="btn-fc-reset-filtro">Ver todos os termos</button>
        </div>
      `;

      container.querySelectorAll('[data-fc-filtro]').forEach((btn) => {
        btn.addEventListener('click', () => {
          filtroFlashcard = btn.dataset.fcFiltro;
          montarBaralhoFlashcards();
          renderizarFlashcardAtual();
        });
      });

      document.getElementById('btn-fc-reset-filtro')?.addEventListener('click', () => {
        filtroFlashcard = 'todos';
        montarBaralhoFlashcards();
        renderizarFlashcardAtual();
      });
      return;
    }

    if (indiceFlashcard >= totalBaralho) indiceFlashcard = 0;
    if (indiceFlashcard < 0) indiceFlashcard = totalBaralho - 1;

    const termo = listaFlashcards[indiceFlashcard];
    const jaDominado = dominados.has(termo.name);
    const percentual = Math.round(((indiceFlashcard + 1) / totalBaralho) * 100);

    container.innerHTML = `
      <div class="flashcards-topo-controles">
        <div class="flashcards-filtros">
          <button type="button" class="chip ${filtroFlashcard === 'todos' ? 'ativo' : ''}" data-fc-filtro="todos">Todos (${typeof TERMOS !== 'undefined' ? TERMOS.length : 0})</button>
          <button type="button" class="chip ${filtroFlashcard === 'revisar' ? 'ativo' : ''}" data-fc-filtro="revisar">Para revisar</button>
          <button type="button" class="chip ${filtroFlashcard === 'favoritos' ? 'ativo' : ''}" data-fc-filtro="favoritos">★ Favoritos</button>
        </div>

        <div class="flashcards-contador-area">
          <span>Cartão <strong>${indiceFlashcard + 1}</strong> de <strong>${totalBaralho}</strong></span>
          <button type="button" class="chip" id="btn-fc-embaralhar" title="Embaralhar ordem dos cartões">🔀 Embaralhar</button>
        </div>
      </div>

      <div class="flashcards-barra-progresso">
        <div class="flashcards-barra-preenchimento" style="width: ${percentual}%"></div>
      </div>

      <div class="flashcard-cena" id="flashcard-cena" tabindex="0" role="button" aria-label="Cartão de estudo. Clique ou aperte Espaço para virar">
        <div class="flashcard-objeto ${flashcardVirado ? 'virado' : ''}" id="flashcard-objeto">
          
          <!-- FRENTE DO CARTÃO -->
          <div class="flashcard-face flashcard-frente">
            <div class="flashcard-face-topo">
              <span class="flashcard-badge-cat">${escaparTextoSeguro(termo.tagLabel || termo.cat || 'Conceito')}</span>
              ${jaDominado ? '<span class="flashcard-badge-dominado">✓ Dominado</span>' : '<span class="flashcard-badge-estudo">Em estudo</span>'}
            </div>

            <div class="flashcard-centro">
              <span class="flashcard-label-pergunta">CONCEITO DE PROGRAMAÇÃO</span>
              <h3 class="flashcard-titulo-termo">${escaparTextoSeguro(termo.name)}</h3>
              <p class="flashcard-desafio">Tente explicar mentalmente o que é e quando usar antes de virar o cartão.</p>
            </div>

            <div class="flashcard-rodape-dica">
              <span>👆 Clique no cartão ou pressione <kbd>Espaço</kbd> para revelar a resposta</span>
            </div>
          </div>

          <!-- VERSO DO CARTÃO -->
          <div class="flashcard-face flashcard-verso">
            <div class="flashcard-face-topo">
              <strong class="flashcard-verso-nome">${escaparTextoSeguro(termo.name)}</strong>
              <span class="flashcard-badge-cat">${escaparTextoSeguro(termo.tagLabel || termo.cat || 'Conceito')}</span>
            </div>

            <div class="flashcard-verso-conteudo">
              <p class="flashcard-definicao">${escaparTextoSeguro(termo.desc)}</p>
              ${termo.code ? `<pre class="flashcard-codigo"><code>${escaparTextoSeguro(termo.code)}</code></pre>` : ''}
              ${termo.tip ? `<div class="flashcard-dica"><strong>💡 Dica:</strong> ${escaparTextoSeguro(termo.tip)}</div>` : ''}
            </div>

            <div class="flashcard-rodape-dica">
              <span>Clique novamente para voltar à frente</span>
            </div>
          </div>

        </div>
      </div>

      <div class="flashcards-acoes-inferiores">
        <button type="button" class="flashcard-btn-nav" id="btn-fc-anterior">← Anterior</button>

        <div class="flashcards-autoavaliacao">
          <button type="button" class="flashcard-btn-revisar" id="btn-fc-revisar" title="Marcar para revisar novamente">
            🔄 Ainda aprendendo
          </button>
          <button type="button" class="flashcard-btn-dominei" id="btn-fc-dominei" title="Marcar conceito como dominado">
            ✅ Já domino!
          </button>
        </div>

        <button type="button" class="flashcard-btn-nav" id="btn-fc-proximo">Próximo →</button>
      </div>
    `;

    container.querySelectorAll('[data-fc-filtro]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filtroFlashcard = btn.dataset.fcFiltro;
        montarBaralhoFlashcards();
        renderizarFlashcardAtual();
      });
    });

    document.getElementById('flashcard-cena')?.addEventListener('click', () => {
      flashcardVirado = !flashcardVirado;
      document.getElementById('flashcard-objeto')?.classList.toggle('virado', flashcardVirado);
    });

    document.getElementById('btn-fc-anterior')?.addEventListener('click', () => {
      indiceFlashcard--;
      flashcardVirado = false;
      renderizarFlashcardAtual();
    });

    document.getElementById('btn-fc-proximo')?.addEventListener('click', () => {
      indiceFlashcard++;
      flashcardVirado = false;
      renderizarFlashcardAtual();
    });

    document.getElementById('btn-fc-embaralhar')?.addEventListener('click', () => {
      listaFlashcards.sort(() => Math.random() - 0.5);
      indiceFlashcard = 0;
      flashcardVirado = false;
      renderizarFlashcardAtual();
    });

    document.getElementById('btn-fc-dominei')?.addEventListener('click', () => {
      const dom = obterFlashcardsDominados();
      dom.add(termo.name);
      salvarFlashcardsDominados(dom);
      atualizarPillDominados();
      indiceFlashcard++;
      flashcardVirado = false;
      renderizarFlashcardAtual();
    });

    document.getElementById('btn-fc-revisar')?.addEventListener('click', () => {
      const dom = obterFlashcardsDominados();
      dom.delete(termo.name);
      salvarFlashcardsDominados(dom);
      atualizarPillDominados();
      indiceFlashcard++;
      flashcardVirado = false;
      renderizarFlashcardAtual();
    });
  }

  /* ========================================================================
     4. COMPARADOR VISUAL DE CÓDIGO (DIFF ANTES × DEPOIS) NO ANALISADOR
     ======================================================================== */
  function calcularDiffLinhas(codigoOriginal, codigoSugerido) {
    const linhasA = String(codigoOriginal || '').replace(/\r\n/g, '\n').split('\n');
    const linhasB = String(codigoSugerido || '').replace(/\r\n/g, '\n').split('\n');

    const resultado = [];
    const maxLen = Math.max(linhasA.length, linhasB.length);

    let i = 0;
    let j = 0;

    while (i < linhasA.length || j < linhasB.length) {
      const linhaOriginal = i < linhasA.length ? linhasA[i] : null;
      const linhaNova = j < linhasB.length ? linhasB[j] : null;

      if (linhaOriginal !== null && linhaNova !== null && linhaOriginal.trim() === linhaNova.trim()) {
        resultado.push({ tipo: 'igual', texto: linhaNova, numA: i + 1, numB: j + 1 });
        i++;
        j++;
      } else if (
        linhaOriginal !== null &&
        linhaNova !== null &&
        i + 1 < linhasA.length &&
        linhasA[i + 1].trim() === linhaNova.trim()
      ) {
        resultado.push({ tipo: 'removida', texto: linhaOriginal, numA: i + 1, numB: '' });
        i++;
      } else if (
        linhaOriginal !== null &&
        linhaNova !== null &&
        j + 1 < linhasB.length &&
        linhaOriginal.trim() === linhasB[j + 1].trim()
      ) {
        resultado.push({ tipo: 'adicionada', texto: linhaNova, numA: '', numB: j + 1 });
        j++;
      } else {
        if (linhaOriginal !== null) {
          resultado.push({ tipo: 'removida', texto: linhaOriginal, numA: i + 1, numB: '' });
          i++;
        }
        if (linhaNova !== null) {
          resultado.push({ tipo: 'adicionada', texto: linhaNova, numA: '', numB: j + 1 });
          j++;
        }
      }

      if (resultado.length > maxLen * 3 + 200) break;
    }

    return resultado;
  }

  function configurarDiffAnalisador() {
    const analisadorResultado = document.getElementById('analisador-resultado');
    const analisadorCodigo = document.getElementById('analisador-codigo');
    const btnAnalisar = document.getElementById('btn-analisar-codigo');

    if (!analisadorResultado || !analisadorCodigo) return;

    btnAnalisar?.addEventListener('click', () => {
      if (analisadorCodigo.value.trim()) {
        desbloquearConquista('auditor_codigo');
      }
    });

    const observer = new MutationObserver(() => {
      // Só injeta a barra de Diff quando a análise terminou (botão analisar habilitado novamente)
      if (btnAnalisar && btnAnalisar.disabled) return;

      const blocosCodigo = analisadorResultado.querySelectorAll('pre code');
      if (blocosCodigo.length === 0) return;
      if (analisadorResultado.querySelector('.analisador-diff-toolbar')) return;

      // Escolhe o maior bloco de código sugerido pela IA como versão corrigida principal
      let melhorBloco = blocosCodigo[0];
      blocosCodigo.forEach((bloco) => {
        if ((bloco.textContent || '').trim().length > (melhorBloco.textContent || '').trim().length) {
          melhorBloco = bloco;
        }
      });

      const codigoSugerido = (melhorBloco.textContent || '').trim();
      const codigoOriginal = analisadorCodigo.value.trim();

      if (!codigoSugerido || !codigoOriginal) return;

      const toolbar = document.createElement('div');
      toolbar.className = 'analisador-diff-toolbar';
      toolbar.innerHTML = `
        <div class="analisador-diff-info">
          <span>✨ <strong>Sugestão de código detectada</strong></span>
          <small>Compare as alterações linha a linha com o seu código original</small>
        </div>
        <div class="analisador-diff-botoes">
          <button type="button" class="analisador-btn-diff" id="btn-toggle-diff-visual">
            🔀 Comparar Antes × Depois (Diff)
          </button>
          <button type="button" class="analisador-btn-aplicar" id="btn-aplicar-sugestao">
            ✓ Aplicar no Editor
          </button>
        </div>
      `;

      const containerDiff = document.createElement('div');
      containerDiff.className = 'analisador-diff-container';
      containerDiff.hidden = true;

      analisadorResultado.insertAdjacentElement('afterbegin', containerDiff);
      analisadorResultado.insertAdjacentElement('afterbegin', toolbar);

      const btnToggleDiff = toolbar.querySelector('#btn-toggle-diff-visual');
      const btnAplicar = toolbar.querySelector('#btn-aplicar-sugestao');

      btnToggleDiff?.addEventListener('click', () => {
        const aberto = !containerDiff.hidden;
        if (aberto) {
          containerDiff.hidden = true;
          btnToggleDiff.textContent = '🔀 Comparar Antes × Depois (Diff)';
          return;
        }

        const linhasDiff = calcularDiffLinhas(analisadorCodigo.value.trim(), codigoSugerido);
        const adicionadas = linhasDiff.filter((l) => l.tipo === 'adicionada').length;
        const removidas = linhasDiff.filter((l) => l.tipo === 'removida').length;

        containerDiff.innerHTML = `
          <div class="diff-cabecalho">
            <span class="diff-titulo">Comparação Visual (Estilo Git Diff)</span>
            <div class="diff-estatisticas">
              <span class="diff-stat-rem">− ${removidas} removidas</span>
              <span class="diff-stat-add">+ ${adicionadas} adicionadas</span>
            </div>
          </div>
          <div class="diff-tabela" role="region" aria-label="Diferenças de código">
            ${linhasDiff.map((linha) => {
              const simbolo = linha.tipo === 'adicionada' ? '+' : linha.tipo === 'removida' ? '−' : ' ';
              return `
                <div class="diff-linha diff-${linha.tipo}">
                  <span class="diff-num">${linha.numA || ''}</span>
                  <span class="diff-num">${linha.numB || ''}</span>
                  <span class="diff-sinal">${simbolo}</span>
                  <span class="diff-codigo">${escaparTextoSeguro(linha.texto) || ' '}</span>
                </div>
              `;
            }).join('')}
          </div>
        `;

        containerDiff.hidden = false;
        btnToggleDiff.textContent = '🔼 Ocultar Comparação Diff';
      });

      btnAplicar?.addEventListener('click', () => {
        analisadorCodigo.value = codigoSugerido;
        analisadorCodigo.dispatchEvent(new Event('input'));
        btnAplicar.textContent = '✓ Código Aplicado!';
        setTimeout(() => {
          btnAplicar.textContent = '✓ Aplicar no Editor';
        }, 2000);
      });
    });

    observer.observe(analisadorResultado, {
      childList: true,
      subtree: true
    });
  }

  /* ========================================================================
     5. COMMAND PALETTE GLOBAL (CTRL + K / CMD + K)
     ======================================================================== */
  let modalCommand = null;
  let inputCommand = null;
  let listaCommand = null;
  let itensCommandFiltrados = [];
  let indiceCommandAtivo = 0;

  function criarModalCommandPalette() {
    if (document.getElementById('tcc-command-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'tcc-command-overlay';
    overlay.className = 'tcc-command-overlay';
    overlay.hidden = true;

    overlay.innerHTML = `
      <div class="tcc-command-modal" role="dialog" aria-modal="true" aria-label="Paleta de Comandos Rápidos">
        <div class="tcc-command-busca-topo">
          <span class="tcc-command-lupa">🔎</span>
          <input
            type="text"
            id="tcc-command-input"
            class="tcc-command-input"
            placeholder="Digite um comando, ferramenta ou termo do glossário..."
            autocomplete="off"
          />
          <kbd class="tcc-command-esc" id="btn-fechar-command">ESC</kbd>
        </div>

        <div id="tcc-command-lista" class="tcc-command-lista" role="listbox"></div>

        <div class="tcc-command-rodape">
          <span><kbd>↑</kbd> <kbd>↓</kbd> para navegar</span>
          <span><kbd>Enter</kbd> para executar</span>
          <span><kbd>Esc</kbd> para fechar</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    modalCommand = overlay;
    inputCommand = document.getElementById('tcc-command-input');
    listaCommand = document.getElementById('tcc-command-lista');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharCommandPalette();
    });

    document.getElementById('btn-fechar-command')?.addEventListener('click', fecharCommandPalette);

    inputCommand?.addEventListener('input', () => {
      indiceCommandAtivo = 0;
      atualizarListaCommandPalette(inputCommand.value);
    });

    inputCommand?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (itensCommandFiltrados.length > 0) {
          indiceCommandAtivo = (indiceCommandAtivo + 1) % itensCommandFiltrados.length;
          renderizarItensCommandPalette();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (itensCommandFiltrados.length > 0) {
          indiceCommandAtivo = (indiceCommandAtivo - 1 + itensCommandFiltrados.length) % itensCommandFiltrados.length;
          renderizarItensCommandPalette();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = itensCommandFiltrados[indiceCommandAtivo];
        if (item && typeof item.acao === 'function') {
          fecharCommandPalette();
          item.acao();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        fecharCommandPalette();
      }
    });

    // Atalho Ctrl+K funciona globalmente sem poluir a sidebar
  }

  function navegarParaAba(nomeAba) {
    const btn = document.querySelector(`.aba-btn[data-aba="${nomeAba}"]`);
    btn?.click();
  }

  function obterCatalogoComandos() {
    const comandosBase = [
      {
        icone: '🎓',
        titulo: 'Ativar Modo Tutor Socrático no Chat',
        subtitulo: 'Pedagogia • A IA faz perguntas orientadoras sem dar o código pronto',
        acao: () => {
          navegarParaAba('chat');
          alterarModoChat('socratico');
        }
      },
      {
        icone: '⚡',
        titulo: 'Ativar Modo Direto no Chat',
        subtitulo: 'Chat • Respostas diretas e código completo imediato',
        acao: () => {
          navegarParaAba('chat');
          alterarModoChat('direto');
        }
      },
      {
        icone: '🎴',
        titulo: 'Praticar com Flashcards 3D',
        subtitulo: 'Estudo Ativo • Memorize conceitos do glossário com repetição espaçada',
        acao: () => {
          navegarParaAba('glossario');
          alternarModoFlashcards(true);
        }
      },
      {
        icone: '💬',
        titulo: 'Nova Conversa com IA',
        subtitulo: 'Chat • Iniciar um tópico em branco',
        acao: () => {
          document.getElementById('btn-nova-conversa')?.click();
        }
      },
      {
        icone: '🔍',
        titulo: 'Ir para Analisador de Código (com Diff)',
        subtitulo: 'Ferramenta • Diagnosticar erros e comparar Antes × Depois',
        acao: () => navegarParaAba('analisador')
      },
      {
        icone: '💻',
        titulo: 'Ir para Playground JavaScript',
        subtitulo: 'Prática • Executar código JS diretamente no navegador',
        acao: () => navegarParaAba('playground')
      },
      {
        icone: '🏆',
        titulo: 'Ir para Quiz de Programação',
        subtitulo: 'Avaliação • Testar seus conhecimentos',
        acao: () => navegarParaAba('quiz')
      },
      {
        icone: '🏆',
        titulo: 'Abrir Minhas Conquistas',
        subtitulo: 'Gamificação • Ver medalhas desbloqueadas e seu nível',
        acao: () => abrirModalConquistas()
      },
      {
        icone: '🏠',
        titulo: 'Ir para Início (Dashboard)',
        subtitulo: 'Visão Geral • Estatísticas de estudo e atalhos',
        acao: () => navegarParaAba('inicio')
      },
      {
        icone: '📥',
        titulo: 'Exportar Conversa Atual (.md)',
        subtitulo: 'Caderno de Estudos • Baixar resumo em Markdown',
        acao: () => exportarConversaMarkdown()
      },
      {
        icone: '🌗',
        titulo: 'Alternar Tema Claro / Escuro',
        subtitulo: 'Aparência • Mudar esquema visual da plataforma',
        acao: () => {
          const toggle = document.getElementById('toggle-tema');
          if (toggle) {
            toggle.checked = !toggle.checked;
            toggle.dispatchEvent(new Event('change'));
          }
        }
      }
    ];

    const termosLista = typeof TERMOS !== 'undefined' && Array.isArray(TERMOS) ? TERMOS : [];
    const comandosTermos = termosLista.map((termo) => ({
      icone: '📖',
      titulo: `Conceito: ${termo.name}`,
      subtitulo: `Glossário (${termo.tagLabel || termo.cat}) • ${termo.desc}`,
      acao: () => {
        navegarParaAba('glossario');
        if (flashcardsAtivos) alternarModoFlashcards(false);
        if (typeof abrirTermoRelacionado === 'function') {
          abrirTermoRelacionado(termo.name);
        }
      }
    }));

    return [...comandosBase, ...comandosTermos];
  }

  function atualizarListaCommandPalette(termoBusca = '') {
    const todos = obterCatalogoComandos();
    const q = String(termoBusca || '').trim().toLowerCase();

    if (!q) {
      itensCommandFiltrados = todos.slice(0, 14);
    } else {
      itensCommandFiltrados = todos
        .filter((item) =>
          item.titulo.toLowerCase().includes(q) ||
          item.subtitulo.toLowerCase().includes(q)
        )
        .slice(0, 18);
    }

    renderizarItensCommandPalette();
  }

  function renderizarItensCommandPalette() {
    if (!listaCommand) return;

    if (itensCommandFiltrados.length === 0) {
      listaCommand.innerHTML = `
        <div class="tcc-command-vazio">
          Nenhum comando ou termo encontrado para essa busca.
        </div>
      `;
      return;
    }

    listaCommand.innerHTML = itensCommandFiltrados.map((item, idx) => `
      <button
        type="button"
        class="tcc-command-item ${idx === indiceCommandAtivo ? 'ativo' : ''}"
        data-cmd-index="${idx}"
        role="option"
        aria-selected="${idx === indiceCommandAtivo}"
      >
        <span class="tcc-command-item-icone">${item.icone}</span>
        <div class="tcc-command-item-texto">
          <strong>${escaparTextoSeguro(item.titulo)}</strong>
          <span>${escaparTextoSeguro(item.subtitulo)}</span>
        </div>
        <span class="tcc-command-item-enter">↵</span>
      </button>
    `).join('');

    listaCommand.querySelectorAll('.tcc-command-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.cmdIndex);
        const item = itensCommandFiltrados[idx];
        if (item && typeof item.acao === 'function') {
          fecharCommandPalette();
          item.acao();
        }
      });
    });

    const itemAtivoEl = listaCommand.querySelector('.tcc-command-item.ativo');
    itemAtivoEl?.scrollIntoView({ block: 'nearest' });
  }

  function abrirCommandPalette() {
    criarModalCommandPalette();
    if (!modalCommand) return;

    modalCommand.hidden = false;
    indiceCommandAtivo = 0;
    if (inputCommand) {
      inputCommand.value = '';
      atualizarListaCommandPalette('');
      setTimeout(() => inputCommand.focus(), 20);
    }
  }

  function fecharCommandPalette() {
    if (!modalCommand) return;
    modalCommand.hidden = true;
  }

  /* ========================================================================
     6. MONITORAMENTO DE EVENTOS GLOBAIS E ATALHOS
     ======================================================================== */
  function configurarMonitoramentoEventos() {
    // Atalho global Ctrl+K ou Cmd+K e atalhos dos Flashcards
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const ovConq = document.getElementById('tcc-conquistas-overlay');
        if (ovConq && !ovConq.hidden) {
          fecharModalConquistas();
          return;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (modalCommand && !modalCommand.hidden) {
          fecharCommandPalette();
        } else {
          abrirCommandPalette();
        }
        return;
      }

      // Atalhos nos Flashcards quando o painel glossário está ativo e flashcards abertos
      const painelGlossario = document.getElementById('painel-glossario');
      const tagAtiva = document.activeElement?.tagName;
      const digitando = tagAtiva === 'INPUT' || tagAtiva === 'TEXTAREA' || tagAtiva === 'SELECT';

      if (
        flashcardsAtivos &&
        painelGlossario?.classList.contains('ativo') &&
        !digitando &&
        (!modalCommand || modalCommand.hidden)
      ) {
        if (e.code === 'Space') {
          e.preventDefault();
          flashcardVirado = !flashcardVirado;
          document.getElementById('flashcard-objeto')?.classList.toggle('virado', flashcardVirado);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          indiceFlashcard++;
          flashcardVirado = false;
          renderizarFlashcardAtual();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          indiceFlashcard--;
          flashcardVirado = false;
          renderizarFlashcardAtual();
        }
      }
    });

    // Monitorar envio de mensagens no Chat para desbloquear conquistas
    document.getElementById('chat-form')?.addEventListener('submit', () => {
      desbloquearConquista('primeiro_chat');
      if (window.modoChatCodeHelper === 'socratico') {
        desbloquearConquista('tutor_socratico');
      }
    });

    // Monitorar clique no Playground
    document.getElementById('btn-executar-codigo')?.addEventListener('click', () => {
      desbloquearConquista('mao_na_massa');
    });

    // Monitorar início do Quiz
    document.getElementById('btn-iniciar-quiz')?.addEventListener('click', () => {
      desbloquearConquista('mestre_quiz');
    });

    // Monitorar abertura de cards ou favoritos no Glossário
    document.getElementById('lista')?.addEventListener('click', (e) => {
      if (e.target.closest('.btn-favorito')) {
        desbloquearConquista('curador_favoritos');
      } else if (e.target.closest('.card')) {
        desbloquearConquista('explorador_glossario');
      }
    });
  }


  /* ========================================================================
     7. ORGANIZAÇÃO VISUAL CLEAN (DASHBOARD, SIDEBAR, SOBRE E CONFIGURAÇÕES)
     ======================================================================== */
  const CHAVE_PREFS_USUARIO = 'codehelper_preferencias_usuario_v1';

  function obterPrefsUsuario() {
    try {
      const salvo = localStorage.getItem(CHAVE_PREFS_USUARIO);
      return salvo ? JSON.parse(salvo) : {};
    } catch {
      return {};
    }
  }

  function salvarPrefsUsuario(novasPrefs) {
    try {
      const atuais = obterPrefsUsuario();
      const mesclado = { ...atuais, ...novasPrefs };
      localStorage.setItem(CHAVE_PREFS_USUARIO, JSON.stringify(mesclado));
      return mesclado;
    } catch {
      return novasPrefs;
    }
  }

  // 7.1. Dashboard Clean: mantém todos os blocos visíveis sem barra de sub-abas
  function configurarDashboardLimpo() {
    document.getElementById('dashboard-subabas')?.remove();
  }

  // 7.2. Sidebar Clean & Modo Barra Compacta (Estilo Gemini Rail)
  function configurarSidebarLimpa() {
    const sidebar = document.querySelector('.sidebar-principal');
    const sidebarTopo = document.querySelector('.sidebar-topo');
    const marca = document.querySelector('.brand');
    const btnNovaConversa = document.getElementById('btn-nova-conversa');
    const nav = document.querySelector('.sidebar-nav');
    const secaoConversas = document.getElementById('secao-conversas');
    const tituloConversas = secaoConversas?.querySelector('.sidebar-secao-label, .conversas-titulo');
    const listaConversas = document.getElementById('lista-conversas');
    if (!sidebar) return;

    if (sidebar.dataset.cleanConfigurado === 'true') return;
    sidebar.dataset.cleanConfigurado = 'true';

    function definirSidebarRecolhida(recolher) {
      document.body.classList.toggle('sidebar-recolhida', Boolean(recolher));
      sidebar.classList.toggle('recolhida', Boolean(recolher));
      const btnToggle = document.getElementById('btn-toggle-sidebar');
      if (btnToggle) {
        btnToggle.title = recolher
          ? 'Expandir barra lateral'
          : 'Recolher barra lateral (Modo Gemini compacto)';
        btnToggle.setAttribute('aria-expanded', String(!recolher));
      }
    }

    window.alternarSidebarCodeHelper = () => {
      definirSidebarRecolhida(!document.body.classList.contains('sidebar-recolhida'));
    };

    // 1. Topo da Sidebar: Cabeçalho com Brand + Botão Circular de Recolher (Estilo Gemini)
    if (sidebarTopo && marca && !document.getElementById('btn-toggle-sidebar')) {
      const linhaTopo = document.createElement('div');
      linhaTopo.className = 'sidebar-topo-linha';

      const btnToggle = document.createElement('button');
      btnToggle.type = 'button';
      btnToggle.id = 'btn-toggle-sidebar';
      btnToggle.className = 'btn-toggle-sidebar-gemini';
      btnToggle.title = 'Alternar barra lateral — CodeHelper';
      btnToggle.setAttribute('aria-label', 'Alternar barra lateral');
      btnToggle.innerHTML = `
        <span class="icone-codehelper-logo" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
            <path d="M10.5 11L5.5 16L10.5 21M21.5 11L26.5 16L21.5 21M18 9.5L14 22.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;
      btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        window.alternarSidebarCodeHelper();
      });

      sidebarTopo.insertBefore(linhaTopo, marca);
      linhaTopo.appendChild(btnToggle);
      linhaTopo.appendChild(marca);
    }

    // 2. Ícone de Nova Conversa estilo Compose (Lápis no quadrado igual ao Gemini)
    if (btnNovaConversa) {
      btnNovaConversa.title = 'Nova conversa (Alt + N)';
      btnNovaConversa.innerHTML = `
        <span class="nova-conversa-icone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
          </svg>
        </span>
        <span class="nova-conversa-texto">Nova conversa</span>
        <span class="nova-conversa-atalho">Alt N</span>
      `;
      btnNovaConversa.addEventListener('click', () => {
        if (window.innerWidth > 900) {
          definirSidebarRecolhida(true);
        }
      });
    }

    // 3. Botão de Busca Rápida (Lupa) abaixo de Nova Conversa
    if (sidebarTopo && !document.getElementById('btn-sidebar-busca-rail')) {
      const btnBuscaRail = document.createElement('button');
      btnBuscaRail.type = 'button';
      btnBuscaRail.id = 'btn-sidebar-busca-rail';
      btnBuscaRail.className = 'btn-sidebar-busca-rail';
      btnBuscaRail.title = 'Buscar conceitos e ferramentas (Ctrl + K)';
      btnBuscaRail.innerHTML = `
        <span class="rail-busca-icone">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        <span class="rail-busca-texto">Buscar</span>
        <span class="nova-conversa-atalho">Ctrl K</span>
      `;
      btnBuscaRail.addEventListener('click', () => {
        abrirCommandPalette();
      });
      sidebarTopo.appendChild(btnBuscaRail);
    }

    // 4. Atualiza ícone de Início para grade 4 quadrados (estilo Gemini) e garante tooltips nas abas
    const btnInicio = document.querySelector('.aba-btn[data-aba="inicio"] .nav-icone');
    if (btnInicio) {
      btnInicio.innerHTML = `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>`;
    }
    document.querySelectorAll('.aba-btn').forEach((btn) => {
      const txt = btn.querySelector('.nav-texto')?.textContent?.trim() || btn.textContent.trim();
      if (txt) btn.title = txt;
    });

    function definirRecolhido(recolher) {
      secaoConversas?.classList.toggle('historico-recolhido', recolher);
    }

    // 5. Ícones utilitários da barra recolhida: Histórico (Relógio) e Configurações (Hexágono)
    if (nav && !document.getElementById('sidebar-rail-extras')) {
      const railExtras = document.createElement('div');
      railExtras.id = 'sidebar-rail-extras';
      railExtras.className = 'sidebar-rail-extras';
      railExtras.innerHTML = `
        <button type="button" id="btn-rail-historico" class="rail-extra-btn" title="Ver Histórico de Conversas">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
          </svg>
        </button>
        <button type="button" id="btn-rail-config" class="rail-extra-btn" title="Personalização e Configurações">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2 19.5 6.3v8.7L12 19.3 4.5 15V6.3L12 2Z"/>
            <circle cx="12" cy="10.7" r="2.6"/>
          </svg>
        </button>
      `;
      nav.insertAdjacentElement('afterend', railExtras);

      document.getElementById('btn-rail-historico')?.addEventListener('click', () => {
        definirSidebarRecolhida(false);
        definirRecolhido(false);
        const abaChat = document.querySelector('.aba-btn[data-aba="chat"]');
        if (abaChat && !abaChat.classList.contains('ativo')) {
          window.__abrindoConversaSalva = true;
          abaChat.click();
          setTimeout(() => { window.__abrindoConversaSalva = false; }, 100);
        }
        secaoConversas?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      document.getElementById('btn-rail-config')?.addEventListener('click', () => {
        if (typeof window.abrirSecaoConfigEspecifica === 'function') {
          window.abrirSecaoConfigEspecifica('personalizacao');
        } else {
          document.querySelector('.aba-btn[data-aba="config"]')?.click();
        }
      });
    }

    // 6. Botão na barra superior fixa do Chat para recolher/expandir a barra lateral
    const barraChat = document.getElementById('chat-barra-pedagogica');
    const grupoModoChat = barraChat?.querySelector('.chat-modo-grupo');
    if (barraChat && grupoModoChat && !document.getElementById('btn-chat-toggle-sidebar')) {
      const wrapperEsquerda = document.createElement('div');
      wrapperEsquerda.className = 'chat-barra-esquerda';
      wrapperEsquerda.style.display = 'inline-flex';
      wrapperEsquerda.style.alignItems = 'center';
      wrapperEsquerda.style.gap = '10px';

      const btnChatSidebar = document.createElement('button');
      btnChatSidebar.type = 'button';
      btnChatSidebar.id = 'btn-chat-toggle-sidebar';
      btnChatSidebar.className = 'btn-chat-toggle-sidebar';
      btnChatSidebar.title = 'Expandir ou recolher barra lateral';
      btnChatSidebar.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 3v18"/>
        </svg>
      `;
      btnChatSidebar.addEventListener('click', () => {
        window.alternarSidebarCodeHelper();
      });

      barraChat.insertBefore(wrapperEsquerda, grupoModoChat);
      wrapperEsquerda.appendChild(btnChatSidebar);
      wrapperEsquerda.appendChild(grupoModoChat);
    }

    if (tituloConversas) {
      tituloConversas.classList.add('conversas-titulo-toggle');
      tituloConversas.setAttribute('role', 'button');
      tituloConversas.setAttribute('tabindex', '0');
      tituloConversas.title = 'Mostrar ou ocultar histórico de conversas';
      tituloConversas.innerHTML = `
        <span>Histórico de chats</span>
        <span class="conversas-seta-toggle">▾</span>
      `;
      tituloConversas.addEventListener('click', () => {
        definirRecolhido(!secaoConversas?.classList.contains('historico-recolhido'));
      });
    }

    // Por padrão no Início fica recolhido para deixar a barra lateral limpa
    definirRecolhido(true);

    // Ao clicar em uma conversa salva no histórico do Chat, recolhe a sidebar para o modo Gemini Rail
    listaConversas?.addEventListener('click', (evento) => {
      if (evento.target.closest('.btn-excluir-conversa')) return;
      if (evento.target.closest('.conversa-acoes-hover')) return;
      const item = evento.target.closest('.item-conversa');
      if (item && window.innerWidth > 900) {
        definirSidebarRecolhida(true);
      }
    });

    // Quando o usuário abre a aba Chat, transforma a sidebar na barra compacta estilo Gemini
    document.querySelectorAll('.aba-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.aba === 'chat') {
          definirRecolhido(false);
          if (window.innerWidth > 900) {
            definirSidebarRecolhida(true);
          }
        } else {
          definirRecolhido(true);
        }
      });
    });
  }

  // 7.3. Abas da página "Sobre o CodeHelper" (Apresentação TCC)
  function configurarAbasSobre() {
    const painelSobre = document.getElementById('painel-sobre');
    if (!painelSobre) return;

    const botoes = painelSobre.querySelectorAll('[data-sobre-aba]');
    const paineis = painelSobre.querySelectorAll('[data-sobre-painel]');

    botoes.forEach((btn) => {
      btn.addEventListener('click', () => {
        const alvo = btn.dataset.sobreAba;

        botoes.forEach((b) => b.classList.toggle('ativo', b === btn));

        paineis.forEach((p) => {
          const mostrar = alvo === 'tudo' || p.dataset.sobrePainel === alvo;
          p.hidden = !mostrar;
          p.classList.toggle('ativo', mostrar);
        });
      });
    });
  }

  // 7.4. Abas e Controles de Perfil, Personalização e Configurações
  function aplicarPersonalizacaoSalva() {
    const prefs = obterPrefsUsuario();

    // Paletas Apple TV / visionOS (Luz ambiente + Destaque em vidro)
    const cores = {
      prata: {
        roxo: '#cbd5e1',
        hover: '#f1f5f9',
        claro: '#f8fafc',
        textoSobre: '#07080c',
        rgb: '203, 213, 225',
        orb2Rgb: '148, 163, 184'
      },
      violeta: {
        roxo: '#8b5cf6',
        hover: '#7c3aed',
        claro: '#c4b5fd',
        textoSobre: '#ffffff',
        rgb: '139, 92, 246',
        orb2Rgb: '192, 132, 252'
      },
      esmeralda: {
        roxo: '#10b981',
        hover: '#059669',
        claro: '#6ee7b7',
        textoSobre: '#051b11',
        rgb: '16, 185, 129',
        orb2Rgb: '52, 211, 153'
      },
      ambar: {
        roxo: '#f59e0b',
        hover: '#d97706',
        claro: '#fcd34d',
        textoSobre: '#090601',
        rgb: '245, 158, 11',
        orb2Rgb: '251, 191, 36'
      },
      rosa: {
        roxo: '#f43f5e',
        hover: '#e11d48',
        claro: '#fda4af',
        textoSobre: '#ffffff',
        rgb: '244, 63, 94',
        orb2Rgb: '251, 113, 133'
      },
      laranja: {
        roxo: '#f97316',
        hover: '#ea580c',
        claro: '#fdba74',
        textoSobre: '#090401',
        rgb: '249, 115, 22',
        orb2Rgb: '251, 146, 60'
      },
      turquesa: {
        roxo: '#14b8a6',
        hover: '#0d9488',
        claro: '#5eead4',
        textoSobre: '#041f1c',
        rgb: '20, 184, 166',
        orb2Rgb: '45, 212, 191'
      },
      apple: {
        roxo: '#0a84ff',
        hover: '#409cff',
        claro: '#64d2ff',
        textoSobre: '#ffffff',
        rgb: '10, 132, 255',
        orb2Rgb: '94, 92, 230'
      }
    };

    const corSalva = prefs.corDestaqueV5 ? prefs.corDestaque : 'prata';
    const corEscolhida = cores[corSalva] ? corSalva : 'prata';
    const paleta = cores[corEscolhida];
    document.documentElement.style.setProperty('--roxo', paleta.roxo);
    document.documentElement.style.setProperty('--roxo-claro', paleta.claro);
    document.documentElement.style.setProperty('--cor-destaque', paleta.roxo);
    document.documentElement.style.setProperty('--cor-destaque-hover', paleta.hover);
    document.documentElement.style.setProperty('--gradiente', paleta.roxo);
    document.documentElement.style.setProperty('--cor-texto-sobre-destaque', paleta.textoSobre);
    document.documentElement.style.setProperty('--cor-destaque-rgb', paleta.rgb);
    document.documentElement.style.setProperty('--cor-orb2-rgb', paleta.orb2Rgb);

    document.querySelectorAll('.config-cor-opcao').forEach((btn) => {
      btn.classList.toggle('ativo', btn.dataset.cor === corEscolhida);
    });

    // Tamanho da fonte
    const tamanhoFonte = prefs.tamanhoFonte || 'padrao';
    document.body.classList.remove('fonte-compacta', 'fonte-padrao', 'fonte-grande');
    document.body.classList.add(`fonte-${tamanhoFonte}`);

    const selectFonte = document.getElementById('pref-tamanho-fonte');
    if (selectFonte) selectFonte.value = tamanhoFonte;

    // Aba inicial do Dashboard
    const selectHome = document.getElementById('pref-aba-inicial-home');
    if (selectHome && prefs.abaInicialHome) selectHome.value = prefs.abaInicialHome;

    // Perfil de estudo
    const selNivel = document.getElementById('pref-nivel-programacao');
    const selLing = document.getElementById('pref-linguagem-foco');
    const selObj = document.getElementById('pref-objetivo-estudo');
    if (selNivel && prefs.nivelProgramacao) selNivel.value = prefs.nivelProgramacao;
    if (selLing && prefs.linguagemFoco) {
      selLing.value = prefs.linguagemFoco;
      const analisadorLing = document.getElementById('analisador-linguagem');
      if (analisadorLing) analisadorLing.value = prefs.linguagemFoco;
    }
    if (selObj && prefs.objetivoEstudo) selObj.value = prefs.objetivoEstudo;

    // Modo IA padrão
    const selModoIA = document.getElementById('pref-modo-ia-padrao');
    if (selModoIA) selModoIA.value = window.modoChatCodeHelper || 'direto';

    // Modo discreto de atalhos
    const selAtalhos = document.getElementById('pref-atalhos-teclado');
    if (selAtalhos && prefs.atalhosTeclado) {
      selAtalhos.value = prefs.atalhosTeclado;
      document.body.classList.toggle('atalhos-discretos', prefs.atalhosTeclado === 'discretos');
    }
  }

  function atualizarResumoCardPerfil() {
    const cardNome = document.getElementById('config-card-nome');
    const cardEmail = document.getElementById('config-card-email');
    const cardLetra = document.getElementById('config-avatar-letra');
    const cardNivel = document.getElementById('config-card-nivel');

    const salvas = obterConquistasSalvas();
    const totalDesbloqueadas = CATALOGO_CONQUISTAS.filter((c) => Boolean(salvas[c.id])).length;
    if (cardNivel) {
      cardNivel.textContent = obterNivelConquistas(totalDesbloqueadas);
    }

    const u = typeof usuarioAtual !== 'undefined' ? usuarioAtual : null;
    if (u) {
      const nome = u.user_metadata?.nome || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Estudante';
      if (cardNome) cardNome.textContent = nome;
      if (cardEmail) cardEmail.textContent = u.email || 'Conta autenticada';
      if (cardLetra) cardLetra.textContent = nome.charAt(0).toUpperCase();
    } else {
      if (cardNome) cardNome.textContent = 'Modo Convidado';
      if (cardEmail) cardEmail.textContent = 'Entre com uma conta para sincronizar dados na nuvem';
      if (cardLetra) cardLetra.textContent = 'C';
    }
  }

  function configurarCentralContaEPreferencias() {
    const painelConfig = document.getElementById('painel-config');
    if (!painelConfig) return;

    const titulosAbas = {
      perfil: {
        titulo: 'Meu Perfil de Estudante',
        subtitulo: 'Gerencie sua identidade, nível de experiência e objetivos de estudo.'
      },
      personalizacao: {
        titulo: 'Personalização Visual',
        subtitulo: 'Adapte o tema, as cores de destaque e o tamanho da fonte ao seu estilo.'
      },
      config: {
        titulo: 'Configurações do Sistema',
        subtitulo: 'Ajuste o comportamento pedagógico padrão da IA, exporte relatórios e gerencie dados.'
      }
    };

    function ativarSubAbaConfig(aba) {
      const abaAlvo = ['perfil', 'personalizacao', 'config'].includes(aba) ? aba : 'perfil';

      painelConfig.querySelectorAll('[data-config-aba]').forEach((btn) => {
        btn.classList.toggle('ativo', btn.dataset.configAba === abaAlvo);
      });

      painelConfig.querySelectorAll('[data-config-painel]').forEach((painel) => {
        const ativo = painel.dataset.configPainel === abaAlvo;
        painel.hidden = !ativo;
        painel.classList.toggle('ativo', ativo);
      });

      const info = titulosAbas[abaAlvo];
      const elTitulo = document.getElementById('config-titulo-dinamico');
      const elSub = document.getElementById('config-subtitulo-dinamico');
      if (elTitulo && info) elTitulo.textContent = info.titulo;
      if (elSub && info) elSub.textContent = info.subtitulo;

      atualizarResumoCardPerfil();
      transformarSelectsCustomizados();
      integrarChatTopbarSemSobreposicao();
    }

    window.ativarSubAbaConfig = ativarSubAbaConfig;

    painelConfig.querySelectorAll('[data-config-aba]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ativarSubAbaConfig(btn.dataset.configAba);
      });
    });

    document.getElementById('btn-perfil-ver-conquistas')?.addEventListener('click', abrirModalConquistas);

    // Salvar perfil de estudo
    document.getElementById('btn-salvar-perfil-estudo')?.addEventListener('click', () => {
      const nivelProgramacao = document.getElementById('pref-nivel-programacao')?.value || 'iniciante';
      const linguagemFoco = document.getElementById('pref-linguagem-foco')?.value || 'JavaScript';
      const objetivoEstudo = document.getElementById('pref-objetivo-estudo')?.value || 'logica';

      salvarPrefsUsuario({ nivelProgramacao, linguagemFoco, objetivoEstudo });
      aplicarPersonalizacaoSalva();

      const status = document.getElementById('status-perfil-estudo');
      if (status) {
        status.textContent = '✓ Preferências de estudo salvas com sucesso!';
        setTimeout(() => { status.textContent = ''; }, 3000);
      }
    });

    // Troca de cor de destaque
    document.querySelectorAll('.config-cor-opcao').forEach((btn) => {
      btn.addEventListener('click', () => {
        salvarPrefsUsuario({ corDestaque: btn.dataset.cor, corDestaqueV5: true });
        aplicarPersonalizacaoSalva();
      });
    });

    // Tamanho da fonte
    document.getElementById('pref-tamanho-fonte')?.addEventListener('change', (e) => {
      salvarPrefsUsuario({ tamanhoFonte: e.target.value });
      aplicarPersonalizacaoSalva();
    });

    // Aba inicial do Dashboard
    document.getElementById('pref-aba-inicial-home')?.addEventListener('change', (e) => {
      salvarPrefsUsuario({ abaInicialHome: e.target.value });
    });

    // Modo IA padrão
    document.getElementById('pref-modo-ia-padrao')?.addEventListener('change', (e) => {
      alterarModoChat(e.target.value);
    });

    // Modo discreto de atalhos
    document.getElementById('pref-atalhos-teclado')?.addEventListener('change', (e) => {
      salvarPrefsUsuario({ atalhosTeclado: e.target.value });
      aplicarPersonalizacaoSalva();
    });

    // Exportar relatório geral de estudos
    document.getElementById('btn-exportar-relatorio-geral')?.addEventListener('click', () => {
      const salvas = obterConquistasSalvas();
      const dominados = obterFlashcardsDominados();
      const prefs = obterPrefsUsuario();
      const dataStr = new Date().toLocaleString('pt-BR');

      let md = `# 📊 Relatório de Desempenho — CodeHelper
`;
      md += `> Gerado em: ${dataStr}
`;
      md += `> Linguagem Foco: ${prefs.linguagemFoco || 'JavaScript'} | Nível: ${prefs.nivelProgramacao || 'Iniciante'}

---

`;
      md += `## 🏆 Conquistas Desbloqueadas (${ Object.keys(salvas).length }/${ CATALOGO_CONQUISTAS.length })

`;
      CATALOGO_CONQUISTAS.forEach((c) => {
        md += `- [${salvas[c.id] ? 'x' : ' '}] **${c.titulo}**: ${c.descricao}
`;
      });
      md += `
## 🎴 Conceitos Dominados nos Flashcards (${dominados.size})

`;
      if (dominados.size > 0) {
        Array.from(dominados).forEach((t) => { md += `- ${t}
`; });
      } else {
        md += `_Nenhum conceito marcado como dominado ainda._
`;
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-codehelper-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    // Resetar progresso local
    document.getElementById('btn-resetar-progresso-local')?.addEventListener('click', async () => {
      const ok = await window.confirmarCodeHelper({
        titulo: 'Redefinir progresso local?',
        mensagem: 'Isso zerará os Flashcards marcados como dominados, termos visitados e conquistas salvas neste navegador.',
        textoConfirmar: 'Sim, redefinir',
        perigo: true
      });
      if (!ok) return;
      localStorage.removeItem(CHAVE_CONQUISTAS);
      localStorage.removeItem(CHAVE_FLASHCARDS_DOMINADOS);
      localStorage.removeItem('codehelper_termos_visitados');
      atualizarPillDominados();
      renderizarSecaoConquistasDashboard();
      atualizarResumoCardPerfil();
      alert('Progresso local redefinido com sucesso.');
    });

    aplicarPersonalizacaoSalva();
    atualizarResumoCardPerfil();
  }


  /* ========================================================================
     8. DIÁLOGOS DE CONFIRMAÇÃO E ALERTAS IN-APP (SUBSTITUI CAIXA DO NAVEGADOR)
     ======================================================================== */
  function garantirModalDialogoInApp() {
    let overlay = document.getElementById('tcc-dialog-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'tcc-dialog-overlay';
    overlay.className = 'tcc-dialog-overlay';
    overlay.hidden = true;

    overlay.innerHTML = `
      <div class="tcc-dialog-modal" role="alertdialog" aria-modal="true" aria-labelledby="tcc-dialog-titulo" aria-describedby="tcc-dialog-msg">
        <div class="tcc-dialog-topo">
          <div id="tcc-dialog-icone" class="tcc-dialog-icone">⚠️</div>
          <div class="tcc-dialog-textos">
            <h3 id="tcc-dialog-titulo">Confirmação</h3>
            <p id="tcc-dialog-msg"></p>
          </div>
        </div>
        <div class="tcc-dialog-acoes">
          <button type="button" id="tcc-dialog-cancelar" class="tcc-dialog-btn-secundario">Cancelar</button>
          <button type="button" id="tcc-dialog-confirmar" class="tcc-dialog-btn-primario">Confirmar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  window.confirmarCodeHelper = function ({
    titulo = 'Confirmar ação',
    mensagem = 'Deseja continuar?',
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    perigo = false
  } = {}) {
    return new Promise((resolve) => {
      const overlay = garantirModalDialogoInApp();
      const elIcone = document.getElementById('tcc-dialog-icone');
      const elTitulo = document.getElementById('tcc-dialog-titulo');
      const elMsg = document.getElementById('tcc-dialog-msg');
      const btnCancelar = document.getElementById('tcc-dialog-cancelar');
      const btnConfirmar = document.getElementById('tcc-dialog-confirmar');

      if (elIcone) {
        elIcone.textContent = perigo ? '🗑️' : '💬';
        elIcone.classList.toggle('perigo', Boolean(perigo));
      }
      if (elTitulo) elTitulo.textContent = titulo;
      if (elMsg) elMsg.textContent = mensagem;

      if (btnCancelar) {
        btnCancelar.hidden = false;
        btnCancelar.textContent = textoCancelar;
      }

      if (btnConfirmar) {
        btnConfirmar.textContent = textoConfirmar;
        btnConfirmar.className = perigo ? 'tcc-dialog-btn-perigo' : 'tcc-dialog-btn-primario';
      }

      overlay.hidden = false;
      setTimeout(() => btnConfirmar?.focus(), 20);

      function finalizar(resultado) {
        overlay.hidden = true;
        btnConfirmar?.removeEventListener('click', onConfirm);
        btnCancelar?.removeEventListener('click', onCancel);
        overlay.removeEventListener('click', onOverlay);
        document.removeEventListener('keydown', onKey);
        resolve(resultado);
      }

      function onConfirm() { finalizar(true); }
      function onCancel() { finalizar(false); }
      function onOverlay(e) { if (e.target === overlay) finalizar(false); }
      function onKey(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          finalizar(false);
        }
      }

      btnConfirmar?.addEventListener('click', onConfirm);
      btnCancelar?.addEventListener('click', onCancel);
      overlay.addEventListener('click', onOverlay);
      document.addEventListener('keydown', onKey);
    });
  };

  window.alertaCodeHelper = function (mensagem, titulo = 'Aviso do CodeHelper') {
    return new Promise((resolve) => {
      const overlay = garantirModalDialogoInApp();
      const elIcone = document.getElementById('tcc-dialog-icone');
      const elTitulo = document.getElementById('tcc-dialog-titulo');
      const elMsg = document.getElementById('tcc-dialog-msg');
      const btnCancelar = document.getElementById('tcc-dialog-cancelar');
      const btnConfirmar = document.getElementById('tcc-dialog-confirmar');

      const ehErro = /erro|não foi possível|inválid|limite/i.test(String(mensagem));

      if (elIcone) {
        elIcone.textContent = ehErro ? '⚠️' : '✨';
        elIcone.classList.toggle('perigo', ehErro);
      }
      if (elTitulo) elTitulo.textContent = ehErro ? 'Atenção' : titulo;
      if (elMsg) elMsg.textContent = String(mensagem || '');

      if (btnCancelar) btnCancelar.hidden = true;
      if (btnConfirmar) {
        btnConfirmar.textContent = 'Entendi';
        btnConfirmar.className = 'tcc-dialog-btn-primario';
      }

      overlay.hidden = false;
      setTimeout(() => btnConfirmar?.focus(), 20);

      function fechar() {
        overlay.hidden = true;
        btnConfirmar?.removeEventListener('click', fechar);
        overlay.removeEventListener('click', onOverlay);
        document.removeEventListener('keydown', onKey);
        resolve();
      }

      function onOverlay(e) { if (e.target === overlay) fechar(); }
      function onKey(e) {
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault();
          fechar();
        }
      }

      btnConfirmar?.addEventListener('click', fechar);
      overlay.addEventListener('click', onOverlay);
      document.addEventListener('keydown', onKey);
    });
  };

  // Substitui o window.alert nativo para sempre exibir dentro da interface do site
  window.alert = function (msg) {
    window.alertaCodeHelper(msg);
  };

  /* ========================================================================
     9. DROPDOWN CUSTOMIZADO (SUBSTITUI O MENU NATIVO DO WINDOWS EM TODOS OS SELECTS)
     ======================================================================== */
  function transformarSelectsCustomizados() {
    const selects = document.querySelectorAll('select');

    selects.forEach((select) => {
      if (select.dataset.customSelect === 'true') {
        if (typeof select._atualizarCustomSelect === 'function') {
          select._atualizarCustomSelect();
        }
        return;
      }

      select.dataset.customSelect = 'true';
      select.classList.add('tcc-select-nativo-oculto');
      select.hidden = true;
      select.style.setProperty('display', 'none', 'important');

      const wrapper = document.createElement('div');
      wrapper.className = 'tcc-select-wrapper';
      if (select.id) {
        wrapper.dataset.selectId = select.id;
      }

      const gatilho = document.createElement('button');
      gatilho.type = 'button';
      gatilho.className = 'tcc-select-gatilho';
      gatilho.setAttribute('aria-haspopup', 'listbox');
      gatilho.setAttribute('aria-expanded', 'false');

      const menu = document.createElement('div');
      menu.className = 'tcc-select-menu';
      menu.setAttribute('role', 'listbox');
      menu.hidden = true;

      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
      wrapper.appendChild(gatilho);
      wrapper.appendChild(menu);

      function renderizarEstadoSelect() {
        const opcoes = [...select.options];
        const selecionada = opcoes[select.selectedIndex] || opcoes[0];

        gatilho.innerHTML = `
          <span class="tcc-select-gatilho-texto">${escaparTextoSeguro(selecionada ? selecionada.textContent : '')}</span>
          <span class="tcc-select-gatilho-seta">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
        `;

        menu.innerHTML = opcoes.map((opt, idx) => {
          const ativa = idx === select.selectedIndex;
          return `
            <button
              type="button"
              class="tcc-select-opcao ${ativa ? 'ativo' : ''}"
              data-opt-index="${idx}"
              role="option"
              aria-selected="${ativa}"
            >
              <span class="tcc-select-opcao-label">${escaparTextoSeguro(opt.textContent)}</span>
              <span class="tcc-select-opcao-check">${ativa ? '✓' : ''}</span>
            </button>
          `;
        }).join('');

        menu.querySelectorAll('.tcc-select-opcao').forEach((btnOpcao) => {
          btnOpcao.addEventListener('click', (e) => {
            e.stopPropagation();
            const novoIdx = Number(btnOpcao.dataset.optIndex);
            if (select.selectedIndex !== novoIdx) {
              select.selectedIndex = novoIdx;
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
            renderizarEstadoSelect();
            fecharMenuSelect();
          });
        });
      }

      function abrirMenuSelect() {
        document.querySelectorAll('.tcc-select-wrapper.aberto').forEach((outro) => {
          if (outro !== wrapper) {
            outro.classList.remove('aberto');
            const m = outro.querySelector('.tcc-select-menu');
            const g = outro.querySelector('.tcc-select-gatilho');
            if (m) m.hidden = true;
            if (g) g.setAttribute('aria-expanded', 'false');
          }
        });

        wrapper.classList.add('aberto');
        menu.hidden = false;
        gatilho.setAttribute('aria-expanded', 'true');
      }

      function fecharMenuSelect() {
        wrapper.classList.remove('aberto');
        menu.hidden = true;
        gatilho.setAttribute('aria-expanded', 'false');
      }

      gatilho.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menu.hidden) {
          renderizarEstadoSelect();
          abrirMenuSelect();
        } else {
          fecharMenuSelect();
        }
      });

      gatilho.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) {
          e.preventDefault();
          fecharMenuSelect();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const total = select.options.length;
          if (!total) return;
          const delta = e.key === 'ArrowDown' ? 1 : -1;
          const novoIdx = (select.selectedIndex + delta + total) % total;
          select.selectedIndex = novoIdx;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          renderizarEstadoSelect();
        }
      });

      select.addEventListener('change', renderizarEstadoSelect);
      select._atualizarCustomSelect = renderizarEstadoSelect;
      renderizarEstadoSelect();
    });

    if (!window.__listenerFecharSelectsCustom) {
      window.__listenerFecharSelectsCustom = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.tcc-select-wrapper')) {
          document.querySelectorAll('.tcc-select-wrapper.aberto').forEach((w) => {
            w.classList.remove('aberto');
            const m = w.querySelector('.tcc-select-menu');
            const g = w.querySelector('.tcc-select-gatilho');
            if (m) m.hidden = true;
            if (g) g.setAttribute('aria-expanded', 'false');
          });
        }
      });

      const obsSelects = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1 && (node.tagName === 'SELECT' || node.querySelector?.('select:not([data-custom-select="true"])'))) {
              transformarSelectsCustomizados();
              return;
            }
          }
        }
      });
      obsSelects.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.transformarSelectsCustomizados = transformarSelectsCustomizados;

  /* ========================================================================
     10. INTEGRAR TOPBAR DO CHAT PARA EVITAR SOBREPOSIÇÃO COM BOTÃO TROFÉU
     ======================================================================== */
  function integrarChatTopbarSemSobreposicao() {
    const topbarConversa = document.querySelector('.chat-topbar');
    const barraDireitaChat = document.querySelector('#chat-barra-pedagogica .chat-barra-direita');
    if (topbarConversa && barraDireitaChat && topbarConversa.parentElement !== barraDireitaChat) {
      barraDireitaChat.appendChild(topbarConversa);
    }
  }

  /* ========================================================================
     INICIALIZAÇÃO
     ======================================================================== */
  function inicializarRecursosTCC() {
    sincronizarConquistasExistentes();
    configurarBarraSuperiorChat();
    configurarFlashcardsGlossario();
    configurarDiffAnalisador();
    criarModalCommandPalette();
    renderizarSecaoConquistasDashboard();
    configurarDashboardLimpo();
    configurarSidebarLimpa();
    configurarAbasSobre();
    configurarCentralContaEPreferencias();
    transformarSelectsCustomizados();
    integrarChatTopbarSemSobreposicao();
    configurarMonitoramentoEventos();

    // Atualiza contador de flashcards após carregamento assíncrono dos termos
    setTimeout(() => {
      atualizarPillDominados();
      sincronizarConquistasExistentes();
      renderizarSecaoConquistasDashboard();
      atualizarResumoCardPerfil();
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarRecursosTCC);
  } else {
    inicializarRecursosTCC();
  }
})();
