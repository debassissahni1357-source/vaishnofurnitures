// Shopping Cart Logic for Vaishno Furniture
let cart = JSON.parse(localStorage.getItem('vf-cart')) || [];

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = cart.length;
    }
}

function saveCart() {
    localStorage.setItem('vf-cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function addToCart(name, price, img) {
    cart.push({ name, price, img, id: Date.now() });
    saveCart();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total-amount');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">Your cart is empty.</p>';
        totalElement.innerText = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const priceNum = parseInt(item.price.replace(/[^\d]/g, ''));
        total += priceNum;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.price}</span>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">&times;</button>
            </div>
        `;
    }).join('');

    totalElement.innerText = `₹${total.toLocaleString()}`;
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();

    const cartBtn = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('close-cart');
    
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);

    // Payment Logic
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closePayment = document.getElementById('close-payment');
    const confirmBtn = document.getElementById('confirm-pay-btn');
    const successSection = document.getElementById('payment-success');
    const step1Section = document.getElementById('payment-step-1');
    const continueBtn = document.getElementById('continue-shopping');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            paymentModal.style.display = 'flex';
            closeCart();
        });
    }

    if (closePayment) {
        closePayment.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            confirmBtn.innerText = 'Processing...';
            confirmBtn.disabled = true;
            
            setTimeout(() => {
                step1Section.style.display = 'none';
                successSection.style.display = 'block';
                cart = [];
                saveCart();
            }, 2000);
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            paymentModal.style.display = 'none';
            step1Section.style.display = 'block';
            successSection.style.display = 'none';
            confirmBtn.innerText = 'Confirm Payment';
            confirmBtn.disabled = false;
        });
    }
});
