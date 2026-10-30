/* Media paths are configured in media-catalog.js; no server fetch is needed. */
(() => {
  const catalogue = window.portfolioMedia || {};
  const prefix = document.body.dataset.assetPrefix || '';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function assetPath(path) {
    return /^(https?:)?\/\//.test(path) ? path : prefix + path;
  }
  document.querySelectorAll('[data-media-id]').forEach(slot => {
    const entry = catalogue[slot.dataset.mediaId];
    if (!entry || !entry.src) return;
    slot.hidden = false;
    const original = slot.innerHTML;
    let element;
    if (entry.type === 'video') {
      element = document.createElement('video');
      element.controls = true;
      element.muted = true;
      element.loop = true;
      element.playsInline = true;
      element.preload = 'metadata';
      element.autoplay = !reduceMotion && slot.dataset.autoplay !== 'false';
      if (entry.poster) element.poster = assetPath(entry.poster);
    } else if (entry.type === 'gif' && reduceMotion) {
      const link = document.createElement('a');
      link.className = 'case-link reduced-media-link';
      link.href = assetPath(entry.src);
      link.textContent = 'Open original animation ↗';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      slot.replaceChildren(link);
      return;
    } else {
      element = document.createElement('img');
      element.alt = entry.caption || 'Original project demonstration';
      element.loading = 'lazy';
    }
    element.className = 'original-project-media';
    element.addEventListener('error', () => {
      slot.innerHTML = original;
      if (slot.dataset.hideEmpty === 'true') slot.hidden = true;
      const title = slot.querySelector('.media-empty-title');
      if (title) title.textContent = 'Recording unavailable';
    }, { once: true });
    element.src = assetPath(entry.src);
    slot.replaceChildren(element);
    slot.classList.add('has-original-media');

  });
  document.querySelectorAll('[data-repository-id]').forEach(link => {
    const entry = catalogue[link.dataset.repositoryId];
    if (!entry || !entry.repository) return;
    try {
      const url = new URL(entry.repository);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' ||
          url.pathname.split('/').filter(Boolean).length < 2) return;
      link.href = url.href;
      link.hidden = false;
      const notice = link.parentElement.querySelector('.repository-pending');
      if (notice) notice.hidden = true;
    } catch (_) {
      // Keep the explicit pending state for an invalid URL.
    }
  });
})();
