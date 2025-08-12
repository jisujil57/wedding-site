document.addEventListener('DOMContentLoaded', () => {
  const scrollEl = document.querySelector('[data-scroll-container]');
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  gsap.registerPlugin(ScrollTrigger);

  // Функция для анимации элементов появления с прокруткой
  function animateElements(scroller = null) {
    const animatedElems = document.querySelectorAll('.content > *');

    animatedElems.forEach(elem => {
      gsap.from(elem, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elem,
          scroller: scroller,       // null для нативного скролла или scrollEl для Locomotive
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    });
  }

  if (!isMobile) {
    // Инициализация Locomotive Scroll для ПК
    const scroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      multiplier: 1.5,
      tablet: { smooth: true },
      smartphone: { smooth: true },
    });

    // Интеграция с ScrollTrigger
    scroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: scrollEl.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();

    // Смена фото при скролле (если нужна)
    const photos = document.querySelectorAll('.photo-backgrounds .photo');
    scroll.on('call', func => {
      if (func.startsWith('panel-')) {
        const index = parseInt(func.split('-')[1], 10);
        photos.forEach((photo, i) => {
          photo.classList.toggle('active', i === index - 1);
        });
      }
    });

    animateElements(scrollEl);

    window.addEventListener('load', () => {
      scroll.update();
    });
  } else {
    // Мобильная версия — обычный нативный скролл и анимации
    animateElements(null);
  }

  // Таймер обратного отсчёта — без изменений
  const targetISO = '2025-09-09T15:30:00+03:00';
  const countdownDate = new Date(Date.parse(targetISO));

  const elDays = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');
  const elMessage = document.getElementById('countdown-message');
  const countdownWrap = document.querySelector('.countdown');

  function formatNumber(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const dist = countdownDate.getTime() - now;
    if (dist <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      if (elMessage) {
        elMessage.style.display = 'inline-block';
        elMessage.setAttribute('aria-hidden', 'false');
        elMessage.textContent = 'Свадьба уже началась!';
      }
      if (countdownWrap) countdownWrap.setAttribute('aria-label', 'Свадьба уже началась!');
      return true;
    }
    const days = Math.floor(dist / (1000 * 60 * 60 * 24));
    const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((dist % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = formatNumber(days);
    if (elHours) elHours.textContent = formatNumber(hours);
    if (elMinutes) elMinutes.textContent = formatNumber(minutes);
    if (elSeconds) elSeconds.textContent = formatNumber(seconds);

    return false;
  }

  updateCountdown();
  const intervalId = setInterval(() => {
    const done = updateCountdown();
    if (done) clearInterval(intervalId);
  }, 1000);
});
