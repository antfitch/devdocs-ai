import type { DocItem } from '@/types';

export const topics: Omit<DocItem, 'content'>[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: 'Book',
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Rocket',
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    icon: 'Zap',
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: 'CodeXml',
  },
];
