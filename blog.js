/**
 * KrishnaThinks — Blog Page JS v3.0
 * Renders posts grid with live search + category filter.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof posts === 'undefined') return;

  const grid      = document.getElementById('postsGrid');
  const countEl   = document.getElementById('postsCount');
  const searchInput  = document.getElementById('searchInput');
  const filterBtns   = document.querySelectorAll('.filter-btn');

  let activeCategory = 'all';
  let searchQuery    = '';

  /* ── Build a post card ─────────────────────────── */
  function buildCard(post) {
    const a = document.createElement('a');
    a.href = `post.html?id=${post.id}`;
    a.className = 'post-card reveal';
    a.innerHTML = `
      <div class="post-card-img">
        <img src="${post.image}" alt="${post.title}" loading="lazy" />
      </div>
      <div class="post-card-body">
        <div class="post-card-meta">
          <span class="tag ${post.categoryClass}">${post.category}</span>
          <span class="read-time"><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
        </div>
        <div class="post-card-title">${post.title}</div>
        <p class="post-card-teaser">${post.teaser}</p>
      </div>
      <div class="post-card-footer">
        <span class="post-date"><i class="fa-regular fa-calendar"></i> ${post.date}</span>
        <span class="arrow-btn"><i class="fa-solid fa-arrow-right"></i></span>
      </div>
    `;
    return a;
  }

  /* ── Render filtered posts ─────────────────────── */
  function render() {
    const filtered = posts.filter(post => {
      const matchCat = activeCategory === 'all' ||
        post.category.toLowerCase() === activeCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        post.teaser.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="icon"><i class="fa-regular fa-face-sad-tear"></i></div>
          <strong>No posts found</strong>
          <p>Try a different search or category filter.</p>
        </div>`;
    } else {
      filtered.forEach((post, i) => {
        const card = buildCard(post);
        card.style.transitionDelay = `${i * 0.06}s`;
        grid.appendChild(card);
      });
    }

    if (countEl) {
      countEl.innerHTML = `Showing <span>${filtered.length}</span> of <span>${posts.length}</span> posts`;
    }

    // Trigger reveal observer for newly rendered cards
    const newReveals = grid.querySelectorAll('.reveal:not(.visible)');
    if (newReveals.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.05 });
      newReveals.forEach(el => io.observe(el));
    }
  }

  /* ── Search ─────────────────────────────────────── */
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim();
      render();
    });
  }

  /* ── Category filter ─────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      render();
    });
  });

  /* ── Initial render ──────────────────────────────── */
  render();
});
