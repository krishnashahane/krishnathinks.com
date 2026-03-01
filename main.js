/**
 * KrishnaThinks — Main JS v3.0
 * Sticky nav, mobile menu, scroll animations, back-to-top.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav ────────────────────────────────── */
  const header = document.getElementById('siteHeader');
  const backTopBtn = document.getElementById('backTop');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('solid', y > 20);
    if (backTopBtn) backTopBtn.classList.toggle('show', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active nav link ────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list li a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else if (!a.classList.contains('nav-cta')) {
      a.classList.remove('active');
    }
  });

  /* ── Mobile menu toggle ─────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const navList = document.querySelector('.nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Back to top ────────────────────────────────── */
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Reveal animations ──────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ── Cursor spotlight ───────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--cx', e.clientX + 'px');
    document.documentElement.style.setProperty('--cy', e.clientY + 'px');
  }, { passive: true });

  /* ── Count-up animation ─────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let count = 0;
        const duration = 900;
        const step = Math.ceil(duration / (target * 16));
        const timer = setInterval(() => {
          count = Math.min(count + 1, target);
          el.textContent = count;
          if (count >= target) clearInterval(timer);
        }, step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    statNums.forEach(el => countObs.observe(el));
  }

  /* ── Newsletter form ────────────────────────────── */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input[type="email"]');
      const btn = nlForm.querySelector('button');
      if (input && input.validity.valid && input.value) {
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Subscribed!';
        btn.disabled = true;
        btn.style.background = 'linear-gradient(135deg, #34d399, #059669)';
        input.value = '';
        input.disabled = true;
      }
    });
  }

});
