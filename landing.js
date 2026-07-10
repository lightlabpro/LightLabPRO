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

const ROADMAP_BRANCHES = [
  { status: "in-progress", label: "In Progress", y: 72, stroke: "url(#branch-in-progress)", color: "#22d3ee" },
  { status: "planned", label: "Planned", y: 172, stroke: "url(#branch-planned)", color: "#a78bfa" },
  { status: "scratched", label: "Scratched", y: 272, stroke: "url(#branch-scratched)", color: "#ef4444" },
  { status: "completed", label: "Completed", y: 372, stroke: "url(#branch-completed)", color: "#34d399" },
];

const SVG_NS = "http://www.w3.org/2000/svg";
const POINT_SPACING_BASE = 150;
const TIMELINE_PADDING = 140;
const TIMELINE_HEIGHT = 520;
const HORIZONTAL_SCROLL_SPEED = 3.1;
const SCROLL_END_BUFFER_RATIO = 0.16;
const WORKFLOW_PANEL_SCROLL_RATIO = 0.19;
const WORKFLOW_END_BUFFER_RATIO = 0.12;
const PEEK_LABEL_WIDTH = 184;
const ROADMAP_SIMPLE_LIMITS = {
  "in-progress": 4,
  planned: 2,
  scratched: 2,
  completed: 3,
};

let horizontalPinController = null;
let workflowStackCleanup = null;
let horizontalScrollFrame = 0;
let workflowScrollFrame = 0;

function getPointSpacing(count) {
  if (count >= 12) return 240;
  if (count >= 8) return 205;
  if (count >= 5) return 175;
  return POINT_SPACING_BASE;
}

function getBranchWidth(count) {
  const spacing = Math.max(getPointSpacing(count), PEEK_LABEL_WIDTH + 24);
  return count * spacing + TIMELINE_PADDING * 2;
}

function getEndBuffer(ratio = SCROLL_END_BUFFER_RATIO) {
  return Math.round(window.innerHeight * ratio);
}

