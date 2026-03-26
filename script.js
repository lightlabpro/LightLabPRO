const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const cards = Array.from(document.querySelectorAll("#moduleCards .card"));
const docTitle = document.getElementById("docTitle");
const docReadmeBody = document.getElementById("docReadmeBody");
const docReadmeWrap = document.getElementById("docReadmeWrap");
const docThumbWrap = document.getElementById("docThumbWrap");
const docImage = document.getElementById("docImage");
const docPanel = document.getElementById("docPanel");
const docOverlayBackdrop = document.getElementById("docOverlayBackdrop");
const docPanelClose = document.getElementById("docPanelClose");
const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const docImageOpen = document.getElementById("docImageOpen");
const heroReadmeIntro = document.getElementById("heroReadmeIntro");
const troubleshootingReadme = document.getElementById("troubleshootingReadme");

const README_URL = "README_LightLabPRO_Features_Tutorial.md";

const moduleImages = {
  "Window Overview & Utilities": {
    src: "StudioLightingUI.png",
    caption: "Window utilities and top-level tabs in the Light Lab PRO UI"
  },
  "Scene Lights & Cluster": {
    src: "LightGroupsUI.png",
    caption: "Scene lights list, grouping, and synchronized editing context"
  }
};

if (typeof marked !== "undefined" && marked.setOptions) {
  marked.setOptions({ gfm: true, breaks: false });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Strips README-style numeric prefixes from headings for on-site reading. */
function stripReadmeNumbering(md) {
  if (!md || typeof md !== "string") return md;
  return md
    .replace(/^##\s*\d+\)\s+/gm, "## ")
    .replace(/^###\s*\d+(?:\.\d+)+\s+/gm, "### ");
}

function renderMarkdown(md) {
  if (!md || !String(md).trim()) {
    return "<p><em>(empty)</em></p>";
  }
  const cleaned = stripReadmeNumbering(md);
  if (typeof marked !== "undefined" && marked.parse) {
    return marked.parse(cleaned, { async: false });
  }
  return `<pre class="readme-fallback">${escapeHtml(cleaned)}</pre>`;
}

function parseReadmeSections(md) {
  const byNum = {};
  const re = /^## (\d+)\)\s+.+$/gm;
  const matches = [...md.matchAll(re)];
  if (!matches.length) {
    byNum._raw = md;
    return byNum;
  }
  byNum.preamble = md.slice(0, matches[0].index).trim();
  for (let i = 0; i < matches.length; i++) {
    const num = matches[i][1];
    const start = matches[i].index;
    const end = matches[i + 1] ? matches[i + 1].index : md.length;
    byNum[num] = md.slice(start, end).trim();
  }
  return byNum;
}

function getReadmeMarkdown() {
  if (typeof window.__README_MD__ === "string" && window.__README_MD__.length > 0) {
    return window.__README_MD__;
  }
  return null;
}

function isMobileModules() {
  // Keep the "mobile sheet" behavior for small screens only.
  // Tablet/desktop should use the sticky side panel instead.
  return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 740px)").matches;
}

function openDocPanelMobile() {
  if (!isMobileModules() || !docPanel || !docOverlayBackdrop) return;
  docOverlayBackdrop.hidden = false;
  docOverlayBackdrop.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => docOverlayBackdrop.classList.add("is-visible"));
  docPanel.classList.add("doc-panel--open");
  document.body.classList.add("doc-modal-open");
}

function closeDocPanelMobile() {
  if (!docPanel || !docOverlayBackdrop) return;
  docOverlayBackdrop.classList.remove("is-visible");
  docPanel.classList.remove("doc-panel--open");
  document.body.classList.remove("doc-modal-open");
  window.setTimeout(() => {
    docOverlayBackdrop.hidden = true;
    docOverlayBackdrop.setAttribute("aria-hidden", "true");
  }, 280);
}

function resetMobileDocOverlay() {
  if (!docPanel || !docOverlayBackdrop) return;
  docOverlayBackdrop.classList.remove("is-visible");
  docPanel.classList.remove("doc-panel--open");
  document.body.classList.remove("doc-modal-open");
  docOverlayBackdrop.hidden = true;
  docOverlayBackdrop.setAttribute("aria-hidden", "true");
}

function showReadmeError(message) {
  const html = `<p class="readme-error"><strong>Could not load README.</strong> ${message}</p>`;
  if (docReadmeBody) docReadmeBody.innerHTML = html;
  if (heroReadmeIntro) heroReadmeIntro.innerHTML = html;
  if (troubleshootingReadme) troubleshootingReadme.innerHTML = "";
}

async function loadReadme() {
  let md = getReadmeMarkdown();
  if (!md) {
    try {
      const res = await fetch(README_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      md = await res.text();
    } catch (e) {
      showReadmeError(
        "Add <code>readme-data.js</code> (run <code>node embed-readme.mjs</code>) or serve the site over HTTP so <code>README_LightLabPRO_Features_Tutorial.md</code> can load. You can still open the <a href=\"README_LightLabPRO_Features_Tutorial.md\">markdown file</a> directly."
      );
      return;
    }
  }

  window.__readmeBySection = parseReadmeSections(md);
  const by = window.__readmeBySection;

  if (heroReadmeIntro && by.preamble) {
    heroReadmeIntro.innerHTML = renderMarkdown(by.preamble);
  }
  if (troubleshootingReadme && by["18"]) {
    troubleshootingReadme.innerHTML = renderMarkdown(by["18"]);
  }

  if (cards[0]) {
    selectCard(cards[0], { openMobile: false });
  }
}

function selectCard(card, options = {}) {
  const openMobile = options.openMobile !== false;

  cards.forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  const title = card.querySelector("h3")?.textContent?.trim() || "Module";
  const cardImage = card.querySelector("img");
  const mappedImage = moduleImages[title];
  const sectionIds = (card.getAttribute("data-readme-sections") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  docTitle.textContent = title;

  const by = window.__readmeBySection;
  if (by && docReadmeBody) {
    const parts = sectionIds.map((id) => by[id]).filter(Boolean);
    const combined = parts.join("\n\n---\n\n");
    docReadmeBody.innerHTML = combined
      ? renderMarkdown(combined)
      : "<p><em>No README sections mapped for this card.</em></p>";
  } else if (docReadmeBody && !by) {
    docReadmeBody.innerHTML = "<p><em>Loading README\u2026</em></p>";
  }

  const hasRefImage = Boolean(cardImage || mappedImage);
  if (docThumbWrap) docThumbWrap.hidden = !hasRefImage;
  if (docReadmeWrap) docReadmeWrap.classList.toggle("doc-thumb-visible", hasRefImage);

  if (hasRefImage) {
    if (cardImage) {
      docImage.src = cardImage.getAttribute("src");
      docImage.alt = cardImage.getAttribute("alt") || `${title} reference image`;
    } else if (mappedImage) {
      docImage.src = mappedImage.src;
      docImage.alt = `${title} reference image`;
    }
  } else if (docImage) {
    docImage.removeAttribute("src");
    docImage.alt = "";
  }

  if (openMobile && isMobileModules()) {
    openDocPanelMobile();
  }
}

const storedTheme = localStorage.getItem("llp-theme");
if (storedTheme === "light") {
  body.classList.add("light");
  themeToggle.textContent = "\u2600";
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light");
  const isLight = body.classList.contains("light");
  themeToggle.textContent = isLight ? "\u2600" : "\u263e";
  localStorage.setItem("llp-theme", isLight ? "light" : "dark");
});

function applyModuleSearch() {
  const query = searchInput?.value.trim().toLowerCase() ?? "";

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
    const matches = !query || text.includes(query) || keywords.includes(query);
    card.classList.toggle("hidden", !matches);
  });
}

