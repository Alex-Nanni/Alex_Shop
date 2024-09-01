import { auth, db } from './index.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {

    // Autenticação de login
    document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem("authToken", token);
            
            // Definir papel do usuário baseado no email
            let userRole = 'user'; // Papel padrão
            if (email === 'admin@oficina.com') {
                userRole = 'admin';
            }
            localStorage.setItem("userRole", userRole);
            
            window.location.href = "index1.html";
        } catch (error) {
            console.error("Erro de autenticação:", error);
            alert("Credenciais inválidas!");
        }
    });

    // Verificar o papel do usuário na página de consulta
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
        document.getElementById("adminActions").style.display = "block";
    }

    // Função de consulta de produtos
    document.getElementById("consultaForm")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nome = document.getElementById("consultaNome").value.toLowerCase();
        const preco = document.getElementById("consultaPreco").value;
        const data = document.getElementById("consultaData").value;

        const resultadoDiv = document.getElementById("resultadoConsulta");
        resultadoDiv.innerHTML = ""; // Limpa o resultado anterior

        let q = query(collection(db, "produtos"));

        if (nome) {
            q = query(collection(db, "produtos"), where("nome", "==", nome));
        }
        if (preco) {
            q = query(collection(db, "produtos"), where("preco", "==", Number(preco)));
        }
        if (data) {
            q = query(collection(db, "produtos"), where("data", "==", data));
        }

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            resultadoDiv.innerHTML = "<p>Nenhum produto encontrado com os critérios de pesquisa fornecidos.</p>";
        } else {
            querySnapshot.forEach(doc => {
                const produto = doc.data();
                resultadoDiv.innerHTML += `<p>Serviço: ${produto.nome} | Preço: R$ ${produto.preco},00 | Data: ${produto.data}</p>`;
            });
        }
    });

    // Função para adicionar produtos (Admin)
    document.getElementById("adminForm")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nome = document.getElementById("produtoNome").value;
        const preco = document.getElementById("produtoPreco").value;
        const data = new Date().toISOString().split('T')[0]; // Data de inserção atual

        try {
            await addDoc(collection(db, "produtos"), {
                nome,
                preco: Number(preco),
                data
            });
            populateAdminProductList();
            alert("Produto adicionado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
        }
    });

    // Função para listar e permitir a exclusão de produtos (Admin)
    async function populateAdminProductList() {
        const produtoLista = document.getElementById("produtoLista");
        produtoLista.innerHTML = "";

        const querySnapshot = await getDocs(collection(db, "produtos"));
        querySnapshot.forEach(doc => {
            const produto = doc.data();
            const li = document.createElement("li");
            li.textContent = `${produto.nome} - R$ ${produto.preco},00 - Data: ${produto.data}`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.addEventListener("click", async function () {
                try {
                    await deleteDoc(doc(db, "produtos", doc.id));
                    populateAdminProductList();
                    alert("Produto excluído com sucesso!");
                } catch (error) {
                    console.error("Erro ao excluir produto:", error);
                }
            });
            li.appendChild(deleteButton);
            produtoLista.appendChild(li);
        });
    }

    // Popula lista de produtos se o admin estiver logado
    if (userRole === "admin") {
        populateAdminProductList();
    }
});
