const dashboardSaudacao =
  document.getElementById('dashboard-saudacao');

const dashboardTotalTermos =
  document.getElementById('dashboard-total-termos');

const dashboardTotalFavoritos =
  document.getElementById('dashboard-total-favoritos');

const dashboardTotalConversas =
  document.getElementById('dashboard-total-conversas');

const painelInicio =
  document.querySelector('.painel-inicio');

const containerEstatisticas =
  document.querySelector('.dashboard-estatisticas');

const DASHBOARD_ICONES = {
  termos: `
    <svg viewBox="0 0 24 24">
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22Z"/>
      <path d="M4 5.5V22"/>
      <path d="M8 7h8"/>
      <path d="M8 11h6"/>
    </svg>
  `,
  favoritos: `
    <svg viewBox="0 0 24 24">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>
    </svg>
  `,
  conversas: `
    <svg viewBox="0 0 24 24">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>
      <path d="M8 9h8"/>
      <path d="M8 13h5"/>
    </svg>
  `,
  quiz: `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.8 9a2.4 2.4 0 0 1 4.65.8c0 1.8-2.45 2.1-2.45 3.7"/>
      <path d="M12 17h.01"/>
    </svg>
  `,
  trofeu: `
    <svg viewBox="0 0 24 24">
      <path d="M8 3h8v5a4 4 0 0 1-8 0Z"/>
      <path d="M8 5H4v2a4 4 0 0 0 4 4"/>
      <path d="M16 5h4v2a4 4 0 0 1-4 4"/>
      <path d="M12 12v5"/>
      <path d="M8 21h8"/>
      <path d="M10 17h4"/>
    </svg>
  `,
  recente: `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  `
};

let dashboardAtualizacao = 0;

function navegarDashboard(destino) {
  if (!destino) return;

  const aba = document.querySelector(
    `.aba-btn[data-aba="${destino}"]`
  );

  aba?.click();
}

function prepararEstatisticas() {
  if (!containerEstatisticas) return;

  const statsExistentes = [
    {
      elemento: dashboardTotalTermos,
      icone: DASHBOARD_ICONES.termos,
      tipo: 'termos'
    },
    {
      elemento: dashboardTotalFavoritos,
      icone: DASHBOARD_ICONES.favoritos,
      tipo: 'favoritos'
    },
    {
      elemento: dashboardTotalConversas,
      icone: DASHBOARD_ICONES.conversas,
      tipo: 'conversas'
    }
  ];

  statsExistentes.forEach(({ elemento, icone, tipo }) => {
    const card = elemento?.closest('.dashboard-stat');

    if (!card) return;

    card.classList.add(`dashboard-stat-${tipo}`);

    if (card.querySelector('.dashboard-stat-icone')) {
      return;
    }

    const iconeContainer = document.createElement('div');

    iconeContainer.className = 'dashboard-stat-icone';
    iconeContainer.innerHTML = icone;

    card.insertAdjacentElement(
      'afterbegin',
      iconeContainer
    );
  });
}

function criarCardsProgresso() {
  if (!containerEstatisticas) return;

  if (document.getElementById('dashboard-quizzes-feitos')) {
    return;
  }

  const cards = [
    {
      classe: 'dashboard-stat-quiz',
      icone: DASHBOARD_ICONES.quiz,
      id: 'dashboard-quizzes-feitos',
      valor: '0',
      label: 'quizzes realizados'
    },
    {
      classe: 'dashboard-stat-melhor',
      icone: DASHBOARD_ICONES.trofeu,
      id: 'dashboard-melhor-quiz',
      valor: '--',
      label: 'melhor resultado'
    },
    {
      classe: 'dashboard-stat-recente',
      icone: DASHBOARD_ICONES.recente,
      id: 'dashboard-ultimo-quiz',
      valor: '--',
      label: 'último quiz'
    }
  ];

  cards.forEach(card => {
    const elemento = document.createElement('div');

    elemento.className =
      `dashboard-stat ${card.classe}`;

    elemento.innerHTML = `
      <div class="dashboard-stat-icone">
        ${card.icone}
      </div>
      <span
        id="${card.id}"
        class="dashboard-stat-numero"
      >${card.valor}</span>
      <span class="dashboard-stat-label">${card.label}</span>
    `;

    containerEstatisticas.appendChild(elemento);
  });
}

