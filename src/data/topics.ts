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
    subtopics: [
      { id: 'qubits', title: 'Qubits', icon: 'Box' },
      { id: 'entanglement', title: 'Entanglement', icon: 'GitCommitVertical' },
      { id: 'superposition', title: 'Superposition', icon: 'Layers' },
      { id: 'quantum-gates', title: 'Quantum Gates', icon: 'Gateway' },
      { id: 'quantum-circuits', title: 'Quantum Circuits', icon: 'CircuitBoard' },
      { id: 'quantum-measurement', title: 'Quantum Measurement', icon: 'Gauge' },
      { id: 'decoherence', title: 'Decoherence', icon: 'Waves' },
      { id: 'quantum-algorithms', title: 'Quantum Algorithms', icon: 'FunctionSquare' },
      { id: 'grovers-algorithm', title: 'Grover\'s Algorithm', icon: 'Search' },
      { id: 'shors-algorithm', title: 'Shor\'s Algorithm', icon: 'Calculator' },
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: 'CodeXml',
  },
];