function updateSearchClearVisibility() {
  if (!searchClear || !searchInput) return;
  const hasText = searchInput.value.trim().length > 0;
  // Use toggleAttribute to reliably add/remove the `hidden` boolean attribute.
  searchClear.toggleAttribute("hidden", !hasText);
  searchClear.setAttribute("aria-hidden", hasText ? "false" : "true");
}

searchInput?.addEventListener("input", () => {
  updateSearchClearVisibility();
  applyModuleSearch();
});

searchClear?.addEventListener("click", () => {
  searchInput.value = "";
  updateSearchClearVisibility();
  applyModuleSearch();
  searchInput.focus();
});

cards.forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open documentation for ${card.querySelector("h3")?.textContent?.trim() || "module"}`);
  card.addEventListener("click", () => selectCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(card);
    }
  });
});

docOverlayBackdrop?.addEventListener("click", () => {
  if (isMobileModules()) closeDocPanelMobile();
});

docPanelClose?.addEventListener("click", () => closeDocPanelMobile());

window.addEventListener("resize", () => {
  if (!isMobileModules()) resetMobileDocOverlay();
});

document.addEventListener("DOMContentLoaded", () => {
  updateSearchClearVisibility();
  loadReadme();
});

function openLightbox() {
  if (!imageLightbox || !lightboxImage || !docImage) return;
  lightboxImage.src = docImage.currentSrc || docImage.src;
  lightboxImage.alt = docImage.alt || "Screenshot";
  if (lightboxCaption) {
    lightboxCaption.textContent = docTitle?.textContent?.trim() || docImage.alt || "";
  }
  imageLightbox.removeAttribute("hidden");
  imageLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  const closeBtn = imageLightbox.querySelector(".lightbox-close");
  closeBtn?.focus();
}

function closeLightbox() {
  if (!imageLightbox) return;
  imageLightbox.setAttribute("hidden", "");
  imageLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  docImageOpen?.focus();
}

docImageOpen?.addEventListener("click", (event) => {
  event.stopPropagation();
  openLightbox();
});

imageLightbox?.querySelectorAll("[data-lightbox-close]").forEach((el) => {
  el.addEventListener("click", () => closeLightbox());
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (imageLightbox && !imageLightbox.hasAttribute("hidden")) {
    closeLightbox();
    return;
  }
  if (isMobileModules() && docPanel?.classList.contains("doc-panel--open")) {
    closeDocPanelMobile();
  }
});
