// src/utils/initSidebarToolbar.js
//
// Injects a utility toolbar at the top of the doc sidebar (before the menu
// tree). Four tools in a compact row, vanilla JS, no React coupling.
//
// Tools: Expand All | Collapse All | Copy Link | Edit Page
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
    edit: 'Edit this page',
  },
  'zh-Hans': {
    expand: '展开全部',
    collapse: '折叠全部',
    link: '复制页面链接',
    edit: '编辑此页',
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
  edit:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l3 3-9 9H3v-3l9-9z"/></svg>',
  check:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l3 3 7-7"/></svg>',
};

// ---------------------------------------------------------------------------
// Tool logic
// ---------------------------------------------------------------------------

// Expand all collapsed categories in the sidebar.
function expandAll(sidebarRoot) {
  const collapsed = sidebarRoot.querySelectorAll('[aria-expanded="false"]');
  collapsed.forEach((el) => el.click());
}

// Collapse all expanded categories in the sidebar.
function collapseAll(sidebarRoot) {
  const expanded = sidebarRoot.querySelectorAll('[aria-expanded="true"]');
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

// Open the "Edit this page" link for the current doc.
function editPage(btn) {
  const editLink = document.querySelector('.theme-edit-this-page');
  if (editLink) {
    editLink.click();
  } else {
    btn.style.display = 'none';
  }
}

// Check whether an edit link exists; hide button if not.
function refreshEditButton(btn) {
  btn.style.display = document.querySelector('.theme-edit-this-page') ? '' : 'none';
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
      <button class="sb-toolbar-btn" data-action="edit" title="${t('edit')}">
        ${ICONS.edit}
      </button>
    </div>`;
}

// Single delegated click handler for the whole toolbar.
function handleToolbarClick(e, sidebarRoot) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case 'expand':
      expandAll(sidebarRoot);
      break;
    case 'collapse':
      collapseAll(sidebarRoot);
      break;
    case 'link':
      copyLink(btn);
      break;
    case 'edit':
      editPage(btn);
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

  toolbar.addEventListener('click', (e) => handleToolbarClick(e, sidebarRoot));

  // Hide edit button if no edit link exists on this page.
  const editBtn = toolbar.querySelector('[data-action="edit"]');
  if (editBtn) refreshEditButton(editBtn);

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
      // Refresh edit button visibility on route change.
      const tb = root.querySelector(`#${TOOLBAR_ID}`);
      if (tb) {
        const editBtn = tb.querySelector('[data-action="edit"]');
        if (editBtn) refreshEditButton(editBtn);
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
