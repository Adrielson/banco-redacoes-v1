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

// Lê a nota de um campo: vazio vira null (sem nota)
function lerNota(id) {
    let texto = document.getElementById(id).value.trim();
    if (texto === "") {
        return null;
    }
    return Number(texto);
}

// A nota pode ficar vazia; se tiver valor, é um número inteiro de 0 a 1000
function notaValida(nota) {
    return nota === null || (Number.isInteger(nota) && nota >= 0 && nota <= 1000);
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

// Mostra uma mensagem (sucesso ou erro) que flutua no alto da tela e some
// sozinha depois de 3 segundos. A página fica onde está: não volta para o topo.
let temporizadorMensagem = null;
function mostrarMensagem(id, texto) {
    // Só uma mensagem por vez: esconde as duas e mostra a pedida
    esconder(document.getElementById("mensagem-sucesso"));
    esconder(document.getElementById("mensagem-erro"));

    let mensagem = document.getElementById(id);
    mensagem.textContent = texto;
    mostrar(mensagem);

    // Uma mensagem nova recomeça a contagem dos 3 segundos
    clearTimeout(temporizadorMensagem);
    temporizadorMensagem = setTimeout(function () {
        esconder(mensagem);
    }, 3000);
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
        container.innerHTML = `<p class="mensagem-erro">❌ Nenhuma redação foi indicada no endereço.</p>`;
        return;
    }

    try {
        let redacao = await pedirAPI("GET", "/redacoes/" + id);
        desenharRedacao(redacao);
    } catch (erro) {
        container.innerHTML = `<p class="mensagem-erro">❌ ${escaparHTML(erro.message)}</p>`;
    }
}

// ===== Desenhar a redação e a decisão =====
function desenharRedacao(redacao) {
    let info = statusMap[redacao.status];

    // Os botões só aparecem se a redação ainda espera uma decisão
    let decisaoHTML = "";
    if (redacao.status === "aguardando") {
        let notaAtual = (redacao.nota === null || redacao.nota === undefined) ? "" : redacao.nota;
        decisaoHTML = `
            <section class="caixa-formulario" id="avaliacao">
                <h2>Avaliação</h2>
                <div class="campo">
                    <label for="moderar-nota">Nota (0 a 1000)</label>
                    <input type="number" id="moderar-nota" min="0" max="1000" step="1" placeholder="Vazia até a correção" value="${notaAtual}">
                </div>
                <div class="campo">
                    <label for="moderar-autor">Professor revisor</label>
                    <input type="text" id="moderar-autor" placeholder="Ex: Prof. Carlos (só se for comentar)">
                </div>
                <div class="campo">
                    <label for="moderar-comentario">Comentário (opcional)</label>
                    <textarea id="moderar-comentario" placeholder="Escreva seu comentário sobre a redação..."></textarea>
                </div>
            </section>

            <div class="botoes-moderacao">
                <button type="button" class="aprovar" id="btn-aprovar" data-acao="aprovar" data-id="${redacao.id}">Aprovar e Publicar</button>
                <button type="button" class="recusar" id="btn-recusar" data-acao="recusar" data-id="${redacao.id}">Recusar</button>
            </div>
        `;
    } else {
        decisaoHTML = `<p class="texto-vazio">Esta redação já foi decidida. <a href="admin.html">Voltar ao painel</a></p>`;
    }

    document.getElementById("conteudo-moderacao").innerHTML = `
        <section class="leitura-bloco">
            <h2>${escaparHTML(tituloDaRedacao(redacao))}</h2>
            <p class="meta">Tema: ${escaparHTML(redacao.tema)}</p>
            <p class="meta">Candidato: <strong>${escaparHTML(redacao.candidato)}</strong> • Matrícula ${escaparHTML(redacao.matricula || "-")}</p>
            <p class="meta">Status atual: <span class="${info.classe}">${info.texto}</span></p>
            <p class="meta">Nota: <strong>${escaparHTML(textoNota(redacao))}</strong></p>
            <div class="leitura-texto">${textoEmParagrafos(redacao.texto)}</div>
        </section>

        ${decisaoHTML}

        <section class="comentarios-bloco" id="comentarios"></section>
    `;
    desenharComentarios(redacao);
}

// ===== Comentários: listar, editar e excluir =====

// A redação que está na tela (para achar o comentário que vai ser editado)
let redacaoAtual = null;

