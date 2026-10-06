// MENU MOBILE

const menuButton = document.getElementById("menuButton");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
    nav.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});


// CARRINHO

let cart = JSON.parse(localStorage.getItem("cafeAuroraCart")) || [];

const cartElement = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function saveCart() {
    localStorage.setItem("cafeAuroraCart", JSON.stringify(cart));
}

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let quantity = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        quantity += item.quantity;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p>R$ ${item.price.toFixed(2).replace(".", ",")}</p>

                <button onclick="changeQuantity(${index}, -1)">−</button>
                ${item.quantity}
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>

            <button onclick="removeItem(${index})">×</button>
        `;

        cartItems.appendChild(div);
    });

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    cartCount.textContent = quantity;
    cartTotal.textContent = total.toFixed(2).replace(".", ",");

    saveCart();
}

function addToCart(name, price) {

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
    openCart();
}

function changeQuantity(index, value) {

    cart[index].quantity += value;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

document.querySelectorAll(".add-button").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        addToCart(name, price);
    });
});


// ABRIR E FECHAR CARRINHO

function openCart() {
    cartElement.classList.add("open");
    overlay.classList.add("show");
}

function closeCartMenu() {
    cartElement.classList.remove("open");
    overlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartMenu);
overlay.addEventListener("click", closeCartMenu);


// FILTROS DO CARDÁPIO

const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(item => {
            item.classList.remove("active");
        });

        filter.classList.add("active");

        const category = filter.dataset.category;

        products.forEach(product => {

            if (
                category === "todos" ||
                product.dataset.category === category
            ) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }

        });
    });
});


// FORMULÁRIO

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {

        formMessage.textContent = "Preencha todos os campos.";
        formMessage.style.color = "#ffb4a2";

        return;
    }

    if (!email.includes("@")) {

        formMessage.textContent = "Digite um e-mail válido.";
        formMessage.style.color = "#ffb4a2";

        return;
    }

    if (message.length < 10) {

        formMessage.textContent =
            "A mensagem precisa ter pelo menos 10 caracteres.";

        formMessage.style.color = "#ffb4a2";

        return;
    }

    formMessage.textContent =
        "Mensagem enviada com sucesso! ☕";

    formMessage.style.color = "#e2b875";

    form.reset();
});


// FINALIZAR PEDIDO

document.getElementById("finishOrder").addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    let order = "Pedido Café Aurora:\n\n";

    cart.forEach(item => {
        order += `${item.quantity}x ${item.name}\n`;
    });

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    order += `\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`;

    alert(order);

    cart = [];

    updateCart();
    closeCartMenu();
});


// INICIAR

updateCart();
