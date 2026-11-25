// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

// Font Awesome brand icon (CC BY 4.0) rendered as inline SVG.
const iconSvg = ({icon: [w, h, , , d]}) =>
  `<svg viewBox="0 0 ${w} ${h}" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;

import {LINKS} from './src/links.js';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SB90-source',
  tagline: 'Student informatiebeveiliging. Notities, writeups en projecten.',
  favicon: 'img/favicon.png',

  url: 'https://sb90-source.github.io',
  baseUrl: '/',
  organizationName: 'Sb90-source',
  projectName: 'Sb90-source.github.io',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'warn'}},

  i18n: {defaultLocale: 'nl', locales: ['nl']},

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'wiki',
          sidebarPath: './sidebars.js',
          showLastUpdateTime: false,
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Blog',
          blogDescription: 'Voortgang en writeups',
          blogSidebarTitle: 'Recente berichten',
          blogSidebarCount: 10,
          postsPerPage: 10,
          feedOptions: {type: ['rss', 'atom'], xslt: true},
          onInlineTags: 'ignore',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {defaultMode: 'light', respectPrefersColorScheme: true},
      navbar: {
        title: 'SB90-source',
        logo: {alt: '', src: 'img/sprite.svg', width: 28, height: 28},
        items: [
          {type: 'docSidebar', sidebarId: 'wiki', position: 'left', label: 'Wiki'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {type: 'html', position: 'right', value: `<a class="navbar__link nav-icon" href="${LINKS.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${iconSvg(faGithub)}</a>`},
        ],
      },
      footer: {
        style: 'light',
        copyright: `© ${new Date().getFullYear()} SB90-source. Gebouwd met Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'powershell', 'yaml', 'json', 'python'],
      },
    }),
};

export default config;
