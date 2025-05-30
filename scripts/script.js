'use strict'

document.addEventListener("DOMContentLoaded", () => {
    console.log('Скрипт отработал корректно');
});


// ========== Глобальные переменные ==========
let cities = [
  {
    id: 1,
    name: "Москва",
    type: "imperial",
    year: 1147,
    description: "Столица России, крупнейший по численности населения город",
    shortFact: "Москва — город с семью вокзалами и кольцевым метро.",
    image: "images/moscow.jpg",
    gallery: ["images/moscow.jpg"],
    history: "Москва впервые упоминается в 1147 году. С тех пор она выросла до крупного мегаполиса и столицы России."
  },
  {
    id: 2,
    name: "Санкт-Петербург",
    type: "imperial",
    year: 1703,
    description: "Основан Петром I как 'окно в Европу'",
    shortFact: "Город на 42 островах с 342 мостами!",
    image: "images/piter.jpg",
    gallery: ["images/piter.jpg"],
    history: "Построен на болотах по приказу Петра I как символ новой, европейской России."
  },
  {
    id: 3,
    name: "Владимир",
    type: "ancient",
    year: 990,
    description: "Древняя столица северо-восточной Руси",
    shortFact: "Во Владимире сохранились уникальные белокаменные соборы XII века.",
    image: "images/vladimi.jpg",
    gallery: ["images/vladimi.jpg"],
    history: "Был одним из центров древней Руси, известен своими памятниками архитектуры."
  },
  {
    id: 4,
    name: "Казань",
    type: "imperial",
    year: 1005,
    description: "Культурная столица Татарстана",
    shortFact: "В Казани можно увидеть мечеть и православный собор в одном Кремле.",
    image: "images/kazan.jpeg",
    gallery: ["images/kazan.jpeg"],
    history: "Казань — город с тысячелетней историей, сочетает исламскую и христианскую культуру."
  },
  {
    id: 5,
    name: "Екатеринбург",
    type: "modern",
    year: 1723,
    description: "Индустриальный и культурный центр Урала",
    shortFact: "Екатеринбург — уральский мегаполис, где граница Европы и Азии!",
    image: "images/ekb.jpg",
    gallery: ["images/ekb.jpg"],
    history: "Основан как центр металлургии. Сегодня — крупный бизнес и культурный центр."
  }
];

let timeline = []; // Это должна быть ваша структура данных для временной шкалы, если она не в data.json
let preloaderAnimation;

// ========== Прелоадер ==========
function initPreloader() {
  const wasShown = localStorage.getItem('preloaderShown');
  if (wasShown) {
    document.querySelector('.preloader').style.display = 'none';
    return;
  }

  // NOTE: В вашем HTML не был обнаружен элемент с id="lottie-container".
  // Если Lottie-анимация нужна, убедитесь, что в HTML есть <div id="lottie-container"></div>
  // Например, внутри preloader__content
  const lottieContainer = document.getElementById('lottie-container');
  if (lottieContainer) {
      preloaderAnimation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_qm8eqzse.json'
      });
  } else {
      console.warn("Элемент #lottie-container не найден. Lottie-анимация прелоадера не будет загружена.");
  }
}

function hidePreloader() {
  const preloader = document.querySelector('.preloader'); // Класс остался .preloader
  preloader.classList.add('fade-out'); // Модификатор остался `fade-out`
  setTimeout(() => {
    preloader.style.display = 'none';
    preloaderAnimation?.destroy(); // Проверяем, существует ли анимация перед уничтожением
    localStorage.setItem('preloaderShown', 'true');
  }, 500);
}

// ========== Инициализация AOS ==========
AOS.init({ duration: 1000, once: true });

// ========== Инициализация на DOMContentLoaded ==========
window.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  loadData(); // Попытка загрузки data.json
});

// ========== Загрузка данных с fallback ==========
async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Ошибка загрузки JSON');
    const data = await response.json();

    // Заменяем локальные данные только если в JSON есть данные
    if (data.cities && Array.isArray(data.cities)) {
      cities = data.cities;
    }

    timeline = data.timeline || []; // Загружаем данные для временной шкалы

  } catch (error) {
    console.warn("⚠️ Невозможно загрузить data.json, использованы локальные города.", error); // Логируем ошибку
  } finally {
    init(); // Продолжаем инициализацию
    hidePreloader();
  }
}

