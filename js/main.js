(function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  root.dataset.theme = savedTheme || (prefersLight ? "light" : "dark");

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-label", root.dataset.theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.innerHTML = root.dataset.theme === "light"
      ? '<span aria-hidden="true">☾</span>'
      : '<span aria-hidden="true">☼</span>';
  }

  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", root.dataset.theme);
    updateThemeIcon();
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-links] a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const contactForm = document.querySelector("[data-contact-form]");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(contactForm);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    const status = contactForm.querySelector("[data-form-status]");

    if (!name || !email || !message) {
      if (status) status.textContent = "Please complete all fields before sending.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:hemansh@example.com?subject=${subject}&body=${body}`;
    if (status) status.textContent = "Opening your email app with the message ready to send.";
    contactForm.reset();
  });

  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
})();
