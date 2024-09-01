import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js";

// Inicializa Firebase Functions
const functions = getFunctions();

// Função para enviar e-mail
const sendContactEmail = httpsCallable(functions, 'sendContactEmail');

// Adiciona o evento de submit ao formulário de contato
document.getElementById("contatoForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("contatoNome").value;
    const email = document.getElementById("contatoEmail").value;
    const mensagem = document.getElementById("contatoMensagem").value;

    // Envia o e-mail
    try {
        await sendContactEmail({ nome, email, mensagem });
        alert("Mensagem enviada com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        alert("Erro ao enviar mensagem.");
    }
});
