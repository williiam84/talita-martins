// ======= INCREMENTO E DECREMENTO =======
function increment(id) {
    let input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
}

function decrement(id) {
    let input = document.getElementById(id);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ======= CARRINHO =======
let carrinho = [];
const carrinhoUl = document.getElementById('Carrinho');
const totalSpan = document.getElementById('total');

function adicionarCarrinho(nome, preco, quantidade) {
    quantidade = parseInt(quantidade);
    if (quantidade <= 0) return;

    // Verifica se produto já existe
    const existente = carrinho.find(item => item.nome === nome);
    if (existente) {
        existente.quantidade += quantidade;
    } else {
        carrinho.push({ nome, preco, quantidade });
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    carrinhoUl.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - ${item.quantidade} x R$${item.preco.toFixed(2)}`;
        carrinhoUl.appendChild(li);
        total += item.preco * item.quantidade;
    });

    totalSpan.textContent = total.toFixed(2);
}

// ======= POPUP =======
const popup = document.getElementById('popup');
const fecharPopup = document.getElementById('fecharPopup');

document.getElementById('finalizar').addEventListener('click', () => {
    popup.style.display = 'block';
});

fecharPopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === popup) popup.style.display = 'none';
});

// ======= MOSTRAR CAMPOS DE ENDEREÇO =======
const tipoEntregaRadios = document.querySelectorAll('input[name="tipoEntregaPopup"]');
const enderecoCamposPopup = document.getElementById('enderecoCamposPopup');

tipoEntregaRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'entrega') {
            enderecoCamposPopup.classList.remove('hidden');
        } else {
            enderecoCamposPopup.classList.add('hidden');
        }
    });
});

// ======= MOSTRAR TROCO =======
const pagamentoPopup = document.getElementById('pagamentoPopup');
const trocoDivPopup = document.getElementById('trocoDivPopup');

pagamentoPopup.addEventListener('change', () => {
    if (pagamentoPopup.value === 'dinheiro') {
        trocoDivPopup.classList.remove('hidden');
    } else {
        trocoDivPopup.classList.add('hidden');
    }
});

// ======= CONFIRMAR PEDIDO =======
document.getElementById('confirmarPedido').addEventListener('click', function() {
    const tipoEntrega = document.querySelector('input[name="tipoEntregaPopup"]:checked').value;

    if (tipoEntrega === 'entrega') {
        const nome = document.getElementById('nomePopup').value.trim();
        const rua = document.getElementById('ruaPopup').value.trim();
        const numero = document.getElementById('numeroPopup').value.trim();
        const bairro = document.getElementById('bairroPopup').value.trim();

        if (!nome || !rua || !numero || !bairro) {
            alert("Preencha todos os campos de endereço antes de finalizar o pedido!");
            return;
        }
    }

    if (pagamentoPopup.value === '') {
        alert("Selecione a forma de pagamento!");
        return;
    }

    if (pagamentoPopup.value === 'dinheiro') {
        const troco = document.getElementById('trocoPopup').value.trim();
        if (!troco) {
            alert("Informe o valor do troco!");
            return;
        }
    }

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Se tudo estiver certo
    alert("Pedido confirmado!");
    popup.style.display = 'none';

    // Limpa o carrinho
    carrinho = [];
    atualizarCarrinho();
});