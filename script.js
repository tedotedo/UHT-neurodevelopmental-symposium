document.documentElement.classList.add('js-ready');

(() => {
  const toggle = document.querySelector('.brand-menu-toggle');
  const menu = document.getElementById('site-menu');
  const close = document.querySelector('.site-menu-close');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close site menu' : 'Open site menu');
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  close?.addEventListener('click', () => setOpen(false));
  menu.addEventListener('click', (event) => {
    if (event.target === menu) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) setOpen(false);
  });
})();

(() => {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;
  const revealAt = 520;
  const updateVisibility = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > revealAt);
  };
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
})();

(() => {
  const storagePrefix = 'tees-symposium-note:';
  const textareas = Array.from(document.querySelectorAll('[data-note-key]'));
  if (!textareas.length) return;

  const toast = document.createElement('div');
  toast.className = 'save-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function keyFor(textarea) {
    return `${storagePrefix}${textarea.dataset.noteKey}`;
  }

  function talkTitle(textarea) {
    const card = textarea.closest('.note-card');
    const day = card?.querySelector('.note-meta span')?.textContent?.trim() || '';
    const title = card?.querySelector('.note-meta strong')?.textContent?.trim() || textarea.dataset.noteKey;
    return `${day} — ${title}`;
  }

  textareas.forEach((textarea) => {
    textarea.value = localStorage.getItem(keyFor(textarea)) || '';
    textarea.addEventListener('input', () => {
      localStorage.setItem(keyFor(textarea), textarea.value);
      showToast('Note saved on this device');
    });
  });

  document.getElementById('export-notes')?.addEventListener('click', () => {
    const now = new Date();
    const stamp = now.toISOString().slice(0, 10);
    const sections = textareas.map((textarea) => {
      const note = textarea.value.trim() || '[No note added]';
      return `## ${talkTitle(textarea)}\n\n${note}`;
    });
    const content = [
      '# 15th Tees Neuro-developmental Paediatrics Symposium notes',
      `Exported: ${now.toLocaleString()}`,
      '',
      'Private delegate notes. Do not include identifiable patient information.',
      '',
      ...sections,
      ''
    ].join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tees-neurodevelopmental-symposium-notes-${stamp}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Notes downloaded');
  });

  document.getElementById('print-notes')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('clear-notes')?.addEventListener('click', () => {
    const hasNotes = textareas.some((textarea) => textarea.value.trim());
    if (!hasNotes) {
      showToast('No notes to clear');
      return;
    }
    if (!window.confirm('Clear all locally saved symposium notes from this browser?')) return;
    textareas.forEach((textarea) => {
      localStorage.removeItem(keyFor(textarea));
      textarea.value = '';
    });
    showToast('Local notes cleared');
  });
})();
