// src/utils/initSidebarToolbar.js
//
// Injects a utility toolbar at the top of the doc sidebar (before the menu
// tree). Vanilla JS, no React coupling.
//
// Tools: Expand All | Collapse All | Copy Link | Theme Color
//   (the former "Edit this page" slot now hosts the theme-color picker — same
//    32px icon footprint, no layout change.)
//
// Injected once per sidebar container; survives route changes because the
// observer catches sidebar rebuilds and re-injects automatically.

const TOOLBAR_ID = 'sb-toolbar';
const COPY_FEEDBACK_MS = 1500;

// ---------------------------------------------------------------------------
// i18n — detect locale from <html lang="...">, fall back to 'en'
// ---------------------------------------------------------------------------
const T = {
  en: {
    expand: 'Expand all',
    collapse: 'Collapse all',
    link: 'Copy page link',
    color: 'Theme color',
  },
  'zh-Hans': {
    expand: '展开全部',
    collapse: '折叠全部',
    link: '复制页面链接',
    color: '主题颜色',
  },
};

function getLocale() {
  const lang = document.documentElement.lang || 'en';
  return T[lang] ? lang : 'en';
}

function t(key) {
  return T[getLocale()][key];
}

// ---------------------------------------------------------------------------
// SVG icons (18×18, currentColor)
// ---------------------------------------------------------------------------
const ICONS = {
  expand:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7 9 11 13 7"/><path d="M5 12h8"/></svg>',
  collapse:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11 9 7 13 11"/><path d="M5 6h8"/></svg>',
  link:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 10.5a3 3 0 0 0 4.2.4l1.8-1.8a3 3 0 0 0-4.2-4.2L7.9 6.1"/><path d="M10.5 7.5a3 3 0 0 0-4.2-.4l-1.8 1.8a3 3 0 0 0 4.2 4.2l1.4-1.4"/></svg>',
  color:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 2.5 2.5 0 0 0 2.5-2.5c0-.66-.26-1.26-.68-1.7-.4-.43-.65-.99-.65-1.6A2.3 2.3 0 0 1 15.5 13H17a5 5 0 0 0 5-5c0-3.3-3.6-6-10-6z"/><circle cx="7.5" cy="10.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="16.5" cy="10.5" r="1.3" fill="currentColor" stroke="none"/></svg>',
  check:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l3 3 7-7"/></svg>',
};

// ---------------------------------------------------------------------------
// Theme-color picker (mounted inside the toolbar's last slot)
// ---------------------------------------------------------------------------
const COLOR_STORAGE_KEY = 'theme-color';

const COLORS = [
  {id: 'blue', label: 'Blue'},
  {id: 'cyan', label: 'Cyan'},
  {id: 'orange', label: 'Orange'},
  {id: 'purple', label: 'Purple'},
  {id: 'green', label: 'Green'},
];

function currentColor() {
  return document.documentElement.getAttribute('data-theme-color') || 'blue';
}

function applyColor(id) {
  document.documentElement.setAttribute('data-theme-color', id);
  try {
    localStorage.setItem(COLOR_STORAGE_KEY, id);
  } catch (e) {
    /* localStorage may be unavailable (private mode) — attribute still applies */
  }
  updateActiveSwatch();
}

function updateActiveSwatch(toolbar) {
  const active = currentColor();
  const scope = toolbar || document;
  scope.querySelectorAll('[data-color]').forEach((sw) => {
    const isActive = sw.dataset.color === active;
    sw.classList.toggle('theme-color-swatch--active', isActive);
    sw.setAttribute('aria-pressed', String(isActive));
  });
}

// Build the color-picker slot: a toolbar button that opens a swatch popover.
// Marked data-color-slot so the click handlers below can find it.
function buildColorSlot() {
  const swatches = COLORS.map(
    (c, i) =>
      `<button type="button" class="theme-color-swatch theme-color-swatch--${c.id}" data-color="${c.id}" style="--n:${i}" title="${c.label}" aria-label="${c.label}" aria-pressed="false"><svg class="theme-color-check" width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l3 3 7-7"/></svg></button>`
  ).join('');

  return `
    <div class="theme-color-slot" data-color-slot>
      <button class="sb-toolbar-btn" type="button" data-color-toggle title="${t('color')}" aria-label="${t('color')}" aria-haspopup="true" aria-expanded="false">
        ${ICONS.color}
      </button>
      <div class="theme-color-popover" role="menu" hidden>
        ${swatches}
      </div>
    </div>`;
}

