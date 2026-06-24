// src/components/AnnotatedYaml.js
// A modern, copyable YAML code block. Each line carries an optional trailing
// `note` (rendered as a `#` comment on the same line, aligned) and/or a `to`
// link (rendered as a trailing ↗ that opens the detail page). Text stays
// selectable; a header "copy" button copies the raw YAML. Colors reuse the
// shared `.language-yaml .token.*` palette from src/css/custom.css.

import React, { useState, useRef, useMemo } from 'react';
import Link from '@docusaurus/Link';
import styles from './AnnotatedYaml.module.css';
import { renderYamlLine } from './yamlTokens';

function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const copy = (text) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      }).catch(() => {});
    }
  };
  return { copied, copy };
}

// Build the display string for one line: code + optional aligned `#` note.
// Notes are padded so the `#` columns line up across the block.
function buildLine(code, note, maxCodeWidth) {
  if (!note) return { display: code };
  const padding = Math.max(1, maxCodeWidth - code.length + 2);
  return { display: `${code}${' '.repeat(padding)}# ${note}` };
}

export default function AnnotatedYaml({ lines = [] }) {
  const { copied, copy } = useCopy();

  // Longest code length (without note) → alignment column for `#`.
  const maxCodeWidth = useMemo(
    () => lines.reduce((m, l) => Math.max(m, l.code.length), 0),
    [lines]
  );

  const built = useMemo(
    () => lines.map((l) => ({ ...l, ...buildLine(l.code, l.note, maxCodeWidth) })),
    [lines, maxCodeWidth]
  );

  const rawYaml = useMemo(
    () => built.map((l) => l.display).join('\n'),
    [built]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.lang}>YAML</span>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={() => copy(rawYaml)}
          aria-label="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className={styles.body}>
        <pre className={`language-yaml ${styles.pre}`}>
          <code>
            {built.map((line, i) => (
              <span key={i} className={styles.row}>
                <span className={`${styles.code} language-yaml`}>
                  {line.display.length ? renderYamlLine(line.display) : ' '}
                </span>
                {line.to && (
                  <Link to={line.to} className={styles.link} title="Open detail page" aria-label="Open detail page">
                    ↗
                  </Link>
                )}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
