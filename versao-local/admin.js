// A lista "redacoes" vem do dados.js, carregado antes deste arquivo

// Próximos números livres para novas redações e novos comentários
let proximoId = 5;
let proximoComentarioId = 2;

// ===== Login simulado =====
// ATENÇÃO: uma senha no JavaScript serve só para aprender a alternar as telas.
// Qualquer pessoa pode abrir este arquivo (F12) e ler a senha.
const SENHA_ADMIN = "cejred26";
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

// Mostra uma mensagem (sucesso ou erro) que some sozinha depois de 3 segundos
function mostrarMensagem(id, texto) {
    let mensagem = document.getElementById(id);
    mensagem.textContent = texto;
    mostrar(mensagem);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () {
        esconder(mensagem);
    }, 3000);
}

// A data de hoje no formato ano-mês-dia (ex.: "2026-10-13")
function dataDeHoje() {
    let hoje = new Date();
    let mes = String(hoje.getMonth() + 1).padStart(2, "0");
    let dia = String(hoje.getDate()).padStart(2, "0");
    return hoje.getFullYear() + "-" + mes + "-" + dia;
}

// Para cada status: o texto que aparece na tela e a classe CSS da cor
const statusMap = {
    aguardando: { texto: "Aguardando aprovação", classe: "status-aguardando" },
    aprovada: { texto: "Aprovada", classe: "status-aprovada" },
    recusada: { texto: "Recusada", classe: "status-recusada" }
};

// ===== Login =====
function verificarLogin() {
    if (sessionStorage.getItem(CHAVE_SESSAO) === "true") {
        esconder(document.getElementById("login-overlay"));
        mostrar(document.getElementById("painel-admin"));
        atualizarPainel();
    }
}

function entrar(event) {
    event.preventDefault();
    let campoSenha = document.getElementById("senha-admin");

    if (campoSenha.value === SENHA_ADMIN) {
        sessionStorage.setItem(CHAVE_SESSAO, "true");
        esconder(document.getElementById("login-erro"));
        campoSenha.value = "";
        verificarLogin();
    } else {
        mostrar(document.getElementById("login-erro"));
        campoSenha.value = "";
        campoSenha.focus();
    }
}

function sair(event) {
    event.preventDefault();
    sessionStorage.removeItem(CHAVE_SESSAO);
    window.location.reload();
}

// ===== Painel: estatísticas e listas =====
function atualizarPainel() {
    atualizarEstatisticas();
    renderizarModeracao();
    renderizarListaCompleta();
}

function atualizarEstatisticas() {
    document.getElementById("total-redacoes").textContent = redacoes.length;
    document.getElementById("total-aprovadas").textContent = redacoes.filter(r => r.status === "aprovada").length;
    document.getElementById("total-aguardando").textContent = redacoes.filter(r => r.status === "aguardando").length;
    document.getElementById("total-recusadas").textContent = redacoes.filter(r => r.status === "recusada").length;
}

// Cria o card de uma redação; os botões mudam de uma lista para a outra
function criarCard(redacao, botoesHTML) {
    let info = statusMap[redacao.status];
    let card = document.createElement("article");
    card.className = "redacao";
    card.innerHTML = `
        <h3>${escaparHTML(redacao.titulo)}</h3>
        <p>Tema: ${escaparHTML(redacao.tema)}</p>
        <p>Candidato: ${escaparHTML(redacao.candidato)}</p>
        <p>Matrícula: ${escaparHTML(redacao.matricula || "-")}</p>
        <p>Status: <span class="${info.classe}">${info.texto}</span></p>
        <div class="botoes-redacao">${botoesHTML}</div>
    `;
    return card;
}

function renderizarModeracao() {
    let container = document.getElementById("lista-moderacao");
    container.innerHTML = "";

    let pendentes = redacoes.filter(r => r.status === "aguardando");
    if (pendentes.length === 0) {
        container.innerHTML = `<p class="texto-vazio">Nenhuma redação aguardando aprovação.</p>`;
        return;
    }

    pendentes.forEach(function (redacao) {
        let botoes = `
            <a href="moderar.html?id=${redacao.id}" class="ler">Ler e moderar</a>
            <button type="button" class="aprovar" data-acao="aprovar" data-id="${redacao.id}">Aprovar</button>
            <button type="button" class="recusar" data-acao="recusar" data-id="${redacao.id}">Recusar</button>
        `;
        container.appendChild(criarCard(redacao, botoes));
    });
}

function renderizarListaCompleta() {
    let container = document.getElementById("lista-redacoes");
    container.innerHTML = "";

    if (redacoes.length === 0) {
        container.innerHTML = `<p class="texto-vazio">Nenhuma redação cadastrada.</p>`;
        return;
    }

    redacoes.forEach(function (redacao) {
        let botoes = `
            <a href="moderar.html?id=${redacao.id}" class="ler">Ler</a>
            <button type="button" class="editar" data-acao="editar" data-id="${redacao.id}">Editar</button>
            <button type="button" class="comentar" data-acao="comentar" data-id="${redacao.id}">Comentar</button>
            <button type="button" class="excluir" data-acao="excluir" data-id="${redacao.id}">Excluir</button>
        `;
        container.appendChild(criarCard(redacao, botoes));
    });
}

// ===== Ações dos botões dos cards =====
function buscarRedacao(id) {
    return redacoes.find(r => r.id === id);
}

function mudarStatus(id, novoStatus) {
    let redacao = buscarRedacao(id);
    redacao.status = novoStatus;
    atualizarPainel();

    if (novoStatus === "aprovada") {
        mostrarMensagem("mensagem-sucesso", "✅ Redação aprovada e publicada!");
    } else {
        mostrarMensagem("mensagem-sucesso", "Redação recusada.");
    }
}