// Toggle the popover open/closed with an exit animation. Same race-guarded
// logic the navbar picker used: toggle on the --open class (visual state), not
// on `hidden` (which only flips after the exit animation finishes).
function setPopoverOpen(slot, open) {
  const btn = slot.querySelector('[data-color-toggle]');
  const pop = slot.querySelector('.theme-color-popover');
  if (!btn || !pop) return;

  if (pop._closeTimer) {
    clearTimeout(pop._closeTimer);
    pop._closeTimer = 0;
  }

  btn.setAttribute('aria-expanded', String(open));

  if (open) {
    pop.hidden = false;
    void pop.offsetWidth; // force reflow so the transition runs
    pop.classList.add('theme-color-popover--open');
  } else {
    pop.classList.remove('theme-color-popover--open');
    if (pop.hidden) return;
    const finish = () => {
      pop._closeTimer = 0;
      // Aborted: reopened before this close finished — don't hide.
      if (pop.classList.contains('theme-color-popover--open')) return;
      pop.hidden = true;
    };
    // Only trust the popover's OWN transform ending — swatch transitionends
    // bubble up here and would fire finish() far too early.
    const onEnd = (e) => {
      if (e.target === pop && e.propertyName === 'transform') finish();
    };
    pop.addEventListener('transitionend', onEnd, {once: true});
    pop._closeTimer = setTimeout(finish, 620);
  }
}

// ---------------------------------------------------------------------------
// Tool logic
// ---------------------------------------------------------------------------

// Expand all collapsed sidebar categories.
//
// Scoped to .menu so it can NEVER match the toolbar's own buttons — the
// theme-color toggle carries aria-expanded="false" too, and clicking it opens
// the color popover (the "second expand toggles theme color" bug). The toolbar
// is a sibling of .menu, so .menu [aria-expanded] reaches only the real
// category controls: the sublist link (no-href categories) and the caret
// button (categories with an href), both of which toggle on click.
function expandAll(sidebarRoot) {
  const collapsed = sidebarRoot.querySelectorAll(
    '.menu [aria-expanded="false"]'
  );
  collapsed.forEach((el) => el.click());
}

// Collapse all expanded sidebar categories. Same scoping as expandAll.
function collapseAll(sidebarRoot) {
  const expanded = sidebarRoot.querySelectorAll(
    '.menu [aria-expanded="true"]'
  );
  expanded.forEach((el) => el.click());
}

// Copy current page URL to clipboard with visual feedback (icon → ✓ for 1.5s).
function copyLink(btn) {
  navigator.clipboard.writeText(location.href).then(() => {
    const svg = btn.querySelector('svg');
    if (!svg) return;
    const original = svg.outerHTML;
    svg.outerHTML = ICONS.check;
    setTimeout(() => {
      const s = btn.querySelector('svg');
      if (s) s.outerHTML = original;
    }, COPY_FEEDBACK_MS);
  });
}

// ---------------------------------------------------------------------------
// Build & inject
// ---------------------------------------------------------------------------

function buildToolbarHTML() {
  return `
    <div id="${TOOLBAR_ID}" class="sb-toolbar">
      <button class="sb-toolbar-btn" data-action="expand" title="${t('expand')}">
        ${ICONS.expand}
      </button>
      <button class="sb-toolbar-btn" data-action="collapse" title="${t('collapse')}">
        ${ICONS.collapse}
      </button>
      <button class="sb-toolbar-btn" data-action="link" title="${t('link')}">
        ${ICONS.link}
      </button>
      ${buildColorSlot()}
    </div>`;
}

