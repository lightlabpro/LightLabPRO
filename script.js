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
const editModeToggle = document.getElementById("editModeToggle");
const saveReadmeEdits = document.getElementById("saveReadmeEdits");
const editFormatToolbar = document.getElementById("editFormatToolbar");

const README_URL = "README_LightLabPRO_Features_Tutorial.md";
const README_FILENAME = "README_LightLabPRO_Features_Tutorial.md";
const README_DATA_FILENAME = "readme-data.js";

let activeModuleCard = null;
let readmeLoaded = false;

let turndownServicePromise = null;
let formatToolbarRaf = null;

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

function canUseSectionEditing(by) {
  return Boolean(by && !by._raw && Object.keys(by).some((k) => /^\d+$/.test(k)));
}

function cloneSectionMap(by) {
  const o = {};
  for (const k of Object.keys(by)) {
    if (k === "_raw") continue;
    o[k] = by[k];
  }
  return o;
}

function rebuildReadmeFromSections(by) {
  const parts = [];
  if (by.preamble != null && String(by.preamble).trim() !== "") {
    parts.push(String(by.preamble).trim());
  }
  const nums = Object.keys(by)
    .filter((k) => /^\d+$/.test(k))
    .map(Number)
    .sort((a, b) => a - b);
  for (const n of nums) {
    const chunk = by[String(n)];
    if (chunk != null && String(chunk).trim() !== "") {
      parts.push(String(chunk).trim());
    }
  }
  return parts.join("\n\n") + "\n";
}

function stripLeadingH2(md) {
  return String(md || "").replace(/^##\s+[^\n]+\n?/, "").trim();
}

function sectionHeaderLine(sectionMd) {
  const first = String(sectionMd || "").split("\n")[0].trim();
  return first || "## ";
}

async function getTurndownService() {
  if (turndownServicePromise) return turndownServicePromise;
  turndownServicePromise = (async () => {
    if (typeof TurndownService === "undefined") {
      throw new Error("Turndown library missing.");
    }
    const td = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
    try {
      const gfmMod = await import(
        "https://cdn.jsdelivr.net/npm/turndown-plugin-gfm@1.0.2/lib/turndown-plugin-gfm.es.js"
      );
      if (gfmMod && typeof gfmMod.gfm === "function") {
        gfmMod.gfm(td);
      }
    } catch (_) {
      /* GFM optional; tables may convert less cleanly without it */
    }
    return td;
  })();
  return turndownServicePromise;
}

function triggerDownload(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function buildReadmeDataJs(md) {
  const header =
    "/* Embedded copy of README_LightLabPRO_Features_Tutorial.md — run: node embed-readme.mjs */\n";
  return `${header}window.__README_MD__=${JSON.stringify(md)};\n`;
}

function getEditableRoots() {
  return [heroReadmeIntro, docReadmeBody, troubleshootingReadme].filter(Boolean);
}

function selectionInsideEditable() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return false;
  let n = sel.anchorNode;
  if (n.nodeType === Node.TEXT_NODE) n = n.parentElement;
  const roots = getEditableRoots();
  while (n) {
    if (roots.includes(n)) return true;
    n = n.parentElement;
  }
  return false;
}

function wrapSelectionInlineCode() {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  const code = document.createElement("code");
  try {
    range.surroundContents(code);
  } catch {
    const contents = range.extractContents();
    code.appendChild(contents);
    range.insertNode(code);
  }
  sel.removeAllRanges();
  const nr = document.createRange();
  nr.selectNodeContents(code);
  sel.addRange(nr);
}

function runFormatLink() {
  const url = window.prompt("Link URL (leave empty to remove link)", "https://");
  if (url === null) return;
  const trimmed = url.trim();
  if (trimmed === "") {
    document.execCommand("unlink", false, null);
    return;
  }
  document.execCommand("createLink", false, trimmed);
}

function runExecFormat(cmd, val) {
  if (cmd === "formatBlock" && val) {
    document.execCommand("formatBlock", false, val);
    return;
  }
  document.execCommand(cmd, false, null);
}

function normalizeFormatBlockValue(raw) {
  let v = String(raw || "")
    .toLowerCase()
    .replace(/[<>]/g, "")
    .trim();
  if (v === "div") v = "p";
  return v;
}

function selectionInsideTag(tagName) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return false;
  const upper = tagName.toUpperCase();
  const roots = getEditableRoots();

  function pathHitsTag(node) {
    let n = node;
    if (n.nodeType === Node.TEXT_NODE) n = n.parentElement;
    while (n) {
      if (roots.includes(n)) return false;
      if (n.nodeName === upper) return true;
      n = n.parentElement;
    }
    return false;
  }

  return pathHitsTag(sel.anchorNode) || pathHitsTag(sel.focusNode);
}

