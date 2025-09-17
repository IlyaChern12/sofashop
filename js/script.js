// открытие/закрытие модалок
document.querySelectorAll('[data-modal-target]').forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    modal.showModal();
  });
});

document.querySelectorAll('.modal-close').forEach(button => {
  button.addEventListener('click', () => {
    button.closest('dialog').close();
  });
});

// корзина
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const mainContent = document.getElementById("main-content");

cartButton.addEventListener("click", () => {
    const isOpen = cartPanel.classList.toggle("open");
    mainContent.classList.toggle("cart-open", isOpen);
});

const closeCartButton = document.querySelector("#cart-panel .close-cart");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector(".cart-count");

let cart = [];

// закрыть корзину крестиком
if (closeCartButton) {
    closeCartButton.addEventListener("click", () => {
        cartPanel.classList.remove("open");
        mainContent.classList.remove("cart-open");
    });
}

// добавление товаров
addToCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        const title = card.querySelector(".product-title").textContent;
        const price = parseInt(card.dataset.price);

        // проверяем, есть ли товар с таким названием
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ title, price, quantity: 1 });
        }

        updateCartUI();

        // открыть корзину при добавлении
        cartPanel.classList.add("open");
        mainContent.classList.add("cart-open");
    });
});

function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <p class="cart-item-name">${item.title}</p>
            <p class="cart-item-qty">${item.quantity} шт</p>
            <button class="cart-item-remove" aria-label="Удалить товар">&times;</button>
            <p class="cart-item-total">${item.price * item.quantity} ₽</p>
        `;

        // удаление товара
        div.querySelector(".cart-item-remove").addEventListener("click", () => {
            cart = cart.filter(cartItem => cartItem.title !== item.title);
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total;
    cartCount.textContent = count;
}