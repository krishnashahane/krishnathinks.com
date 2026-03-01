/**
 * KrishnaThinks — Post Page JS
 * Handles: post rendering, reading progress, share buttons, related posts.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof posts === 'undefined') return;

  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));
  const post = posts.find(p => p.id === id);

  /* ---- 404 fallback ---- */
  const container = document.getElementById('postContent');
  if (!container) return;

  if (!post) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:1rem;">404</div>
        <h2>Post not found</h2>
        <p style="margin:1rem 0 2rem;">Looks like this post doesn't exist.</p>
        <a href="blog.html" class="btn btn-primary">← Back to Blog</a>
      </div>`;
    return;
  }

  /* ---- Set page title ---- */
  document.title = `${post.title} — KrishnaThinks`;

  /* ---- Render post ---- */
  container.innerHTML = `
    <div class="post-nav-row">
      <a href="blog.html" class="back-link">
        <i class="fa-solid fa-arrow-left"></i> All Posts
      </a>
      <span class="read-time"><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
    </div>

    <div class="post-meta-row">
      <span class="tag ${post.categoryClass}">${post.category}</span>
      <span class="post-date-pill">
        <i class="fa-regular fa-calendar"></i> ${post.date}
      </span>
    </div>

    <h1 class="post-title">${post.title}</h1>

    <img class="post-cover" src="${post.image}" alt="${post.title}" />

    <div class="post-content" id="postBody">
      ${post.content}
    </div>

    <hr class="post-divider" />

    <div class="post-share-row">
      <span class="share-label">Share this post:</span>
      <button class="share-btn" id="shareX">
        <i class="fa-brands fa-x-twitter"></i> Share on X
      </button>
      <button class="share-btn" id="shareLink">
        <i class="fa-solid fa-link"></i> Copy Link
      </button>
    </div>

    <div class="related-section" id="relatedSection"></div>
  `;

  window.scrollTo(0, 0);

  /* ---- Reading progress bar ---- */
  const bar = document.getElementById('readingBar');
  const postBody = document.getElementById('postBody');

  if (bar && postBody) {
    window.addEventListener('scroll', () => {
      const el = postBody;
      const rect = el.getBoundingClientRect();
      const totalHeight = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / totalHeight) * 100);
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---- Share on X ---- */
  const shareX = document.getElementById('shareX');
  if (shareX) {
    shareX.addEventListener('click', () => {
      const text = encodeURIComponent(`"${post.title}" by @krishnashahane_ — `);
      const url = encodeURIComponent(location.href);
      window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener');
    });
  }

  /* ---- Copy link ---- */
  const shareLink = document.getElementById('shareLink');
  if (shareLink) {
    shareLink.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).then(() => {
        shareLink.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        shareLink.style.borderColor = 'var(--green)';
        shareLink.style.color = 'var(--green)';
        setTimeout(() => {
          shareLink.innerHTML = '<i class="fa-solid fa-link"></i> Copy Link';
          shareLink.style.borderColor = '';
          shareLink.style.color = '';
        }, 2200);
      });
    });
  }

  /* ---- Related posts ---- */
  const relatedSection = document.getElementById('relatedSection');
  if (relatedSection) {
    const related = posts
      .filter(p => p.id !== post.id)
      .filter(p => p.category === post.category)
      .slice(0, 2);

    // Fall back to any 2 other posts if no same-category match
    const fallback = posts.filter(p => p.id !== post.id).slice(0, 2);
    const toShow = related.length >= 1 ? related : fallback;

    if (toShow.length > 0) {
      relatedSection.innerHTML = `
        <h3>More from KrishnaThinks</h3>
        <div class="related-grid">
          ${toShow.map(p => `
            <a href="post.html?id=${p.id}" class="post-card">
              <div class="post-card-img">
                <img src="${p.image}" alt="${p.title}" loading="lazy" />
              </div>
              <div class="post-card-body">
                <div class="post-card-meta">
                  <span class="tag ${p.categoryClass}">${p.category}</span>
                  <span class="read-time"><i class="fa-regular fa-clock"></i> ${p.readTime}</span>
                </div>
                <div class="post-card-title">${p.title}</div>
              </div>
              <div class="post-card-footer">
                <span class="post-date">${p.date}</span>
                <span class="arrow-btn"><i class="fa-solid fa-arrow-right"></i></span>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    }
  }
});
