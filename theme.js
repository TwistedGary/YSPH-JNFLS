(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('ysph-theme'); } catch (_) {}
  if (saved !== 'dark' && saved !== 'light') saved = null;
  const apply = () => {
    const theme = saved || (preference.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
      const label = theme === 'dark' ? (zh ? '切换到浅色模式' : 'Switch to light mode') : (zh ? '切换到深色模式' : 'Switch to dark mode');
      button.textContent = theme === 'dark' ? '☀' : '☾';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  };
  apply();
  preference.addEventListener('change', () => { if (!saved) apply(); });
  document.addEventListener('ysph-language', apply);
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('[data-site-nav]');
    if (!nav) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.dataset.themeToggle = '';
    nav.append(button);
    button.addEventListener('click', () => {
      saved = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('ysph-theme', saved); } catch (_) {}
      apply();
    });
    apply();
  });
})();
