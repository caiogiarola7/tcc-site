
(() => {
  if (window.__codehelperNavegacaoInicializada) return;
  window.__codehelperNavegacaoInicializada = true;

  function obterClienteSupabase() {
    try {
      return window.supabaseClient ||
        (typeof supabaseClient !== 'undefined' ? supabaseClient : null);
    } catch {
      return window.supabaseClient || null;
    }
  }

  function carregarCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  carregarCSS('acabamento.css');
  carregarCSS('interface-ui.css');

  const sidebar = document.querySelector('.sidebar-principal');
  const nav = document.querySelector('.sidebar-nav');
  const marca = document.querySelector('.brand');
  const btnNovaConversa = document.getElementById('btn-nova-conversa');
  const listaConversas = document.getElementById('lista-conversas');
  const authArea = document.getElementById('auth-area');
  const chatInput = document.getElementById('chat-input');

  function fecharSidebarMobile() {
    const s = document.querySelector('.sidebar-principal');
    const b = document.getElementById('sidebar-backdrop');
    s?.classList.remove('aberta');
    b?.classList.remove('visivel');
  }

  function abrirSidebarMobile() {
    const s = document.querySelector('.sidebar-principal');
    const b = document.getElementById('sidebar-backdrop');
    s?.classList.add('aberta');
    b?.classList.add('visivel');
  }

  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const btnNovaConversaMobile = document.getElementById('btn-nova-conversa-mobile');
  const mobileBrandBtn = document.getElementById('mobile-brand-btn');

  btnMenuMobile?.addEventListener('click', (e) => {
    e.stopPropagation();
    const s = document.querySelector('.sidebar-principal');
    if (s?.classList.contains('aberta')) {
      fecharSidebarMobile();
    } else {
      abrirSidebarMobile();
    }
  });

  sidebarBackdrop?.addEventListener('click', fecharSidebarMobile);

  mobileBrandBtn?.addEventListener('click', () => {
    navegarPara('inicio');
    fecharSidebarMobile();
  });

  btnNovaConversaMobile?.addEventListener('click', () => {
    fecharSidebarMobile();
    document.getElementById('btn-nova-conversa')?.click();
  });

  function navegarPara(destino) {
    fecharSidebarMobile();
    const botao = document.querySelector(`.aba-btn[data-aba="${destino}"]`);
    if (botao) botao.click();
  }

  const ICONES_NAV = {
    inicio: `<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>`,
    chat: `<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>`,
    analisador: `<svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/></svg>`,
    glossario: `<svg viewBox="0 0 24 24"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22Z"/><path d="M4 5.5V22"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>`,
    quiz: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 0 1 4.65.8c0 1.8-2.45 2.1-2.45 3.7"/><path d="M12 17h.01"/></svg>`,
    playground: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/></svg>`,
    sobre: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7h.01"/></svg>`,
    config: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.37.31.72.6 1 .3.28.69.42 1.1.4H21v4h-.09a1.7 1.7 0 0 0-1.51.6Z"/></svg>`
  };

  if (marca) {
    marca.innerHTML = `
      <div class="brand-principal">
        <span class="brand-code">CODE</span>
        <span class="brand-simbolo">&lt;/&gt;</span>
        <span class="brand-helper">HELPER</span>
      </div>
      <span class="brand-subtitulo">LEARN • DEBUG • BUILD</span>
    `;

    marca.setAttribute('role', 'button');
    marca.setAttribute('tabindex', '0');
    marca.title = 'Voltar ao início';

    marca.addEventListener('click', () => navegarPara('inicio'));

    marca.addEventListener('keydown', evento => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        navegarPara('inicio');
      }
    });
  }

  if (btnNovaConversa) {
    btnNovaConversa.innerHTML = `
      <span class="nova-conversa-icone">
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
      </span>
      <span>Nova conversa</span>
      <span class="nova-conversa-atalho">Ctrl K</span>
    `;

    btnNovaConversa.addEventListener('click', () => {
      setTimeout(() => {
        navegarPara('chat');
        setTimeout(() => chatInput?.focus(), 50);
      }, 0);
    });

    document.addEventListener('keydown', evento => {
      if (evento.ctrlKey && evento.key.toLowerCase() === 'k') {
        evento.preventDefault();
        btnNovaConversa.click();
      }
    });
  }

  if (nav) {
    const botoes = [...nav.querySelectorAll('.aba-btn')];

    const grupoPrincipal = document.createElement('div');
    grupoPrincipal.className = 'sidebar-nav-grupo';
    grupoPrincipal.innerHTML = `<div class="sidebar-nav-titulo">Principal</div>`;

    const grupoPraticar = document.createElement('div');
    grupoPraticar.className = 'sidebar-nav-grupo';
    grupoPraticar.innerHTML = `<div class="sidebar-nav-titulo">Praticar</div>`;

    const grupoOculto = document.createElement('div');
    grupoOculto.className = 'sidebar-nav-oculto';

    botoes.forEach(botao => {
      const destino = botao.dataset.aba;
      const textoOriginal = botao.textContent.trim();

      if (ICONES_NAV[destino]) {
        botao.innerHTML = `
          <span class="nav-icone">${ICONES_NAV[destino]}</span>
          <span class="nav-texto">${textoOriginal}</span>
        `;
      }

      if (destino === 'config' || destino === 'sobre') {
        grupoOculto.appendChild(botao);
        return;
      }

      if (destino === 'quiz' || destino === 'playground') {
        grupoPraticar.appendChild(botao);
        return;
      }

      grupoPrincipal.appendChild(botao);
    });

    nav.innerHTML = '';
    nav.appendChild(grupoPrincipal);
    nav.appendChild(grupoPraticar);
    nav.appendChild(grupoOculto);
  }

  const nomesPaginas = {
    inicio: 'Início',
    chat: 'Chat',
    analisador: 'Analisador de Código',
    glossario: 'Glossário',
    quiz: 'Quiz',
    playground: 'Playground',
    sobre: 'Sobre',
    config: 'Configurações'
  };

  document.querySelectorAll('.aba-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      const nome = nomesPaginas[botao.dataset.aba];
      if (nome) document.title = `${nome} — CodeHelper`;
    });
  });

  if (listaConversas) {
    listaConversas.addEventListener('click', evento => {
      if (evento.target.closest('.btn-excluir-conversa')) return;

      const conversa = evento.target.closest('.item-conversa');
      if (!conversa) return;

      setTimeout(() => navegarPara('chat'), 0);
    });
  }

  if (authArea) authArea.style.display = 'none';
  if (!sidebar) return;

  const perfilRoot = document.createElement('div');
  perfilRoot.className = 'perfil-menu-root';

  perfilRoot.innerHTML = `
    <div class="perfil-dock-linha">
      <button class="perfil-gatilho" type="button" aria-expanded="false">
        <span class="perfil-avatar">
          <img class="perfil-avatar-img" alt="" hidden>
          <span class="perfil-avatar-inicial">U</span>
        </span>
        <span class="perfil-resumo">
          <strong class="perfil-nome">Carregando...</strong>
          <span class="perfil-status">Verificando conta</span>
        </span>
        <svg class="perfil-chevron" viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
      <button class="perfil-entrar-rapido" type="button" hidden>Entrar</button>
    </div>

    <div class="perfil-popup" hidden>
      <div class="perfil-popup-topo">
        <span class="perfil-avatar perfil-avatar-grande">
          <img class="perfil-popup-avatar-img" alt="" hidden>
          <span class="perfil-popup-avatar-inicial">U</span>
        </span>
        <div class="perfil-popup-identidade">
          <strong class="perfil-popup-nome">Usuário</strong>
          <span class="perfil-popup-email">CodeHelper</span>
          <span class="perfil-popup-provider">Conta</span>
        </div>
      </div>

      <div class="perfil-menu-separador"></div>

      <button class="perfil-menu-item perfil-item-conta" data-acao="perfil" type="button">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
        <span>Perfil</span>
      </button>

      <button class="perfil-menu-item" data-acao="personalizacao" type="button">
        <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-1.1-.9-2-2-2h-1.5a1.5 1.5 0 0 1-1.3-2.25l.4-.7A2.7 2.7 0 0 0 14.25 3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="6.8" r=".8"/><circle cx="6.8" cy="14" r=".8"/></svg>
        <span>Personalização</span>
      </button>

      <button class="perfil-menu-item" data-acao="config" type="button">
        ${ICONES_NAV.config}
        <span>Configurações</span>
      </button>

      <div class="perfil-menu-separador"></div>

      <button class="perfil-menu-item" data-acao="sobre" type="button">
        ${ICONES_NAV.sobre}
        <span>Sobre o CodeHelper</span>
      </button>

      <button class="perfil-menu-item perfil-menu-sair" data-acao="sair" type="button">
        <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>
        <span class="perfil-sair-texto">Sair</span>
      </button>
    </div>
  `;

  sidebar.appendChild(perfilRoot);

  const gatilho = perfilRoot.querySelector('.perfil-gatilho');
  const popup = perfilRoot.querySelector('.perfil-popup');
  const btnEntrarRapido = perfilRoot.querySelector('.perfil-entrar-rapido');
  const itemPerfil = perfilRoot.querySelector('.perfil-item-conta');
  const textoSair = perfilRoot.querySelector('.perfil-sair-texto');

  let usuarioLogado = false;

  function abrirPopup() {
    popup.hidden = false;
    requestAnimationFrame(() => popup.classList.add('aberto'));
    gatilho.setAttribute('aria-expanded', 'true');
  }

  function fecharPopup() {
    if (popup.hidden) return;

    popup.classList.remove('aberto');
    gatilho.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      if (!popup.classList.contains('aberto')) popup.hidden = true;
    }, 160);
  }

  gatilho.addEventListener('click', () => {
    if (popup.hidden) abrirPopup();
    else fecharPopup();
  });

  document.addEventListener('click', evento => {
    if (!perfilRoot.contains(evento.target)) fecharPopup();
  });

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') fecharPopup();
  });

  function irParaLogin() {
    sessionStorage.removeItem('convidado');
    window.location.href = 'index.html';
  }

  btnEntrarRapido.addEventListener('click', irParaLogin);

  function obterNome(usuario) {
    const meta = usuario?.user_metadata || {};

    return (
      meta.full_name ||
      meta.name ||
      meta.user_name ||
      meta.preferred_username ||
      usuario?.email?.split('@')[0] ||
      'Usuário'
    );
  }

  function obterAvatar(usuario) {
    const meta = usuario?.user_metadata || {};
    return meta.avatar_url || meta.picture || null;
  }

  function obterProvider(usuario) {
    const provider = usuario?.app_metadata?.provider;

    if (provider === 'google') return 'Google';
    if (provider === 'github') return 'GitHub';

    return 'Conta CodeHelper';
  }

  function configurarAvatar(imagem, inicial, nome, avatar) {
    inicial.textContent = nome.charAt(0).toUpperCase();
    imagem.onerror = () => {
      imagem.hidden = true;
      inicial.hidden = false;
    };

    if (avatar) {
      imagem.src = avatar;
      imagem.alt = `Foto de ${nome}`;
      imagem.hidden = false;
      inicial.hidden = true;
    } else {
      imagem.removeAttribute('src');
      imagem.hidden = true;
      inicial.hidden = false;
    }
  }

  function mostrarUsuario(usuario) {
    usuarioLogado = true;
    perfilRoot.classList.remove('modo-convidado');

    const nome = obterNome(usuario);
    const avatar = obterAvatar(usuario);
    const provider = obterProvider(usuario);

    perfilRoot.querySelector('.perfil-nome').textContent = nome;
    perfilRoot.querySelector('.perfil-status').textContent = provider;
    perfilRoot.querySelector('.perfil-popup-nome').textContent = nome;
    perfilRoot.querySelector('.perfil-popup-email').textContent = usuario.email || 'Conta CodeHelper';
    perfilRoot.querySelector('.perfil-popup-provider').textContent = provider;

    btnEntrarRapido.hidden = true;
    itemPerfil.hidden = false;
    textoSair.textContent = 'Sair';

    configurarAvatar(
      perfilRoot.querySelector('.perfil-avatar-img'),
      perfilRoot.querySelector('.perfil-avatar-inicial'),
      nome,
      avatar
    );

    configurarAvatar(
      perfilRoot.querySelector('.perfil-popup-avatar-img'),
      perfilRoot.querySelector('.perfil-popup-avatar-inicial'),
      nome,
      avatar
    );
  }

  function mostrarConvidado() {
    usuarioLogado = false;
    perfilRoot.classList.add('modo-convidado');

    perfilRoot.querySelector('.perfil-nome').textContent = 'Convidado';
    perfilRoot.querySelector('.perfil-status').textContent = 'Progresso não salvo';
    perfilRoot.querySelector('.perfil-popup-nome').textContent = 'Modo convidado';
    perfilRoot.querySelector('.perfil-popup-email').textContent = 'Entre para salvar seu progresso';
    perfilRoot.querySelector('.perfil-popup-provider').textContent = 'Convidado';

    btnEntrarRapido.hidden = false;
    itemPerfil.hidden = true;
    textoSair.textContent = 'Entrar ou criar conta';

    perfilRoot.querySelectorAll('.perfil-avatar-img').forEach(imagem => {
      imagem.removeAttribute('src');
      imagem.hidden = true;
    });

    perfilRoot.querySelectorAll('.perfil-avatar-inicial, .perfil-popup-avatar-inicial').forEach(inicial => {
      inicial.hidden = false;
      inicial.textContent = 'C';
    });
  }

  async function carregarConta(cliente) {
    try {
      const { data, error } = await cliente.auth.getSession();

      if (error) throw error;

      if (data?.session?.user) {
        mostrarUsuario(data.session.user);
      } else {
        mostrarConvidado();
      }
    } catch (erro) {
      console.error('Erro ao carregar conta:', erro);
      mostrarConvidado();
    }
  }

  function abrirConfiguracao(tipo) {
    navegarPara('config');
    fecharPopup();

    setTimeout(() => {
      const painel = document.getElementById('painel-config');
      if (!painel) return;

      if (tipo === 'perfil') {
        const form = document.getElementById('form-perfil');
        form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }

  perfilRoot.querySelectorAll('.perfil-menu-item').forEach(botao => {
    botao.addEventListener('click', async () => {
      const acao = botao.dataset.acao;

      if (acao === 'perfil') {
        abrirConfiguracao('perfil');
        return;
      }

      if (acao === 'personalizacao' || acao === 'config') {
        abrirConfiguracao('geral');
        return;
      }

      if (acao === 'sobre') {
        navegarPara('sobre');
        fecharPopup();
        return;
      }

      if (acao === 'sair') {
        if (!usuarioLogado) {
          irParaLogin();
          return;
        }

        const cliente = obterClienteSupabase();
        if (!cliente?.auth) return;

        try {
          const { error } = await cliente.auth.signOut();
          if (error) throw error;
          window.location.href = 'index.html';
        } catch (erro) {
          console.error('Erro ao sair da conta:', erro);
        }
      }
    });
  });

  let tentativasCliente = 0;

  const verificacaoCliente = setInterval(() => {
    const cliente = obterClienteSupabase();

    if (cliente?.auth) {
      clearInterval(verificacaoCliente);

      cliente.auth.onAuthStateChange((evento, sessao) => {
        if (sessao?.user) mostrarUsuario(sessao.user);
        else mostrarConvidado();
      });

      carregarConta(cliente);
      return;
    }

    tentativasCliente++;

    if (tentativasCliente >= 100) {
      clearInterval(verificacaoCliente);
      console.error('Cliente Supabase não foi encontrado pela navegação.');
      mostrarConvidado();
    }
  }, 100);
})();