// Single delegated click handler for the whole toolbar.
function handleToolbarClick(e, sidebarRoot) {
  // Color swatch selection (inside the popover).
  const sw = e.target.closest('[data-color]');
  if (sw) {
    applyColor(sw.dataset.color);
    const slot = sw.closest('[data-color-slot]');
    if (slot) setPopoverOpen(slot, false);
    return;
  }

  // Color picker toggle button.
  const toggle = e.target.closest('[data-color-toggle]');
  if (toggle) {
    e.stopPropagation();
    const slot = toggle.closest('[data-color-slot]');
    if (slot) {
      const pop = slot.querySelector('.theme-color-popover');
      const isOpen = pop && pop.classList.contains('theme-color-popover--open');
      setPopoverOpen(slot, !isOpen);
    }
    return;
  }

  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  switch (btn.dataset.action) {
    case 'expand':
      expandAll(sidebarRoot);
      break;
    case 'collapse':
      collapseAll(sidebarRoot);
      break;
    case 'link':
      copyLink(btn);
      break;
  }
}

// Insert toolbar at the top of the sidebar card, before <nav class="menu">.
function injectInto(sidebarRoot) {
  if (sidebarRoot.dataset.sbToolbarInjected) return;

  const card = sidebarRoot.querySelector(':scope > div > div');
  const menu = sidebarRoot.querySelector(':scope > div > div > .menu');

  if (!card || !menu) return;

  card.insertAdjacentHTML('afterbegin', buildToolbarHTML());

  const toolbar = card.querySelector(`#${TOOLBAR_ID}`);
  if (!toolbar) return;

  // Stop toolbar clicks (esp. the popover toggle) from closing the popover via
  // the document-level outside-click listener.
  toolbar.addEventListener('click', (e) => e.stopPropagation());
  toolbar.addEventListener('click', (e) => handleToolbarClick(e, sidebarRoot));

  // Close the popover on outside click / Escape.
  document.addEventListener('click', (e) => {
    const slot = toolbar.querySelector('[data-color-slot]');
    if (!slot) return;
    if (!slot.contains(e.target)) setPopoverOpen(slot, false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const slot = toolbar.querySelector('[data-color-slot]');
      if (slot) setPopoverOpen(slot, false);
    }
  });

  updateActiveSwatch(toolbar);

  sidebarRoot.dataset.sbToolbarInjected = '1';
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

const SIDEBAR = '.theme-doc-sidebar-container';

export default function initSidebarToolbar() {
  const injected = new WeakSet();

  let scanRaf = 0;
  const scan = () => {
    if (scanRaf) return;
    scanRaf = requestAnimationFrame(() => {
      scanRaf = 0;
      document.querySelectorAll(SIDEBAR).forEach((root) => {
        if (!injected.has(root)) {
          injectInto(root);
          injected.add(root);
        }
      });
    });
  };

  // Initial scan.
  scan();

  // Watch sidebar containers for DOM changes (childList catches menu rebuilds
  // on route changes, where the old .menu is replaced — we need to re-inject).
  const structObserver = new MutationObserver(() => {
    document.querySelectorAll(SIDEBAR).forEach((root) => {
      // Check if toolbar was lost (element no longer in DOM).
      const toolbar = root.querySelector(`#${TOOLBAR_ID}`);
      if (!toolbar && root.dataset.sbToolbarInjected) {
        delete root.dataset.sbToolbarInjected;
        injected.delete(root);
      }
    });
    scan();
  });

  document.querySelectorAll(SIDEBAR).forEach((root) => {
    structObserver.observe(root, { childList: true, subtree: true });
  });

  // Catch brand-new sidebar containers.
  const bodyObserver = new MutationObserver(() => {
    document.querySelectorAll(SIDEBAR).forEach((root) => {
      structObserver.observe(root, { childList: true, subtree: true });
    });
    scan();
  });
  bodyObserver.observe(document.body, { childList: true });

  return () => {
    structObserver.disconnect();
    bodyObserver.disconnect();
    if (scanRaf) cancelAnimationFrame(scanRaf);
    // Remove all injected toolbars.
    document.querySelectorAll(`#${TOOLBAR_ID}`).forEach((el) => el.remove());
    document.querySelectorAll(SIDEBAR).forEach((root) => {
      delete root.dataset.sbToolbarInjected;
    });
  };
}