// Desenha só a área dos comentários, cada um com "Editar" e "Excluir"
function desenharComentarios(redacao) {
    redacaoAtual = redacao;

    let comentariosHTML = "";
    redacao.comentarios.forEach(function (c) {
        comentariosHTML += `
            <div class="comentario" id="comentario-${c.id}">
                <span class="autor">${escaparHTML(c.autor)}</span>
                <span class="data">${escaparHTML(c.data)}</span>
                <p class="texto">${escaparHTML(c.texto)}</p>
                <div class="botoes-redacao">
                    <button type="button" class="editar" data-acao="editar-comentario" data-id="${redacao.id}" data-comentario="${c.id}">Editar</button>
                    <button type="button" class="excluir" data-acao="excluir-comentario" data-id="${redacao.id}" data-comentario="${c.id}">Excluir</button>
                </div>
            </div>
        `;
    });

    if (comentariosHTML === "") {
        comentariosHTML = `<p class="texto-vazio">Ainda não há comentários para esta redação.</p>`;
    }

    document.getElementById("comentarios").innerHTML = `
        <h3>💬 Comentários dos professores</h3>
        ${comentariosHTML}
    `;
}

// Pede a redação de novo à API e redesenha só os comentários
async function atualizarComentarios(id) {
    let redacao = await pedirAPI("GET", "/redacoes/" + id);
    desenharComentarios(redacao);
}

// Troca o comentário por um pequeno formulário, já preenchido
function abrirEdicaoComentario(id, comentarioId) {
    let comentario = redacaoAtual.comentarios.find(c => c.id === comentarioId);
    let caixa = document.getElementById("comentario-" + comentarioId);

    caixa.innerHTML = `
        <div class="campo">
            <label for="autor-comentario-${comentarioId}">Professor revisor</label>
            <input type="text" id="autor-comentario-${comentarioId}">
        </div>
        <div class="campo">
            <label for="texto-comentario-${comentarioId}">Comentário</label>
            <textarea id="texto-comentario-${comentarioId}"></textarea>
        </div>
        <div class="botoes-redacao">
            <button type="button" class="aprovar" data-acao="salvar-comentario" data-id="${id}" data-comentario="${comentarioId}">Salvar comentário</button>
            <button type="button" class="ler" data-acao="cancelar-comentario">Cancelar</button>
        </div>
    `;
    // Os valores entram pelo .value: assim, aspas ou "<" no texto não quebram o HTML
    document.getElementById("autor-comentario-" + comentarioId).value = comentario.autor;
    document.getElementById("texto-comentario-" + comentarioId).value = comentario.texto;
}

async function salvarComentarioEditado(id, comentarioId) {
    let dados = {
        autor: document.getElementById("autor-comentario-" + comentarioId).value.trim(),
        texto: document.getElementById("texto-comentario-" + comentarioId).value.trim()
    };
    if (!dados.autor || !dados.texto) {
        mostrarMensagem("mensagem-erro", "❌ O nome do professor e o comentário não podem ficar vazios.");
        return;
    }

    try {
        await pedirAPI("PUT", "/redacoes/" + id + "/comentarios/" + comentarioId, dados);
        await atualizarComentarios(id);
        mostrarMensagem("mensagem-sucesso", "✅ Comentário atualizado!");
    } catch (erro) {
        mostrarMensagem("mensagem-erro", "❌ " + erro.message);
    }
}

async function excluirComentario(id, comentarioId) {
    try {
        await pedirAPI("DELETE", "/redacoes/" + id + "/comentarios/" + comentarioId);
        await atualizarComentarios(id);
        mostrarMensagem("mensagem-sucesso", "Comentário excluído.");
    } catch (erro) {
        mostrarMensagem("mensagem-erro", "❌ " + erro.message);
    }
}

// ===== Aprovar ou recusar =====
// A nota e o comentário da área "Avaliação" são salvos junto com a decisão
async function decidir(id, novoStatus) {
    let nota = lerNota("moderar-nota");
    let autor = document.getElementById("moderar-autor").value.trim();
    let comentario = document.getElementById("moderar-comentario").value.trim();

    if (!notaValida(nota)) {
        mostrarMensagem("mensagem-erro", "❌ A nota deve ser um número inteiro de 0 a 1000 (ou ficar vazia).");
        return;
    }
    if (comentario && !autor) {
        mostrarMensagem("mensagem-erro", "❌ Para comentar, escreva o nome do professor revisor.");
        return;
    }

    try {
        await pedirAPI("PUT", "/redacoes/" + id, { status: novoStatus, nota: nota });
        if (comentario) {
            await pedirAPI("POST", "/redacoes/" + id + "/comentarios", { autor: autor, texto: comentario });
        }
        esconder(document.getElementById("avaliacao"));
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

    // Os botões dos comentários
    let comentarioId = parseInt(botao.dataset.comentario);
    if (acao === "editar-comentario") {
        abrirEdicaoComentario(id, comentarioId);
    }
    if (acao === "salvar-comentario") {
        salvarComentarioEditado(id, comentarioId);
    }
    if (acao === "cancelar-comentario") {
        desenharComentarios(redacaoAtual);
    }
    if (acao === "excluir-comentario" && confirm("Tem certeza que deseja EXCLUIR este comentário?")) {
        excluirComentario(id, comentarioId);
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
