import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'intro',
        'installation',
        'quick-start',
        'library/features'
      ]
    },
    {
      type: 'category',
      label: 'Guide utilisateur',
      items: [
        'library/configuration',
        'library/models',
        'library/repository',
        'library/query-builder',
        'library/transactions',
        'library/pagination',
        'library/builder-pattern',
        'library/examples'
      ]
    },
    {
      type: 'category',
      label: 'Documentation technique',
      items: [
        'technical/architecture',
        'technical/dialectes',
        'technical/metadata',
        'technical/repository',
        'technical/query-builder',
        'technical/transaction'
      ]
    },
    {
      type: 'category',
      label: 'Référence API',
      items: [
        'api-reference'
      ]
    }
  ]
};

export default sidebars;
