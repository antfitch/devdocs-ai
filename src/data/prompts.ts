import type { DocItem } from '@/types';

export const promptsMetadata: Omit<DocItem, 'content'>[] = [
  {
    id: 'handle-api-errors',
    title: 'Handling API Errors',
    icon: 'ShieldAlert',
  },
  {
    id: 'first-steps',
    title: 'First Steps with the API',
    icon: 'Footprints',
  },
  {
    id: 'explain-entanglement',
    title: 'Explain Entanglement',
    icon: 'BrainCircuit',
  },
  {
    id: 'bell-state-example',
    title: 'Bell State Code Example',
    icon: 'Code',
  },
];