function truncateTitle(title, max = 34) {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1).trim()}…`;
}

function getHeaderHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  return parseFloat(value) || 68;
}

function branchPath(y, width) {
  return `M 0 ${y} C ${width * 0.28} ${y - 14}, ${width * 0.72} ${y + 14}, ${width} ${y}`;
}

function canUseScrollEffects() {
  return window.matchMedia("(min-width: 760px)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getWorkflowPanels(pin) {
  return [...pin.querySelectorAll(".workflow-window")];
}

function isPinActive(pin) {
  const rect = pin.getBoundingClientRect();
  const top = getHeaderHeight();
  return rect.top <= top + 1 && rect.bottom > window.innerHeight - 1;
}

function initHorizontalPin({ pin, track, scrollViewport, hint, endBufferRatio = SCROLL_END_BUFFER_RATIO, getContentWidth }) {
  if (!pin || !track || !scrollViewport) return null;

  horizontalPinController?.cleanup();

  const state = {
    pinStart: 0,
    maxScroll: 0,
    endBuffer: 0,
    stickyHeight: 0,
    scrollDistance: 0,
  };

  const readContentWidth = () => {
    const measured = getContentWidth?.() ?? track.scrollWidth;
    return Math.max(measured, track.scrollWidth, track.offsetWidth);
  };

  const measure = () => {
    const sticky = pin.querySelector(".hscroll-sticky, .roadmap-sticky");
    if (!sticky) return;

    state.pinStart = pin.offsetTop;
    state.stickyHeight = sticky.offsetHeight;
    state.endBuffer = getEndBuffer(endBufferRatio);
    state.maxScroll = Math.max(0, readContentWidth() - scrollViewport.clientWidth);
    state.scrollDistance = state.maxScroll > 0 ? state.maxScroll / HORIZONTAL_SCROLL_SPEED : 0;

    if (canUseScrollEffects() && state.maxScroll > 8) {
      pin.style.height = `${state.stickyHeight + state.scrollDistance + state.endBuffer}px`;
    } else {
      pin.style.height = "";
      track.style.transform = "";
    }

    hint?.classList.toggle("is-hidden", !canUseScrollEffects() || state.maxScroll <= 8);
  };

  const getScrolled = () => Math.max(0, window.scrollY - state.pinStart);
  const getOffset = () => Math.min(state.maxScroll, getScrolled() * HORIZONTAL_SCROLL_SPEED);
  const getMaxPinScroll = () => state.scrollDistance + state.endBuffer;

  const applyTransform = () => {
    if (!canUseScrollEffects()) return;
    track.style.transform = `translate3d(${-getOffset()}px, 0, 0)`;
    hint?.classList.toggle("is-hidden", getScrolled() >= getMaxPinScroll() - 2);
  };

  const onWheel = (event) => {
    if (!canUseScrollEffects() || state.maxScroll <= 0) return;
    if (!isPinActive(pin)) return;

    const scrolled = getScrolled();
    const delta = event.deltaY;
    const maxPinScroll = getMaxPinScroll();

    if (delta > 0 && scrolled < maxPinScroll) {
      event.preventDefault();
      window.scrollTo({ top: state.pinStart + Math.min(maxPinScroll, scrolled + delta), behavior: "auto" });
      applyTransform();
      return;
    }

    if (delta < 0 && scrolled > 0) {
      event.preventDefault();
      window.scrollTo({ top: state.pinStart + Math.max(0, scrolled + delta), behavior: "auto" });
      applyTransform();
    }
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(horizontalScrollFrame);
    horizontalScrollFrame = requestAnimationFrame(applyTransform);
  };

  const remeasure = () => {
    measure();
    applyTransform();
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("wheel", onWheel, { passive: false });

  const resizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(() => remeasure())
    : null;
  resizeObserver?.observe(track);
  resizeObserver?.observe(scrollViewport);

  const cleanup = () => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", remeasure);
    window.removeEventListener("wheel", onWheel);
    cancelAnimationFrame(horizontalScrollFrame);
    resizeObserver?.disconnect();
  };

  horizontalPinController = { cleanup, remeasure };
  requestAnimationFrame(() => requestAnimationFrame(remeasure));

  return horizontalPinController;
}

function initWorkflowStack() {
  const pin = document.getElementById("workflow");
  const sticky = pin?.querySelector(".workflow-sticky");
  if (!pin || !sticky) return;

  workflowStackCleanup?.();

  const layout = {
    pinStart: 0,
    panelStep: 0,
  };

  const measure = () => {
    const panels = getWorkflowPanels(pin);
    layout.pinStart = pin.offsetTop;
    layout.panelStep = Math.round(window.innerHeight * WORKFLOW_PANEL_SCROLL_RATIO);
    const endBuffer = Math.round(window.innerHeight * WORKFLOW_END_BUFFER_RATIO);

    if (canUseScrollEffects() && panels.length > 0) {
      pin.style.height = `${sticky.offsetHeight + panels.length * layout.panelStep + endBuffer}px`;
    } else {
      pin.style.height = "";
    }
  };

  const update = () => {
    const panels = getWorkflowPanels(pin);
    measure();

    if (!canUseScrollEffects()) {
      panels.forEach((panel, index) => {
        panel.classList.add("is-revealed");
        panel.classList.toggle("is-front", index === panels.length - 1);
        panel.style.zIndex = String(index + 1);
      });
      return;
    }

    const scrolled = Math.max(0, window.scrollY - layout.pinStart);
    const activeIndex = Math.min(panels.length - 1, Math.floor(scrolled / layout.panelStep));

    panels.forEach((panel, index) => {
      const isRevealed = index <= activeIndex;
      panel.classList.toggle("is-revealed", isRevealed);
      panel.classList.toggle("is-front", index === activeIndex);
      panel.style.zIndex = String(index + 1);
    });
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(workflowScrollFrame);
    workflowScrollFrame = requestAnimationFrame(update);
  };

  const remeasure = () => {
    measure();
    update();
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", remeasure);

  workflowStackCleanup = () => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", remeasure);
    cancelAnimationFrame(workflowScrollFrame);
  };

  remeasure();
}

function renderRoadmapSimple(grouped, container) {
  if (!container) return;

  container.innerHTML = ROADMAP_BRANCHES.map((branch) => {
    const branchItems = grouped[branch.status];
    const limit = ROADMAP_SIMPLE_LIMITS[branch.status] ?? 3;
    const visibleItems = branchItems.slice(-limit);
    const hiddenCount = Math.max(0, branchItems.length - visibleItems.length);

    const itemsMarkup = visibleItems.map((item) => `
      <li class="roadmap-simple__item roadmap-simple__item--${branch.status}">
        <time datetime="${item.date}">${item.dateLabel}</time>
        <span class="roadmap-simple__title">${item.title}</span>
      </li>
    `).join("");

    const moreMarkup = hiddenCount > 0
      ? `<li class="roadmap-simple__more">+${hiddenCount} more on <a href="https://discord.gg/GgXHsHGZ3" target="_blank" rel="noopener noreferrer">Discord</a></li>`
      : "";

    return `
      <section class="roadmap-simple__group roadmap-simple__group--${branch.status}">
        <h3 class="roadmap-simple__heading">${branch.label}</h3>
        <ul class="roadmap-simple__list">
          ${itemsMarkup}
          ${moreMarkup}
        </ul>
      </section>
    `;
  }).join("");
}

function renderRoadmapTimeline(grouped) {
  const canvas = document.getElementById("roadmapCanvas");
  const timeline = document.getElementById("roadmapTimeline");
  const labels = document.getElementById("roadmapLabels");
  const points = document.getElementById("roadmapPoints");
  if (!canvas || !timeline || !labels || !points) return;

  const timelineWidth = Math.max(
    720,
    ...ROADMAP_BRANCHES.map((branch) => getBranchWidth(grouped[branch.status].length)),
  );

  canvas.setAttribute("viewBox", `0 0 ${timelineWidth} ${TIMELINE_HEIGHT}`);
  canvas.setAttribute("preserveAspectRatio", "xMinYMid meet");
  canvas.style.width = `${timelineWidth}px`;
  canvas.style.height = `${TIMELINE_HEIGHT}px`;
  timeline.style.width = `${timelineWidth}px`;
  timeline.style.height = `${TIMELINE_HEIGHT}px`;

  const track = document.getElementById("roadmapTrack");
  if (!track) return;
  track.style.width = `${timelineWidth}px`;

  canvas.querySelectorAll("path.roadmap-branch").forEach((node) => node.remove());
  labels.innerHTML = "";
  points.innerHTML = "";

  ROADMAP_BRANCHES.forEach((branch) => {
    const branchItems = grouped[branch.status];
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", branchPath(branch.y, timelineWidth));
    path.setAttribute("class", `roadmap-branch roadmap-branch--${branch.status}`);
    path.setAttribute("id", `roadmap-path-${branch.status}`);
    path.setAttribute("stroke", branch.stroke);
    canvas.appendChild(path);

    const label = document.createElement("p");
    label.className = `roadmap-label roadmap-label--${branch.status}`;
    label.style.top = `${(branch.y / TIMELINE_HEIGHT) * 100}%`;
    label.textContent = branch.label;
    labels.appendChild(label);

    branchItems.forEach((item, index) => {
      const length = path.getTotalLength();
      const ratio = branchItems.length === 1 ? 0.5 : index / (branchItems.length - 1);
      const at = length * (0.1 + ratio * 0.82);
      const { x, y } = path.getPointAtLength(at);

      const point = document.createElement("button");
      point.type = "button";
      point.className = `roadmap-point roadmap-point--${branch.status}`;
      point.style.left = `${x}px`;
      point.style.top = `${y}px`;
      point.setAttribute("data-status", branch.status);
      point.setAttribute("aria-label", `${item.title} — ${item.dateLabel}`);

      point.innerHTML = `
        <span class="roadmap-point__marker">
          <span class="roadmap-point__dot" style="--point-color: ${branch.color}"></span>
        </span>
        <span class="roadmap-point__peek">
          <time datetime="${item.date}">${item.dateLabel}</time>
          <span class="roadmap-point__peek-title">${truncateTitle(item.title)}</span>
        </span>
        <span class="roadmap-point__card">
          <span class="roadmap-point__status">${branch.label}</span>
          <span class="roadmap-point__module">${item.module}</span>
          <span class="roadmap-point__title">${item.title}</span>
        </span>
      `;

      points.appendChild(point);
    });
  });

  initHorizontalPin({
    pin: document.getElementById("roadmap"),
    track,
    scrollViewport: document.getElementById("roadmapScroll"),
    hint: document.querySelector(".roadmap-scroll-hint"),
    endBufferRatio: SCROLL_END_BUFFER_RATIO,
    getContentWidth: () => timelineWidth,
  });
}

function renderRoadmap() {
  const items = window.LLP_ROADMAP;
  const canvas = document.getElementById("roadmapCanvas");
  const timeline = document.getElementById("roadmapTimeline");
  const labels = document.getElementById("roadmapLabels");
  const points = document.getElementById("roadmapPoints");
  const richRail = document.getElementById("roadmapRich");
  const simple = document.getElementById("roadmapSimple");
  const pin = document.getElementById("roadmap");
  if (!items?.length || !canvas || !timeline || !labels || !points || !richRail || !simple || !pin) return;

  const grouped = Object.fromEntries(
    ROADMAP_BRANCHES.map((branch) => [
      branch.status,
      items.filter((item) => item.status === branch.status).sort((a, b) => a.date.localeCompare(b.date)),
    ]),
  );

  if (!canUseScrollEffects()) {
    horizontalPinController?.cleanup();
    pin.style.height = "";
    richRail.hidden = true;
    simple.hidden = false;
    renderRoadmapSimple(grouped, simple);
    return;
  }

  richRail.hidden = false;
  richRail.removeAttribute("hidden");
  simple.hidden = true;
  renderRoadmapTimeline(grouped);
  horizontalPinController?.remeasure?.();
}

let roadmapResizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(roadmapResizeTimer);
  roadmapResizeTimer = setTimeout(() => {
    renderRoadmap();
    initWorkflowStack();
  }, 150);
});

document.addEventListener("DOMContentLoaded", () => {
  renderRoadmap();
  initWorkflowStack();
});
