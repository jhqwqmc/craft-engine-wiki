// src/theme/Root.js
// Client-side root wrapper:
//   • tags sidebar folders with depth/active classes (avoids :has() cost)
//   • installs an overlay scrollbar on the doc sidebar

import React from 'react';
import initSidebarOverlayScrollbar from '../utils/initSidebarOverlayScrollbar';
import initSidebarActiveFolder from '../utils/initSidebarActiveFolder';

export default function Root({children}) {
  React.useEffect(() => {
    const cleanupActive = initSidebarActiveFolder();
    const cleanupScroll = initSidebarOverlayScrollbar();
    return () => {
      cleanupActive();
      cleanupScroll();
    };
  }, []);

  return <>{children}</>;
}
