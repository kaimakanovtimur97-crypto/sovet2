(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    mobileNav.hidden = true;
  }
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Закрыть меню' : 'Открыть меню');
    mobileNav.hidden = !opening;
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
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
  function activate(tab) {
    tabs.forEach(item => {
      item.setAttribute('aria-selected', String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
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
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openCase);
      if (!dialog || dialog.open) return;
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
      button.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('keydown', event => {
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
