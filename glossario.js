
const glossarioLista = document.getElementById('lista');

function encontrarTermo(nome) {
  if (typeof TERMOS === 'undefined' || !Array.isArray(TERMOS)) {
    return null;
  }

  return TERMOS.find((termo) => termo.name === nome) || null;
}

async function copiarExemploGlossario(termo, botao) {
  if (!termo?.code) {
    return;
  }

  try {
    await navigator.clipboard.writeText(termo.code);

    const textoOriginal = botao.textContent;

    botao.textContent = 'Copiado ✓';
    botao.classList.add('copiado');

    setTimeout(() => {
      botao.textContent = textoOriginal;
      botao.classList.remove('copiado');
    }, 1500);
  } catch {
    alert('Não foi possível copiar o código.');
  }
}

function perguntarIASobreTermo(termo) {
  if (!termo) {
    return;
  }

  if (typeof iniciarTelaConversaVazia === 'function') {
    iniciarTelaConversaVazia();
  }

  const abaChat = document.querySelector(
    '.aba-btn[data-aba="chat"]'
  );

  if (abaChat) {
    abaChat.click();
  }

  const pergunta = `Explique "${termo.name}" para um iniciante. Explique o que é, para que serve, quando usar e dê um exemplo prático. Se possível, apresente também erros comuns e termos relacionados.`;

  if (typeof adicionarMensagem === 'function') {
    adicionarMensagem(pergunta, 'usuario');
  }

  if (typeof enviarPergunta === 'function') {
    enviarPergunta(pergunta);
  }
}

function criarCategoriaGlossario(termo) {
  const categoria = document.createElement('span');

  categoria.className = 'glossario-categoria';
  categoria.textContent = termo.tagLabel || termo.cat || 'Geral';

  return categoria;
}

function criarAcoesGlossario(termo) {
  const acoes = document.createElement('div');

  acoes.className = 'glossario-acoes';

  const btnIA = document.createElement('button');

  btnIA.className = 'glossario-btn glossario-btn-ia';
  btnIA.type = 'button';
  btnIA.textContent = 'Perguntar à IA';

  btnIA.addEventListener('click', (evento) => {
    evento.stopPropagation();
    perguntarIASobreTermo(termo);
  });

  acoes.appendChild(btnIA);

  if (termo.code) {
    const btnCopiar = document.createElement('button');

    btnCopiar.className = 'glossario-btn glossario-btn-copiar';
    btnCopiar.type = 'button';
    btnCopiar.textContent = 'Copiar exemplo';

    btnCopiar.addEventListener('click', (evento) => {
      evento.stopPropagation();
      copiarExemploGlossario(termo, btnCopiar);
    });

    acoes.appendChild(btnCopiar);
  }

  return acoes;
}

function melhorarCardsGlossario() {
  if (!glossarioLista) {
    return;
  }

  glossarioLista.querySelectorAll('.card').forEach((card) => {
    if (card.dataset.glossarioMelhorado === 'true') {
      return;
    }

    const nomeElemento = card.querySelector('.nome');

    if (!nomeElemento) {
      return;
    }

    const termo = encontrarTermo(nomeElemento.textContent.trim());

    if (!termo) {
      return;
    }

    const cardHead = card.querySelector('.card-head');
    const corpo = card.querySelector('.card-corpo');

    if (!cardHead || !corpo) {
      return;
    }

    if (!cardHead.querySelector('.glossario-categoria')) {
      cardHead.appendChild(criarCategoriaGlossario(termo));
    }

    if (!corpo.querySelector('.glossario-acoes')) {
      corpo.appendChild(criarAcoesGlossario(termo));
    }

    card.dataset.glossarioMelhorado = 'true';
  });
}

if (glossarioLista) {
  const observerGlossario = new MutationObserver(() => {
    melhorarCardsGlossario();
  });

  observerGlossario.observe(glossarioLista, {
    childList: true,
    subtree: true
  });

  melhorarCardsGlossario();
}
