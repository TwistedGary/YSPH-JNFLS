const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = !motionQuery.matches;

document.documentElement.classList.add("motion-ready");

if (motionQuery.matches) {
  document.documentElement.classList.add("reduced-motion");
}

const revealItems = [
  ...document.querySelectorAll("[data-reveal]"),
  ...Array.from(document.querySelectorAll("[data-reveal-group]")).flatMap((group) => [...group.children]),
];

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 80}ms`);
});

const formatCount = (value, pad) => String(value).padStart(pad, "0");

const animateCount = (element) => {
  if (element.dataset.counted === "true") return;
  element.dataset.counted = "true";

  const target = Number(element.dataset.target || "0");
  const pad = Number(element.dataset.pad || "1");

  if (!canAnimate) {
    element.textContent = formatCount(target, pad);
    return;
  }

  const start = performance.now();
  const duration = 1100;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatCount(Math.round(target * eased), pad);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll?.("[data-count]").forEach(animateCount);

        if (entry.target.matches("[data-count]")) {
          animateCount(entry.target);
        }

        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 8% 0px", threshold: 0.04 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  document.querySelectorAll("[data-count]").forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  document.querySelectorAll("[data-count]").forEach(animateCount);
}
