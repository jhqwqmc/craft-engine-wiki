// src/theme/Icon/SystemColorMode/index.js
// Overrides Docusaurus' built-in "follow system" color-mode icon (a half-filled
// circle) with a monitor icon — a clearer "match the system/display" affordance.
// Resolved before @docusaurus/theme-classic's default via theme aliasing.

import React from 'react';

export default function IconSystemColorMode(props) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <path
        fill="currentColor"
        d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6v2H7v2h10v-2h-2v-2h6c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
      />
    </svg>
  );
}
