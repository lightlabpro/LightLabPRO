const root = document.documentElement;
const themeButtons = Array.from(document.querySelectorAll(".theme-btn"));
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

function setTheme(mode) {
  if (mode === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  localStorage.setItem("llp-theme", mode);
  themeButtons.forEach((btn) => {
    const active = btn.getAttribute("data-theme") === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function closeMobileNav() {
  mobileNav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

setTheme(localStorage.getItem("llp-theme") || "auto");

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => setTheme(btn.getAttribute("data-theme")));
});

navToggle?.addEventListener("click", () => {
  const open = mobileNav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNav();
});