function criarBlocoContinuar() {
  if (
    !painelInicio ||
    document.getElementById('dashboard-continuar')
  ) {
    return;
  }

  const estatisticas = document.querySelector(
    '.dashboard-estatisticas'
  );

  const bloco = document.createElement('section');

  bloco.id = 'dashboard-continuar';
  bloco.className = 'dashboard-continuar';

  bloco.innerHTML = `
    <div class="dashboard-continuar-topo">
      <div>
        <span class="dashboard-mini-label">
          SEU PROGRESSO
        </span>
        <h2>Continue aprendendo</h2>
        <p id="dashboard-continuar-texto">
          Faça um quiz para acompanhar sua evolução.
        </p>
      </div>

      <button
        id="dashboard-continuar-botao"
        class="dashboard-continuar-botao"
        type="button"
      >
        Continuar
        <span>→</span>
      </button>
    </div>

    <div class="dashboard-progresso-area">
      <div class="dashboard-progresso-info">
        <span>Desempenho recente</span>
        <strong id="dashboard-progresso-percentual">0%</strong>
      </div>

      <div
        class="dashboard-progresso-trilho"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <div
          id="dashboard-progresso-barra"
          class="dashboard-progresso-barra"
        ></div>
      </div>

      <div class="dashboard-progresso-rodape">
        <span id="dashboard-progresso-detalhe">
          Nenhum quiz realizado ainda
        </span>

        <button
          id="dashboard-ver-progresso"
          type="button"
        >
          Fazer quiz
        </button>
      </div>
    </div>
  `;

  if (estatisticas) {
    estatisticas.insertAdjacentElement('afterend', bloco);
  } else {
    painelInicio.appendChild(bloco);
  }

  bloco
    .querySelector('#dashboard-continuar-botao')
    ?.addEventListener('click', () => {
      navegarDashboard('quiz');
    });

  bloco
    .querySelector('#dashboard-ver-progresso')
    ?.addEventListener('click', () => {
      navegarDashboard('quiz');
    });
}

function prepararCardsFerramentas() {
  document
    .querySelectorAll('.dashboard-card')
    .forEach((card, indice) => {
      card.style.setProperty(
        '--dashboard-delay',
        `${indice * 35}ms`
      );

      if (!card.querySelector('.dashboard-card-brilho')) {
        const brilho = document.createElement('span');

        brilho.className = 'dashboard-card-brilho';
        brilho.setAttribute('aria-hidden', 'true');

        card.appendChild(brilho);
      }
    });
}

function configurarNavegacaoCards() {
  document
    .querySelectorAll('.dashboard-navegar')
    .forEach(botao => {
      if (botao.dataset.dashboardConfigurado) {
        return;
      }

      botao.dataset.dashboardConfigurado = 'true';

      botao.addEventListener('click', () => {
        navegarDashboard(botao.dataset.destino);
      });
    });
}

function obterPrimeiroNome(usuario) {
  const metadata = usuario?.user_metadata || {};

  const nomeCompleto = (
    metadata.nome ||
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    metadata.preferred_username ||
    ''
  ).trim();

  if (nomeCompleto) {
    return nomeCompleto.split(/\s+/)[0];
  }

  if (usuario?.email) {
    return usuario.email.split('@')[0];
  }

  return null;
}

function obterSaudacao() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) {
    return 'Bom dia';
  }

  if (hora >= 12 && hora < 18) {
    return 'Boa tarde';
  }

  return 'Boa noite';
}

function atualizarBlocoProgresso(resultados) {
  const barra = document.getElementById(
    'dashboard-progresso-barra'
  );

  const percentualEl = document.getElementById(
    'dashboard-progresso-percentual'
  );

  const detalheEl = document.getElementById(
    'dashboard-progresso-detalhe'
  );

  const textoEl = document.getElementById(
    'dashboard-continuar-texto'
  );

  const trilho = document.querySelector(
    '.dashboard-progresso-trilho'
  );

  if (!barra || !percentualEl || !detalheEl) {
    return;
  }

  if (!Array.isArray(resultados) || resultados.length === 0) {
    percentualEl.textContent = '0%';
    detalheEl.textContent = 'Nenhum quiz realizado ainda';

    if (textoEl) {
      textoEl.textContent =
        'Comece com um quiz rápido e acompanhe sua evolução.';
    }

    barra.style.width = '0%';

    trilho?.setAttribute('aria-valuenow', '0');

    return;
  }

  const ultimo = resultados[0];

  const percentual = Math.max(
    0,
    Math.min(
      100,
      Math.round(Number(ultimo.percentual) || 0)
    )
  );

  const acertos = Number(ultimo.acertos) || 0;
  const total = Number(ultimo.total) || 0;

  percentualEl.textContent = `${percentual}%`;

  detalheEl.textContent =
    `${acertos} de ${total} respostas corretas no último quiz`;

  barra.style.width = `${percentual}%`;

  trilho?.setAttribute(
    'aria-valuenow',
    String(percentual)
  );

  if (!textoEl) return;

  if (percentual >= 80) {
    textoEl.textContent =
      'Ótimo resultado. Continue praticando para manter o ritmo.';
  } else if (percentual >= 50) {
    textoEl.textContent =
      'Você está avançando. Mais algumas tentativas podem melhorar seu resultado.';
  } else {
    textoEl.textContent =
      'Continue praticando. O CodeHelper está aqui para ajudar nos pontos mais difíceis.';
  }
}

function configurarConvidado() {
  if (dashboardSaudacao) {
    dashboardSaudacao.textContent =
      `${obterSaudacao()}!`;
  }

  if (dashboardTotalFavoritos) {
    dashboardTotalFavoritos.textContent = '0';
  }

  if (dashboardTotalConversas) {
    dashboardTotalConversas.textContent = '0';
  }

  const quizzes = document.getElementById(
    'dashboard-quizzes-feitos'
  );

  const melhor = document.getElementById(
    'dashboard-melhor-quiz'
  );

  const ultimo = document.getElementById(
    'dashboard-ultimo-quiz'
  );

  if (quizzes) quizzes.textContent = '0';
  if (melhor) melhor.textContent = '--';
  if (ultimo) ultimo.textContent = '--';

  atualizarBlocoProgresso([]);
}

