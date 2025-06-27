# Getting Started with the Quantum API

This guide will walk you through setting up your environment and making your first API call.

## Installation

First, you'll need to install our client library. You can do this via npm:

```bash
npm install @quantum-api/client
```

## Authentication

To authenticate with the Quantum API, you'll need an API key. You can get one from your dashboard.

```javascript
import { QuantumClient } from '@quantum-api/client';

const client = new QuantumClient({
  apiKey: 'YOUR_API_KEY'
});
```

Highlight the code above and click "Make Code" on the AI assistant to see a more complete example.