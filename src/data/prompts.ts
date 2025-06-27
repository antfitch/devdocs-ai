import { HelpCircle, Bot, BrainCircuit } from 'lucide-react';
import type { DocItem } from '@/types';

export const prompts: DocItem[] = [
  {
    id: 'ask-a-question',
    title: 'Ask a Question',
    icon: HelpCircle,
    content: `
# Ask a Question

Use the "Ask" feature in the AI assistant to ask any question about the documentation. The AI will use vector search to find relevant information and provide a comprehensive answer.

For example, you could ask:

> "How do I handle errors from the API?"

> "What is the difference between a qubit and a regular bit?"
    `
  },
  {
    id: 'explain-code',
    title: 'Explain Code',
    icon: Bot,
    content: `
# Explain Code or Text

If you find a section of the documentation or a code snippet that is confusing, simply highlight it. Once highlighted, the "Explain" button in the AI assistant will become active. Click it to get a detailed explanation of the selected text.

This is useful for:
- Understanding complex technical jargon.
- Deciphering dense code examples.
- Getting a simpler view of a concept.
    `
  },
  {
    id: 'generate-code',
    title: 'Generate Code',
    icon: BrainCircuit,
    content: `
# Generate Sample Code

Need a practical example? Highlight a section of the documentation describing a feature, and then click the "Make Code" button in the AI assistant. The AI will generate a ready-to-use code snippet based on the context you provided.

For example, highlight the "Authentication" section in the "Getting Started" topic and ask the AI to make code. It will generate a full, runnable example of how to authenticate.
    `
  },
];
