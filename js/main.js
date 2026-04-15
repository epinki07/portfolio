(function () {
  const { translations } = window.PortfolioI18n;

  const typingEl = document.getElementById('typing-label');
  const langToggle = document.getElementById('lang-toggle');
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('nav-links');
  const progressBar = document.getElementById('scroll-progress');
  const educationImage = document.getElementById('education-image');
  const educationModalImage = document.getElementById('modal-education-image');
  const educationZoom = document.getElementById('education-zoom');
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  const certificateTrigger = document.getElementById('certificate-trigger');
  const metaDescription = document.getElementById('meta-description');
  const metaOgTitle = document.getElementById('meta-og-title');
  const metaOgDescription = document.getElementById('meta-og-description');
  const pageTitle = document.getElementById('page-title');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverNone = window.matchMedia('(hover: none)');

  let typingTick;
  let typingRunId = 0;
  let currentLang = localStorage.getItem('portfolio-lang') || 'es';

  function setInnerHtml(id, value) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = value;
  }

  function startTyping(text) {
    clearTimeout(typingTick);
    const runId = ++typingRunId;
    typingEl.textContent = '';
    if (reducedMotion.matches) {
      typingEl.textContent = text;
      return;
    }
    let index = 0;
    function step() {
      if (runId !== typingRunId) return;
      if (index <= text.length) {
        typingEl.textContent = text.slice(0, index++);
        typingTick = setTimeout(step, index === 1 ? 280 : 28);
      }
    }
    step();
  }

  function updateLanguageToggle(lang) {
    const toggle = translations[lang].toggle;
    langToggle.innerHTML = `<span class="lang-flag">${toggle.flag}</span><span class="lang-label">${toggle.label}</span>`;
    langToggle.setAttribute('aria-label', toggle.aria);
    hamburger.setAttribute('aria-label', toggle.hamburger);
    modalCloseButtons.forEach(button => button.setAttribute('aria-label', toggle.closeImage));
  }

  function applyTranslations(lang) {
    const translation = translations[lang];
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.lang = lang;
    document.title = translation.meta.title;
    pageTitle.textContent = translation.meta.title;
    metaDescription.setAttribute('content', translation.meta.description);
    metaOgTitle.setAttribute('content', translation.meta.ogTitle);
    metaOgDescription.setAttribute('content', translation.meta.ogDescription);
    Object.entries(translation.content).forEach(([id, value]) => setInnerHtml(id, value));
    educationImage.src = translation.educationImage.src;
    educationImage.alt = translation.educationImage.alt;
    educationModalImage.src = translation.educationImage.src;
    educationModalImage.alt = translation.educationImage.alt;
    updateLanguageToggle(lang);
    startTyping(translation.typingLabel);
  }

  langToggle.addEventListener('click', () => {
    applyTranslations(currentLang === 'es' ? 'en' : 'es');
  });

  /* ── MODAL DELEGATION (sin onclick inline) ── */
  const certificateModal = document.getElementById('modal-constancia');
  const educationModal = document.getElementById('modal-education');

  function openModal(modal) { modal.classList.add('active'); }
  function closeModal(modal) { modal.classList.remove('active'); }

  certificateTrigger.setAttribute('role', 'button');
  certificateTrigger.setAttribute('tabindex', '0');
  certificateTrigger.addEventListener('click', () => openModal(certificateModal));
  certificateTrigger.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(certificateModal);
    }
  });

  educationZoom.addEventListener('click', () => openModal(educationModal));

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeModal(overlay);
    });
  });
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', event => {
      const modal = button.closest('.modal-overlay');
      if (modal) closeModal(modal);
      event.stopPropagation();
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
  });

  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
  });

  /* ── CURSOR LIGHT — solo cuando hay mouse real y sin reduced-motion ── */
  if (!hoverNone.matches && !reducedMotion.matches) {
    const light = document.getElementById('cursor-light');
    if (light) {
      let mx = -9999, my = -9999, cx = -9999, cy = -9999;
      document.addEventListener('mousemove', event => {
        mx = event.clientX;
        my = event.clientY;
      });
      const lerp = (a, b, t) => a + (b - a) * t;
      (function loop() {
        cx = lerp(cx, mx, 0.1);
        cy = lerp(cy, my, 0.1);
        light.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
        requestAnimationFrame(loop);
      })();
    }
  }

  /* ── NAV ACTIVE ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(anchor => {
          anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(section => navObserver.observe(section));

  /* ── HAMBURGER MENU ── */
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navList.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navList.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navList.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));

  /* ── SCROLL PROGRESS BAR ── */
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });

  /* ── SCROLL REVEAL ── */
  const revealEls = [
    ...document.querySelectorAll('.logro-card'),
    ...document.querySelectorAll('.gh-card'),
    ...document.querySelectorAll('.skill-card'),
    ...document.querySelectorAll('.about-card'),
    ...document.querySelectorAll('.about-body'),
    ...document.querySelectorAll('.education-showcase'),
  ];
  revealEls.forEach(element => element.classList.add('reveal'));
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(element => revealObs.observe(element));

  /* ── ANIMATED SKILL BARS ── */
  const skillFills = document.querySelectorAll('.skill-fill');
  skillFills.forEach(bar => {
    bar.dataset.target = bar.style.width;
    bar.style.width = '0%';
  });
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.transition = 'width .9s cubic-bezier(.4,0,.2,1)';
        bar.style.width = bar.dataset.target;
        barObs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(bar => barObs.observe(bar));

  /* ── ANIMATED COUNTER ── */
  document.querySelectorAll('[data-count]').forEach(element => {
    const target = +element.dataset.count;
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countObs.unobserve(entry.target);
        let current = 0;
        const step = Math.ceil(target / 30);
        const tick = setInterval(() => {
          current = Math.min(current + step, target);
          entry.target.textContent = current;
          if (current >= target) clearInterval(tick);
        }, 40);
      });
    }, { threshold: 0.5 });
    countObs.observe(element);
  });

  applyTranslations(currentLang);
})();
