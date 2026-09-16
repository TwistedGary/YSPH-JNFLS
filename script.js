const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const langToggle = document.querySelector("[data-lang-toggle]");
const translatableItems = document.querySelectorAll("[data-zh][data-en]");

const getSavedLanguage = () => {
  const saved = window.localStorage.getItem("ysph-language");
  return saved === "zh" ? "zh" : "en";
};

const setLanguage = (language) => {
  const isEnglish = language === "en";
  document.documentElement.lang = isEnglish ? "en" : "zh-CN";
  document.body.dataset.language = language;

  translatableItems.forEach((item) => {
    item.textContent = item.dataset[language];
  });

  if (langToggle) {
    langToggle.textContent = isEnglish ? "中文" : "EN";
    langToggle.setAttribute("aria-label", isEnglish ? "切换到中文" : "Switch to English");
  }

  window.localStorage.setItem("ysph-language", language);
  document.dispatchEvent(new CustomEvent("ysph-language", { detail: language }));
};

const closeMenu = () => {
  closeDropdowns();
  if (!menuToggle || !siteNav || !header) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
setLanguage(getSavedLanguage());

window.addEventListener("scroll", updateHeader, { passive: true });

if (menuToggle && siteNav && header) {
  menuToggle.addEventListener("click", () => {
    closeDropdowns();
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    header.classList.toggle("menu-active", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    setLanguage(document.body.dataset.language === "en" ? "zh" : "en");
    closeMenu();
  });
}

const dropdowns = [...document.querySelectorAll('[data-dropdown]')];
const desktopNav = window.matchMedia('(min-width: 1101px)');
function setDropdownOpen(dropdown, open) {
  dropdown.classList.toggle('is-expanded', open);
  dropdown.querySelector('[data-dropdown-toggle]').setAttribute('aria-expanded', String(open));
}
function closeDropdowns(except) {
  dropdowns.forEach((dropdown) => {
    if (dropdown !== except) setDropdownOpen(dropdown, false);
  });
}
dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('[data-dropdown-toggle]');
  const links = [...dropdown.querySelectorAll('a')];
  const open = () => { closeDropdowns(dropdown); setDropdownOpen(dropdown, true); };
  toggle.addEventListener('click', () => {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    closeDropdowns();
    setDropdownOpen(dropdown, !wasOpen);
  });
  dropdown.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && desktopNav.matches) open();
  });
  dropdown.addEventListener('pointerleave', () => {
    if (desktopNav.matches && !dropdown.contains(document.activeElement)) setDropdownOpen(dropdown, false);
  });
  dropdown.addEventListener('focusout', (event) => {
    if (!dropdown.contains(event.relatedTarget)) setDropdownOpen(dropdown, false);
  });
  dropdown.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setDropdownOpen(dropdown, false);
      toggle.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
      const index = links.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (index + 1) % links.length : (index <= 0 ? links.length - 1 : index - 1);
      links[next].focus();
    }
  });
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-dropdown]')) closeDropdowns();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeMenu(); menuToggle?.focus(); }
});
desktopNav.addEventListener('change', closeMenu);