function setFormatButtonActive(btn, active) {
  if (!btn) return;
  if (active) {
    btn.classList.add("fmt-btn--active");
    btn.setAttribute("aria-pressed", "true");
  } else {
    btn.classList.remove("fmt-btn--active");
    btn.setAttribute("aria-pressed", "false");
  }
}

function clearFormatToolbarState() {
  if (!editFormatToolbar) return;
  editFormatToolbar.querySelectorAll("button.fmt-btn").forEach((btn) => {
    btn.classList.remove("fmt-btn--active");
    btn.setAttribute("aria-pressed", "false");
  });
}

function updateFormatToolbarState() {
  if (!editFormatToolbar || !body.classList.contains("edit-mode")) return;

  clearFormatToolbarState();

  if (!selectionInsideEditable()) return;

  try {
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-cmd="bold"]'),
      document.queryCommandState("bold")
    );
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-cmd="italic"]'),
      document.queryCommandState("italic")
    );
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-cmd="underline"]'),
      document.queryCommandState("underline")
    );
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-cmd="strikeThrough"]'),
      document.queryCommandState("strikeThrough")
    );

    const inUl = document.queryCommandState("insertUnorderedList");
    const inOl = document.queryCommandState("insertOrderedList");
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-cmd="insertUnorderedList"]'),
      inUl
    );
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-cmd="insertOrderedList"]'),
      inOl
    );

    const blockVal = normalizeFormatBlockValue(document.queryCommandValue("formatBlock"));
    editFormatToolbar.querySelectorAll('[data-cmd="formatBlock"][data-val]').forEach((btn) => {
      const want = (btn.getAttribute("data-val") || "").toLowerCase();
      let match = blockVal === want;
      if (want === "p") {
        match =
          blockVal === "p" ||
          blockVal === "div" ||
          (blockVal === "" && !inUl && !inOl);
      }
      setFormatButtonActive(btn, match);
    });

    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-fmt="code"]'),
      selectionInsideTag("code")
    );
    setFormatButtonActive(
      editFormatToolbar.querySelector('[data-fmt="link"]'),
      selectionInsideTag("a")
    );
  } catch (_) {
    /* queryCommand* may throw outside edit context */
  }
}

function scheduleFormatToolbarUpdate() {
  if (!body.classList.contains("edit-mode")) return;
  if (formatToolbarRaf != null) return;
  formatToolbarRaf = requestAnimationFrame(() => {
    formatToolbarRaf = null;
    updateFormatToolbarState();
  });
}

function setEditMode(on) {
  const wasOn = body.classList.contains("edit-mode");
  body.classList.toggle("edit-mode", on);
  const targets = getEditableRoots();
  for (const el of targets) {
    if (on) {
      el.contentEditable = "true";
      el.setAttribute("spellcheck", "true");
    } else {
      el.contentEditable = "false";
      el.removeAttribute("spellcheck");
    }
  }
  if (editModeToggle) {
    editModeToggle.setAttribute("aria-pressed", on ? "true" : "false");
    editModeToggle.textContent = on ? "Disable editing" : "Enable editing";
  }
  if (saveReadmeEdits) saveReadmeEdits.hidden = !on;
  if (editFormatToolbar) editFormatToolbar.hidden = !on;
  if (on) {
    scheduleFormatToolbarUpdate();
  } else {
    clearFormatToolbarState();
  }
  if (wasOn && !on) {
    refreshReadmeViews();
  }
}

function refreshReadmeViews() {
  const by = window.__readmeBySection;
  if (!by) return;
  if (heroReadmeIntro && by.preamble) {
    heroReadmeIntro.innerHTML = renderMarkdown(by.preamble);
  }
  if (troubleshootingReadme && by["18"]) {
    troubleshootingReadme.innerHTML = renderMarkdown(by["18"]);
  }
  if (activeModuleCard) {
    selectCard(activeModuleCard, { openMobile: false });
  }
}

