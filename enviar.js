// ===== Endereço da API =====
// A API (api.py) precisa estar rodando: python api.py
const API_URL = "http://localhost:5000";

// ===== Funções auxiliares =====

// Mostra um elemento que estava escondido pela classe "oculto"
function mostrar(elemento) {
    elemento.classList.remove("oculto");
}

// Esconde um elemento colocando a classe "oculto"
function esconder(elemento) {
    elemento.classList.add("oculto");
}

// Mostra o aviso de erro com o texto escolhido
function mostrarErro(texto) {
    let mensagem = document.getElementById("mensagem-erro");
    mensagem.textContent = texto;
    mostrar(mensagem);
}

// ===== Envio da redação =====
async function enviarRedacao(event) {
    event.preventDefault();
    esconder(document.getElementById("mensagem-erro"));

    // Sem status: a API coloca "aguardando" em toda redação enviada pelo candidato
    let nova = {
        tema: document.getElementById("tema").value.trim(),
        titulo: document.getElementById("titulo").value.trim(),
        candidato: document.getElementById("candidato").value.trim(),
        matricula: document.getElementById("matricula").value.trim(),
        texto: document.getElementById("texto").value.trim()
    };

    if (!nova.tema || !nova.titulo || !nova.candidato || !nova.texto) {
        mostrarErro("❌ Preencha todos os campos obrigatórios.");
        return;
    }
    if (nova.texto.length < 50) {
        mostrarErro("❌ O texto da redação parece muito curto. Confira se ele foi colado inteiro.");
        return;
    }

    try {
        let resposta = await fetch(API_URL + "/redacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nova)
        });
        let resultado = await resposta.json();

        if (!resposta.ok) {
            mostrarErro("❌ " + resultado.erro);
            return;
        }

        esconder(document.getElementById("form-enviar"));
        mostrar(document.getElementById("mensagem-sucesso"));
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
        console.error(erro);
        mostrarErro("❌ Não foi possível enviar a redação. Tente novamente em alguns minutos.");
    }
}

// ===== Início =====
document.addEventListener("DOMContentLoaded", function () {
    let formulario = document.getElementById("formulario-envio");
    formulario.addEventListener("submit", enviarRedacao);

    // Quando a pessoa volta a digitar, o aviso de erro some
    formulario.addEventListener("input", function () {
        esconder(document.getElementById("mensagem-erro"));
    });
});
