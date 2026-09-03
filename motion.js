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

const setupGsapMotion = () => {
  if (!canAnimate || !window.gsap || !window.ScrollTrigger) return false;

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".hero-image", {
    scale: 1.02,
    yPercent: 1.5,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".hero-facts", {
    y: -18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "45% top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.utils.toArray("[data-story-card]").forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 18 + index * 8 },
      {
        y: index === 0 ? -8 : -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".glimmer",
          start: "top 72%",
          end: "bottom 20%",
          scrub: true,
        },
      }
    );
  });

  return true;
};

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

const loadGsap = () => {
  if (window.gsap && window.ScrollTrigger) {
    return Promise.resolve();
  }

  return Promise.race([
    loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js").then(() =>
      loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js")
    ),
    new Promise((_, reject) => {
      window.setTimeout(reject, 1800);
    }),
  ]);
};

const setupFallbackParallax = () => {
  if (!canAnimate) return;

  const heroImage = document.querySelector(".hero-image");
  const heroFacts = document.querySelector(".hero-facts");
  if (!heroImage || !heroFacts) return;

  let ticking = false;

  const update = () => {
    const heroHeight = document.querySelector(".hero")?.offsetHeight || window.innerHeight;
    const progress = Math.min(window.scrollY / heroHeight, 1);
    heroImage.style.transform = `scale(${1 + progress * 0.02}) translateY(${progress * 10}px)`;
    heroFacts.style.transform = `translateY(${-progress * 14}px)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
};

window.addEventListener("load", () => {
  loadGsap()
    .then(() => {
      if (!setupGsapMotion()) {
        setupFallbackParallax();
      }
    })
    .catch(setupFallbackParallax);
});