async function atualizarDashboard() {
  const atualizacao = ++dashboardAtualizacao;

  criarCardsProgresso();
  prepararEstatisticas();
  criarBlocoContinuar();
  prepararCardsFerramentas();
  configurarNavegacaoCards();

  try {
    const resposta = await fetch('/api/termos');

    if (atualizacao !== dashboardAtualizacao) return;

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os termos.');
    }

    const termos = await resposta.json();

    if (dashboardTotalTermos) {
      dashboardTotalTermos.textContent =
        Array.isArray(termos) ? termos.length : 0;
    }
  } catch (erro) {
    console.error('Erro ao carregar termos:', erro);

    if (dashboardTotalTermos) {
      dashboardTotalTermos.textContent = '0';
    }
  }

  let usuario = null;

  try {
    if (
      typeof supabaseClient === 'undefined' ||
      !supabaseClient?.auth
    ) {
      configurarConvidado();
      return;
    }

    const { data, error } =
      await supabaseClient.auth.getSession();

    if (error) throw error;

    usuario = data?.session?.user || null;
  } catch (erro) {
    console.error('Erro ao carregar sessão:', erro);
    configurarConvidado();
    return;
  }

  if (atualizacao !== dashboardAtualizacao) return;

  if (!usuario) {
    configurarConvidado();
    return;
  }

  const primeiroNome = obterPrimeiroNome(usuario);
  const saudacao = obterSaudacao();

  if (dashboardSaudacao) {
    dashboardSaudacao.textContent = primeiroNome
      ? `${saudacao}, ${primeiroNome}!`
      : `${saudacao}!`;
  }

  const quizzesFeitosEl = document.getElementById(
    'dashboard-quizzes-feitos'
  );

  const melhorQuizEl = document.getElementById(
    'dashboard-melhor-quiz'
  );

  const ultimoQuizEl = document.getElementById(
    'dashboard-ultimo-quiz'
  );

  const consultas = [
    {
      tabela: 'favoritos',
      elemento: dashboardTotalFavoritos
    },
    {
      tabela: 'conversas',
      elemento: dashboardTotalConversas
    }
  ];

  await Promise.all(
    consultas.map(async ({ tabela, elemento }) => {
      if (!elemento) return;

      try {
        const { count, error } = await supabaseClient
          .from(tabela)
          .select('*', {
            count: 'exact',
            head: true
          })
          .eq('user_id', usuario.id);

        if (error) throw error;

        if (atualizacao !== dashboardAtualizacao) return;

        elemento.textContent = count ?? 0;
      } catch (erro) {
        console.error(`Erro ao carregar ${tabela}:`, erro);
        elemento.textContent = '0';
      }
    })
  );

  try {
    const { data: resultados, error } = await supabaseClient
      .from('quiz_resultados')
      .select('acertos, total, percentual, created_at')
      .eq('user_id', usuario.id)
      .order('created_at', {
        ascending: false
      });

    if (error) throw error;

    if (atualizacao !== dashboardAtualizacao) return;

    const listaResultados = Array.isArray(resultados)
      ? resultados
      : [];

    if (quizzesFeitosEl) {
      quizzesFeitosEl.textContent = listaResultados.length;
    }

    if (listaResultados.length === 0) {
      if (melhorQuizEl) {
        melhorQuizEl.textContent = '--';
      }

      if (ultimoQuizEl) {
        ultimoQuizEl.textContent = '--';
      }

      atualizarBlocoProgresso([]);
      return;
    }

    const ultimo = listaResultados[0];

    if (ultimoQuizEl) {
      ultimoQuizEl.textContent =
        `${ultimo.acertos}/${ultimo.total}`;
    }

    const melhor = [...listaResultados].sort(
      (a, b) =>
        Number(b.percentual) - Number(a.percentual)
    )[0];

    if (melhorQuizEl) {
      melhorQuizEl.textContent =
        `${melhor.acertos}/${melhor.total}`;
    }

    atualizarBlocoProgresso(listaResultados);

  } catch (erro) {
    console.error('Erro ao carregar progresso:', erro);

    if (atualizacao !== dashboardAtualizacao) return;

    if (quizzesFeitosEl) {
      quizzesFeitosEl.textContent = '0';
    }

    if (melhorQuizEl) {
      melhorQuizEl.textContent = '--';
    }

    if (ultimoQuizEl) {
      ultimoQuizEl.textContent = '--';
    }

    atualizarBlocoProgresso([]);
  }
}

const btnInicio = document.querySelector(
  '.aba-btn[data-aba="inicio"]'
);

if (btnInicio) {
  btnInicio.addEventListener('click', () => {
    atualizarDashboard();
  });
}

criarCardsProgresso();
prepararEstatisticas();
criarBlocoContinuar();
prepararCardsFerramentas();
configurarNavegacaoCards();
atualizarDashboard();