// ========== Инициализация Swiper для отзывов ==========
window.addEventListener('load', () => {
  // Инициализируем Swiper по новому БЭМ-классу контейнера
  new Swiper('.testimonials-section__swiper', { // Было .testimonials-swiper
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.testimonials-section__swiper-pagination', // Было .swiper-pagination
      clickable: true
    },
    navigation: {
      nextEl: '.testimonials-section__swiper-button-next', // Было .swiper-button-next
      prevEl: '.testimonials-section__swiper-button-prev'  // Было .swiper-button-prev
    }
  });
});

// ========== Рендер городов ==========
function renderCities(filter = 'all') {
  const cityGrid = document.querySelector('.cities-section__grid');
  if (!cityGrid) return;
  cityGrid.innerHTML = '';

  const filtered = filter === 'all' ? cities : cities.filter(city => city.type === filter);

  filtered.forEach(city => {
    cityGrid.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
        <div class="city-card" onclick="openCityModal(${city.id})">
          <img src="${city.image}" alt="${city.name}" class="city-card__image">
          <div class="city-card__info">
            <h3 class="city-card__info-title">${city.name}</h3>
            <p class="city-card__info-description">${city.year} г.</p>
            <p class="city-card__info-description"><em>${city.shortFact}</em></p>
          </div>
        </div>
      </div>`;
  });
}


// ========== Рендер ленты истории ==========
function renderTimeline() {
  const timelineElement = document.querySelector('.timeline-section__container'); // Было .timeline. В HTML теперь .timeline-section__container .timeline
  if (!timelineElement) return;
  timelineElement.innerHTML = '';

  const sortedEvents = timeline.sort((a, b) => a.year - b.year);

  for (let i in sortedEvents) {
    const event = sortedEvents[i];
    const aos = ['fade-up', 'fade-right', 'fade-down', 'fade-left'][i % 4];

    let additionalEventsHTML = '';
    if (event.additionalEvents) {
      additionalEventsHTML = `
        <div class="timeline__item-additional-events">
          ${event.additionalEvents.map(addEvent => `
            <div class="timeline__item-additional-event">
              <span class="timeline__item-additional-event-year">${addEvent.year}</span>
              <p class="timeline__item-additional-event-text">${addEvent.event}</p>
            </div>`).join('')}
        </div>`;
    }

    timelineElement.innerHTML += `
      <div class="timeline__item" data-aos="${aos}"> <!-- Было .timeline-item -->
        <div class="timeline__item-dot"></div> <!-- Было .timeline-dot -->
        <div class="timeline__item-content"> <!-- Новый элемент для содержимого пункта -->
          <h3 class="timeline__item-title">${event.city}</h3>
          <p class="timeline__item-year">${event.year} г.</p>
          <p class="timeline__item-event">${event.event}</p>
          <p class="timeline__item-description">${event.description}</p>
          ${additionalEventsHTML}
        </div>
      </div>`;
  }
}

// ========== Рендер галереи ==========
function renderGallery() {
  const gallery = document.querySelector('.gallery'); // Остался .gallery, так как это блок
  if (!gallery) return;
  gallery.innerHTML = '';

  for (const city of cities) {
    for (const img of city.gallery) {
      gallery.innerHTML += `
        <div class="gallery__item" data-aos="fade-up"> <!-- Было .gallery-item -->
          <img src="${img}" alt="${city.name}" class="gallery__item-image"> <!-- Было .gallery-item img -->
        </div>`;
    }
  }
}

// ========== Модалка города ==========
function openCityModal(id) {
  const city = cities.find(c => c.id === id);
  const modal = new bootstrap.Modal(document.getElementById('cityModal'));

  // Bootstrap классы modal-title и modal-body остаются без изменений
  document.querySelector('.modal-title').textContent = city.name;
  document.querySelector('.modal-body').innerHTML = `
    <div class="swiper modal-swiper"> <!-- swiper - это класс библиотеки, modal-swiper - ваш модификатор или класс для конкретного экземпляра -->
      <div class="swiper-wrapper">
        ${city.gallery.map(img => `
          <div class="swiper-slide">
            <img src="${img}" alt="${city.name}" class="img-fluid rounded w-100">
          </div>`).join('')}
      </div>
      <div class="swiper-pagination modal-swiper__pagination"></div> <!-- Добавлен БЭМ-класс для пагинации модального свайпера -->
      <div class="swiper-button-prev modal-swiper__button-prev"></div> <!-- Добавлен БЭМ-класс для кнопки prev модального свайпера -->
      <div class="swiper-button-next modal-swiper__button-next"></div> <!-- Добавлен БЭМ-класс для кнопки next модального свайпера -->
    </div>
    <div class="mt-4">
      <h4>История</h4>
      <p>${city.history}</p>
    </div>`;

  modal.show();

  setTimeout(() => {
    // Инициализируем Swiper для модального окна, используя его специфичные классы
    new Swiper('.modal-swiper', {
      loop: true,
      navigation: {
        nextEl: '.modal-swiper__button-next', // Используем БЭМ-класс
        prevEl: '.modal-swiper__button-prev'  // Используем БЭМ-класс
      },
      pagination: {
        el: '.modal-swiper__pagination', // Используем БЭМ-класс
        clickable: true
      }
    });
  }, 300);
}

// ========== Фильтрация городов ==========
const filterButtons = document.querySelectorAll(".city-filters button"); // Класс .city-filters остался, button - это тег
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Классы .active и .city-filters остаются без изменений
    document.querySelector(".city-filters .active")?.classList.remove("active");
    btn.classList.add("active");
    const chosenFilter = btn.dataset.filter;
    localStorage.setItem('cityFilter', chosenFilter);
    renderCities(chosenFilter);
  });
});

// ========== Якоря/прокрутка ==========
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 70, // Смещение для фиксированной навигации
        behavior: 'smooth'
      });
    }
  });
});

// ========== Push UI ==========
function init() {
  const savedFilter = localStorage.getItem('cityFilter') || 'all';
  renderCities(savedFilter);

  filterButtons.forEach(btn => {
    if (btn.dataset.filter === savedFilter) {
      document.querySelector(".city-filters .active")?.classList.remove("active");
      btn.classList.add("active");
    }
  });

  renderTimeline();
  renderGallery();
}

// ========== Tilt (для карточек личностей) ==========
VanillaTilt.init(document.querySelectorAll(".person-card"), { // Было .person-modern-card
  max: 15,
  speed: 300,
  glare: true,
  "max-glare": 0.2,
});

// ========== Форма + LocalStorage сохранение ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form'); // ID остался, это нормально для БЭМ

  // Классы полей формы теперь имеют префикс booking-section__form-
  const fields = ['name', 'email', 'phone', 'city', 'message'];

  if (form) {
    fields.forEach(field => {
      // Ищем элементы по их ID, которые не менялись, так что тут все ОК
      const input = document.getElementById(field);
      if (input && localStorage.getItem(`form_${field}`)) {
        input.value = localStorage.getItem(`form_${field}`);
      }

      input?.addEventListener('input', () => {
        localStorage.setItem(`form_${field}`, input.value);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Заявка успешно отправлена!');
      form.reset();
      fields.forEach(field => localStorage.removeItem(`form_${field}`));
    });
  }
});

// ===== Алгоритм отображения кнопки "Наверх" по скроллу =====
// 1. При загрузке страницы добавляем обработчик события scroll
// 2. При каждом скролле проверяем текущую позицию окна
// 3. Если позиция по Y больше 300px — показываем кнопку
// 4. Если меньше — скрываем
// 5. Кнопка плавно возвращает пользователя в начало страницы

// Блок-схема алгоритма: /images/block-schema.png

// Переменная кнопки
const scrollToTopBtn = document.querySelector('.scroll-to-top');

// Слушатель события scroll
window.addEventListener('scroll', () => {
  console.log("Прокрутка:", window.pageYOffset); // Проверка через консоль
  scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
});

// Слушатель на клик по кнопке
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
