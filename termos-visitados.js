(() => {
  const ID_CONTADOR = 'dashboard-termos-estudados';

  let totalTermos = 0;
  let nomesValidos = new Set();
  let termosVisitados = new Set();
  let chaveStorage = 'codehelper_termos_visitados_convidado';
  let observerContador = null;
  let inicializado = false;

  async function definirChaveStorage() {
    try {
      if (
        typeof supabaseClient !== 'undefined' &&
        supabaseClient?.auth
      ) {
        const { data, error } =
          await supabaseClient.auth.getSession();

        if (error) {
          throw error;
        }

        const usuario = data?.session?.user;

        if (usuario?.id) {
          chaveStorage =
            `codehelper_termos_visitados_${usuario.id}`;
        }
      }
    } catch (erro) {
      console.warn(
        'Não foi possível identificar o usuário para os termos visitados.',
        erro
      );
    }
  }

  function carregarVisitados() {
    try {
      const salvo = localStorage.getItem(chaveStorage);

      if (!salvo) {
        termosVisitados = new Set();
        return;
      }

      const lista = JSON.parse(salvo);

      termosVisitados = new Set(
        Array.isArray(lista)
          ? lista.filter(
              nome =>
                typeof nome === 'string' &&
                nome.trim().length > 0
            )
          : []
      );
    } catch (erro) {
      termosVisitados = new Set();

      console.warn(
        'Erro ao carregar termos visitados.',
        erro
      );
    }
  }

  function salvarVisitados() {
    try {
      localStorage.setItem(
        chaveStorage,
        JSON.stringify([...termosVisitados])
      );
    } catch (erro) {
      console.warn(
        'Erro ao salvar termos visitados.',
        erro
      );
    }
  }

  function atualizarDashboard() {
    const contador = document.getElementById(ID_CONTADOR);

    if (!contador) {
      return;
    }

    contador.textContent =
      `${termosVisitados.size}/${totalTermos}`;

    const card = contador.closest('.dashboard-stat');

    const label = card?.querySelector(
      '.dashboard-stat-label'
    );

    if (label) {
      label.textContent = 'termos visitados';
    }
  }

  function registrarVisita(nome) {
    if (typeof nome !== 'string') {
      return;
    }

    const termo = nome.trim();

    if (!termo) {
      return;
    }

    if (
      nomesValidos.size > 0 &&
      !nomesValidos.has(termo)
    ) {
      return;
    }

    if (termosVisitados.has(termo)) {
      return;
    }

    termosVisitados.add(termo);

    salvarVisitados();
    atualizarDashboard();
  }

  async function carregarTotalTermos() {
    try {
      const resposta = await fetch('/api/termos');

      if (!resposta.ok) {
        throw new Error(
          'Não foi possível carregar os termos.'
        );
      }

      const termos = await resposta.json();

      if (!Array.isArray(termos)) {
        return;
      }

      totalTermos = termos.length;

      nomesValidos = new Set(
        termos
          .map(termo => termo?.name)
          .filter(
            nome =>
              typeof nome === 'string' &&
              nome.trim().length > 0
          )
      );

      termosVisitados = new Set(
        [...termosVisitados].filter(
          nome => nomesValidos.has(nome)
        )
      );

      salvarVisitados();
      atualizarDashboard();
    } catch (erro) {
      console.error(
        'Erro ao calcular termos visitados:',
        erro
      );
    }
  }

  function configurarCliques() {
    document.addEventListener(
      'click',
      evento => {
        const alvo = evento.target;

        if (!(alvo instanceof Element)) {
          return;
        }

        const cabecalho = alvo.closest(
          '#lista .card-head'
        );

        if (cabecalho) {
          const card = cabecalho.closest('.card');

          const nome = card
            ?.querySelector('.nome')
            ?.textContent
            ?.trim();

          setTimeout(() => {
            if (
              card?.classList.contains('aberto')
            ) {
              registrarVisita(nome);
            }
          }, 0);
        }

        const relacionado = alvo.closest(
          '.chip-relacionado'
        );

        if (relacionado) {
          registrarVisita(
            relacionado.dataset.termo
          );
        }

        const inicio = alvo.closest(
          '.aba-btn[data-aba="inicio"]'
        );

        if (inicio) {
          setTimeout(
            atualizarDashboard,
            0
          );
        }
      },
      true
    );
  }

  function observarContador() {
    const contador = document.getElementById(ID_CONTADOR);

    if (!contador || observerContador) {
      return;
    }

    observerContador = new MutationObserver(() => {
      if (totalTermos <= 0) {
        return;
      }

      const correto =
        `${termosVisitados.size}/${totalTermos}`;

      if (contador.textContent.trim() !== correto) {
        contador.textContent = correto;
      }

      const label = contador
        .closest('.dashboard-stat')
        ?.querySelector('.dashboard-stat-label');

      if (
        label &&
        label.textContent.trim() !== 'termos visitados'
      ) {
        label.textContent = 'termos visitados';
      }
    });

    observerContador.observe(
      contador,
      {
        childList: true,
        subtree: true,
        characterData: true
      }
    );
  }

  async function iniciarTermosVisitados() {
    if (inicializado) {
      return;
    }

    inicializado = true;

    await definirChaveStorage();

    carregarVisitados();

    configurarCliques();

    await carregarTotalTermos();

    observarContador();

    atualizarDashboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      iniciarTermosVisitados,
      { once: true }
    );
  } else {
    iniciarTermosVisitados();
  }
})();