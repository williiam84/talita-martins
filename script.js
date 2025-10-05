let carrinho = [];
let totalSpan = document.getElementById("total");

function adicionarCarrinho(nome, preco, qtd) {
  qtd = parseInt(qtd);
  if (isNaN(qtd) || qtd < 1) return;

  let itemExistente = carrinho.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.qtd += qtd;
  } else {
    carrinho.push({ nome, preco, qtd });
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinhoUL = document.getElementById("Carrinho");
  carrinhoUL.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, i) => {
    let li = document.createElement("li");
    li.textContent = `${item.qtd}x ${item.nome} - R$ ${(item.qtd * item.preco).toFixed(2)}`;

    let btnRemover = document.createElement("button");
    btnRemover.textContent = "❌";
    btnRemover.onclick = () => removerItem(i);

    li.appendChild(btnRemover);
    carrinhoUL.appendChild(li);

    total += item.qtd * item.preco;
  });

  totalSpan.textContent = total.toFixed(2);
}

function removerItem(i) {
  carrinho.splice(i, 1);
  atualizarCarrinho();
}

// Incrementar e decrementar quantidades
function increment(id) {
  let input = document.getElementById(id);
  input.value = parseInt(input.value) + 1;
}

function decrement(id) {
  let input = document.getElementById(id);
  if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

// Mostrar/ocultar campos de endereço conforme o tipo de entrega
document.querySelectorAll("input[name='tipoEntrega']").forEach(radio => {
  radio.addEventListener("change", e => {
    document.getElementById("enderecoCampos").style.display =
      e.target.value === "entrega" ? "block" : "none";
  });
});

function confirmarPedido() {
  let pagamento = document.getElementById("pagamento").value;
  let tipoEntrega = document.querySelector("input[name='tipoEntrega']:checked").value;

  if (!pagamento) {
    alert("Selecione a forma de pagamento!");
    return;
  }

  if (tipoEntrega === "entrega") {
    let nome = document.getElementById("nome").value.trim();
    let rua = document.getElementById("rua").value.trim();
    let numero = document.getElementById("numero").value.trim();
    let bairro = document.getElementById("bairro").value.trim();

    if (!nome || !rua || !numero || !bairro) {
      alert("Preencha todos os campos obrigatórios para entrega!");
      return;
    }
  }

  // Monta mensagem do pedido
  let msg = "🍨 *Pedido Realizado*\n\n";
  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - R$ ${(item.qtd * item.preco).toFixed(2)}\n`;
  });

  let totalCarrinho = parseFloat(totalSpan.textContent);
  let taxaEntrega = 0;

  if (tipoEntrega === "entrega") {
    let bairro = document.getElementById("bairro").value;

    // 🔹 Regras de taxa de entrega
    if (bairro === "Santana") {
      if (totalCarrinho < 30) {
        taxaEntrega = 2;
      }
    } else if (bairro === "São José") taxaEntrega = 3;
    else if (bairro === "Bairro Floresta") taxaEntrega = 3;
    else if (bairro === "Nova Betânia") taxaEntrega = 3;
    else if (bairro === "Vila dos Pescadores") taxaEntrega = 3;
    else if (bairro === "Bugia") taxaEntrega = 3;
    else if (bairro === "Centro") taxaEntrega = 2;

    totalCarrinho += taxaEntrega;

    msg += `\n🚚 *Taxa de entrega:* R$ ${taxaEntrega.toFixed(2)}`;
    msg += `\n💰 *Total com entrega:* R$ ${totalCarrinho.toFixed(2)}`;
  } else {
    msg += `\n💰 *Total:* R$ ${totalCarrinho.toFixed(2)}`;
  }

  msg += `\n\n💳 *Pagamento:* ${pagamento}`;
  if (pagamento === "dinheiro") {
    let troco = document.getElementById("troco").value || "sem troco";
    msg += `\n💵 *Troco:* ${troco}`;
  }

  if (tipoEntrega === "entrega") {
    let nome = document.getElementById("nome").value.trim();
    let rua = document.getElementById("rua").value.trim();
    let numero = document.getElementById("numero").value.trim();
    let bairro = document.getElementById("bairro").value.trim();
    let referencia = document.getElementById("referencia").value.trim() || "Não informado";

    msg += `\n\n📦 *Entrega para:*\n👤 ${nome}\n📍 ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia}`;
  } else {
    msg += "\n\n📦 *Retirada na loja*";
  }

  const telefone = "5527997765557";
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");

  document.querySelector(".popup-content").style.display = "none";
}

// Exibe aviso automático quando for Santana e total < 30
document.getElementById("bairro").addEventListener("change", () => {
  const bairro = document.getElementById("bairro").value;
  const total = parseFloat(totalSpan.textContent);
  const aviso = document.querySelector(".aviso");

  if (bairro === "Santana" && total < 30) {
    aviso.innerHTML = "⚠️ Pedido abaixo de R$30 em Santana tem taxa de R$2,00.";
  } else {
    aviso.innerHTML = "";
  }
});