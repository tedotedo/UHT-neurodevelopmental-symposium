document.documentElement.classList.add('js-ready');

(() => {
  const href = 'design-polish.css?v=hero-gradient-20260524';
  if (!document.querySelector('link[href^="design-polish.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    const refreshLink = document.querySelector('link[href^="conference-refresh.css"]');
    document.head.insertBefore(link, refreshLink || null);
  }
})();

(() => {
  const href = 'conference-refresh.css?v=hero-gradient-20260524';
  const existing = document.querySelector('link[href^="conference-refresh.css"]');
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  } else if (existing.nextElementSibling) {
    document.head.appendChild(existing);
  }
})();

(() => {
  document.querySelectorAll('.brand-title').forEach((title) => {
    title.innerHTML = '<strong>Tees Neurodevelopmental</strong><em>Symposium</em><span class="brand-trust">University Hospital Tees NHS Foundation Trust</span>';
  });
})();

(() => {
  const reducedRateEmail = 'michelle.leahy1@nhs.net';
  const reducedRateHref = `mailto:${reducedRateEmail}?subject=${encodeURIComponent('Reduced rate booking information')}`;
  document.querySelectorAll(`a[href^="mailto:${reducedRateEmail}"]`).forEach((link) => {
    link.setAttribute('href', reducedRateHref);
    link.setAttribute('target', '_self');
  });
})();

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

  document.querySelectorAll('.session span').forEach((speaker) => {
    const name = speaker.textContent.trim();
    if (!speakerDetails.has(name) || speaker.parentElement?.querySelector('.speaker-affiliation')) return;
    const affiliation = document.createElement('em');
    affiliation.className = 'speaker-affiliation';
    affiliation.textContent = speakerDetails.get(name);
    speaker.insertAdjacentElement('afterend', affiliation);
  });

  document.querySelectorAll('.tnp-speaker').forEach((speaker) => {
    const name = speaker.firstChild?.textContent.trim() || speaker.textContent.trim();
    if (!speakerDetails.has(name) || speaker.querySelector('.tnp-affiliation')) return;
    const affiliation = document.createElement('span');
    affiliation.className = 'tnp-affiliation';
    affiliation.textContent = speakerDetails.get(name);
    speaker.appendChild(affiliation);
  });
})();

(() => {
  const bookingUrl = 'https://events.southtees.nhs.uk/events/15th-tees-neuro-developmental-paediatrics-symposium-6th-7th-july-2026/';
  const main = document.querySelector('main');
  const trustStrip = document.querySelector('.trust-strip');

  const notesNav = Array.from(document.querySelectorAll('.nav a')).find((link) => link.getAttribute('href') === 'notes.html');
  if (notesNav) notesNav.textContent = 'My notes';
  const notesMenu = Array.from(document.querySelectorAll('.site-menu-grid a')).find((link) => link.getAttribute('href') === 'notes.html');
  if (notesMenu) {
    const label = notesMenu.querySelector('span');
    const title = notesMenu.querySelector('strong');
    const description = notesMenu.querySelector('em');
    if (label) label.textContent = 'My notes';
    if (title) title.textContent = 'Talk notebook';
    if (description) description.textContent = 'Private notes saved on this device';
  }

  if (main && trustStrip && !document.querySelector('.why-attend')) {
    const section = document.createElement('section');
    section.className = 'why-attend';
    section.setAttribute('aria-labelledby', 'why-attend-title');
    section.innerHTML = `
      <div class="why-attend__head">
        <p class="eyebrow blue">Why attend?</p>
        <h2 id="why-attend-title">Practical neurodevelopmental learning for everyday clinical work.</h2>
        <p>Two focused days bringing together paediatric neurodevelopment, neurology, genetics, disability, mental health, transition and complex care.</p>
      </div>
      <div class="why-attend__grid">
        <article class="why-attend__item"><span aria-hidden="true">1</span><strong>Clinically focused updates</strong><p>Talks are framed around assessment, management, counselling and service actions.</p></article>
        <article class="why-attend__item"><span aria-hidden="true">2</span><strong>Broad neurodisability scope</strong><p>Cerebral palsy, autism genetics, epilepsy, movement disorders, FASD, transition and more.</p></article>
        <article class="why-attend__item"><span aria-hidden="true">3</span><strong>Named specialist speakers</strong><p>Each session is mapped to the actual speaker and timetable so delegates can plan the day.</p></article>
        <article class="why-attend__item"><span aria-hidden="true">4</span><strong>Built-in delegate notes</strong><p>Private lecture-linked notes can be saved locally, downloaded or printed after the event.</p></article>
      </div>`;
    trustStrip.insertAdjacentElement('afterend', section);
  }

  const venueSection = document.querySelector('.section.venue, #venue');
  if (main && venueSection && !document.querySelector('.final-cta')) {
    const section = document.createElement('section');
    section.className = 'final-cta';
    section.setAttribute('aria-labelledby', 'final-cta-title');
    section.innerHTML = `
      <p class="eyebrow inverted">Ready to attend?</p>
      <h2 id="final-cta-title">Join colleagues for two focused days of practical learning.</h2>
      <p>Neurodevelopmental and paediatric neurology updates for paediatricians, trainees, nurses, therapists and allied professionals.</p>
      <div class="final-cta__actions">
        <a class="button primary" href="${bookingUrl}">Book your place</a>
        <a class="button secondary" href="mailto:michelle.leahy1@nhs.net?subject=Reduced%20rate%20booking%20information">Ask about reduced rates</a>
        <a class="button secondary" href="programme.html">View programme</a>
      </div>`;
    venueSection.insertAdjacentElement('afterend', section);
  }

  if (!document.querySelector('.sticky-booking-bar')) {
    const bar = document.createElement('aside');
    bar.className = 'sticky-booking-bar';
    bar.setAttribute('aria-label', 'Booking shortcut');
    bar.innerHTML = `
      <div class="sticky-booking-bar__text"><strong>Reduced rate available</strong><span>For Nurses, Therapists, Non-clinical staff and Paediatric trainees</span></div>
      <a class="button primary" href="${bookingUrl}">Book</a>`;
    document.body.appendChild(bar);
    const updateBar = () => {
      const programme = document.querySelector('.tnp-programme, .programme-board');
      const trigger = programme ? programme.getBoundingClientRect().top + window.scrollY - 180 : 1400;
      const shouldShow = window.scrollY > trigger && window.innerWidth <= 980;
      bar.classList.toggle('is-visible', shouldShow);
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
    updateBar();
  }
})();

(() => {
  const toggle = document.querySelector('.brand-menu-toggle');
  const menu = document.getElementById('site-menu');
  const close = document.querySelector('.site-menu-close');
  if (!toggle || !menu) return;

  let lockedScrollY = 0;

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
    if (open) lockPageScroll();
    else unlockPageScroll();
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
      '# 15th Tees Neurodevelopmental Paediatrics Symposium notes',
      `Exported: ${now.toLocaleString()}`,
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