async function saveReadmeFromEditables() {
  const by = window.__readmeBySection;
  if (!canUseSectionEditing(by)) {
    window.alert("README is not loaded in sectioned form; cannot save.");
    return;
  }
  const td = await getTurndownService();

  const copy = cloneSectionMap(by);

  if (heroReadmeIntro) {
    copy.preamble = td.turndown(heroReadmeIntro).trim();
  }

  if (troubleshootingReadme && copy["18"]) {
    const h = sectionHeaderLine(copy["18"]);
    const bodyMd = stripLeadingH2(td.turndown(troubleshootingReadme));
    copy["18"] = `${h}\n\n${bodyMd}`.trim();
  }

  if (docReadmeBody && activeModuleCard) {
    const sectionIds = (activeModuleCard.getAttribute("data-readme-sections") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (sectionIds.length) {
      const docMd = td.turndown(docReadmeBody).trim();
      const blocks = docMd.split(/\n---\n/).map((s) => s.trim());
      if (blocks.length !== sectionIds.length) {
        window.alert(
          `Could not match edited panel to README sections (expected ${sectionIds.length} parts separated by --- between modules, found ${blocks.length}). Keep the horizontal rules between combined sections, or save from a simpler card first.`
        );
        return;
      }
      sectionIds.forEach((id, i) => {
        if (!copy[id]) return;
        const h = sectionHeaderLine(copy[id]);
        const bodyBlock = stripLeadingH2(blocks[i] || "");
        copy[id] = `${h}\n\n${bodyBlock}`.trim();
      });
    }
  }

  const newMd = rebuildReadmeFromSections(copy);
  window.__README_MD__ = newMd;
  window.__readmeBySection = parseReadmeSections(newMd);

  triggerDownload(README_FILENAME, newMd);
  window.setTimeout(() => {
    triggerDownload(README_DATA_FILENAME, buildReadmeDataJs(newMd));
  }, 400);

  setEditMode(false);
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
  readmeLoaded = false;
  if (editModeToggle) editModeToggle.disabled = true;
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

  readmeLoaded = true;
  if (editModeToggle) {
    editModeToggle.disabled = !canUseSectionEditing(by);
  }

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

  activeModuleCard = card;

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
  if ((event.ctrlKey || event.metaKey) && event.key === "s" && body.classList.contains("edit-mode")) {
    event.preventDefault();
    saveReadmeFromEditables().catch((e) => {
      console.error(e);
      window.alert(e.message || String(e));
    });
    return;
  }
  if (event.key !== "Escape") return;
  if (imageLightbox && !imageLightbox.hasAttribute("hidden")) {
    closeLightbox();
    return;
  }
  if (isMobileModules() && docPanel?.classList.contains("doc-panel--open")) {
    closeDocPanelMobile();
  }
});

editModeToggle?.addEventListener("click", () => {
  if (!readmeLoaded || editModeToggle.disabled) return;
  const on = !body.classList.contains("edit-mode");
  setEditMode(on);
});

saveReadmeEdits?.addEventListener("click", () => {
  saveReadmeFromEditables().catch((e) => {
    console.error(e);
    window.alert(e.message || String(e));
  });
});

editFormatToolbar?.addEventListener("mousedown", (e) => {
  if (e.target.closest("button.fmt-btn")) e.preventDefault();
});

editFormatToolbar?.addEventListener("click", (e) => {
  if (!body.classList.contains("edit-mode")) return;
  const btn = e.target.closest("button.fmt-btn");
  if (!btn) return;
  if (!selectionInsideEditable()) {
    window.alert("Click in the intro, module panel, or troubleshooting area and select text first.");
    return;
  }
  const fmt = btn.getAttribute("data-fmt");
  if (fmt === "code") {
    wrapSelectionInlineCode();
    scheduleFormatToolbarUpdate();
    return;
  }
  if (fmt === "link") {
    runFormatLink();
    scheduleFormatToolbarUpdate();
    return;
  }
  const cmd = btn.getAttribute("data-cmd");
  const val = btn.getAttribute("data-val");
  if (!cmd) return;
  runExecFormat(cmd, val);
  scheduleFormatToolbarUpdate();
});

document.addEventListener("selectionchange", () => {
  scheduleFormatToolbarUpdate();
});

getEditableRoots().forEach((root) => {
  root?.addEventListener("keyup", () => scheduleFormatToolbarUpdate());
});
