/*
 * Основной скрипт для маркетплейса JoyCity.
 * Содержит генерацию данных о категориях и товарах,
 * функции для отображения категорий, списка товаров, деталей товара,
 * управление корзиной и оформление заказа.
 */

// Данные о категориях. Название и slug для адресной строки.
const data = {
  categories: [
    { name: 'Женщинам', slug: 'women' },
    { name: 'Мужчинам', slug: 'men' },
    { name: 'Детям', slug: 'kids' },
    { name: 'Обувь', slug: 'shoes' },
    { name: 'Электроника', slug: 'electronics' },
    { name: 'Красота', slug: 'beauty' },
    { name: 'Спорт', slug: 'sports' },
    { name: 'Дом', slug: 'home' },
    { name: 'Игрушки', slug: 'toys' },
    { name: 'Бытовая техника', slug: 'appliances' },
    { name: 'Книги', slug: 'books' },
    { name: 'Для ремонта', slug: 'tools' },
    { name: 'Сад и огород', slug: 'garden' },
    { name: 'Авто', slug: 'auto' },
    { name: 'Подарки', slug: 'gifts' },
    { name: 'Канцтовары', slug: 'office' },
    { name: 'Здоровье', slug: 'health' },
    { name: 'Украшения', slug: 'jewelry' },
    { name: 'Музыка', slug: 'music' },
    { name: 'Товары для животных', slug: 'pets' }
  ],
  products: []
};

// Генерация списка товаров. Для каждой категории создаём 15 товаров.
(function generateProducts() {
  data.categories.forEach((cat) => {
    for (let i = 1; i <= 15; i++) {
      const id = `${cat.slug}-${i}`;
      const price = (Math.floor(Math.random() * 90) + 10) * 10; // цена от 100 до 1000 рублей
      // Создаём URL изображения с помощью placeholder.com. Кодируем название категории для корректного отображения.
      const imageText = encodeURIComponent(`${cat.name} ${i}`);
      const imageUrl = `https://via.placeholder.com/300x300.png?text=${imageText}`;
      data.products.push({
        id: id,
        name: `${cat.name} – Товар ${i}`,
        category: cat.slug,
        price: price,
        description: `Описание товара ${i} из категории ${cat.name}. Отличное качество и стиль от лучших производителей.`,
        image: imageUrl
      });
    }
  });
})();

/**
 * Отображает список категорий на главной странице.
 */
function displayCategories() {
  const container = document.getElementById('categories');
  if (!container) return;
  container.innerHTML = '';
  data.categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <a href="category.html?category=${cat.slug}">
        <div class="category-name">${cat.name}</div>
      </a>
    `;
    container.appendChild(card);
  });
}

/**
 * Отображает товары выбранной категории.
 * @param {string} slug slug категории
 */
function displayProducts(slug) {
  const container = document.getElementById('product-list');
  const titleElem = document.getElementById('category-title');
  if (!container) return;
  const category = data.categories.find(c => c.slug === slug);
  if (category && titleElem) {
    titleElem.textContent = category.name;
  }
  const products = data.products.filter(p => p.category === slug);
  container.innerHTML = '';
  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${prod.id}">
        <img src="${prod.image}" alt="${prod.name}">
        <h3>${prod.name}</h3>
        <p class="price">${prod.price} ₽</p>
      </a>
    `;
    container.appendChild(card);
  });
}

/**
 * Отображает подробную информацию о товаре.
 * @param {string} id идентификатор товара
 */
function displayProduct(id) {
  const container = document.getElementById('product-detail');
  if (!container) return;
  const product = data.products.find(p => p.id === id);
  if (!product) {
    container.innerHTML = '<p>Товар не найден.</p>';
    return;
  }
  container.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <h2>${product.name}</h2>
    <p class="product-description">${product.description}</p>
    <p class="price">Цена: ${product.price} ₽</p>
    <button class="btn" onclick="addToCart('${product.id}')">Добавить в корзину</button>
  `;
}

/**
 * Добавляет товар в корзину (localStorage).
 * @param {string} id идентификатор товара
 */
function addToCart(id) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Товар добавлен в корзину');
}

/**
 * Загружает корзину и отображает ёё содержимое.
 */
function loadCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Корзина пуста.</p>';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    const product = data.products.find(p => p.id === item.id);
    if (!product) return;
    const itemTotal = product.price * item.qty;
    total += itemTotal;
    const itemElem = document.createElement('div');
    itemElem.className = 'cart-item';
    itemElem.innerHTML = `
      <div class="cart-item-name">${product.name}</div>
      <div class="cart-item-controls">
        <span>${product.price} ₽ × ${item.qty} = ${itemTotal} ₽</span>
        <button class="small-btn" onclick="removeFromCart('${item.id}')">Удалить</button>
      </div>
    `;
    container.appendChild(itemElem);
  });
  const totalElem = document.createElement('div');
  totalElem.className = 'cart-total';
  totalElem.innerHTML = `<strong>Итого: ${total} ₽</strong>`;
  container.appendChild(totalElem);
}

/**
 * Удаляет товар из корзины.
 * @param {string} id идентификатор товара
 */
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

/**
 * Переходит к странице оформления заказа.
 */
function proceedToCheckout() {
  window.location.href = 'checkout.html';
}

/**
 * Инициализация страницы оформления заказа: отображение сводки по заказу,
 * расчёт примерной даты доставки и обработка отправки формы.
 */
function checkoutPageInit() {
  const summary = document.getElementById('order-summary');
  const form = document.getElementById('checkout-form');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  summary.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const product = data.products.find(p => p.id === item.id);
    if (!product) return;
    const itemTotal = product.price * item.qty;
    total += itemTotal;
    const line = document.createElement('div');
    line.textContent = `${product.name} × ${item.qty} = ${itemTotal} ₽`;
    summary.appendChild(line);
  });
  const deliveryDate = randomDeliveryDate();
  const totalElem = document.createElement('div');
  totalElem.innerHTML = `<strong>Итого: ${total} ₽</strong>`;
  summary.appendChild(totalElem);
  const deliveryElem = document.createElement('div');
  deliveryElem.textContent = `Предполагаемая доставка: ${deliveryDate}`;
  summary.appendChild(deliveryElem);
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // В реальном проекте здесь должна быть интеграция с платёжным шлюзом (sandbox).
    localStorage.removeItem('cart');
    alert('Спасибо за заказ! Оплата прошла успешно (sandbox). Ваш заказ будет доставлен ' + deliveryDate + '.');
    window.location.href = 'index.html';
  });
}

/**
 * Возвращает случайную дату доставки (через 3–7 дней от сегодняшнего дня).
 */
function randomDeliveryDate() {
  const today = new Date();
  const days = Math.floor(Math.random() * 5) + 3;
  const deliveryDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  return deliveryDate.toLocaleDateString('ru-RU');
}
