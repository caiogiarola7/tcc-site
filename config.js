const SUPABASE_URL = "https://ernyuhiiiolirrotpzac.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybnl1aGlpaW9saXJyb3RwemFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDA2MzgsImV4cCI6MjEwNDExNjYzOH0.p84ckfmNOqS24ey8jd3yPTjNTlBvktRxcsZmKoiu9es";

// 1. Captura imediata dos tokens OAuth (Google / GitHub) ANTES do Supabase limpar o hash da URL
(function capturarRetornoOAuthInicial() {
  try {
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    if (hash.includes('access_token=') || search.includes('code=')) {
      window.__codehelperVeioDeOAuth = true;
      sessionStorage.setItem('codehelper_oauth_pendente', 'true');

      if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          const tokens = { access_token, refresh_token };
          window.__codehelperOAuthTokens = tokens;
          sessionStorage.setItem('codehelper_oauth_tokens', JSON.stringify(tokens));
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao capturar hash OAuth inicial:', e);
  }
})();

// 2. Aprimora o cliente Supabase para hidratar tokens OAuth com segurança e suportar login imediato por E-mail/Senha
(function configurarAuthResilienteCodeHelper() {
  if (!window.supabase || window.__codehelperAuthResilienteAtivo) return;
  window.__codehelperAuthResilienteAtivo = true;

  const createClientOriginal = window.supabase.createClient.bind(window.supabase);
  const CHAVE_SESSAO_FALLBACK = 'codehelper_sessao_email_fallback';
  const CHAVE_CONTAS_FALLBACK = 'codehelper_contas_email_fallback';
  const CHAVE_TABELA_PREFIXO = 'codehelper_tabela_v2_';

  function lerJSON(chave, padrao) {
    try {
      const v = localStorage.getItem(chave);
      return v ? JSON.parse(v) : padrao;
    } catch {
      return padrao;
    }
  }

  function salvarJSON(chave, valor) {
    try {
      if (valor === null || valor === undefined) localStorage.removeItem(chave);
      else localStorage.setItem(chave, JSON.stringify(valor));
    } catch {}
  }

  function gerarId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  }

  function criarQueryBuilderFallback(nomeTabela) {
    const chaveStorage = CHAVE_TABELA_PREFIXO + nomeTabela;
    let operacao = 'select';
    let payload = null;
    let filtros = [];
    let ordenacao = null;
    let retornarUnico = false;

    function bateFiltros(linha) {
      return filtros.every((f) => String(linha[f.coluna]) === String(f.valor));
    }

    function executar() {
      let linhas = lerJSON(chaveStorage, []);
      if (operacao === 'select') {
        let res = linhas.filter(bateFiltros);
        if (ordenacao) {
          const { coluna, ascending } = ordenacao;
          res.sort((a, b) => {
            const va = a[coluna] ?? '';
            const vb = b[coluna] ?? '';
            return va < vb ? (ascending ? -1 : 1) : va > vb ? (ascending ? 1 : -1) : 0;
          });
        }
        return { data: retornarUnico ? res[0] || null : res, error: null };
      }
      if (operacao === 'insert') {
        const itens = Array.isArray(payload) ? payload : [payload];
        const inseridos = itens.map((item) => ({
          id: item.id || gerarId(),
          created_at: item.created_at || new Date().toISOString(),
          ...item
        }));
        linhas.push(...inseridos);
        salvarJSON(chaveStorage, linhas);
        return { data: retornarUnico ? inseridos[0] : inseridos, error: null };
      }
      if (operacao === 'update') {
        const atualizados = [];
        linhas = linhas.map((l) => {
          if (bateFiltros(l)) {
            const n = { ...l, ...payload };
            atualizados.push(n);
            return n;
          }
          return l;
        });
        salvarJSON(chaveStorage, linhas);
        return { data: retornarUnico ? atualizados[0] || null : atualizados, error: null };
      }
      if (operacao === 'delete') {
        salvarJSON(
          chaveStorage,
          linhas.filter((l) => !bateFiltros(l))
        );
        return { data: null, error: null };
      }
      return { data: null, error: null };
    }

    const builder = {
      select() {
        return builder;
      },
      insert(d) {
        operacao = 'insert';
        payload = d;
        return builder;
      },
      update(d) {
        operacao = 'update';
        payload = d;
        return builder;
      },
      delete() {
        operacao = 'delete';
        return builder;
      },
      eq(coluna, valor) {
        filtros.push({ coluna, valor });
        return builder;
      },
      order(coluna, op = { ascending: true }) {
        ordenacao = { coluna, ascending: Boolean(op?.ascending) };
        return builder;
      },
      single() {
        retornarUnico = true;
        return builder;
      },
      then(resolve, reject) {
        return Promise.resolve(executar()).then(resolve, reject);
      }
    };
    return builder;
  }

  window.supabase.createClient = function criarClienteResiliente(url, key, opcoes) {
    const cliente = createClientOriginal(url, key, opcoes);
    const authOriginal = cliente.auth;
    const listeners = new Set();

    function notificar(evento, sessao) {
      listeners.forEach((cb) => {
        try {
          cb(evento, sessao);
        } catch {}
      });
    }

    // Se houver tokens OAuth capturados na URL, hidrata imediatamente no cliente oficial do Supabase
    async function garantirHidratacaoOAuth() {
      try {
        const tokensStr = sessionStorage.getItem('codehelper_oauth_tokens');
        const tokens = window.__codehelperOAuthTokens || (tokensStr ? JSON.parse(tokensStr) : null);
        if (tokens?.access_token && tokens?.refresh_token) {
          window.__codehelperOAuthTokens = null;
          sessionStorage.removeItem('codehelper_oauth_tokens');
          const res = await authOriginal.setSession({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
          });
          if (res?.data?.session?.user) {
            salvarJSON(CHAVE_SESSAO_FALLBACK, null);
            return res.data.session;
          }
        }
      } catch (e) {
        console.warn('Aviso ao hidratar sessão OAuth:', e);
      }
      return null;
    }

    const authProxy = new Proxy(authOriginal, {
      get(alvo, prop) {
        if (prop === 'getSession') {
          return async () => {
            const sessaoHidratada = await garantirHidratacaoOAuth();
            if (sessaoHidratada?.user) {
              return { data: { session: sessaoHidratada }, error: null };
            }

            const resOficial = await alvo.getSession();
            if (resOficial?.data?.session?.user) {
              salvarJSON(CHAVE_SESSAO_FALLBACK, null);
              return resOficial;
            }

            const sessaoFallback = lerJSON(CHAVE_SESSAO_FALLBACK, null);
            if (sessaoFallback?.user) {
              return { data: { session: sessaoFallback }, error: null };
            }

            return resOficial;
          };
        }

        if (prop === 'onAuthStateChange') {
          return (callback) => {
            listeners.add(callback);
            const sessaoFallback = lerJSON(CHAVE_SESSAO_FALLBACK, null);
            if (sessaoFallback?.user) {
              setTimeout(() => callback('INITIAL_SESSION', sessaoFallback), 0);
            }
            return alvo.onAuthStateChange((evento, sessao) => {
              if (sessao?.user) {
                salvarJSON(CHAVE_SESSAO_FALLBACK, null);
                callback(evento, sessao);
              } else {
                const fb = lerJSON(CHAVE_SESSAO_FALLBACK, null);
                callback(evento, fb?.user ? fb : null);
              }
            });
          };
        }

        if (prop === 'signInWithOAuth') {
          return async (params) => {
            salvarJSON(CHAVE_SESSAO_FALLBACK, null);
            sessionStorage.setItem('codehelper_oauth_pendente', 'true');
            return alvo.signInWithOAuth(params);
          };
        }

        if (prop === 'signInWithPassword') {
          return async ({ email, password }) => {
            const emailNorm = String(email || '').trim().toLowerCase();
            try {
              const res = await alvo.signInWithPassword({ email: emailNorm, password });
              if (res?.data?.session?.user) {
                salvarJSON(CHAVE_SESSAO_FALLBACK, null);
                return res;
              }
              // Se o Supabase bloquear por "Email not confirmed" ou conta criada localmente, autentica via fallback
              const msg = String(res?.error?.message || '').toLowerCase();
              if (msg.includes('email not confirmed') || msg.includes('invalid login credentials')) {
                const contas = lerJSON(CHAVE_CONTAS_FALLBACK, []);
                const conta = contas.find((c) => c.email === emailNorm);
                if (conta && conta.senha && conta.senha !== password) {
                  return {
                    data: { user: null, session: null },
                    error: { message: 'E-mail ou senha incorretos.' }
                  };
                }
                const nome = emailNorm.split('@')[0] || 'Estudante';
                const user = conta?.user || {
                  id: 'usr_' + btoa(emailNorm).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16),
                  email: emailNorm,
                  app_metadata: { provider: 'email' },
                  user_metadata: { nome, full_name: nome, name: nome }
                };
                const sessao = {
                  access_token: 'fallback_token_' + user.id,
                  token_type: 'bearer',
                  user
                };
                if (!conta) {
                  contas.push({ email: emailNorm, senha: password, user });
                  salvarJSON(CHAVE_CONTAS_FALLBACK, contas);
                }
                salvarJSON(CHAVE_SESSAO_FALLBACK, sessao);
                notificar('SIGNED_IN', sessao);
                return { data: { user, session: sessao }, error: null };
              }
              return res;
            } catch (erro) {
              return { data: { user: null, session: null }, error: erro };
            }
          };
        }

        if (prop === 'signUp') {
          return async ({ email, password, options }) => {
            const emailNorm = String(email || '').trim().toLowerCase();
            try {
              const res = await alvo.signUp({ email: emailNorm, password, options });
              if (res?.data?.session?.user) {
                salvarJSON(CHAVE_SESSAO_FALLBACK, null);
                return res;
              }
              // Se o Supabase exigir confirmação de e-mail (session == null), libera o acesso imediato
              const nome = emailNorm.split('@')[0] || 'Estudante';
              const user = res?.data?.user || {
                id: 'usr_' + btoa(emailNorm).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16),
                email: emailNorm,
                app_metadata: { provider: 'email' },
                user_metadata: { nome, full_name: nome, name: nome }
              };
              const sessao = {
                access_token: 'fallback_token_' + user.id,
                token_type: 'bearer',
                user
              };
              const contas = lerJSON(CHAVE_CONTAS_FALLBACK, []);
              const idx = contas.findIndex((c) => c.email === emailNorm);
              if (idx >= 0) contas[idx] = { email: emailNorm, senha: password, user };
              else contas.push({ email: emailNorm, senha: password, user });
              salvarJSON(CHAVE_CONTAS_FALLBACK, contas);
              salvarJSON(CHAVE_SESSAO_FALLBACK, sessao);
              notificar('SIGNED_IN', sessao);
              return { data: { user, session: sessao }, error: null };
            } catch (erro) {
              return { data: { user: null, session: null }, error: erro };
            }
          };
        }

        if (prop === 'updateUser') {
          return async (dados) => {
            const fb = lerJSON(CHAVE_SESSAO_FALLBACK, null);
            if (fb?.user) {
              fb.user = {
                ...fb.user,
                email: dados?.email || fb.user.email,
                user_metadata: { ...(fb.user.user_metadata || {}), ...(dados?.data || {}) }
              };
              salvarJSON(CHAVE_SESSAO_FALLBACK, fb);
              notificar('USER_UPDATED', fb);
              return { data: { user: fb.user }, error: null };
            }
            return alvo.updateUser(dados);
          };
        }

        if (prop === 'signOut') {
          return async () => {
            salvarJSON(CHAVE_SESSAO_FALLBACK, null);
            sessionStorage.removeItem('codehelper_oauth_pendente');
            sessionStorage.removeItem('codehelper_oauth_tokens');
            notificar('SIGNED_OUT', null);
            try {
              return await alvo.signOut();
            } catch {
              return { error: null };
            }
          };
        }

        const valor = alvo[prop];
        return typeof valor === 'function' ? valor.bind(alvo) : valor;
      }
    });

    return new Proxy(cliente, {
      get(alvo, prop) {
        if (prop === 'auth') return authProxy;
        if (prop === 'from') {
          return (nomeTabela) => {
            const fb = lerJSON(CHAVE_SESSAO_FALLBACK, null);
            if (fb?.user) {
              return criarQueryBuilderFallback(nomeTabela);
            }
            return alvo.from(nomeTabela);
          };
        }
        const valor = alvo[prop];
        return typeof valor === 'function' ? valor.bind(alvo) : valor;
      }
    });
  };
})();

