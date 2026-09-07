const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const langToggle = document.querySelector("[data-lang-toggle]");
const translatableItems = document.querySelectorAll("[data-zh][data-en]");

const getSavedLanguage = () => {
  const saved = window.localStorage.getItem("ysph-language");
  return saved === "en" ? "en" : "zh";
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
};

const closeMenu = () => {
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
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    header.classList.toggle("menu-active", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
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
