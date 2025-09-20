// элементы корзины
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const mainContent = document.getElementById("main-content");
const closeCartButton = cartPanel.querySelector(".close-cart");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.querySelector(".cart-count");
const cartSummary = document.querySelector(".cart-summary");
const checkoutButton = document.getElementById("checkout-button");

// модалки заказа
const orderModal = document.getElementById("order-modal");
const orderForm = document.getElementById("order-form");
const orderSuccessModal = document.getElementById("order-success-modal");

// выгрузка из localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// загрузка в из localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// обновить интерфейс корзины
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
            <div class="cart-item-controls">
                <button class="qty-decrease" aria-label="Уменьшить">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="qty-increase" aria-label="Увеличить">+</button>
            </div>
            <p class="cart-item-total">${(item.price * item.quantity).toLocaleString("ru-RU")} ₽</p>
            <button class="cart-item-remove" aria-label="Удалить">
                <img src="icons/trash.png" alt="Удалить товар" width="20" height="20">
            </button>
        `;

        // уменьшить количество
        div.querySelector(".qty-decrease").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== item.id);
            }
            saveCart();
            updateCartUI();
        });

        // увеличить количество
        div.querySelector(".qty-increase").addEventListener("click", () => {
            item.quantity++;
            saveCart();
            updateCartUI();
        });

        // удалить товар
        div.querySelector(".cart-item-remove").addEventListener("click", () => {
            cart = cart.filter(i => i.id !== item.id);
            saveCart();
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    // обновить общую сумму и счётчик
    cartTotal.textContent = total.toLocaleString("ru-RU");
    cartCount.textContent = count;
    cartSummary.style.display = cart.length > 0 ? "block" : "none";
}

// показать модалку "заказ создан"
function showOrderSuccessModal() {
    if (!orderSuccessModal) return;
    orderSuccessModal.showModal();

    const closeBtn = orderSuccessModal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => orderSuccessModal.close(), { once: true });

    setTimeout(() => {
        if (orderSuccessModal.open) orderSuccessModal.close();
    }, 3000);
}

// открыть модалки
document.querySelectorAll("[data-modal-target]").forEach(btn => {
  const target = document.querySelector(btn.dataset.modalTarget);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    target.showModal();
  });
});

// закрыть модалки по кнопке
document.querySelectorAll(".modal-close").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest("dialog").close();
  });
});

// открыть/закрыть панель через иконки
cartButton.addEventListener("click", () => {
    const isOpen = cartPanel.classList.toggle("open");
    mainContent.classList.toggle("cart-open", isOpen);
});
closeCartButton.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    mainContent.classList.remove("cart-open");
});

// добавить товар в корзину
addToCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const productCard = e.target.closest(".product-card");
        const id = productCard.dataset.id;
        const title = productCard.querySelector(".product-title").textContent;
        const price = parseInt(productCard.dataset.price, 10);

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }

        saveCart();
        updateCartUI();

        cartPanel.classList.add("open");
        mainContent.classList.add("cart-open");
    });
});

// оформить заказ
checkoutButton.addEventListener("click", () => {
    if (orderModal) orderModal.showModal();
});

// закрыть модалку заказа
if (orderModal) {
    const modalClose = orderModal.querySelector(".modal-close");
    modalClose.addEventListener("click", () => orderModal.close());
}

// отправка формы заказа
if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(orderForm);
        const orderData = Object.fromEntries(formData.entries());

        console.log("Создан заказ:", orderData);

        orderModal.close();
        cart = [];
        saveCart();
        updateCartUI();
        orderForm.reset();

        showOrderSuccessModal();
    });
}

// заполнение корзины с запуска
updateCartUI();