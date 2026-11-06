// A lista "redacoes" vem do dados.js, carregado antes deste arquivo

// ===== Funções auxiliares =====

// Transforma um texto em texto "seguro" para colocar no innerHTML
function escaparHTML(texto) {
    let div = document.createElement("div");
    div.textContent = texto || "";
    return div.innerHTML;
}

// Mostra um elemento que estava escondido pela classe "oculto"
function mostrar(elemento) {
    elemento.classList.remove("oculto");
}

// O título é opcional: sem ele, a página mostra "Sem título"
function tituloDaRedacao(redacao) {
    return redacao.titulo || "Sem título";
}

// A nota fica vazia (null) até a correção
function textoNota(redacao) {
    if (redacao.nota === null || redacao.nota === undefined) {
        return "ainda não avaliada";
    }
    return String(redacao.nota);
}

// A cor da nota: verde a partir de 600, vermelha abaixo; cinza enquanto não há nota
const NOTA_MINIMA_VERDE = 600;

function classeNota(redacao) {
    if (redacao.nota === null || redacao.nota === undefined) {
        return "nota nota-pendente";
    }
    if (redacao.nota >= NOTA_MINIMA_VERDE) {
        return "nota nota-alta";
    }
    return "nota nota-baixa";
}

// Com nota abaixo de 700, o nome do candidato não aparece para o público
const NOTA_MINIMA_PARA_IDENTIFICAR = 700;

function nomePublico(redacao) {
    if (redacao.nota !== null && redacao.nota !== undefined && redacao.nota < NOTA_MINIMA_PARA_IDENTIFICAR) {
        return "Anônimo";
    }
    return redacao.candidato;
}

// ===== index.html: lista e busca =====

// O público só vê as redações aprovadas
let redacoesPublicas = redacoes.filter(r => r.status === "aprovada");

function renderizarCards(lista, mensagemSeVazia) {
    let container = document.getElementById("lista-redacoes");
    container.innerHTML = "";                       // apaga os cards de exemplo

    if (lista.length === 0) {
        container.innerHTML = `<p class="texto-vazio">${mensagemSeVazia}</p>`;
        return;
    }

    lista.forEach(function (redacao) {
        let card = document.createElement("article");
        card.className = "redacao";
        card.innerHTML = `
            <h3>${escaparHTML(tituloDaRedacao(redacao))}</h3>
            <p>Tema: ${escaparHTML(redacao.tema)}</p>
            <p>Candidato: ${escaparHTML(nomePublico(redacao))}</p>
            <p>Nota: <span class="${classeNota(redacao)}">${escaparHTML(textoNota(redacao))}</span></p>
            <div class="botoes-redacao">
                <a href="redacao.html?id=${redacao.id}" class="ler">Ler redação</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function carregarListaPublica() {
    document.getElementById("total-publicadas").textContent = redacoesPublicas.length;
    renderizarCards(redacoesPublicas, "Nenhuma redação publicada ainda. Volte mais tarde!");
}

function filtrarRedacoes(termo) {
    let termoMinusculo = termo.toLowerCase().trim();

    let filtradas = redacoesPublicas.filter(function (r) {
        return (r.titulo || "").toLowerCase().includes(termoMinusculo) ||
               r.tema.toLowerCase().includes(termoMinusculo) ||
               nomePublico(r).toLowerCase().includes(termoMinusculo);
    });

    renderizarCards(filtradas, `Nenhuma redação encontrada para "${escaparHTML(termo)}".`);
}

// ===== redacao.html: leitura de uma redação =====

// Transforma o texto da redação em parágrafos (<p>), um para cada linha do texto.
// As linhas vazias são puladas: na folha de redação, o recuo é que marca o parágrafo.
function textoEmParagrafos(texto) {
    let linhas = (texto || "").split("\n");
    let html = "";
    linhas.forEach(function (linha) {
        if (linha.trim() !== "") {
            html += `<p>${escaparHTML(linha)}</p>`;
        }
    });
    return html;
}

function carregarRedacaoIndividual() {
    let container = document.getElementById("conteudo-redacao");
    let mensagemErro = document.getElementById("mensagem-erro");

    // Lê o número que vem depois de "?id=" no endereço
    let params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get("id"));

    let redacao = redacoes.find(r => r.id === id);

    if (!redacao) {
        mensagemErro.textContent = "Redação não encontrada. Verifique o link.";
        mostrar(mensagemErro);
        container.innerHTML = "";
        return;
    }

    if (redacao.status !== "aprovada") {
        mensagemErro.textContent = "Esta redação ainda não foi publicada.";
        mostrar(mensagemErro);
        container.innerHTML = "";
        return;
    }

    let comentariosHTML = "";
    redacao.comentarios.forEach(function (c) {
        comentariosHTML += `
            <div class="comentario">
                <span class="autor">${escaparHTML(c.autor)}</span>
                <span class="data">${escaparHTML(c.data)}</span>
                <p class="texto">${escaparHTML(c.texto)}</p>
            </div>
        `;
    });

    if (comentariosHTML === "") {
        comentariosHTML = `<p class="texto-vazio">Ainda não há comentários para esta redação.</p>`;
    }

    container.innerHTML = `
        <section class="leitura-bloco">
            <h2>${escaparHTML(tituloDaRedacao(redacao))}</h2>
            <p class="meta">Tema: ${escaparHTML(redacao.tema)}</p>
            <p class="meta">Por <strong>${escaparHTML(nomePublico(redacao))}</strong></p>
            <p class="meta">Nota: <span class="${classeNota(redacao)}">${escaparHTML(textoNota(redacao))}</span></p>
            <div class="leitura-texto">${textoEmParagrafos(redacao.texto)}</div>
        </section>

        <section class="comentarios-bloco">
            <h3>💬 Comentários dos professores</h3>
            ${comentariosHTML}
        </section>
    `;
}

// ===== Início: descobre em qual página estamos =====
document.addEventListener("DOMContentLoaded", function () {

    // Página index.html (tem a lista e a busca)
    if (document.getElementById("form-busca")) {
        carregarListaPublica();

        document.getElementById("form-busca").addEventListener("submit", function (event) {
            event.preventDefault();
            filtrarRedacoes(document.getElementById("termo-busca").value);
        });

        document.getElementById("limpar-busca").addEventListener("click", function () {
            document.getElementById("termo-busca").value = "";
            filtrarRedacoes("");
        });
    }

    // Página redacao.html (tem o espaço da leitura)
    if (document.getElementById("conteudo-redacao")) {
        carregarRedacaoIndividual();
    }
});
