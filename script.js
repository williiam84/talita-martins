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

// Função para adicionar item
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

// Atualiza carrinho e mostra footer
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

// Alterar quantidade
function alterarQtd(index, delta) {
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd < 1) {
    carrinho.splice(index, 1);
  }
  atualizarCarrinho();
}

// Remover item
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// Mostrar campo "troco" se escolher dinheiro
selectPagamento.addEventListener("change", () => {
  const trocoDiv = document.getElementById("trocoDiv");
  trocoDiv.style.display = selectPagamento.value === "dinheiro" ? "block" : "none";
});

// Finalizar pedido - abre popup
document.getElementById("finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let pagamento = document.getElementById("pagamento").value;
  if (!pagamento) {
    alert("Escolha uma forma de pagamento!");
    return;
  }

  document.getElementById("popup").style.display = "block";
  footerCarrinho.style.display = "none"; // esconde footer ao abrir popup
});

// Fechar popup
document.getElementById("fecharPopup").onclick = function() {
  document.getElementById("popup").style.display = "none";
  if (carrinho.length > 0) {
    footerCarrinho.style.display = "flex"; // mostra footer de volta
  }
};

// Alternar entre retirada e entrega no popup
document.querySelectorAll("input[name='tipoEntregaPopup']").forEach(radio => {
  radio.addEventListener("change", function() {
    let enderecoCampos = document.getElementById("enderecoCamposPopup");
    enderecoCampos.style.display = this.value === "entrega" ? "block" : "none";
  });
});

// Confirmar pedido e enviar para WhatsApp
function confirmarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

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

    if (!nome || !rua || !numero || !bairro) {
      alert("Preencha todos os campos obrigatórios para entrega!");
      return;
    }

    // Regras de taxa
    if (bairro === "Santana") {
      taxaEntrega = totalCarrinho < 30 ? 2 : 0;
    } else if (["São José","Bairro Floresta","Nova Betânia","Vila dos Pescadores","Bugia"].includes(bairro)) {
      taxaEntrega = 3;
    } else if (bairro === "Centro") {
      taxaEntrega = 2;
    }

    totalCarrinho += taxaEntrega;
    msg += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
    msg += `\nTotal com entrega: R$ ${totalCarrinho.toFixed(2)}`;

    let referencia = document.getElementById("referenciaPopup").value.trim() || "Não informado";
    msg += `\n\n📦 Entrega para:\n👤 Nome: ${nome}\n📍 Endereço: ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia}`;

  } else {
    msg += `\nTotal: R$ ${totalCarrinho.toFixed(2)}`;
    msg += "\n\n📦 Retirada na loja.";
  }

  msg += `\nPagamento: ${pagamento}`;
  if (pagamento === "dinheiro") {
    let troco = document.getElementById("trocoPopup").value || "sem troco";
    msg += `\nTroco: ${troco}`;
  }

  document.getElementById("popup").style.display = "none";
  if (carrinho.length > 0) footerCarrinho.style.display = "flex";

  const telefone = "5527997765557";
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
}