// src/utils/initSidebarActiveFolder.js
//
// Marks the sidebar folder that directly contains the active doc with plain
// classes — so CSS can style the active rail WITHOUT `:has()` selectors,
// which are expensive to re-evaluate on a large (~200-item) sidebar.
//
// Classes written (on <ul class="menu__list">):
//   osb-active-folder  — this list directly contains the active page's <li>
//   osb-depth-N         — nesting depth (1..4), so the rail can darken by level
//
// When it (re)runs:
//   • on mount
//   • whenever the sidebar's structure changes (route changes rebuild it) via
//     a childList MutationObserver
//   • whenever a `class` attribute changes inside the sidebar (the active
//     item's class flips on navigation) — scoped to `class` only so hover-driven
//     aria-expanded changes don't trigger a refresh.
//   • a one-shot deferred refresh to catch post-hydration class application.
// All refreshes are coalesced via requestAnimationFrame.

const SIDEBAR = '.theme-doc-sidebar-container';
const MENU_LIST = 'ul.menu__list';
const ACTIVE_LINK = '.menu__link--active';
const MAX_DEPTH = 4;

// Tag every nested menu__list with its depth (1 = first nested list, i.e. a
// top-level category's children; the root <ul> under <nav class="menu"> is not
// a "folder panel" and stays untagged).
function tagDepths(root) {
  const rootUl = root.querySelector(MENU_LIST);
  if (!rootUl) return;

  const walk = (list, depth) => {
    if (!list || depth > MAX_DEPTH) return;
    list.classList.add(`osb-depth-${depth}`);
    const childLists = list.querySelectorAll(
      ':scope > .menu__list-item > ' + MENU_LIST
    );
    childLists.forEach((child) => walk(child, depth + 1));
  };

  const childLists = rootUl.querySelectorAll(
    ':scope > .menu__list-item > ' + MENU_LIST
  );
  childLists.forEach((child) => walk(child, 1));
}

// Mark the folder that directly owns the active page. Only that level lights up;
// ancestors stay grey.
//
// Docusaurus marks EVERY ancestor category link as `.menu__link--active` when a
// descendant doc is open (e.g. Configuration > Item > Item Models > Model are
// all active). We want the DEEPEST active link — the one whose <li> does not
// contain another active link — because that's the level actually owning the
// current page. `querySelector` returns the FIRST (outermost) one, which would
// wrongly point at a root-level category whose <ul> has no depth class.
function markActive(root) {
  // Clear previous active marks.
  root.querySelectorAll(MENU_LIST).forEach((list) => {
    list.classList.remove('osb-active-folder');
  });

  const activeLinks = root.querySelectorAll(ACTIVE_LINK);
  if (activeLinks.length === 0) return;

  // Pick the innermost active link. Docusaurus marks every ancestor category
  // link active too, so an ancestor <li> contains MULTIPLE active links (its
  // own + the descendant's). The owning <li> of the current page contains
  // exactly ONE active link — itself. So pick the active link whose <li> has
  // only one active link inside it.
  let chosen = null;
  activeLinks.forEach((link) => {
    const li = link.closest('.menu__list-item');
    if (!li) return;
    const count = li.querySelectorAll(ACTIVE_LINK).length;
    if (count > 1) return; // ancestor category — skip
    if (!chosen) chosen = {link, li};
  });

  // Fallback: last active link in document order.
  if (!chosen) {
    const link = activeLinks[activeLinks.length - 1];
    const li = link.closest('.menu__list-item');
    if (li) chosen = {link, li};
  }
  if (!chosen) return;

  const owningUl = chosen.li.parentElement;
  if (owningUl && owningUl.classList.contains('menu__list')) {
    owningUl.classList.add('osb-active-folder');
  }
}

let rafId = 0;
function refresh() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    document.querySelectorAll(SIDEBAR).forEach((root) => {
      tagDepths(root);
      markActive(root);
    });
  });
}

export default function initSidebarActiveFolder() {
  refresh();

  // One structure observer per sidebar container. We watch:
  //   • childList + subtree — catches route-change rebuilds and lazy-mounted
  //     collapsible <ul>s appearing.
  //   • attributes filtered to `class` only — catches the active item's class
  //     flipping on navigation. Filtering to `class` keeps hover-driven
  //     aria-expanded / style mutations from firing.
  const observer = new MutationObserver(refresh);
  const roots = new Set();

  const observeRoot = (root) => {
    if (roots.has(root)) return;
    roots.add(root);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributeFilter: ['class'],
    });
  };

  document.querySelectorAll(SIDEBAR).forEach(observeRoot);

  // Catch sidebar containers that appear after first paint (first client
  // render / route changes that swap the whole sidebar).
  const bodyObserver = new MutationObserver(() => {
    document.querySelectorAll(SIDEBAR).forEach(observeRoot);
    refresh();
  });
  bodyObserver.observe(document.body, {childList: true, subtree: false});

  // Deferred safety net: React may apply the active class slightly after the
  // initial mount effect runs. Re-check once after hydration settles.
  const deferred = setTimeout(refresh, 300);

  return () => {
    observer.disconnect();
    bodyObserver.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(deferred);
    roots.clear();
  };
}
