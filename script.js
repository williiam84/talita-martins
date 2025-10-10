let carrinho = [];

const carrinhoUl = document.getElementById("Carrinho");
const totalSpan = document.getElementById("total");
const footerCarrinho = document.getElementById("Footer3");

// Função para atualizar carrinho
function atualizarCarrinho() {
  carrinhoUl.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} - R$ ${item.preco} x ${item.qtd} = R$ ${(item.preco*item.qtd).toFixed(2)}
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

function adicionarCarrinho(nome, preco, qtd=1) {
  let item = carrinho.find(i => i.nome === nome);
  if(item) item.qtd += qtd;
  else carrinho.push({ nome, preco, qtd });
  atualizarCarrinho();
}

function alterarQtd(index, delta) {
  carrinho[index].qtd += delta;
  if(carrinho[index].qtd < 1) carrinho.splice(index,1);
  atualizarCarrinho();
}

function removerItem(index){
  carrinho.splice(index,1);
  atualizarCarrinho();
}

// POPUP
const popup = document.getElementById("popup");
const fecharPopup = document.getElementById("fecharPopup");
const finalizar = document.getElementById("finalizar");
const tipoEntregaRadios = document.querySelectorAll("input[name='tipoEntregaPopup']");
const enderecoCampos = document.getElementById("enderecoCamposPopup");

const pagamentoFooter = document.getElementById("pagamento");
const pagamentoPopup = document.getElementById("pagamentoPopup");
const trocoDivFooter = document.getElementById("trocoDiv");
const trocoDivPopup = document.getElementById("trocoDivPopup");

finalizar.addEventListener("click", () => {
  if(carrinho.length === 0){ alert("Seu carrinho está vazio!"); return; }
  popup.style.display = "block";
  footerCarrinho.style.display = "none";
});

// Fechar popup
fecharPopup.addEventListener("click", () => {
  popup.style.display = "none";
  if(carrinho.length>0) footerCarrinho.style.display = "flex";
});

// Alternar entrega/retirada
tipoEntregaRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    enderecoCampos.style.display = radio.value === "entrega" ? "block" : "none";
  });
});

// Mostrar troco se dinheiro
function toggleTroco(selectEl, trocoDiv) {
  trocoDiv.style.display = selectEl.value === "dinheiro" ? "block" : "none";
}

pagamentoFooter.addEventListener("change", () => toggleTroco(pagamentoFooter, trocoDivFooter));
pagamentoPopup.addEventListener("change", () => toggleTroco(pagamentoPopup, trocoDivPopup));

// Confirmar pedido
document.getElementById("confirmarPedido").addEventListener("click", () => {
  if(carrinho.length === 0){ alert("Seu carrinho está vazio!"); return; }

  let pagamento = pagamentoPopup.value;
  if(!pagamento){ alert("Selecione a forma de pagamento!"); return; }

  let tipoEntrega = document.querySelector("input[name='tipoEntregaPopup']:checked").value;
  let totalCarrinho = parseFloat(totalSpan.textContent);
  let taxaEntrega = 0;
  let msg = "Olá, gostaria de fazer o pedido:\n";

  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - R$ ${item.preco} = R$ ${(item.qtd*item.preco).toFixed(2)}\n`;
  });

  if(tipoEntrega === "entrega") {
    let nome = document.getElementById("nomePopup").value.trim();
    let rua = document.getElementById("ruaPopup").value.trim();
    let numero = document.getElementById("numeroPopup").value.trim();
    let bairro = document.getElementById("bairroPopup").value.trim();

    if(!nome || !rua || !numero || !bairro){ alert("Preencha todos os campos obrigatórios para entrega!"); return; }

    if(bairro==="Santana"){ taxaEntrega = totalCarrinho < 30 ? 2 : 0; }
    else if(["São José","Bairro Floresta","Nova Betânia","Vila dos Pescadores","Bugia"].includes(bairro)){ taxaEntrega = 3; }
    else if(bairro==="Centro"){ taxaEntrega = 2; }

    totalCarrinho += taxaEntrega;
    msg += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}\nTotal com entrega: R$ ${totalCarrinho.toFixed(2)}`;
    let referencia = document.getElementById("referenciaPopup").value.trim() || "Não informado";
    msg += `\n\n📦 Entrega para:\n👤 Nome: ${nome}\n📍 Endereço: ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia}`;
  } else {
    msg += `\nTotal: R$ ${totalCarrinho.toFixed(2)}\n\n📦 Retirada na loja`;
  }

  msg += `\nPagamento: ${pagamento}`;
  if(pagamento === "dinheiro") {
    let troco = document.getElementById("trocoPopup").value || "sem troco";
    msg += `\nTroco: ${troco}`;
  }

  popup.style.display = "none";
  if(carrinho.length>0) footerCarrinho.style.display = "flex";

  const telefone = "5527997765557"; // número para WhatsApp
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
});