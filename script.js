let carrinho = [];

// Elementos
const carrinhoUl = document.getElementById("Carrinho");
const totalSpan = document.getElementById("total");
const footerCarrinho = document.getElementById("Footer3");

const popup = document.getElementById("popup");
const fecharPopup = document.getElementById("fecharPopup");
const finalizar = document.getElementById("finalizar");

const tipoEntregaRadios = document.querySelectorAll("input[name='tipoEntregaPopup']");
const enderecoCampos = document.getElementById("enderecoCamposPopup");

const pagamentoPopup = document.getElementById("pagamentoPopup");
const trocoDivPopup = document.getElementById("trocoDivPopup");

// ---------- Funções do carrinho ----------
function atualizarCarrinho() {
    carrinhoUl.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.qtd} = R$ ${(item.preco * item.qtd).toFixed(2)}
            <button onclick="alterarQtd(${index}, 1)">+</button>
            <button onclick="alterarQtd(${index}, -1)">-</button>
            <button onclick="removerItem(${index})">❌</button>
        `;
        carrinhoUl.appendChild(li);
        total += item.qtd * item.preco;
    });

    totalSpan.textContent = total.toFixed(2);
    footerCarrinho.style.display = carrinho.length > 0 ? "flex" : "none";
}

function adicionarCarrinho(nome, preco, qtd = 1) {
    qtd = parseInt(qtd);
    if (isNaN(qtd) || qtd < 1) qtd = 1;

    let item = carrinho.find(i => i.nome === nome);
    if (item) item.qtd += qtd;
    else carrinho.push({ nome, preco, qtd });

    atualizarCarrinho();
}

function alterarQtd(index, delta) {
    carrinho[index].qtd += delta;
    if (carrinho[index].qtd < 1) carrinho.splice(index, 1);
    atualizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// ---------- Incremento e Decremento ----------
function increment(id) {
    const input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
}

function decrement(id) {
    const input = document.getElementById(id);
    input.value = Math.max(1, parseInt(input.value) - 1);
}

// ---------- Popup ----------
finalizar.addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    popup.style.display = "block";
});

fecharPopup.addEventListener("click", () => {
    popup.style.display = "none";
});

// Mostrar campos de endereço se for entrega
tipoEntregaRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        enderecoCampos.style.display = radio.value === "entrega" ? "block" : "none";
    });
});

// Mostrar troco se pagamento for dinheiro
pagamentoPopup.addEventListener("change", () => {
    trocoDivPopup.style.display = pagamentoPopup.value === "dinheiro" ? "block" : "none";
});

// ---------- Confirmar Pedido ----------
document.getElementById("confirmarPedido").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = pagamentoPopup.value;
    if (!pagamento) {
        alert("Selecione a forma de pagamento!");
        return;
    }

    let tipoEntrega = document.querySelector("input[name='tipoEntregaPopup']:checked").value;
    let totalCarrinho = parseFloat(totalSpan.textContent);
    let taxaEntrega = 0;

    // Validação do endereço se for entrega
    let msg = "Olá, gostaria de fazer o pedido:\n";
    carrinho.forEach(item => {
        msg += `${item.qtd}x ${item.nome} - R$ ${item.preco.toFixed(2)} = R$ ${(item.qtd * item.preco).toFixed(2)}\n`;
    });

    if (tipoEntrega === "entrega") {
        const nome = document.getElementById("nomePopup").value.trim();
        const rua = document.getElementById("ruaPopup").value.trim();
        const numero = document.getElementById("numeroPopup").value.trim();
        const bairro = document.getElementById("bairroPopup").value.trim();

        if (!nome || !rua || !numero || !bairro) {
            alert("Preencha todos os campos obrigatórios para entrega!");
            return;
        }

        // Calcular taxa de entrega
        if (bairro === "Santana") taxaEntrega = totalCarrinho < 30 ? 2 : 0;
        else if (["São José", "Bairro Floresta", "Nova Betânia", "Vila dos Pescadores", "Bugia"].includes(bairro)) taxaEntrega = 3;
        else if (bairro === "Centro") taxaEntrega = 2;

        totalCarrinho += taxaEntrega;

        const referencia = document.getElementById("referenciaPopup").value.trim() || "Não informado";

        msg += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
        msg += `\nTotal com entrega: R$ ${totalCarrinho.toFixed(2)}`;
        msg += `\n\n📦 Entrega para:\n👤 Nome: ${nome}\n📍 Endereço: ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia}`;
    } else {
        msg += `\nTotal: R$ ${totalCarrinho.toFixed(2)}`;
        msg += `\n\n📦 Retirada na loja`;
    }

    msg += `\nPagamento: ${pagamento}`;

    if (pagamento === "dinheiro") {
        const troco = document.getElementById("trocoPopup").value.trim();
        if (!troco) {
            alert("Informe o valor do troco para pagamento em dinheiro!");
            return;
        }
        msg += `\nTroco: ${troco}`;
    }

    // Abrir WhatsApp
    const telefone = "5527997765557";
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");

    popup.style.display = "none";
});