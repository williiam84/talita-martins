let carrinho = [];

// Incrementa quantidade do input
function increment(inputId) {
    const input = document.getElementById(inputId);
    input.stepUp();
}

// Decrementa quantidade do input
function decrement(inputId) {
    const input = document.getElementById(inputId);
    if (input.value > input.min) {
        input.stepDown();
    }
}

const carrinhoUl = document.getElementById("Carrinho");
const totalSpan = document.getElementById("total");
const footerCarrinho = document.getElementById("Footer3");
const selectPagamento = document.getElementById("pagamento");
const trocoDiv = document.getElementById("trocoDiv");

// Adicionar item ao carrinho
function adicionarCarrinho(nome, preco, qtd) {
    qtd = parseInt(qtd);
    if (isNaN(qtd) || qtd < 1) qtd = 1;

    let item = carrinho.find(i => i.nome === nome);

    if (item) {
        item.qtd += qtd;
    } else {
        carrinho.push({ nome, preco, qtd });
    }

    atualizarCarrinho();
}

// Atualiza o carrinho e total
function atualizarCarrinho() {
    carrinhoUl.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.nome} - R$ ${item.preco} x ${item.qtd} = R$ ${(item.preco * item.qtd).toFixed(2)}
            <button onclick="alterarQtd(${index},1)">+</button>
            <button onclick="alterarQtd(${index},-1)">-</button>
            <button onclick="removerItem(${index})">❌</button>
        `;
        carrinhoUl.appendChild(li);

        total += item.qtd * item.preco;
    });

    totalSpan.textContent = total.toFixed(2);
    footerCarrinho.style.display = carrinho.length > 0 ? "flex" : "none";
}

// Alterar quantidade de um item
function alterarQtd(index, delta) {
    carrinho[index].qtd += delta;
    if (carrinho[index].qtd < 1) {
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}

// Remover item do carrinho
function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Mostrar campo "troco" se escolher dinheiro
selectPagamento.addEventListener("change", () => {
    trocoDiv.style.display = selectPagamento.value === "dinheiro" ? "block" : "none";
});

// Finalizar pedido (abre popup)
document.getElementById("finalizar").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = selectPagamento.value;
    if (!pagamento) {
        alert("Escolha uma forma de pagamento!");
        return;
    }

    document.getElementById("popup").style.display = "block";
});

// Fechar popup
document.getElementById("fecharPopup").onclick = function() {
    document.getElementById("popup").style.display = "none";
};

// Alternar entre retirada e entrega
document.querySelectorAll("input[name='tipoEntregaPopup']").forEach(radio => {
    radio.addEventListener("change", function() {
        let enderecoCampos = document.getElementById("enderecoCamposPopup");
        enderecoCampos.style.display = this.value === "entrega" ? "block" : "none";
    });
});

// Confirmar pedido e enviar pro WhatsApp
function confirmarPedido() {
    let pagamento = document.getElementById("pagamento").value;
    let tipoEntrega = document.querySelector("input[name='tipoEntregaPopup']:checked").value;

    if (!pagamento) {
        alert("Selecione a forma de pagamento!");
        return;
    }

    let totalCarrinho = parseFloat(totalSpan.textContent);
    let taxaEntrega = 0;
    let msg = "Olá, gostaria de fazer o pedido:\n";

    carrinho.forEach(item => {
        msg += `${item.qtd}x ${item.nome} - R$ ${item.preco} = R$ ${(item.qtd * item.preco).toFixed(2)}\n`;
    });

    if (tipoEntrega === "entrega") {
        let nome = document.getElementById("nomePopup").value.trim();
        let rua = document.getElementById("ruaPopup").value.trim();
        let numero = document.getElementById("numeroPopup").value.trim();
        let bairro = document.getElementById("bairroPopup").value.trim();
        let referencia = document.getElementById("referenciaPopup").value.trim() || "Não informado";

        if (!nome || !rua || !numero || !bairro) {
            alert("Preencha todos os campos obrigatórios para entrega!");
            return;
        }

        // Define taxa de entrega
        if (bairro === "Santana") taxaEntrega = totalCarrinho < 30 ? 2 : 0;
        else if (["São José","Bairro Floresta","Nova Betânia","Vila dos Pescadores","Bugia"].includes(bairro)) taxaEntrega = 3;
        else if (bairro === "Centro") taxaEntrega = 2;

        totalCarrinho += taxaEntrega;

        msg += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
        msg += `\nTotal com entrega: R$ ${totalCarrinho.toFixed(2)}`;
        msg += `\n\n📦 Entrega para:\n👤 Nome: ${nome}\n📍 Endereço: ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia}`;
    } else {
        msg += `\nTotal: R$ ${totalCarrinho.toFixed(2)}`;
        msg += "\n\n📦 Retirada na loja.";
    }

    msg += `\nPagamento: ${pagamento}`;
    if (pagamento === "dinheiro") {
        let troco = document.getElementById("troco").value || "sem troco";
        msg += `\nTroco: ${troco}`;
    }

    document.getElementById("popup").style.display = "none";

    const telefone = "5527997765557"; // seu número
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
}