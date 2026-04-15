(function () {
  const { translations } = window.PortfolioI18n;

  const typingEl = document.getElementById('typing-label');
  const themeToggle = document.getElementById('theme-toggle');
  const langToggle = document.getElementById('lang-toggle');
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('nav-links');
  const progressBar = document.getElementById('scroll-progress');
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  const certificateTrigger = document.getElementById('certificate-trigger');
  const metaDescription = document.getElementById('meta-description');
  const metaOgTitle = document.getElementById('meta-og-title');
  const metaOgDescription = document.getElementById('meta-og-description');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const pageTitle = document.getElementById('page-title');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverNone = window.matchMedia('(hover: none)');

  let typingTick;
  let typingRunId = 0;

  function getStoredValue(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStoredValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  let currentLang = getStoredValue('portfolio-lang') || 'es';
  let currentTheme = getStoredValue('portfolio-theme') || (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

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

  function updateThemeToggle(lang) {
    if (!themeToggle) return;
    const toggle = translations[lang].toggle;
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    const icon = nextTheme === 'light' ? '☀' : '☾';
    const label = nextTheme === 'light' ? toggle.themeLight : toggle.themeDark;
    const aria = nextTheme === 'light' ? toggle.themeToLight : toggle.themeToDark;

    themeToggle.innerHTML = `<span class="theme-icon" aria-hidden="true">${icon}</span><span class="theme-label">${label}</span>`;
    themeToggle.setAttribute('aria-label', aria);
    themeToggle.setAttribute('title', aria);
  }

  function applyTheme(theme) {
    currentTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (document.body) document.body.setAttribute('data-theme', currentTheme);
    setStoredValue('portfolio-theme', currentTheme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme === 'light' ? '#f7fbff' : '#0a0a0a');
    }
    updateThemeToggle(currentLang);
  }

  function applyTranslations(lang) {
    const translation = translations[lang];
    currentLang = lang;
    setStoredValue('portfolio-lang', lang);
    document.documentElement.lang = lang;
    document.title = translation.meta.title;
    pageTitle.textContent = translation.meta.title;
    metaDescription.setAttribute('content', translation.meta.description);
    metaOgTitle.setAttribute('content', translation.meta.ogTitle);
    metaOgDescription.setAttribute('content', translation.meta.ogDescription);
    Object.entries(translation.content).forEach(([id, value]) => setInnerHtml(id, value));
    updateLanguageToggle(lang);
    updateThemeToggle(lang);
    startTyping(translation.typingLabel);
  }

  function setMenuState(isOpen) {
    hamburger.classList.toggle('open', isOpen);
    navList.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('menu-open', isOpen);
  }

  langToggle.addEventListener('click', () => {
    applyTranslations(currentLang === 'es' ? 'en' : 'es');
  });
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  /* ── MODAL DELEGATION (sin onclick inline) ── */
  const certificateModal = document.getElementById('modal-constancia');
  function openModal(modal) { modal.classList.add('active'); }
  function closeModal(modal) { modal.classList.remove('active'); }

  if (certificateTrigger && certificateModal) {
    certificateTrigger.setAttribute('role', 'button');
    certificateTrigger.setAttribute('tabindex', '0');
    certificateTrigger.addEventListener('click', () => openModal(certificateModal));
    certificateTrigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(certificateModal);
      }
    });
  }

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
    setMenuState(false);
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
    setMenuState(!hamburger.classList.contains('open'));
  });
  navList.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => {
    setMenuState(false);
  }));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenuState(false);
  });

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
    const target = Number(element.dataset.count);
    if (!target || reducedMotion.matches || typeof IntersectionObserver !== 'function') {
      element.textContent = String(target || element.textContent);
      return;
    }

    const animateCounter = targetElement => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      targetElement.textContent = '0';
      const tick = setInterval(() => {
        current = Math.min(current + step, target);
        targetElement.textContent = String(current);
        if (current >= target) clearInterval(tick);
      }, 40);
    };

    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countObs.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    });

    countObs.observe(element);
  });

  applyTranslations(currentLang);
  applyTheme(currentTheme);
})();
