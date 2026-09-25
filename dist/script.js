/*
 * Замените только эти три ссылки перед публикацией реальных контактов.
 * Все кнопки на странице обновятся автоматически.
 */
const MESSENGER_LINKS = {
  whatsapp: "https://wa.me/79260980004",
  telegram: "https://t.me/username",
  max: "https://max.ru/u/placeholder",
};

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMobileMenu = () => {
  if (!menuToggle || !mobileMenu) return;
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
};

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });
}

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

const lawyerGrid = document.querySelector(".lawyer-grid");
const previousLawyer = document.querySelector("[data-carousel-prev]");
const nextLawyer = document.querySelector("[data-carousel-next]");
if (lawyerGrid && previousLawyer && nextLawyer) {
  const updateLawyerArrows = () => {
    const maxScroll = lawyerGrid.scrollWidth - lawyerGrid.clientWidth - 2;
    previousLawyer.disabled = lawyerGrid.scrollLeft <= 2;
    nextLawyer.disabled = lawyerGrid.scrollLeft >= maxScroll;
  };
  const moveLawyer = (direction) => {
    lawyerGrid.scrollBy({ left: direction * lawyerGrid.clientWidth, behavior: "smooth" });
  };
  previousLawyer.addEventListener("click", () => moveLawyer(-1));
  nextLawyer.addEventListener("click", () => moveLawyer(1));
  lawyerGrid.addEventListener("scroll", updateLawyerArrows, { passive: true });
  window.addEventListener("resize", updateLawyerArrows);
  updateLawyerArrows();
}

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