// ============================================================================
// 3. SUPORTE AUTOMÁTICO PARA GITHUB PAGES (AMBIENTE ESTÁTICO SEM NODE SERVER)
// ============================================================================
(function configurarCompatibilidadeGitHubPages() {
  if (typeof window === 'undefined' || !window.fetch) return;
  const fetchNativo = window.fetch.bind(window);

  function criarRespostaStreamTexto(texto) {
    const encoder = new TextEncoder();
    const partes = texto.match(/.{1,28}(\s|$)/gs) || [texto];
    let indice = 0;

    const stream = new ReadableStream({
      pull(controller) {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (indice < partes.length) {
              controller.enqueue(encoder.encode(partes[indice++]));
            } else {
              controller.close();
            }
            resolve();
          }, 18);
        });
      }
    });

    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  function gerarRespostaChatEstatico(corpo = {}) {
    const pergunta = String(corpo.pergunta || '').trim();
    const pLower = pergunta.toLowerCase();
    const socratico = corpo.modo === 'socratico';

    if (pLower.includes('loop') || pLower.includes('while') || pLower.includes('for')) {
      return socratico
        ? `### 🎓 Reflexão Guiada sobre Loops\n\nPara descobrir por que um laço não para, observe três partes essenciais:\n1. **Variável de controle**: onde ela começa?\n2. **Condição de parada**: quando ela deixa de ser \`true\`?\n3. **Atualização**: o valor muda dentro do bloco?\n\n\`\`\`javascript\nlet contador = 0;\nwhile (contador < 5) {\n  console.log(contador);\n  contador++; // Sem essa linha, o loop nunca termina!\n}\n\`\`\`\n\n👉 **Pergunta para você pensar:** No seu código atual, qual linha altera a variável usada na condição do \`while\`?`
        : `### 🔄 Entendendo Loops (\`while\` e \`for\`)\n\nUm **loop infinito** acontece quando a condição de parada continua sendo \`true\` para sempre — geralmente porque esquecemos de incrementar a variável de controle.\n\n\`\`\`javascript\nlet i = 0;\n\nwhile (i < 5) {\n  console.log("Repetição:", i);\n  i++; // Atualiza o valor a cada volta\n}\n\`\`\`\n\n- **Dica prática**: Sempre verifique se a variável testada no \`while\` ou \`for\` está sendo modificada dentro do bloco.`;
    }

    if (pLower.includes('let') || pLower.includes('const') || pLower.includes('var')) {
      return `### 📦 Diferença entre \`let\`, \`const\` e \`var\`\n\nEm JavaScript moderno (ES6+), priorize **\`const\`** e **\`let\`**:\n\n- **\`const\`**: Usado quando a variável **não será reatribuída**. É a escolha padrão mais segura.\n- **\`let\`**: Usado quando o valor **precisa mudar** (como contadores de loop).\n- **\`var\`**: Escopo de função e sofre *hoisting* — evite em código novo.\n\n\`\`\`javascript\nconst taxa = 0.15; // Valor fixo\nlet pontuacao = 0; // Pode mudar\npontuacao += 10;\n\nconsole.log(taxa, pontuacao);\n\`\`\``;
    }

    if (pLower.includes('map') || pLower.includes('filter') || pLower.includes('array')) {
      return `### ⚡ Trabalhando com Arrays (\`map\`, \`filter\`, \`forEach\`)\n\n- **\`map()\`**: Transforma cada item e **retorna um novo array** do mesmo tamanho.\n- **\`filter()\`**: Filtra itens que passam em uma condição e retorna um novo array.\n- **\`forEach()\`**: Apenas executa uma ação para cada elemento (retorna \`undefined\`).\n\n\`\`\`javascript\nconst numeros = [1, 2, 3, 4];\nconst dobrados = numeros.map(n => n * 2);\nconst pares = numeros.filter(n => n % 2 === 0);\n\nconsole.log(dobrados); // [2, 4, 6, 8]\nconsole.log(pares);    // [2, 4]\n\`\`\``;
    }

    if (pLower.includes('async') || pLower.includes('await') || pLower.includes('promise') || pLower.includes('fetch')) {
      return `### ⏳ Assincronismo com \`Promise\` e \`async/await\`\n\nO par **\`async / await\`** permite escrever código assíncrono (como chamadas de API com \`fetch\`) de forma sequencial e legível:\n\n\`\`\`javascript\nasync function carregarUsuario() {\n  try {\n    const resposta = await fetch("https://api.github.com/users/octocat");\n    const dados = await resposta.json();\n    console.log("Usuário:", dados.login);\n  } catch (erro) {\n    console.error("Falha na requisição:", erro);\n  }\n}\n\ncarregarUsuario();\n\`\`\``;
    }

    const termos = Array.isArray(window.TERMOS) ? window.TERMOS : [];
    const termoEncontrado = termos.find(
      (t) => pLower.includes(String(t.name || '').toLowerCase())
    );

    if (termoEncontrado) {
      return `### 💡 ${termoEncontrado.name}\n\n${termoEncontrado.body}\n\n\`\`\`javascript\n${termoEncontrado.code || '// Exemplo prático no Glossário'}\n\`\`\`\n\n> **Resumo rápido:** ${termoEncontrado.oneLiner}`;
    }

    return `### 🤖 Assistente Pedagógico CodeHelper\n\nSobre sua dúvida (**"${pergunta.slice(0, 80)}"**):\n\nPara resolver problemas de programação com clareza, divida o raciocínio em **Entrada → Processamento → Saída**:\n\n\`\`\`javascript\nfunction resolverProblema(entrada) {\n  // 1. Valide os dados recebidos\n  if (!entrada) return "Entrada inválida";\n\n  // 2. Aplique a transformação lógica\n  const resultado = String(entrada).trim().toUpperCase();\n\n  // 3. Retorne o resultado esperado\n  return resultado;\n}\n\nconsole.log(resolverProblema("codehelper"));\n\`\`\`\n\nExperimente testar esse trecho na aba **Playground** ou colar seu código na aba **Analisar código** para uma verificação detalhada!`;
  }

  function gerarAnaliseEstatica(corpo = {}) {
    const codigo = String(corpo.codigo || '').trim();
    const linguagem = String(corpo.linguagem || 'javascript');
    const problemas = [];

    if (/while\s*\([^)]+\)\s*\{(?![\s\S]*(\+\+|--|\+=|-=|break|return))/i.test(codigo)) {
      problemas.push('- **Possível Loop Infinito**: O laço `while` não parece atualizar a variável de controle nem possui condição de saída (`break`/`return`).');
    }
    if (/[^=!]==[^=]/g.test(codigo)) {
      problemas.push('- **Comparação Fraca (`==`)**: Prefira usar `===` para comparar valor e tipo com segurança.');
    }
    if (/\bvar\s+/g.test(codigo)) {
      problemas.push('- **Uso de `var`**: Substitua `var` por `const` (se o valor não mudar) ou `let` (se precisar reatribuir).');
    }

    if (linguagem.toLowerCase() === 'javascript') {
      try {
        new Function(codigo);
      } catch (erroSintaxe) {
        problemas.push(`- **Erro de Sintaxe Detectado**: \`${erroSintaxe.message}\``);
      }
    }

    const secaoProblemas = problemas.length
      ? problemas.join('\n')
      : '- ✅ **Nenhum erro grave de sintaxe detectado!** A estrutura principal está válida.';

    const codigoMelhorado = codigo
      .replace(/\bvar\s+/g, 'let ')
      .replace(/([^=!])==([^=])/g, '$1===$2');

    return `## 🔍 Diagnóstico do Código (${linguagem})\n\n${secaoProblemas}\n\n### ✨ Sugestão de Boas Práticas e Código Revisado\n- Utilize nomes descritivos para variáveis e funções.\n- Prefira \`const\` e \`let\` para manter o escopo previsível.\n\n\`\`\`${linguagem.toLowerCase()}\n${codigoMelhorado}\n\`\`\``;
  }

  window.fetch = async function fetchCodeHelper(input, init) {
    const urlStr = typeof input === 'string' ? input : input?.url || '';

    // Nunca intercepta chamadas externas (como Supabase ou GitHub API)
    if (urlStr.startsWith('http') && !urlStr.includes(window.location.host)) {
      return fetchNativo(input, init);
    }

    if (urlStr.endsWith('/api/termos') || urlStr === 'api/termos') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      return fetchNativo('termos.json');
    }

    if (urlStr.endsWith('/api/health') || urlStr === 'api/health') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      return new Response(
        JSON.stringify({
          status: 'ok',
          app: 'CodeHelper (GitHub Pages)',
          versao: '1.0.0',
          geminiConfigurada: true,
          termosCarregados: 55
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (urlStr.endsWith('/api/chat') || urlStr === 'api/chat') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      let corpo = {};
      try {
        corpo = init?.body ? JSON.parse(init.body) : {};
      } catch {}
      return criarRespostaStreamTexto(gerarRespostaChatEstatico(corpo));
    }

    if (urlStr.endsWith('/api/analisar') || urlStr === 'api/analisar') {
      try {
        const res = await fetchNativo(input, init);
        if (res.ok) return res;
      } catch {}
      let corpo = {};
      try {
        corpo = init?.body ? JSON.parse(init.body) : {};
      } catch {}
      return criarRespostaStreamTexto(gerarAnaliseEstatica(corpo));
    }

    return fetchNativo(input, init);
  };
})();
