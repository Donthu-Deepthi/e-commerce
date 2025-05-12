// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "High-quality wireless headphones with noise cancellation."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Feature-packed smartwatch with health monitoring."
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 24.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Comfortable 100% cotton t-shirt available in multiple colors."
    },
    {
        id: 4,
        name: "Denim Jeans",
        price: 59.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Classic fit denim jeans with stretch for comfort."
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 89.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Programmable coffee maker with thermal carafe."
    },
    {
        id: 6,
        name: "Throw Pillow",
        price: 19.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Soft decorative throw pillow for your living space."
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        price: 79.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Portable Bluetooth speaker with 12-hour battery life."
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 89.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Lightweight running shoes with cushioned soles."
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartCount = document.querySelector('.cart-count');
const filterButtons = document.querySelectorAll('.filter-btn');

// Display Products
function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to Cart
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Show cart notification
function showCartNotification() {
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 500);
}

// Update Cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal if open
    if (cartModal.style.display === 'flex') {
        renderCartItems();
    }
}

// Render Cart Items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <div class="remove-item" data-id="${item.id}">&times;</div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Decrease Quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Increase Quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    item.quantity++;
    updateCart();
}

// Remove Item
function removeItem(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Filter Products
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Filter products
        displayProducts(button.dataset.filter);
    });
});

// Contact Form
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Checkout
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert(`Order placed! Total: $${cartTotal.textContent}`);
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
    }
});

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    renderCartItems();
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Initialize
displayProducts();

// Add animation class to cart icon
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    .animate {
        animation: bounce 0.5s;
    }
`;
document.head.appendChild(style);