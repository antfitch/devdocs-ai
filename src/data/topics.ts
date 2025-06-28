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
    id: 'how-to-guides',
    title: 'How-to Guides',
    icon: 'Hammer',
    subtopics: [
      { id: 'how-to-run-circuit', title: 'Run a Quantum Circuit', icon: 'Play' },
      { id: 'how-to-check-job-status', title: 'Check Job Status', icon: 'Activity' },
      { id: 'how-to-retrieve-results', title: 'Retrieve Results', icon: 'DownloadCloud' },
      { id: 'how-to-list-backends', title: 'List Available Backends', icon: 'Server' },
      { id: 'how-to-create-bell-state', title: 'Create a Bell State', icon: 'GitMerge' },
      { id: 'how-to-use-grovers-algorithm', title: 'Use Grover\'s Algorithm', icon: 'SearchCode' },
      { id: 'how-to-handle-api-errors', title: 'Handle API Errors', icon: 'ShieldAlert' },
      { id: 'how-to-batch-jobs', title: 'Batch Multiple Jobs', icon: 'BoxSelect' },
      { id: 'how-to-cancel-job', title: 'Cancel a Running Job', icon: 'XCircle' },
      { id: 'how-to-use-simulator', title: 'Use a Local Simulator', icon: 'Laptop' },
    ]
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
