const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    header.classList.remove("menu-active");
    document.body.classList.remove("menu-open");
  }
});
