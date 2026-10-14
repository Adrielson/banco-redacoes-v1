// ===== Configuração =====
// A API (api.py) precisa estar rodando: python api.py
const API_URL = "http://localhost:5000";

// A mesma chave que o admin.js usa para lembrar do login
const CHAVE_SESSAO = "admin_autenticado";

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

// Esconde um elemento colocando a classe "oculto"
function esconder(elemento) {
    elemento.classList.add("oculto");
}

// Mostra uma mensagem (sucesso ou erro) no alto da página
function mostrarMensagem(id, texto) {
    let mensagem = document.getElementById(id);
    mensagem.textContent = texto;
    mostrar(mensagem);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Para cada status: o texto que aparece na tela e a classe CSS da cor
const statusMap = {
    aguardando: { texto: "Aguardando aprovação", classe: "status-aguardando" },
    aprovada: { texto: "Aprovada", classe: "status-aprovada" },
    recusada: { texto: "Recusada", classe: "status-recusada" }
};

// ===== Conversa com a API =====

// Faz um pedido à API e devolve a resposta já convertida de JSON.
// Se der errado, lança um erro com uma mensagem para mostrar na tela.
async function pedirAPI(metodo, caminho, dados) {
    let opcoes = { method: metodo };
    if (dados) {
        opcoes.headers = { "Content-Type": "application/json" };
        opcoes.body = JSON.stringify(dados);
    }

    let resposta;
    try {
        resposta = await fetch(API_URL + caminho, opcoes);
    } catch (erro) {
        throw new Error("Não foi possível falar com a API. Ela está ligada?");
    }

    let resultado = await resposta.json();
    if (!resposta.ok) {
        throw new Error(resultado.erro);
    }
    return resultado;
}

// ===== Carregar a redação do endereço =====
async function carregarRedacao() {
    let container = document.getElementById("conteudo-moderacao");

    // Lê o número que vem depois de "?id=" no endereço
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    if (!id) {
        container.innerHTML = "";
        mostrarMensagem("mensagem-erro", "❌ Nenhuma redação foi indicada no endereço.");
        return;
    }

    try {
        let redacao = await pedirAPI("GET", "/redacoes/" + id);
        desenharRedacao(redacao);
    } catch (erro) {
        container.innerHTML = "";
        mostrarMensagem("mensagem-erro", "❌ " + erro.message);
    }
}

// ===== Desenhar a redação e a decisão =====
function desenharRedacao(redacao) {
    let info = statusMap[redacao.status];

    // Os botões só aparecem se a redação ainda espera uma decisão
    let decisaoHTML = "";
    if (redacao.status === "aguardando") {
        decisaoHTML = `
            <div class="botoes-moderacao">
                <button type="button" class="aprovar" id="btn-aprovar" data-acao="aprovar" data-id="${redacao.id}">Aprovar e Publicar</button>
                <button type="button" class="recusar" id="btn-recusar" data-acao="recusar" data-id="${redacao.id}">Recusar</button>
            </div>
        `;
    } else {
        decisaoHTML = `<p class="texto-vazio">Esta redação já foi decidida. <a href="admin.html">Voltar ao painel</a></p>`;
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

    document.getElementById("conteudo-moderacao").innerHTML = `
        <section class="leitura-bloco">
            <h2>${escaparHTML(redacao.titulo)}</h2>
            <p class="meta">Tema: ${escaparHTML(redacao.tema)}</p>
            <p class="meta">Candidato: <strong>${escaparHTML(redacao.candidato)}</strong> • Matrícula ${escaparHTML(redacao.matricula || "-")}</p>
            <p class="meta">Status atual: <span class="${info.classe}">${info.texto}</span></p>
            <div class="leitura-texto">${escaparHTML(redacao.texto)}</div>
        </section>

        ${decisaoHTML}

        <section class="comentarios-bloco">
            <h3>💬 Comentários dos professores</h3>
            ${comentariosHTML}
        </section>
    `;
}

// ===== Aprovar ou recusar =====
async function decidir(id, novoStatus) {
    try {
        await pedirAPI("PUT", "/redacoes/" + id, { status: novoStatus });
        esconder(document.querySelector(".botoes-moderacao"));

        if (novoStatus === "aprovada") {
            mostrarMensagem("mensagem-sucesso", "✅ Redação aprovada e publicada! Voltando ao painel...");
        } else {
            mostrarMensagem("mensagem-sucesso", "Redação recusada. Voltando ao painel...");
        }

        setTimeout(function () {
            window.location.href = "admin.html";
        }, 2000);
    } catch (erro) {
        mostrarMensagem("mensagem-erro", "❌ " + erro.message);
    }
}

// Delegação de eventos: os botões são criados pelo desenharRedacao
function tratarClique(event) {
    let botao = event.target;
    let acao = botao.dataset.acao;
    if (!acao) {
        return;
    }
    let id = botao.dataset.id;

    if (acao === "aprovar") {
        decidir(id, "aprovada");
    }
    if (acao === "recusar" && confirm("Tem certeza que deseja RECUSAR esta redação?")) {
        decidir(id, "recusada");
    }
}

// ===== Início =====
document.addEventListener("DOMContentLoaded", function () {
    // Sem login, volta para o painel (que mostra a tela de senha)
    if (sessionStorage.getItem(CHAVE_SESSAO) !== "true") {
        window.location.href = "admin.html";
        return;
    }

    document.getElementById("conteudo-moderacao").addEventListener("click", tratarClique);
    carregarRedacao();
});
