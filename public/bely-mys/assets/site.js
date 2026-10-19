(() => {
  'use strict';
  const data = window.BELY_MYS_DATA;
  const monthTitles = ['Существующий спрос и основа','Первые выводы и проверка гипотез','Проверка предложений и тест VK','Усиление работающих каналов','Проверка возможностей роста','Итоги полугодия и следующий план'];
  const monthDescriptions = [
    'Проверить аналитику, запустить поиск, актуализировать карточки и приоритетные страницы. Начать интервью и подготовку видеоконтента.',
    'Уточнить предложения по первым данным. Начать статьи и пилот видео, подключить ретаргетинг при достаточной аудитории. Наладить работу с блогерами.',
    'Продолжить проверку предложений и страниц. VK Реклама как первый дополнительный платный тест. РСЯ и тематические размещения пока в резерве.',
    'Постепенно увеличивать расходы на подтверждённые направления. Следующие источники тестировать по очереди, если есть основания и свободный бюджет.',
    'Сохранять работающие кампании. Отдельно проверить выбранную новую географию и материалы для туристов, планирующих поездку.',
    'Свести расходы, действия, реальные посещения, выручку и маржинальный доход. Определить, что продолжать, усиливать, менять или останавливать.'
  ];
  const tabs = [...document.querySelectorAll('[data-month]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const sourceTabs = [...document.querySelectorAll('[data-source]')];
  const rows = document.getElementById('channel-rows');
  const panel = document.getElementById('month-panel');
  let month = 0, filter = 'all', source = 'word';
  const el = (tag, className, text) => {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  };
  const animate = (target) => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && target.animate) {
      target.animate([{opacity:.65,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  };
  if (!data) {
    rows.append(el('p','aside-note','Не удалось загрузить таблицу. Полный медиаплан доступен в Excel в разделе «Документы».'));
    return;
  }
  function renderChannels() {
    const selected = data.channels.filter(c => filter === 'all' || (filter === 'paid' ? c.paid : !c.paid));
    const fragment = document.createDocumentFragment();
    selected.forEach(channel => {
      const task = channel.months[month];
      const row = el('div','media-row' + (/не планируется|резерве|как резерв/i.test(task) ? ' is-reserve' : ''));
      row.setAttribute('role','row');
      const source = el('div','media-source'); source.setAttribute('role','cell');
      source.append(el('h4','',channel.name),el('p','',channel.audience));
      const purpose = el('div','media-purpose'); purpose.setAttribute('role','cell');
      purpose.append(el('span','cell-label','Зачем используем'),el('p','',channel.why));
      const content = el('div','media-task'); content.setAttribute('role','cell');
      content.append(el('span','cell-label','Задача на месяц'),el('p','',task));
      row.append(source,purpose,content);fragment.append(row);
    });
    rows.replaceChildren(fragment);
    document.getElementById('channel-count').textContent = selected.length + ' источников';
  }
  function renderParagraphs(target, paragraphs) {
    target.replaceChildren(...paragraphs.map(text => el('p','',text)));
  }
  function selectSource(next, moveFocus = false) {
    source = next;
    sourceTabs.forEach(tab => {const active=tab.dataset.source===source;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    document.getElementById('word-panel').hidden = source !== 'word';
    document.getElementById('excel-panel').hidden = source !== 'excel';
    if(moveFocus) document.getElementById('source-'+source).focus();
  }
  sourceTabs.forEach((tab,index) => {
    tab.addEventListener('click',() => selectSource(tab.dataset.source));
    tab.addEventListener('keydown',event => {
      if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) {
        event.preventDefault();
        const next=event.key==='Home'?'word':event.key==='End'?'excel':sourceTabs[(index+1)%2].dataset.source;
        selectSource(next,true);
      }
    });
  });
  document.querySelectorAll('[data-source-link]').forEach(link=>link.addEventListener('click',()=>selectSource(link.dataset.sourceLink)));
  renderParagraphs(document.getElementById('word-overview'),data.word.intro);
  renderParagraphs(document.getElementById('word-budget-text'),data.word.budget);
  document.getElementById('analytics-owner').textContent=data.support[0][1];
  document.getElementById('interviews-owner').textContent=data.support[1][1];
  function selectMonth(index, moveFocus = false) {
    month = index;
    tabs.forEach((tab, i) => {tab.setAttribute('aria-selected',String(i === month));tab.tabIndex = i === month ? 0 : -1;});
    panel.setAttribute('aria-labelledby',tabs[month].id);
    document.getElementById('month-title').textContent = monthTitles[month];
    document.getElementById('month-description').textContent = monthDescriptions[month];
    document.getElementById('word-month-title').textContent = data.word.months[month].title;
    renderParagraphs(document.getElementById('word-month-text'),data.word.months[month].paragraphs);
    document.getElementById('analytics-task').textContent = data.support[0][month + 3];
    document.getElementById('interviews-task').textContent = data.support[1][month + 3];
    renderChannels();
    if (moveFocus) tabs[month].focus();
    animate(panel);
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => selectMonth(index));
    tab.addEventListener('keydown',event => {
      let next;
      if (event.key === 'ArrowRight') next = (month + 1) % 6;
      if (event.key === 'ArrowLeft') next = (month + 5) % 6;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = 5;
      if (next !== undefined) {event.preventDefault();selectMonth(next,true);}
    });
  });
  filters.forEach(button => button.addEventListener('click',() => {
    filter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
    renderChannels();
  }));
  const product = document.getElementById('product-select');
  const flow = document.getElementById('product-flow');
  const stageNames = ['Источники','Предложение','Подтверждение','Посещение','Финансовый результат'];
  function renderFunnel() {
    const values = data.funnels[Number(product.value)];
    document.getElementById('funnel-audience').textContent = values[1];
    const fragment = document.createDocumentFragment();
    stageNames.forEach((name,index) => {
      const item = el('li');item.append(el('h3','',name),el('p','',values[index + 2]));fragment.append(item);
    });
    flow.replaceChildren(fragment);animate(flow);
  }
  product.addEventListener('change',renderFunnel);
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click',() => mobileMenu.removeAttribute('open')));
  document.addEventListener('keydown',event => {if(event.key === 'Escape') mobileMenu.removeAttribute('open');});
  selectSource('word');selectMonth(0);renderFunnel();
})();
