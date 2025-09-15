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