
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

  // valida campos de pagamento
  if (!pagamento) {
    alert("Selecione a forma de pagamento!");
    return;
  }

  // valida endereço caso seja entrega
  if (tipoEntrega === "entrega") {
    let nome = document.getElementById("nome").value.trim();
    let rua = document.getElementById("rua").value.trim();
    let numero = document.getElementById("numero").value.trim();
    let bairro = document.getElementById("bairro").value.trim();

    if (!nome || !rua || !numero || !bairro) {
      alert("Preencha todos os campos obrigatórios para entrega!");
      return; // aqui bloqueia o envio
    }
  }

  // monta mensagem do pedido
  let msg = "Olá, gostaria de fazer o pedido:\n";
  carrinho.forEach(item => {
    msg += `${item.qtd}x ${item.nome} - R$ ${item.preco} = R$ ${(item.qtd * item.preco).toFixed(2)}\n`;
  });

  let totalCarrinho = parseFloat(totalSpan.textContent);

  if (tipoEntrega === "entrega") {
    let lugar = document.getElementById("lugar").value;
    let taxaEntrega = 0;
    if (lugar === "Santana") taxaEntrega = 4;
    else if (lugar === "Maria Manteiga") taxaEntrega = 3;
    totalCarrinho += taxaEntrega;
    msg += `\nTaxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
    msg += `\nTotal com entrega: R$ ${totalCarrinho.toFixed(2)}`;
  } else {
    msg += `\nTotal: R$ ${totalCarrinho.toFixed(2)}`;
  }

  msg += `\nPagamento: ${pagamento}`;
  if (pagamento === "dinheiro") {
    let troco = document.getElementById("troco").value || "sem troco";
    msg += `\nTroco: ${troco}`;
  }

  if (tipoEntrega === "entrega") {
    let nome = document.getElementById("nome").value.trim();
    let rua = document.getElementById("rua").value.trim();
    let numero = document.getElementById("numero").value.trim();
    let bairro = document.getElementById("bairro").value.trim();
    let referencia = document.getElementById("referencia").value.trim() || "Não informado";

    msg += `\n\n📦 Entrega para:\n👤 Nome: ${nome}\n📍 Endereço: ${rua}, ${numero} - ${bairro}\n🗺️ Referência: ${referencia}`;
  } else {
    msg += "\n\n📦 Retirada na loja.";
  }

  document.getElementById("popup").style.display = "none";

  const telefone = "5527988223701";
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
}

const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

function delivery() {
  let lugar = document.getElementById("lugar").value;
  let txt = document.getElementById("txt");
  let tempo = document.getElementById("tempo");

  let mensagem = "";
  let minutos = "";

  if (lugar === "Santana") {
    mensagem = "⏱️ Entrega em Santana";
    minutos = "25 min <i class='fa-solid fa-clock'></i>";
  } else if (lugar === "Maria Manteiga") {
    mensagem = "⏱️ Entrega em Maria Manteiga";
    minutos = "30 min <i class='fa-solid fa-clock'></i>";
  } else if (lugar === "nao") {
    mensagem = "⏱️ Entrega em outros locais";
    minutos = "40 min <i class='fa-solid fa-clock'></i>";
  } else {
    mensagem = "Por favor, selecione um local de entrega.";
    minutos = "";
  }

  // Atualiza o conteúdo
  txt.innerHTML = mensagem;
  tempo.innerHTML = minutos;

  // Abre o pop-up
  document.getElementById("popup1").style.display = "flex";
}

// Fechar popup no "X"
document.getElementById("fecharPopup1").addEventListener("click", () => {
  document.getElementById("popup1").style.display = "none";
});

let slideIndex = 1; 
mostrarSlide(slideIndex);

// Controle manual
function mudarSlide(n) {
  mostrarSlide(slideIndex += n);
}

// Mostra o slide correto
function mostrarSlide(n) {
  let slides = document.getElementsByClassName("slide");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}

// Automático com intervalo fixo
setInterval(() => {
  mudarSlide(1);
}, 4000);