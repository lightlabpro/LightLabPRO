const body = document.body;
const root = document.documentElement;
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const moduleCardsRoot = document.getElementById("moduleCards");
const docTitle = document.getElementById("docTitle");
const docReadmeBody = document.getElementById("docReadmeBody");
const docThumbWrap = document.getElementById("docThumbWrap");
const docImage = document.getElementById("docImage");
const heroReadmeIntro = document.getElementById("heroReadmeIntro");
const troubleshootingReadme = document.getElementById("troubleshootingReadme");
const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const docImageOpen = document.getElementById("docImageOpen");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const themeButtons = Array.from(document.querySelectorAll(".theme-btn"));

const README_URL = "README_LightLabPRO_Features_Tutorial.md";

let cards = [];
let activeModuleCard = null;

const moduleImages = {
  "Window Overview & Utilities": {
    src: "StudioLightingUI.png",
    caption: "Window utilities and top-level tabs in the Light Lab PRO UI",
  },
  "Scene Lights & Cluster": {
    src: "LightGroupsUI.png",
    caption: "Scene lights list, grouping, and synchronized editing context",
  },
};

const MODULE_SECTION_IDS = {
  "Gradual Effect": ["47"],
  "Strobe Effect": ["48"],
  "Step Sequencer": ["49"],
  "Sound Effect": ["50"],
  "Sound Reactor": ["51"],
  "Animation: Firefly": ["52"],
  "Animation: Rotation": ["53"],
  "Day-Night: Directional A": ["54"],
  "Day-Night: Directional B": ["55"],
  "Day-Night: Moon": ["46", "5"],
  "PRO Cookies: Texture": ["43"],
  "PRO Cookies: Animated": ["44"],
  "PRO Cookies: Video": ["45"],
};

