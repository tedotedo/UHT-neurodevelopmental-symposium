document.documentElement.classList.add('js-ready');

(() => {
  const speakerDetails = new Map([
    ['Dr Yasmin DeAlwis', 'Consultant Neurodisability Paediatrician, Great North Children’s Hospital, Newcastle upon Tyne Hospitals NHS Foundation Trust, UK'],
    ['Dr Mark Aszkenasy', 'Consultant Paediatrician with expertise in autism and community paediatrics, University Hospital Tees NHS Foundation Trust, UK'],
    ['Dr Santosh Mordekar', 'Consultant Paediatric Neurologist, Sheffield Children’s NHS Foundation Trust, UK'],
    ['Dr Ram Kumar', 'Consultant Paediatric Neurologist, Lancashire Teaching Hospitals NHS Foundation Trust, UK'],
    ['Dr V Ramesh', 'Honorary Consultant Paediatric Neurologist, Bristol Children’s Hospital, University Hospitals Bristol and Weston NHS Foundation Trust, UK'],
    ['Dr Bernd C Schwahn', 'Consultant Clinical Paediatrician in Inherited Metabolic Medicine, Royal Manchester Children’s Hospital, Manchester University NHS Foundation Trust, UK'],
    ['Dr Helen Aspey', 'Consultant Community Paediatrician and lead for the Children’s Holistic Palliative Care Service (CHIPS), Newcastle upon Tyne Hospitals NHS Foundation Trust, UK'],
    ['Prof Sam Amin', 'Consultant Paediatric Neurologist, Bristol Children’s Hospital, University Hospitals Bristol and Weston NHS Foundation Trust, UK'],
    ['Dr Ruth Richardson', 'Consultant Clinical Geneticist, Newcastle upon Tyne Hospitals NHS Foundation Trust, UK'],
    ['Dr Vicki Walker', 'Consultant Paediatrician, Sherwood Forest Hospitals NHS Foundation Trust, UK'],
    ['Dr Jeen Tan', 'Paediatric Neurologist, Manchester University NHS Foundation Trust, UK'],
    ['Dr Olivia Kenneally', 'Child and Educational Psychologist and Paediatric Neuropsychologist, Evelina London Children’s Hospital, UK'],
    ['Dr Sarah Mills', 'Consultant Community Paediatrician, Sunderland and South Tyneside NHS Foundation Trust, UK'],
    ['Dr Ramesh Kumar and Ms Debbie Dack', 'Consultant Paediatrician and Transition Specialist Nurse, The James Cook University Hospital, University Hospital Tees NHS Foundation Trust, UK']
  ]);

  document.querySelectorAll('.tnp-speaker').forEach((speaker) => {
    const name = speaker.textContent.trim();
    const session = speaker.closest('.tnp-session');
    if (!session || !speakerDetails.has(name) || session.querySelector('.speaker-affiliation')) return;

    const affiliation = document.createElement('em');
    affiliation.className = 'speaker-affiliation';
    affiliation.textContent = speakerDetails.get(name);
    speaker.insertAdjacentElement('afterend', affiliation);

    if (name === 'Dr Mark Aszkenasy' && !session.querySelector('.speaker-note')) {
      const note = document.createElement('em');
      note.className = 'speaker-note';
      note.textContent = 'Speaker note: author of The Genetics of Autism, a practical guide for families and professionals.';
      affiliation.insertAdjacentElement('afterend', note);
    }
  });
})();

(() => {
  const toggle = document.querySelector('.brand-menu-toggle');
  const menu = document.getElementById('site-menu');
  const close = document.querySelector('.site-menu-close');
  const panel = menu?.querySelector('.site-menu-panel');
  if (!toggle || !menu || !panel) return;

  let lockedScrollY = 0;
  let restoreFocusTo = null;

  const getFocusableElements = () =>
    Array.from(
      menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.closest('[hidden]'));

  const lockPageScroll = () => {
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  const unlockPageScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, lockedScrollY);
  };

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close site menu' : 'Open site menu');
    document.body.classList.toggle('menu-open', open);

    if (open) {
      restoreFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
      lockPageScroll();
      requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        (focusable[0] || panel).focus();
      });
      return;
    }

    unlockPageScroll();
    (restoreFocusTo || toggle).focus();
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  close?.addEventListener('click', () => setOpen(false));

  menu.addEventListener('click', (event) => {
    if (event.target === menu) setOpen(false);
  });

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
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
      '# 15th Tees Neurodevelopmental Paediatrics Symposium notes',
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
