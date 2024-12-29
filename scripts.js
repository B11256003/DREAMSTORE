// 從 localStorage 中讀取購物車數據
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartTableBody = document.querySelector('#cart-table tbody');
const totalPriceElement = document.getElementById('total-price');
const cartCountElement = document.getElementById('cart-count');

// 渲染購物車列表
function renderCart() {
    cartTableBody.innerHTML = ''; // 清空表格
    let total = 0;

    // 遍歷購物車中的每個商品
    cart.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="decrease-quantity" data-index="${index}">-</button>
                ${product.quantity}
                <button class="increase-quantity" data-index="${index}">+</button>
            </td>
            <td>$${(product.price * product.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">刪除</button></td>
        `;
        cartTableBody.appendChild(row);

        // 計算總價
        total += product.price * product.quantity;
    });

    // 更新總價顯示
    totalPriceElement.textContent = total.toFixed(2);

    // 添加刪除按鈕事件監聽
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            removeFromCart(index);
        });
    });

    // 添加增加數量按鈕事件監聽
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            increaseQuantity(index);
        });
    });

    // 添加減少數量按鈕事件監聽
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            decreaseQuantity(index);
        });
    });
}

// 刪除商品
function removeFromCart(index) {
    cart.splice(index, 1); // 從購物車數組中移除指定的商品
    localStorage.setItem('cart', JSON.stringify(cart)); // 保存更新後的購物車數據到 localStorage
    updateCartCount(); // 重新渲染購物車並更新購物車數量
    renderCart();
}

// 增加商品數量
function increaseQuantity(index) {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart)); // 保存更新後的購物車數據到 localStorage
    renderCart();
}

// 減少商品數量
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index); // 數量為0時，刪除商品
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // 保存更新後的購物車數據到 localStorage
    renderCart();
}

// 更新購物車數量
function updateCartCount() {
    cartCountElement.textContent = cart.length;
}

// 初始化頁面，綁定「加入購物車」按鈕事件
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.parentElement;
        const product = {
            id: productCard.getAttribute('data-id'),
            name: productCard.getAttribute('data-name'),
            price: parseFloat(productCard.getAttribute('data-price')),
        };
        addToCart(product);
    });
});

// 將商品加入購物車
function addToCart(product) {
    const productInCart = cart.find(item => item.id === product.id);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // 更新 localStorage 中的購物車數據
    updateCartCount(); // 更新購物車數量顯示
    renderCart();
    alert('商品已加入購物車！');
}

// 打開購物車彈出視窗
document.querySelector('.cart-icon').addEventListener('click', () => {
    renderCart();
    document.getElementById('cart-modal').style.display = 'flex';
});

// 關閉購物車彈出視窗
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

// 初始化購物車數量
updateCartCount();
