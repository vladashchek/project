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

let timeline = [];
let preloaderAnimation;

// ========== Прелоадер ==========
function initPreloader() {
  const wasShown = localStorage.getItem('preloaderShown');
  if (wasShown) {
    document.querySelector('.preloader').style.display = 'none';
    return;
  }

  preloaderAnimation = lottie.loadAnimation({
    container: document.getElementById('lottie-container'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets2.lottiefiles.com/packages/lf20_qm8eqzse.json'
  });
}

function hidePreloader() {
  const preloader = document.querySelector('.preloader');
  preloader.classList.add('fade-out');
  setTimeout(() => {
    preloader.style.display = 'none';
    preloaderAnimation?.destroy();
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

    timeline = data.timeline || [];

  } catch (error) {
    console.warn("⚠️ Невозможно загрузить data.json, использованы локальные города.");
  } finally {
    init(); // Продолжаем инициализацию
    hidePreloader();
  }
}

// ========== Инициализация Swiper ==========
window.addEventListener('load', () => {
  new Swiper('.testimonials-swiper', {
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
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
});

// ========== Рендер городов ==========
function renderCities(filter = 'all') {
  const cityGrid = document.querySelector('.city-grid');
  if (!cityGrid) return;
  cityGrid.innerHTML = '';

  const filtered = filter === 'all' ? cities : cities.filter(city => city.type === filter);

  for (const city of filtered) {
    cityGrid.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
        <div class="city-card" onclick="openCityModal(${city.id})">
          <img src="${city.image}" alt="${city.name}">
          <div class="city-info">
            <h3>${city.name}</h3>
            <p>${city.year} г.</p>
            <p><em>${city.shortFact}</em></p>
          </div>
        </div>
      </div>`;
  }
}

// ========== Рендер ленты истории ==========
function renderTimeline() {
  const timelineElement = document.querySelector('.timeline');
  if (!timelineElement) return;
  timelineElement.innerHTML = '';

  const sortedEvents = timeline.sort((a, b) => a.year - b.year);

  for (let i in sortedEvents) {
    const event = sortedEvents[i];
    const aos = ['fade-up', 'fade-right', 'fade-down', 'fade-left'][i % 4];

    let additionalEventsHTML = '';
    if (event.additionalEvents) {
      additionalEventsHTML = `
        <div class="additional-events">
          ${event.additionalEvents.map(addEvent => `
            <div class="additional-event">
              <span class="year">${addEvent.year}</span>
              <p>${addEvent.event}</p>
            </div>`).join('')}
        </div>`;
    }

    timelineElement.innerHTML += `
      <div class="timeline-item" data-aos="${aos}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3>${event.city}</h3>
          <p class="year">${event.year} г.</p>
          <p>${event.event}</p>
          <p>${event.description}</p>
          ${additionalEventsHTML}
        </div>
      </div>`;
  }
}

// ========== Рендер галереи ==========
function renderGallery() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  for (const city of cities) {
    for (const img of city.gallery) {
      gallery.innerHTML += `
        <div class="gallery-item" data-aos="fade-up">
          <img src="${img}" alt="${city.name}">
        </div>`;
    }
  }
}

// ========== Модалка города ==========
function openCityModal(id) {
  const city = cities.find(c => c.id === id);
  const modal = new bootstrap.Modal(document.getElementById('cityModal'));

  document.querySelector('.modal-title').textContent = city.name;
  document.querySelector('.modal-body').innerHTML = `
    <div class="swiper modal-swiper">
      <div class="swiper-wrapper">
        ${city.gallery.map(img => `
          <div class="swiper-slide">
            <img src="${img}" alt="${city.name}" class="img-fluid rounded w-100">
          </div>`).join('')}
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <div class="mt-4">
      <h4>История</h4>
      <p>${city.history}</p>
    </div>`;

  modal.show();

  setTimeout(() => {
    new Swiper('.modal-swiper', {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }, 300);
}

// ========== Фильтрация городов ==========
const filterButtons = document.querySelectorAll(".city-filters button");
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
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
        top: target.offsetTop - 70,
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

// ========== Tilt ==========
VanillaTilt.init(document.querySelectorAll(".person-modern-card"), {
  max: 15,
  speed: 300,
  glare: true,
  "max-glare": 0.2,
});

// ========== Форма + LocalStorage сохранение ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  const fields = ['name', 'email', 'phone', 'city', 'message'];

  if (form) {
    fields.forEach(field => {
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

// ========== Кнопка "Наверх" ==========
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
  scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
});
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});