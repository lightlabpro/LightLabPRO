const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const cards = Array.from(document.querySelectorAll("#moduleCards .card"));
const docTitle = document.getElementById("docTitle");
const docSummary = document.getElementById("docSummary");
const docSectionIds = document.getElementById("docSectionIds");
const docReadmeBody = document.getElementById("docReadmeBody");
const docImage = document.getElementById("docImage");
const docImageCaption = document.getElementById("docImageCaption");
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

function renderMarkdown(md) {
  if (!md || !String(md).trim()) {
    return "<p><em>(empty)</em></p>";
  }
  if (typeof marked !== "undefined" && marked.parse) {
    return marked.parse(md, { async: false });
  }
  return `<pre class="readme-fallback">${escapeHtml(md)}</pre>`;
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
    selectCard(cards[0]);
  }
}

function selectCard(card) {
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
  docSummary.textContent =
    "Tables and paragraphs below are copied verbatim from README_LightLabPRO_Features_Tutorial.md.";
  docSectionIds.textContent = sectionIds.length
    ? `README sections: \u00a7${sectionIds.join(", \u00a7")}`
    : "";

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

  if (cardImage) {
    docImage.src = cardImage.getAttribute("src");
    docImage.alt = cardImage.getAttribute("alt") || `${title} reference image`;
    docImageCaption.textContent = `${title} screenshot`;
  } else if (mappedImage) {
    docImage.src = mappedImage.src;
    docImage.alt = `${title} reference image`;
    docImageCaption.textContent = mappedImage.caption;
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

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
    const matches = !query || text.includes(query) || keywords.includes(query);
    card.classList.toggle("hidden", !matches);
  });
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

document.addEventListener("DOMContentLoaded", () => {
  loadReadme();
});

function openLightbox() {
  if (!imageLightbox || !lightboxImage || !docImage) return;
  lightboxImage.src = docImage.currentSrc || docImage.src;
  lightboxImage.alt = docImage.alt || "Screenshot";
  if (lightboxCaption && docImageCaption) {
    lightboxCaption.textContent = docImageCaption.textContent || "";
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
  if (event.key === "Escape" && imageLightbox && !imageLightbox.hasAttribute("hidden")) {
    closeLightbox();
  }
});
