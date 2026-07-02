import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'XiaoMoMi Plugins',

  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://ce-pre.gtemc.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  scripts: [{src: "https://wzfx.gtemc.cn/js/script.js", defer: true, 'data-domain': 'ce-pre.gtemc.cn',}],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Xiao-MoMi', // Usually your GitHub org/user name.
  projectName: 'craft-engine-wiki', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },

  // Reapply saved theme preferences BEFORE first paint so the navbar/active
  // states don't flash defaults on reload. The pickers (initThemeColorPicker,
  // initSidebarToolbar) own these attributes thereafter; this only sets them
  // early. Runs in <head>, before React mounts.
  headTags: [
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `
      try {
        const themeColor = localStorage.getItem('theme-color');
        if (themeColor) {
          document.documentElement.setAttribute('data-theme-color', themeColor);
        }
      } catch (_) {}
      try {
        const eyeCare = localStorage.getItem('eyecare');
        if (eyeCare) {
          document.documentElement.setAttribute('data-eyecare', eyeCare);
        }
      } catch (_) {}
      `,
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/Xiao-MoMi/craft-engine-wiki/edit/main/',
          editLocalizedFiles: true,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    navbar: {
      title: 'XiaoMoMi Plugins',
      logo: {
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://discord.gg/xiaomomi',
          label: 'Discord',
          position: 'right',
          className: 'navbar-discord-link',
          'aria-label': 'Discord',
        },
        {
          href: 'https://qm.qq.com/q/OrZULZbRKO',
          label: 'QQ',
          position: 'right',
          className: 'navbar-qq-link',
          'aria-label': 'QQ',
        },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java'],
    },
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    zoom: {
      selector: '.markdown img',
      background: {
        light: 'rgba(255,255,255,0.8)',
        dark: 'rgba(36,36,36,0.8)',
      },
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ["en", "zh"],
        searchBarShortcutKeymap: "ctrl+shift+f",
        docsRouteBasePath: "/",
      }),
    ],
    'docusaurus-plugin-image-zoom',
  ],
};

export default config;
