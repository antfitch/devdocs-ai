# Authentication

Authenticating with the Quantum API is straightforward.

## API Key

You need an API key to make requests. You can find your API key in your account dashboard.

Here's how to initialize the client with your key:

```javascript
import { QuantumClient } from '@quantum-api/client';

const client = new QuantumClient({
  apiKey: 'YOUR_API_KEY'
});

// You can now use the client to make API calls.
```

Remember to keep your API key secure and do not expose it in client-side code.
