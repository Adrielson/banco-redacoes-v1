// ===== Endereço da API =====
// A API (api.py) precisa estar rodando: python api.py
const API_URL = "http://localhost:5000";

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

// Com nota abaixo de 700, o nome do candidato não aparece para o público
const NOTA_MINIMA_PARA_IDENTIFICAR = 700;

function nomePublico(redacao) {
    if (redacao.nota !== null && redacao.nota !== undefined && redacao.nota < NOTA_MINIMA_PARA_IDENTIFICAR) {
        return "Anônimo";
    }
    return redacao.candidato;
}

// ===== index.html: lista e busca =====

// As redações aprovadas, que chegam da API (a lista começa vazia)
let redacoesPublicas = [];

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
            <p>Nota: ${escaparHTML(textoNota(redacao))}</p>
            <div class="botoes-redacao">
                <a href="redacao.html?id=${redacao.id}" class="ler">Ler redação</a>
            </div>
        `;
        container.appendChild(card);
    });
}

async function carregarListaPublica() {
    try {
        let resposta = await fetch(API_URL + "/redacoes?status=aprovada");
        if (!resposta.ok) {
            throw new Error("A API respondeu com o código " + resposta.status);
        }
        redacoesPublicas = await resposta.json();

        document.getElementById("total-publicadas").textContent = redacoesPublicas.length;
        renderizarCards(redacoesPublicas, "Nenhuma redação publicada ainda. Volte mais tarde!");
    } catch (erro) {
        console.error(erro);
        document.getElementById("total-publicadas").textContent = "0";
        renderizarCards([], "Não foi possível carregar as redações. Tente novamente mais tarde.");
    }
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

async function carregarRedacaoIndividual() {
    let container = document.getElementById("conteudo-redacao");
    let mensagemErro = document.getElementById("mensagem-erro");

    // Lê o número que vem depois de "?id=" no endereço
    let params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get("id"));

    // Pede a redação à API; se ela não existir (404), "redacao" continua null
    let redacao = null;
    try {
        let resposta = await fetch(API_URL + "/redacoes/" + id);
        if (resposta.ok) {
            redacao = await resposta.json();
        }
    } catch (erro) {
        console.error(erro);
        mensagemErro.textContent = "Não foi possível carregar a redação. Tente novamente mais tarde.";
        mostrar(mensagemErro);
        container.innerHTML = "";
        return;
    }

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
            <p class="meta">Nota: <strong>${escaparHTML(textoNota(redacao))}</strong></p>
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
