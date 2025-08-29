
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
const resPagamento = document.getElementById("res");

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
selectPagamento.addEventListener("change", () =>{ 
  trocoDiv.style.display = selectPagamento.value === "dinheiro" ? "block" : "none";
  //resPagamento.innerText = selectPagamento.value ? "Você escolheu: " + selectPagamento.value : "";


  const lugarSelect = document.getElementById("lugar");

// Atualiza taxa automaticamente ao mudar de lugar
lugarSelect.addEventListener("change", () => {
  const lugar = lugarSelect.value;
  if (!lugar) return;

  let totalQtd = carrinho.reduce((acc, item) => acc + item.qtd, 0);

  if (totalQtd < 3) {
    alert("⚠️ Pedido mínimo é de 3 chup-chups para qualquer local.");
    return;
  }

  let taxa = 2; // padrão
  if (lugar === "Santana") taxa = 4;
  else if (lugar === "Maria Manteiga") taxa = 3;

  alert(`📍 Entrega em ${lugar}: taxa de R$ ${taxa},00.`);
});
 })
// Finalizar pedido

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

  // abre popup para escolher entrega/retirada e endereço
  document.getElementById("popup").style.display = "block";
});

// fechar popup
document.getElementById("fecharPopup").onclick = function() {
  document.getElementById("popup").style.display = "none";
};

// alternar entre retirada e entrega
document.querySelectorAll("input[name='tipoEntrega']").forEach(radio => {
  radio.addEventListener("change", function() {
    let enderecoCampos = document.getElementById("enderecoCampos");
    enderecoCampos.style.display = this.value === "entrega" ? "block" : "none";
  });
});

// confirmar pedido e enviar pro WhatsApp
function confirmarPedido() {
  let pagamento = document.getElementById("pagamento").value;
  let tipoEntrega = document.querySelector("input[name='tipoEntrega']:checked").value;

  // monta mensagem inicial
  let msg = "Olá, gostaria de fazer o pedido:\n";
  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - R$ ${item.preco} = R$ ${(item.qtd * item.preco).toFixed(2)}\n`;
  });

  // calcula total do carrinho
  let totalCarrinho = parseFloat(totalSpan.textContent);

  // calcula taxa de entrega se for entrega
  let taxaEntrega = 0;
  if(tipoEntrega === "entrega") {
    let lugar = document.getElementById("lugar").value;
    if (lugar === "Santana") taxaEntrega = 4;
    else if (lugar === "Maria Manteiga") taxaEntrega = 3;
    else taxaEntrega = 2; // outros lugares

    totalCarrinho += taxaEntrega;
    msg += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
    msg += `\nTotal com entrega: R$ ${totalCarrinho.toFixed(2)}`;
  } else {
    msg += `\nTotal: R$ ${totalCarrinho.toFixed(2)}`;
  }

  // forma de pagamento
  msg += `\nPagamento: ${pagamento}`;
  if (pagamento === "dinheiro") {
    let troco = document.getElementById("troco").value || "sem troco";
    msg += `\nTroco: ${troco}`;
  }

  // informações de entrega
  let msgExtra = "";
  if (tipoEntrega === "entrega") {
    let nome = document.getElementById("nome").value;
    let rua = document.getElementById("rua").value;
    let numero = document.getElementById("numero").value;
    let bairro = document.getElementById("bairro").value;
    let referencia = document.getElementById("referencia").value;

    if (!nome || !rua || !numero || !bairro) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    msgExtra = `\n\n📦 Entrega para:\n👤 Nome: ${nome}\n📍 Endereço: ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia || "Não informado"}`;
  } else {
    msgExtra = "\n\n📦 Retirada na loja.";
  }

  msg += msgExtra;

  // fecha popup
  document.getElementById("popup").style.display = "none";

  // envia pro WhatsApp
  const telefone = "5527997765557"; // seu número
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
}
const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

