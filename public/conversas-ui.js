
(() => {
  const lista = document.getElementById('lista-conversas');
  const painelChat = document.getElementById('painel-chat');
  const chatMensagens = document.getElementById('chat-mensagens');
  const btnNovaConversa = document.getElementById('btn-nova-conversa');

  if (!lista || !painelChat || !chatMensagens) return;

  const CHAVE_FIXADAS = 'codehelper_conversas_fixadas';
  const CHAVE_RECOLHIDAS = 'codehelper_fixadas_recolhidas';

  const ICONE_PIN = `
    <svg viewBox="0 0 24 24">
      <path d="M14 4 20 10"/>
      <path d="M16 2 22 8"/>
      <path d="M8.5 8.5 15.5 15.5"/>
      <path d="M4 20 9.5 14.5"/>
      <path d="m10 7 7 7"/>
      <path d="M10 7 5 12l7 7 5-5"/>
    </svg>
  `;

  const ICONE_MAIS = `
    <svg viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>
    </svg>
  `;

  const ICONE_LIXEIRA = `
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18"/>
      <path d="M8 6V4h8v2"/>
      <path d="M19 6l-1 15H6L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
    </svg>
  `;

  const ICONE_COMPARTILHAR = `
    <svg viewBox="0 0 24 24">
      <path d="M12 16V3"/>
      <path d="m7 8 5-5 5 5"/>
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
    </svg>
  `;

  const ICONE_CHEVRON = `
    <svg viewBox="0 0 24 24">
      <path d="m7 10 5 5 5-5"/>
    </svg>
  `;

  function lerLocalStorage(chave, padrao = null) {
    try {
      const valor = localStorage.getItem(chave);
      return valor === null ? padrao : valor;
    } catch {
      return padrao;
    }
  }

  function gravarLocalStorage(chave, valor) {
    try {
      localStorage.setItem(chave, valor);
      return true;
    } catch {
      return false;
    }
  }

  function carregarFixadas() {
    try {
      const salvo = lerLocalStorage(CHAVE_FIXADAS);
      const ids = salvo ? JSON.parse(salvo) : [];
      return new Set(Array.isArray(ids) ? ids.map(String) : []);
    } catch {
      return new Set();
    }
  }

  let conversasFixadas = carregarFixadas();

  function salvarFixadas() {
    gravarLocalStorage(
      CHAVE_FIXADAS,
      JSON.stringify([...conversasFixadas])
    );
  }

  function estaFixada(id) {
    return conversasFixadas.has(String(id));
  }

  function fixadasRecolhidas() {
    return lerLocalStorage(CHAVE_RECOLHIDAS) === 'true';
  }

  function salvarFixadasRecolhidas(valor) {
    gravarLocalStorage(CHAVE_RECOLHIDAS, valor ? 'true' : 'false');
  }

  let menuSidebar = null;

  function fecharMenuSidebar() {
    if (!menuSidebar) return;
    menuSidebar.remove();
    menuSidebar = null;
  }

  function posicionarMenuSidebar(menu, botao) {
    const rect = botao.getBoundingClientRect();
    const largura = menu.offsetWidth;
    const altura = menu.offsetHeight;

    let esquerda = rect.right - largura;
    let topo = rect.bottom + 6;

    esquerda = Math.max(8, Math.min(esquerda, window.innerWidth - largura - 8));

    if (topo + altura > window.innerHeight - 8) {
      topo = rect.top - altura - 6;
    }

    topo = Math.max(8, topo);

    menu.style.left = `${esquerda}px`;
    menu.style.top = `${topo}px`;
  }

  function atualizarVisualItem(item) {
    const fixada = estaFixada(item.dataset.id);

    item.classList.toggle('conversa-fixada', fixada);

    const botao = item.querySelector('.btn-fixar-conversa');

    if (botao) {
      botao.title = fixada ? 'Desafixar conversa' : 'Fixar conversa';
      botao.setAttribute('aria-label', botao.title);
    }
  }

  function alternarFixacao(item) {
    const id = String(item.dataset.id || '');

    if (!id) return;

    if (conversasFixadas.has(id)) {
      conversasFixadas.delete(id);
    } else {
      conversasFixadas.add(id);
    }

    salvarFixadas();
    processarLista();
    atualizarTopbar();
  }

  function abrirMenuSidebar(item, botao) {
    fecharMenuSidebar();

    const fixada = estaFixada(item.dataset.id);
    const menu = document.createElement('div');

    menu.className = 'conversa-menu-popup';

    menu.innerHTML = `
      <button class="conversa-menu-item" data-acao="fixar" type="button">
        ${ICONE_PIN}
        <span>${fixada ? 'Desafixar conversa' : 'Fixar conversa'}</span>
      </button>
      <div class="conversa-menu-separador"></div>
      <button class="conversa-menu-item perigo" data-acao="excluir" type="button">
        ${ICONE_LIXEIRA}
        <span>Excluir</span>
      </button>
    `;

    document.body.appendChild(menu);
    menuSidebar = menu;

    posicionarMenuSidebar(menu, botao);

    menu.querySelector('[data-acao="fixar"]').addEventListener('click', evento => {
      evento.stopPropagation();
      alternarFixacao(item);
      fecharMenuSidebar();
    });

    menu.querySelector('[data-acao="excluir"]').addEventListener('click', evento => {
      evento.stopPropagation();

      const excluir = item.querySelector('.btn-excluir-conversa');

      fecharMenuSidebar();
      excluir?.click();
    });
  }

  function prepararItem(item, indice) {
    if (!item.dataset.ordemOriginal) {
      item.dataset.ordemOriginal = String(indice);
    }

    if (item.dataset.conversaUi !== 'true') {
      item.dataset.conversaUi = 'true';

      const acoes = document.createElement('div');
      acoes.className = 'conversa-acoes-hover';

      acoes.innerHTML = `
        <button class="btn-fixar-conversa" type="button" title="Fixar conversa">
          ${ICONE_PIN}
        </button>
        <button class="btn-mais-conversa" type="button" title="Mais opções">
          ${ICONE_MAIS}
        </button>
      `;

      item.appendChild(acoes);

      const btnFixar = acoes.querySelector('.btn-fixar-conversa');
      const btnMais = acoes.querySelector('.btn-mais-conversa');

      btnFixar.addEventListener('click', evento => {
        evento.preventDefault();
        evento.stopPropagation();
        alternarFixacao(item);
      });

      btnMais.addEventListener('click', evento => {
        evento.preventDefault();
        evento.stopPropagation();
        abrirMenuSidebar(item, btnMais);
      });

      item.addEventListener('click', () => {
        setTimeout(atualizarTopbar, 0);
      });
    }

    atualizarVisualItem(item);
  }

  let observerLista = null;
  let processandoLista = false;
  let atualizacaoAgendada = false;

  function processarLista() {
    if (processandoLista) return;

    processandoLista = true;
    observerLista?.disconnect();

    try {
      const itens = [...lista.querySelectorAll('.item-conversa')];

      if (itens.length === 0) {
        lista.querySelectorAll('.conversa-grupo').forEach(grupo => grupo.remove());
        atualizarTopbar();
        return;
      }

      itens.forEach((item, indice) => prepararItem(item, indice));

      const fixadas = itens
        .filter(item => estaFixada(item.dataset.id))
        .sort((a, b) => Number(a.dataset.ordemOriginal) - Number(b.dataset.ordemOriginal));

      const recentes = itens
        .filter(item => !estaFixada(item.dataset.id))
        .sort((a, b) => Number(a.dataset.ordemOriginal) - Number(b.dataset.ordemOriginal));

      lista.replaceChildren();

      if (fixadas.length > 0) {
        const grupoFixadas = document.createElement('div');
        grupoFixadas.className = 'conversa-grupo conversa-grupo-fixadas';

        const recolhida = fixadasRecolhidas();
        grupoFixadas.classList.toggle('recolhido', recolhida);

        const titulo = document.createElement('button');
        titulo.type = 'button';
        titulo.className = 'conversa-grupo-titulo conversa-grupo-toggle';
        titulo.setAttribute('aria-expanded', String(!recolhida));

        titulo.innerHTML = `
          <span>Fixadas</span>
          ${ICONE_CHEVRON}
        `;

        const conteudo = document.createElement('div');
        conteudo.className = 'conversa-grupo-lista';

        fixadas.forEach(item => conteudo.appendChild(item));

        titulo.addEventListener('click', () => {
          const agoraRecolhida = !grupoFixadas.classList.contains('recolhido');

          grupoFixadas.classList.toggle('recolhido', agoraRecolhida);
          titulo.setAttribute('aria-expanded', String(!agoraRecolhida));

          salvarFixadasRecolhidas(agoraRecolhida);
        });

        grupoFixadas.append(titulo, conteudo);
        lista.appendChild(grupoFixadas);
      }

      if (recentes.length > 0) {
        const grupoRecentes = document.createElement('div');
        grupoRecentes.className = 'conversa-grupo conversa-grupo-recentes';

        const titulo = document.createElement('div');
        titulo.className = 'conversa-grupo-titulo';
        titulo.textContent = 'Recentes';

        const conteudo = document.createElement('div');
        conteudo.className = 'conversa-grupo-lista';

        recentes.forEach(item => conteudo.appendChild(item));

        grupoRecentes.append(titulo, conteudo);
        lista.appendChild(grupoRecentes);
      }
    } finally {
      processandoLista = false;

      observerLista?.observe(lista, {
        childList: true
      });

      atualizarTopbar();
    }
  }

  function agendarProcessamentoLista() {
    if (atualizacaoAgendada) return;

    atualizacaoAgendada = true;

    requestAnimationFrame(() => {
      atualizacaoAgendada = false;

      const itens = [...lista.querySelectorAll('.item-conversa')];

      itens.forEach((item, indice) => {
        if (!item.dataset.ordemOriginal) {
          item.dataset.ordemOriginal = String(indice);
        }
      });

      processarLista();
    });
  }

  observerLista = new MutationObserver(mutacoes => {
    if (processandoLista) return;

    const mudouLista = mutacoes.some(mutacao =>
      [...mutacao.addedNodes, ...mutacao.removedNodes].some(node =>
        node.nodeType === Node.ELEMENT_NODE &&
        (
          node.matches?.('.item-conversa') ||
          node.querySelector?.('.item-conversa')
        )
      )
    );

    if (mudouLista) {
      agendarProcessamentoLista();
    }
  });

  observerLista.observe(lista, {
    childList: true
  });

  const topbar = document.createElement('div');
  topbar.className = 'chat-topbar';
  topbar.hidden = true;

  topbar.innerHTML = `
    <button class="chat-topbar-compartilhar" type="button" title="Compartilhar conversa">
      ${ICONE_COMPARTILHAR}
      <span>Compartilhar</span>
    </button>
    <div class="chat-topbar-menu-root">
      <button class="chat-topbar-mais" type="button" aria-label="Mais opções" title="Mais opções">
        ${ICONE_MAIS}
      </button>
      <div class="chat-topbar-popup" hidden>
        <button type="button" data-acao="fixar">
          ${ICONE_PIN}
          <span class="chat-topbar-fixar-texto">Fixar conversa</span>
        </button>
        <div class="chat-topbar-separador"></div>
        <button type="button" class="perigo" data-acao="excluir">
          ${ICONE_LIXEIRA}
          <span>Excluir</span>
        </button>
      </div>
    </div>
  `;

  painelChat.insertBefore(topbar, chatMensagens);

  const btnCompartilhar = topbar.querySelector('.chat-topbar-compartilhar');
  const btnMaisTopo = topbar.querySelector('.chat-topbar-mais');
  const popupTopo = topbar.querySelector('.chat-topbar-popup');
  const btnFixarTopo = popupTopo.querySelector('[data-acao="fixar"]');
  const btnExcluirTopo = popupTopo.querySelector('[data-acao="excluir"]');
  const textoFixarTopo = popupTopo.querySelector('.chat-topbar-fixar-texto');

  function obterConversaAtiva() {
    return lista.querySelector('.item-conversa.ativo');
  }

  function atualizarTopbar() {
    const ativa = obterConversaAtiva();

    if (!ativa) {
      topbar.hidden = true;
      popupTopo.hidden = true;
      return;
    }

    topbar.hidden = false;

    const fixada = estaFixada(ativa.dataset.id);

    textoFixarTopo.textContent = fixada
      ? 'Desafixar conversa'
      : 'Fixar conversa';

    btnFixarTopo.classList.toggle('ativo', fixada);
  }

  btnMaisTopo.addEventListener('click', evento => {
    evento.stopPropagation();

    if (!obterConversaAtiva()) return;

    popupTopo.hidden = !popupTopo.hidden;
    atualizarTopbar();
  });

  btnFixarTopo.addEventListener('click', () => {
    const ativa = obterConversaAtiva();

    if (!ativa) return;

    alternarFixacao(ativa);
    popupTopo.hidden = true;
  });

  btnExcluirTopo.addEventListener('click', () => {
    const ativa = obterConversaAtiva();

    if (!ativa) return;

    popupTopo.hidden = true;

    const excluir = ativa.querySelector('.btn-excluir-conversa');
    excluir?.click();
  });

  function montarTextoConversa() {
    const ativa = obterConversaAtiva();

    const titulo = ativa
      ?.querySelector('.titulo-conversa')
      ?.textContent
      ?.trim() || 'Conversa no CodeHelper';

    const mensagens = [...chatMensagens.querySelectorAll('.msg')];

    const conteudo = mensagens
      .map(mensagem => {
        const autor = mensagem.classList.contains('msg-usuario')
          ? 'Você'
          : 'CodeHelper';

        const clone = mensagem.cloneNode(true);

        clone.querySelectorAll(
          '.acoes-mensagem, .caixa-feedback, button'
        ).forEach(elemento => elemento.remove());

        return `${autor}:\n${clone.textContent.trim()}`;
      })
      .filter(texto => texto.trim().length > 0)
      .join('\n\n');

    return {
      titulo,
      conteudo
    };
  }

  async function copiarTexto(texto) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(texto);
        return true;
      } catch {}
    }

    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    campo.style.pointerEvents = 'none';

    document.body.appendChild(campo);
    campo.select();
    campo.setSelectionRange(0, campo.value.length);

    let copiado = false;

    try {
      copiado = document.execCommand('copy');
    } catch {
      copiado = false;
    }

    campo.remove();

    return copiado;
  }

  btnCompartilhar.addEventListener('click', async () => {
    const { titulo, conteudo } = montarTextoConversa();

    if (!conteudo) return;

    const textoCompleto = `${titulo}\n\n${conteudo}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${titulo} — CodeHelper`,
          text: conteudo
        });

        return;
      }

      const copiado = await copiarTexto(textoCompleto);

      if (!copiado) {
        throw new Error('Não foi possível copiar a conversa.');
      }

      const texto = btnCompartilhar.querySelector('span');
      const original = texto.textContent;

      texto.textContent = 'Copiado';

      setTimeout(() => {
        texto.textContent = original;
      }, 1500);
    } catch (erro) {
      if (erro?.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', erro);
      }
    }
  });

  const observerAtivo = new MutationObserver(atualizarTopbar);

  observerAtivo.observe(lista, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  btnNovaConversa?.addEventListener('click', () => {
    setTimeout(atualizarTopbar, 0);
  });

  document.addEventListener('click', evento => {
    if (menuSidebar && !menuSidebar.contains(evento.target)) {
      fecharMenuSidebar();
    }

    if (!topbar.contains(evento.target)) {
      popupTopo.hidden = true;
    }
  });

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
      fecharMenuSidebar();
      popupTopo.hidden = true;
    }
  });

  window.addEventListener('resize', fecharMenuSidebar);

  window.addEventListener('scroll', fecharMenuSidebar, true);

  processarLista();
  atualizarTopbar();
})();
