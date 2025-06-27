import { Book, Zap, Code2, Rocket } from 'lucide-react';
import type { DocItem } from '@/types';

export const topics: DocItem[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: Book,
    content: `
# Welcome to DevDocs AI

This is an interactive documentation experience powered by AI. You can browse topics, search across multiple documentation sources, and use the AI assistant to ask questions, explain concepts, or generate code.

## Key Features

- **Unified Documentation:** Access all your documentation in one place.
- **Vector Search:** Find what you need quickly with our powerful search.
- **AI Assistant:** Get instant help with our "AskMe" assistant.

This document serves as the landing page. Select a topic from the Table of Contents to get started.
    `
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    content: `
# Getting Started with the Quantum API

This guide will walk you through setting up your environment and making your first API call.

## Installation

First, you'll need to install our client library. You can do this via npm:

\`\`\`bash
npm install @quantum-api/client
\`\`\`

## Authentication

To authenticate with the Quantum API, you'll need an API key. You can get one from your dashboard.

\`\`\`javascript
import { QuantumClient } from '@quantum-api/client';

const client = new QuantumClient({
  apiKey: 'YOUR_API_KEY'
});
\`\`\`

Highlight the code above and click "Make Code" on the AI assistant to see a more complete example.
    `
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    icon: Zap,
    content: `
# Core Concepts

Understanding these core concepts is crucial for using the Quantum API effectively.

## Qubits

A qubit or quantum bit is the basic unit of quantum information—the quantum version of the classical binary bit physically realized with a two-state device. A qubit is a two-state (or two-level) quantum-mechanical system, one of the simplest quantum systems displaying the peculiarity of quantum mechanics.

## Entanglement

Quantum entanglement is a physical phenomenon that occurs when a group of particles are generated, interact, or share spatial proximity in such a way that the quantum state of each particle of the group cannot be described independently of the state of the others, including when the particles are separated by a large distance.

Highlight any text you don't understand and click "Explain" on the AI assistant.
    `
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code2,
    content: `
# API Reference

This section provides a detailed reference for all available API endpoints.

## /v1/compute

This endpoint allows you to submit a quantum circuit for computation.

**Method:** \`POST\`

**Body:**
\`\`\`json
{
  "circuit": "...",
  "shots": 1024
}
\`\`\`

The \`circuit\` parameter should be a string representation of your quantum circuit in QASM format. The \`shots\` parameter specifies how many times to run the circuit.
    `
  },
];
