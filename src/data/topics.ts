import type { DocItem } from '@/types';

type Topic = Omit<DocItem, 'content'> & {
  subtopics?: Omit<DocItem, 'content' | 'subtopics'>[];
};

export const topics: Topic[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: 'Book',
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Rocket',
    subtopics: [
      { id: 'installation', title: 'Installation', icon: 'Download' },
      { id: 'authentication', title: 'Authentication', icon: 'KeyRound' },
    ],
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
