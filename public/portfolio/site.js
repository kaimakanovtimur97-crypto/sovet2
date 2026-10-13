(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionStyle = getComputedStyle(document.documentElement);
  const ease = motionStyle.getPropertyValue('--ease').trim();
  const motionDuration = Object.fromEntries(['ui', 'reveal', 'fade'].map(name =>
    [name, parseFloat(motionStyle.getPropertyValue('--motion-' + name))]
  ));
  const runningMotion = new Set();
  function playMotion(element, frames, options) {
    if (!element.animate) return;
    const animation = element.animate(frames, { easing: ease, ...options });
    runningMotion.add(animation);
    const settled = () => runningMotion.delete(animation);
    animation.finished.then(settled, settled);
    return animation;
  }
  const revealTargets = [...document.querySelectorAll(
    '.contents-body, .about-copy, .section-intro, .expertise>h2, .expertise-item, ' +
    '.case-featured, .case-group-title, .selected-case, .approach-body, .contact-body'
  )];
  let revealObserver;
  function observeReveals() {
    revealObserver?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      if (reducedMotion.matches) return;
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        const element = entry.target;
        element.dataset.motionSeen = 'true';
        revealObserver.unobserve(element);
        playMotion(element, [
          { opacity: 0.15, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: motionDuration.reveal, delay: Math.min(index, 3) * 50, fill: 'backwards' });
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
    revealTargets.filter(element => !element.dataset.motionSeen)
      .forEach(element => revealObserver.observe(element));
  }
  observeReveals();
  reducedMotion.addEventListener('change', () => {
    runningMotion.forEach(animation => animation.cancel());
    observeReveals();
  });
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function closeMenu(instant = true) {
    mobileNav.dataset.motion = instant ? 'instant' : 'animated';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    mobileNav.hidden = true;
  }
  toggle.addEventListener('click', event => {
    mobileNav.dataset.motion = event.detail === 0 ? 'instant' : 'animated';
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Закрыть меню' : 'Открыть меню');
    mobileNav.hidden = !opening;
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => closeMenu(event.detail === 0));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) {
      closeMenu();
      toggle.focus();
    }
  });
  const narrow = window.matchMedia('(max-width: 700px)');
  narrow.addEventListener('change', () => { if (!narrow.matches) closeMenu(); });

  const tabs = [...document.querySelectorAll('[data-channel]')];
  const panels = [...document.querySelectorAll('.channel-panel')];
  function activate(tab, animate = false) {
    const changed = tab.getAttribute('aria-selected') !== 'true';
    panels.forEach(panel => panel.getAnimations().forEach(animation => animation.cancel()));
    tabs.forEach(item => {
      item.setAttribute('aria-selected', String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
    if (changed && animate) {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      playMotion(panel, reducedMotion.matches
        ? [{ opacity: 0.7 }, { opacity: 1 }]
        : [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: reducedMotion.matches ? motionDuration.fade : motionDuration.ui });
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => activate(tab, event.detail > 0));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activate(tabs[next]);
        tabs[next].focus();
      }
    });
  });
  document.querySelectorAll('[data-open-case]').forEach(button => {
    button.addEventListener('click', event => {
      const dialog = document.getElementById(button.dataset.openCase);
      if (!dialog || dialog.open) return;
      dialog.dataset.motion = event.detail === 0 ? 'instant' : 'animated';
      dialog.showModal();
      dialog.querySelector('.dialog-body').scrollTop = 0;
      document.body.classList.add('case-modal-open');
    });
  });
  document.querySelectorAll('.case-dialog').forEach(dialog => {
    let beganOutside = false;
    const outside = event => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.querySelectorAll('[data-close-case]').forEach(button => {
      button.addEventListener('click', event => {
        if (event.detail === 0) dialog.dataset.motion = 'instant';
        dialog.close();
      });
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') dialog.dataset.motion = 'instant';
      if (event.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')]
        .filter(item => !item.disabled && item.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.addEventListener('pointerdown', event => { beganOutside = outside(event); });
    dialog.addEventListener('click', event => {
      if (event.target === dialog && beganOutside && outside(event)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!document.querySelector('.case-dialog[open]')) document.body.classList.remove('case-modal-open');
    });
  });
  const copy = document.querySelector('.copy-phone');
  const status = document.querySelector('.copy-status');
  copy.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('+79180531553');
      status.textContent = 'Номер скопирован';
    } catch {
      status.textContent = 'Не удалось скопировать. Номер: +7 918 053 15 53';
    }
  });
})();
