const LAWYER_CONTACTS = [
  { name: "Гюнай Садигова", phone: "79260980004", display: "+7 (926) 098-00-04" },
  { name: "Ирина Гриднева", phone: "79257277471", display: "+7 (925) 727-74-71" },
];
const MESSENGER_NAMES = { whatsapp: "WhatsApp", telegram: "Telegram", max: "MAX" };
const contactDialog = document.createElement("dialog");
contactDialog.className = "contact-picker";
contactDialog.setAttribute("aria-labelledby", "contact-picker-title");
document.body.append(contactDialog);
let contactTrigger;

function openContactPicker(messenger, trigger) {
  contactTrigger = trigger;
  contactDialog.replaceChildren();
  const close = document.createElement("button");
  close.type = "button";
  close.className = "contact-picker-close";
  close.setAttribute("aria-label", "Закрыть выбор юриста");
  close.textContent = "×";
  close.addEventListener("click", () => contactDialog.close());
  const title = document.createElement("h2");
  title.id = "contact-picker-title";
  title.textContent = "С кем связаться?";
  const intro = document.createElement("p");
  intro.textContent = messenger === "max"
    ? "Выберите юриста. Скопируйте номер и найдите контакт в MAX или позвоните по телефону."
    : `Выберите юриста для общения в ${MESSENGER_NAMES[messenger]} или позвоните по телефону.`;
  contactDialog.append(close, title, intro);
  LAWYER_CONTACTS.forEach((person) => {
    const row = document.createElement("section");
    row.className = "contact-picker-person";
    const name = document.createElement("h3");
    name.textContent = person.name;
    const phone = document.createElement("p");
    phone.textContent = person.display;
    const actions = document.createElement("div");
    actions.className = "contact-picker-actions";
    let message;
    if (messenger === "max") {
      message = document.createElement("button");
      message.type = "button";
      message.textContent = "Скопировать номер";
      message.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(`+${person.phone}`);
          message.textContent = "Номер скопирован";
        } catch {
          message.textContent = person.display;
        }
      });
    } else {
      message = document.createElement("a");
      message.href = messenger === "whatsapp" ? `https://wa.me/${person.phone}` : `https://t.me/+${person.phone}`;
      message.target = "_blank";
      message.rel = "noopener noreferrer";
      message.textContent = `Написать в ${MESSENGER_NAMES[messenger]}`;
    }
    message.className = "contact-picker-message";
    const call = document.createElement("a");
    call.href = `tel:+${person.phone}`;
    call.textContent = "Позвонить";
    actions.append(message, call);
    row.append(name, phone, actions);
    contactDialog.append(row);
  });
  contactDialog.showModal();
}
contactDialog.addEventListener("click", (event) => {
  const rect = contactDialog.getBoundingClientRect();
  if (event.target === contactDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) contactDialog.close();
});
contactDialog.addEventListener("close", () => contactTrigger?.focus());

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
  link.href = "#contact";
  link.setAttribute("aria-haspopup", "dialog");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openContactPicker(link.dataset.messenger, link);
  });
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