function excluirRedacao(id) {
    if (!confirm("Tem certeza que deseja EXCLUIR esta redação? Esta ação não pode ser desfeita.")) {
        return;
    }
    redacoes = redacoes.filter(r => r.id !== id);
    atualizarPainel();
    mostrarMensagem("mensagem-sucesso", "Redação excluída.");
}

// Delegação de eventos: UM ouvinte no painel atende os botões de todos os cards
function tratarClique(event) {
    let botao = event.target;
    let acao = botao.dataset.acao;
    if (!acao) {
        return;
    }
    let id = parseInt(botao.dataset.id);

    if (acao === "aprovar") {
        mudarStatus(id, "aprovada");
    }
    if (acao === "recusar" && confirm("Tem certeza que deseja RECUSAR esta redação?")) {
        mudarStatus(id, "recusada");
    }
    if (acao === "editar") {
        abrirEdicao(id);
    }
    if (acao === "comentar") {
        abrirComentario(id);
    }
    if (acao === "excluir") {
        excluirRedacao(id);
    }
}

// ===== Adicionar redação =====
function adicionarRedacao(event) {
    event.preventDefault();

    let nova = {
        id: proximoId,
        tema: document.getElementById("tema").value.trim(),
        titulo: document.getElementById("titulo").value.trim(),
        candidato: document.getElementById("candidato").value.trim(),
        matricula: document.getElementById("matricula").value.trim(),
        status: document.getElementById("status").value,
        texto: document.getElementById("texto").value.trim(),
        comentarios: []
    };

    if (!nova.tema || !nova.titulo || !nova.candidato || !nova.texto) {
        mostrarMensagem("mensagem-erro", "❌ Preencha tema, título, candidato e texto.");
        return;
    }

    redacoes.push(nova);
    proximoId++;
    document.getElementById("form-adicionar").reset();
    atualizarPainel();
    mostrarMensagem("mensagem-sucesso", "✅ Redação adicionada!");
}

// ===== Editar redação =====
function abrirEdicao(id) {
    let redacao = buscarRedacao(id);

    document.getElementById("editar-id").value = redacao.id;
    document.getElementById("editar-tema").value = redacao.tema;
    document.getElementById("editar-candidato").value = redacao.candidato;
    document.getElementById("editar-matricula").value = redacao.matricula;
    document.getElementById("editar-status").value = redacao.status;
    document.getElementById("editar-titulo").value = redacao.titulo;
    document.getElementById("editar-texto").value = redacao.texto;

    let secao = document.getElementById("editar");
    mostrar(secao);
    secao.scrollIntoView({ behavior: "smooth" });
}

function salvarEdicao(event) {
    event.preventDefault();

    let redacao = buscarRedacao(parseInt(document.getElementById("editar-id").value));
    let tema = document.getElementById("editar-tema").value.trim();
    let titulo = document.getElementById("editar-titulo").value.trim();
    let candidato = document.getElementById("editar-candidato").value.trim();
    let texto = document.getElementById("editar-texto").value.trim();

    if (!tema || !titulo || !candidato || !texto) {
        mostrarMensagem("mensagem-erro", "❌ Tema, título, candidato e texto não podem ficar vazios.");
        return;
    }

    redacao.tema = tema;
    redacao.titulo = titulo;
    redacao.candidato = candidato;
    redacao.matricula = document.getElementById("editar-matricula").value.trim();
    redacao.status = document.getElementById("editar-status").value;
    redacao.texto = texto;

    esconder(document.getElementById("editar"));
    atualizarPainel();
    mostrarMensagem("mensagem-sucesso", "✅ Redação atualizada!");
}

function cancelarEdicao() {
    esconder(document.getElementById("editar"));
}

// ===== Comentar =====
function abrirComentario(id) {
    let redacao = buscarRedacao(id);

    document.getElementById("comentario-redacao-id").value = redacao.id;
    document.getElementById("comentario-redacao-titulo").textContent = redacao.titulo;
    document.getElementById("comentario-autor").value = "";
    document.getElementById("comentario-texto").value = "";

    mostrar(document.getElementById("modal-comentario"));
}

function salvarComentario(event) {
    event.preventDefault();

    let redacao = buscarRedacao(parseInt(document.getElementById("comentario-redacao-id").value));
    let autor = document.getElementById("comentario-autor").value.trim();
    let texto = document.getElementById("comentario-texto").value.trim();

    if (!autor || !texto) {
        mostrarMensagem("mensagem-erro", "❌ Preencha o seu nome e o comentário.");
        return;
    }

    redacao.comentarios.push({
        id: proximoComentarioId,
        autor: autor,
        texto: texto,
        data: dataDeHoje()
    });
    proximoComentarioId++;

    fecharComentario();
    mostrarMensagem("mensagem-sucesso", "✅ Comentário adicionado!");
}

function fecharComentario() {
    esconder(document.getElementById("modal-comentario"));
}

// ===== Início: liga cada evento à sua função =====
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("form-login").addEventListener("submit", entrar);
    document.getElementById("btn-sair").addEventListener("click", sair);
    document.getElementById("painel-admin").addEventListener("click", tratarClique);
    document.getElementById("form-adicionar").addEventListener("submit", adicionarRedacao);
    document.getElementById("form-editar").addEventListener("submit", salvarEdicao);
    document.getElementById("cancelar-edicao").addEventListener("click", cancelarEdicao);
    document.getElementById("form-comentario").addEventListener("submit", salvarComentario);
    document.getElementById("cancelar-comentario").addEventListener("click", fecharComentario);

    verificarLogin();
});
