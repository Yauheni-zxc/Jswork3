const addReviewBtn = document.getElementById('add-review-btn');
const productNameInput = document.getElementById('product-name');
const reviewTextInput = document.getElementById('review-text');
const productList = document.getElementById('product-list');
const reviewsContainer = document.getElementById('reviews');

// Получение данных из LocalStorage
let reviews = JSON.parse(localStorage.getItem('reviews')) || {};

// Функция для добавления нового отзыва
function addReview() {
  const productName = productNameInput.value.trim();
  const reviewText = reviewTextInput.value.trim();

  if (productName && reviewText) {
    // Если продукта нет в reviews, добавляем его
    if (!reviews[productName]) {
      reviews[productName] = [];
    }
    // Добавляем отзыв к существующим
    reviews[productName].push(reviewText);

    // Сохранение данных в LocalStorage
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Очистка полей ввода
    productNameInput.value = '';
    reviewTextInput.value = '';

    // Обновление списка продуктов
    renderProductList();
  } else {
    alert("Пожалуйста, заполните все поля.");
  }
}

// Функция для рендеринга списка продуктов
function renderProductList() {
  productList.innerHTML = '';
  const products = Object.keys(reviews);
  if (products.length > 0) {
    const ul = document.createElement('ul');
    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = product;
      li.addEventListener('click', () => {
        renderReviews(product);
      });
      ul.appendChild(li);
    });
    productList.appendChild(ul);
  } else {
    productList.innerHTML = "<p>Нет отзывов.</p>";
  }
}

// Функция для рендеринга отзывов по продукту
function renderReviews(productName) {
  reviewsContainer.innerHTML = '';
  const productReviews = reviews[productName];
  if (productReviews.length > 0) {
    const ul = document.createElement('ul');
    productReviews.forEach((review, index) => {
      const li = document.createElement('li');
      li.textContent = review;
      const deleteButton = document.createElement('span');
      deleteButton.classList.add('delete-review');
      deleteButton.textContent = 'Удалить';
      deleteButton.addEventListener('click', () => {
        deleteReview(productName, index);
      });
      li.appendChild(deleteButton);
      ul.appendChild(li);
    });
    reviewsContainer.appendChild(ul);
  } else {
    reviewsContainer.innerHTML = "<p>Нет отзывов по этому продукту.</p>";
  }
}

// Функция для удаления отзыва
function deleteReview(productName, reviewIndex) {
  reviews[productName].splice(reviewIndex, 1);
  if (reviews[productName].length === 0) {
    delete reviews[productName]; // Удаляем продукт, если нет отзывов
  }
  localStorage.setItem('reviews', JSON.stringify(reviews));
  renderReviews(productName);
  renderProductList(); // Обновляем список продуктов после удаления
}

// Обработчики событий
addReviewBtn.addEventListener('click', addReview);

// Инициализация при загрузке страницы
renderProductList();