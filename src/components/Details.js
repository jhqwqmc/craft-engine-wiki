// src/components/Details.js
// A modern collapsible card with a GitHub-style "peek then expand" behavior.
// Collapsed: a truncated preview (capped height) with a bottom fade and a
// centered "Read more" button overlaid. Expanded: full content.
//
// The transition is driven by the measured full content height (not a fake
// 9999px), so collapsing/expanding is smooth with no "empty travel" or jank.
//
// Usage:
//   <Details summary="Full Config Overview"> ... </Details>
//   <Details summary="..." previewHeight={220}> ... </Details>
//   <Details summary="..." defaultOpen> ... </Details>

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from './Details.module.css';

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" width="16" height="16"
      aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export default function Details({
  summary,
  children,
  defaultOpen = false,
  previewHeight = 200,
  moreLabel = 'Read more',
  lessLabel = 'Show less',
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(null);
  const contentRef = useRef(null);

  // Padding around the content. Long content reserves room for the bottom
  // "Read more" button; short content uses a tight padding.
  const PAD_TOP = 16;
  const PAD_BOTTOM_LONG = 48;
  const PAD_BOTTOM_SHORT = 18;

  // Short content fits entirely within the preview height — no truncation,
  // no fade, no "Read more" affordance. Behaves like a plain disclosure.
  const short = contentHeight != null && contentHeight + PAD_TOP + PAD_BOTTOM_LONG <= previewHeight;
  const padBottom = short ? PAD_BOTTOM_SHORT : PAD_BOTTOM_LONG;
  const fullHeight = contentHeight != null ? contentHeight + PAD_TOP + padBottom : null;

  // Measure the natural height of the inner content (padding-free wrapper) so
  // the short/long decision is stable and doesn't oscillate as padding changes.
  const measure = () => {
    const el = contentRef.current;
    if (!el) return;
    setContentHeight(el.scrollHeight);
  };

  useLayoutEffect(() => {
    measure();
  }, [children]);

  // Short content defaults to expanded — there's nothing to "peek", so showing
  // it collapsed would be pointless. Runs before paint, so no flash.
  useLayoutEffect(() => {
    if (short && !open) setOpen(true);
  }, [short]);

  useEffect(() => {
    // Keep the measured height honest when the viewport / content reflows.
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Animate to the precise target height. Short content is never clamped.
  // Before the first measurement, leave the height unconstrained if
  // defaultOpen (avoids a flash-collapsed frame) or clamped to previewHeight.
  const bodyStyle = {};
  if (fullHeight != null) {
    if (short) {
      bodyStyle.maxHeight = open ? `${fullHeight}px` : '0px';
    } else {
      bodyStyle.maxHeight = open ? `${fullHeight}px` : `${previewHeight}px`;
    }
  } else if (!defaultOpen) {
    bodyStyle.maxHeight = `${previewHeight}px`;
  }

  return (
    <div className={`${styles.details} ${open ? styles.open : ''} ${short ? styles.short : ''}`}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.summary}>{summary}</span>
        <span className={styles.toggleChip} aria-hidden="true">
          <span className={styles.toggleText}>{open ? lessLabel : moreLabel}</span>
          <Chevron />
        </span>
      </button>

      <div className={styles.body} style={bodyStyle}>
        <div
          className={styles.bodyInner}
          style={{ padding: `${PAD_TOP}px 18px ${padBottom}px 18px` }}
        >
          <div ref={contentRef}>{children}</div>
        </div>

        {!open && !short && <div className={styles.fade} aria-hidden="true" />}

        {!short && (
          <div className={styles.moreWrap}>
            <button
              type="button"
              className={styles.more}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? lessLabel : moreLabel}</span>
              <svg
                className={`${styles.moreChevron} ${open ? styles.moreChevronUp : ''}`}
                viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
