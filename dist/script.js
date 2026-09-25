/*
 * Замените только эти три ссылки перед публикацией реальных контактов.
 * Все кнопки на странице обновятся автоматически.
 */
const MESSENGER_LINKS = {
  whatsapp: "https://wa.me/79990000000",
  telegram: "https://t.me/username",
  max: "https://max.ru/u/placeholder",
};

document.querySelectorAll("[data-messenger]").forEach((link) => {
  const key = link.dataset.messenger;
  link.href = MESSENGER_LINKS[key];
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5%" },
  );
  revealItems.forEach((item) => observer.observe(item));
}

const accordionItems = document.querySelectorAll("[data-accordion] details");
accordionItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    accordionItems.forEach((other) => {
      if (other !== item) other.removeAttribute("open");
    });
  });
});

const portrait = document.querySelector("[data-parallax]");
if (portrait && !reduceMotion && window.matchMedia("(min-width: 900px)").matches) {
  let ticking = false;
  const updatePortrait = () => {
    const offset = Math.min(window.scrollY * 0.035, 24);
    portrait.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePortrait);
        ticking = true;
      }
    },
    { passive: true },
  );
}
