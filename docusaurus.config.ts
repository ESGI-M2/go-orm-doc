import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'GO ORM Documentation',
  tagline: 'ORM pour Go avec support MySQL et PostgreSQL',
  favicon: 'img/favicon.ico',

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  future: {
    v4: true,
  },

  url: 'https://github.com',
  baseUrl: '/docs/intro/',

  organizationName: 'ESGI-M2',
  projectName: 'go-orm-doc',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  onBrokenAnchors: 'ignore', // Les liens fonctionnent correctement malgré les avertissements

  deploymentBranch: 'gh-pages',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/ESGI-M2/GO/tree/main/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'GO ORM',
      logo: {
        alt: 'GO ORM Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/ESGI-M2/GO',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Guide de démarrage',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference',
            },
          ],
        },
        {
          title: 'Communauté',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/go-orm',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/ESGI-M2/GO/issues',
            },
          ],
        },
        {
          title: 'Ressources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ESGI-M2/GO',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GO ORM Project. Construit avec Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