const MODULE_LEGACY_SLICE = {
  "Gradual Effect": {
    from: "8",
    subsections: ["8.1"],
    appendices: ["Appendix A — When effect", "Appendix B — Quick reference"],
    excludeAppendixRows: ["Step Count", "Step Intensity", "Step Range"],
    forbidden: ["## 8) Effects", "8.2 Strobe", "8.3 Step Sequencer", "Strobe Effect (module view)"],
  },
  "Strobe Effect": {
    from: "8",
    subsections: ["8.2"],
    appendices: ["Appendix A — When effect", "Appendix B — Quick reference"],
    excludeAppendixRows: ["Step Count", "Step Intensity", "Step Range"],
    forbidden: ["8.1 Gradual", "8.3 Step Sequencer", "Gradual Effect (module view)"],
  },
  "Step Sequencer": {
    from: "8",
    subsections: ["8.3"],
    appendices: ["Appendix A — When effect", "Appendix B — Quick reference"],
    excludeAppendixRows: ["Min Intensity Speed", "Max Intensity Speed", "Min Range Speed", "Max Range Speed"],
    forbidden: ["8.1 Gradual", "8.2 Strobe", "Gradual Effect (module view)", "Strobe Effect (module view)"],
  },
  "Sound Effect": {
    from: "11",
    subsections: ["11.1"],
    appendices: ["Appendix A — Quick reference", "Appendix B — Sync"],
    excludeAppendixRows: [
      "Intensity Multiplier (Sound Reactor)",
      "Base Intensity (Sound Reactor)",
      "Color Change Speed (Sound Reactor)",
      "Threshold (Sound Reactor)",
    ],
    forbidden: ["11.2 Sound Reactor", "Sound Reactor (module view)"],
  },
  "Sound Reactor": {
    from: "11",
    subsections: ["11.2"],
    appendices: ["Appendix A — Quick reference", "Appendix B — Sync"],
    excludeAppendixRows: ["Audio Volume / Compensation"],
    forbidden: ["11.1 Sound Effect", "Sound Effect (module view)"],
  },
  "Animation: Firefly": {
    from: "14",
    subsections: ["14.2"],
    forbidden: ["14.1 Rotation", "Rotation Animator (module view)"],
  },
  "Animation: Rotation": {
    from: "14",
    subsections: ["14.1"],
    forbidden: ["14.2 Firefly", "Firefly Motion (module view)"],
  },
  "PRO Cookies: Texture": {
    from: "43",
    forbidden: ["Animated mode controls", "Video mode controls"],
  },
  "PRO Cookies: Animated": {
    from: "44",
    forbidden: ["Texture mode controls", "Video mode controls"],
  },
  "PRO Cookies: Video": {
    from: "45",
    forbidden: ["Texture mode controls", "Animated mode controls"],
  },
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

function splitMarkdownByH3(md) {
  const intro = [];
  const parts = [];
  let current = null;
  for (const line of String(md || "").split("\n")) {
    if (/^### /.test(line)) {
      if (current) parts.push(current);
      current = { heading: line.slice(4).trim(), lines: [line] };
    } else if (current) {
      current.lines.push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) parts.push(current);
  return { intro: intro.join("\n").trim(), parts };
}

function subsectionHeadingMatches(heading, id) {
  return heading === id || heading.startsWith(`${id} `);
}

function filterMarkdownTableRows(md, excludeSubstrings) {
  if (!excludeSubstrings?.length) return md;
  return md
    .split("\n")
    .filter((line) => {
      if (!line.trim().startsWith("|")) return true;
      if (/^\|\s*-/.test(line)) return true;
      return !excludeSubstrings.some((needle) => line.includes(needle));
    })
    .join("\n");
}

function extractModuleFromLegacySection(sectionMd, config) {
  const { subsections = [], appendices = [], excludeAppendixRows = [], includeIntro = false } = config;
  const { intro, parts } = splitMarkdownByH3(sectionMd);
  const chunks = [];
  if (includeIntro && intro) chunks.push(intro);
  for (const part of parts) {
    const keepSub = subsections.some((id) => subsectionHeadingMatches(part.heading, id));
    const keepApp = appendices.some((label) => part.heading.includes(label));
    if (!keepSub && !keepApp) continue;
    let text = part.lines.join("\n");
    if (keepApp && excludeAppendixRows.length) {
      text = filterMarkdownTableRows(text, excludeAppendixRows);
    }
    chunks.push(text.trim());
  }
  return chunks.filter(Boolean).join("\n\n");
}

function moduleDocLooksWrong(title, md) {
  const cfg = MODULE_LEGACY_SLICE[title];
  if (!cfg?.forbidden?.length || !md) return false;
  return cfg.forbidden.some((needle) => md.includes(needle));
}

function getCardTitle(card) {
  return card.querySelector(".sidebar-link-title")?.textContent?.trim() || "Module";
}

function getCardSectionIds(card) {
  const title = getCardTitle(card);
  if (MODULE_SECTION_IDS[title]) return MODULE_SECTION_IDS[title].slice();
  return (card.getAttribute("data-readme-sections") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getModuleDocMarkdown(title, sectionIds, by) {
  const parts = sectionIds.map((id) => by[id]).filter(Boolean);
  let combined = parts.join("\n\n---\n\n");
  if (combined && !moduleDocLooksWrong(title, combined)) return combined;
  const legacy = MODULE_LEGACY_SLICE[title];
  if (legacy?.from && by[legacy.from]) {
    if (legacy.subsections?.length || legacy.appendices?.length) {
      return extractModuleFromLegacySection(by[legacy.from], legacy);
    }
    const legacyMd = by[legacy.from];
    if (!moduleDocLooksWrong(title, legacyMd)) return legacyMd;
  }
  return combined;
}

function getReadmeMarkdown() {
  if (typeof window.__README_MD__ === "string" && window.__README_MD__.length > 0) {
    return window.__README_MD__;
  }
  return null;
}

function buildModuleCards() {
  const list = window.LLP_MODULES || [];
  const template = document.getElementById("moduleCardTemplate");
  if (!moduleCardsRoot || !template) return;

  moduleCardsRoot.innerHTML = "";
  for (const mod of list) {
    const btn = template.content.firstElementChild.cloneNode(true);
    btn.setAttribute("data-readme-sections", mod.sections);
    btn.setAttribute("data-keywords", mod.keywords || "");
    btn.querySelector(".sidebar-link-title").textContent = mod.title;
    if (mod.image) {
      const img = btn.querySelector(".card-thumb");
      img.src = mod.image;
      img.alt = mod.imageAlt || mod.title;
      img.hidden = false;
    }
    moduleCardsRoot.appendChild(btn);
  }
  cards = Array.from(moduleCardsRoot.querySelectorAll(".card"));
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
        'Add <code>readme-data.js</code> or serve the site over HTTP so <code>README_LightLabPRO_Features_Tutorial.md</code> can load.'
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
    selectCard(cards[0], { scroll: false });
  }
}

function selectCard(card, options = {}) {
  const scroll = options.scroll !== false;

  activeModuleCard = card;
  cards.forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  const title = getCardTitle(card);
  const cardImage = card.querySelector(".card-thumb:not([hidden])");
  const mappedImage = moduleImages[title];
  const sectionIds = getCardSectionIds(card);

  if (docTitle) docTitle.textContent = title;

  const by = window.__readmeBySection;
  if (by && docReadmeBody) {
    const combined = getModuleDocMarkdown(title, sectionIds, by);
    docReadmeBody.innerHTML = combined
      ? renderMarkdown(combined)
      : "<p><em>No README sections mapped for this module.</em></p>";
  }

  const hasRefImage = Boolean(cardImage || mappedImage);
  if (docThumbWrap) docThumbWrap.hidden = !hasRefImage;

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

  closeSidebarMobile();

  if (scroll) {
    document.getElementById("modules")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

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
  searchClear.toggleAttribute("hidden", !hasText);
}

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

function openSidebarMobile() {
  sidebar?.classList.add("is-open");
  sidebarToggle?.setAttribute("aria-expanded", "true");
  if (sidebarBackdrop) sidebarBackdrop.hidden = false;
}

function closeSidebarMobile() {
  sidebar?.classList.remove("is-open");
  sidebarToggle?.setAttribute("aria-expanded", "false");
  if (sidebarBackdrop) sidebarBackdrop.hidden = true;
}

function openLightbox() {
  if (!imageLightbox || !lightboxImage || !docImage) return;
  lightboxImage.src = docImage.currentSrc || docImage.src;
  lightboxImage.alt = docImage.alt || "Screenshot";
  if (lightboxCaption) {
    lightboxCaption.textContent = docTitle?.textContent?.trim() || docImage.alt || "";
  }
  imageLightbox.removeAttribute("hidden");
  imageLightbox.setAttribute("aria-hidden", "false");
  body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!imageLightbox) return;
  imageLightbox.setAttribute("hidden", "");
  imageLightbox.setAttribute("aria-hidden", "true");
  body.classList.remove("lightbox-open");
}

const storedTheme = localStorage.getItem("llp-theme") || "auto";
setTheme(storedTheme);

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => setTheme(btn.getAttribute("data-theme")));
});

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

sidebarToggle?.addEventListener("click", () => {
  if (sidebar?.classList.contains("is-open")) closeSidebarMobile();
  else openSidebarMobile();
});

sidebarBackdrop?.addEventListener("click", closeSidebarMobile);

docImageOpen?.addEventListener("click", (event) => {
  event.stopPropagation();
  openLightbox();
});

imageLightbox?.querySelectorAll("[data-lightbox-close]").forEach((el) => {
  el.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (imageLightbox && !imageLightbox.hasAttribute("hidden")) {
    closeLightbox();
    return;
  }
  closeSidebarMobile();
});

document.addEventListener("DOMContentLoaded", () => {
  buildModuleCards();
  cards.forEach((card) => {
    card.addEventListener("click", () => selectCard(card));
  });
  updateSearchClearVisibility();
  loadReadme();
});
