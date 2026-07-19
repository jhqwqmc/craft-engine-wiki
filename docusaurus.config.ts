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
  url: 'https://ce.gtemc.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  scripts: [{src: "https://wzfx.gtemc.cn/js/script.js", defer: true, 'data-domain': 'ce.gtemc.cn',}],

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
      innerHTML: (() => {
        const t = process.env.DOCUSAURUS_CURRENT_LOCALE === 'zh-Hans'
            ? {
              title: '切换到预览站点',
              message: '检测到您正在访问正式站点，是否跳转到预览站点 ce-pre.gtemc.cn？当前网站内容大幅落后于预览网站，如果你发现缺少内容请浏览预览网站。',
              confirm: '跳转',
              cancel: '留在本站',
              remember: '不再提示',
            }
            : {
              title: 'Switch to preview site',
              message: 'You are on the production site. Redirect to the preview site ce-pre.gtemc.cn? The content on this site is significantly behind the preview site — if you notice anything missing, please check the preview site.',
              confirm: 'Redirect',
              cancel: 'Stay here',
              remember: "Don't ask again",
            };
        return `
      try {
        var DISABLE_KEY = 'redirect-popup-disabled';
        if (localStorage.getItem(DISABLE_KEY) !== 'true') {
          var texts = ${JSON.stringify(t)};
          var showModal = function () {
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;';
            var modal = document.createElement('div');
            modal.style.cssText = 'background:#fff;color:#1c1e21;border-radius:8px;padding:24px;max-width:360px;width:90%;box-shadow:0 4px 20px rgba(0,0,0,0.2);';
            var title = document.createElement('h3');
            title.style.cssText = 'margin:0 0 12px;font-size:18px;';
            title.textContent = texts.title;
            var message = document.createElement('p');
            message.style.cssText = 'margin:0 0 16px;font-size:14px;line-height:1.5;';
            message.textContent = texts.message;
            var label = document.createElement('label');
            label.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:16px;cursor:pointer;';
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(texts.remember));
            var buttonRow = document.createElement('div');
            buttonRow.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';
            var cancelBtn = document.createElement('button');
            cancelBtn.textContent = texts.cancel;
            cancelBtn.style.cssText = 'padding:8px 16px;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;cursor:pointer;font-size:14px;';
            var confirmBtn = document.createElement('button');
            confirmBtn.textContent = texts.confirm;
            confirmBtn.style.cssText = 'padding:8px 16px;border:none;border-radius:4px;background:#3578e5;color:#fff;cursor:pointer;font-size:14px;';
            var persistIfChecked = function () {
              if (checkbox.checked) {
                try { localStorage.setItem(DISABLE_KEY, 'true'); } catch (_) {}
              }
            };
            cancelBtn.onclick = function () {
              persistIfChecked();
              overlay.remove();
            };
            confirmBtn.onclick = function () {
              persistIfChecked();
              window.location.replace('https://ce-pre.gtemc.cn' + window.location.pathname + window.location.search + window.location.hash);
            };
            buttonRow.appendChild(cancelBtn);
            buttonRow.appendChild(confirmBtn);
            modal.appendChild(title);
            modal.appendChild(message);
            modal.appendChild(label);
            modal.appendChild(buttonRow);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
          };
          if (document.body) {
            showModal();
          } else {
            document.addEventListener('DOMContentLoaded', showModal);
          }
        }
      } catch (_) {}
    `;
      })(),
    },
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
