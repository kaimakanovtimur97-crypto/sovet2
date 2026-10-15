(() => {
  const tabs = Array.from(document.querySelectorAll('[role="tab"][data-city]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const validIds = tabs.map(tab => tab.dataset.city);
  function activate(city, updateHash = true, focus = false) {
    if (!validIds.includes(city)) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.city === city;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach(panel => { panel.hidden = panel.id !== `panel-${city}`; });
    if (updateHash) history.replaceState(null, '', `#${city}`);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.city));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activate(tabs[next].dataset.city, true, true);
      }
    });
  });
  function loadCityHash() {
    const city = location.hash.slice(1);
    if (validIds.includes(city)) activate(city, false);
  }
  window.addEventListener('hashchange', loadCityHash);
  loadCityHash();
  window.addEventListener('beforeprint', () => { panels.forEach(panel => { panel.hidden = false; }); });
  window.addEventListener('afterprint', () => {
    const selected = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
    activate(selected?.dataset.city || 'kanash', false);
  });
})();
