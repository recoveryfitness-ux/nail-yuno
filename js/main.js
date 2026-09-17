'use strict';

/* ===== ギャラリー Swiper (Instagram埋め込みスライダー) ===== */
function initGallerySwiper() {
  if (typeof Swiper === 'undefined') return;

  const processEmbeds = () => {
    if (window.instgrm) window.instgrm.Embeds.process();
  };

  new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next',
    },
    breakpoints: {
      768:  { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
    },
    on: {
      init:        processEmbeds,
      slideChange: processEmbeds,
    },
  });
}

/* ===== 口コミ Swiper ===== */
function initReviewSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.review-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: false,
    autoHeight: true,
    pagination: {
      el: '.review-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.review-prev',
      nextEl: '.review-next',
    },
    breakpoints: {
      768:  { slidesPerView: 2, autoHeight: false },
      1100: { slidesPerView: 3, autoHeight: false },
    },
  });
}

/* Swiper JS ロード後に初期化（async読み込み対応） */
if (document.readyState === 'complete') {
  initGallerySwiper();
  initReviewSwiper();
} else {
  window.addEventListener('load', () => {
    initGallerySwiper();
    initReviewSwiper();
  });
}

/* ===== ヘッダー: スクロールで影を追加 ===== */
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== モバイルナビ ===== */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ナビリンクをクリックしたらメニューを閉じる */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  });
});

/* Escキーで閉じる */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});

/* ===== スクロールアニメーション (Intersection Observer) ===== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* 連続するカードを少しずつ遅延させる */
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== アクティブなナビリンクを更新 ===== */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4, rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72px'} 0px 0px 0px` }
);

sections.forEach(section => navObserver.observe(section));

/* ===== FAQ: details 要素のアニメーション ===== */
document.querySelectorAll('.faq-item').forEach(details => {
  const summary = details.querySelector('.faq-question');
  const answer  = details.querySelector('.faq-answer');

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = details.hasAttribute('open');

    /* 他をすべて閉じる */
    document.querySelectorAll('.faq-item[open]').forEach(other => {
      if (other !== details) other.removeAttribute('open');
    });

    if (isOpen) {
      details.removeAttribute('open');
    } else {
      details.setAttribute('open', '');
    }
  });
});

/* ===== スムーズスクロール (href="#..." のアンカーリンク) ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
