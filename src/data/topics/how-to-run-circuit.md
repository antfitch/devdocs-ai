---
tags:
  - how-to
---
# How to Run a Quantum Circuit

This guide demonstrates the basic workflow for defining a quantum circuit and submitting it to a backend for execution.

## 1. Define Your Circuit
First, you need to define your quantum circuit. Our client library uses a simple, string-based representation for circuits. This example creates a circuit with one Hadamard gate and one CNOT gate.

```javascript
const myCircuit = `
  H q[0];
  CX q[0], q[1];
`;
```

## 2. Configure the Job
Next, create a job configuration object. This specifies the circuit to run, the backend to use, and the number of "shots" (how many times to run the circuit).

```javascript
const jobConfig = {
  circuit: myCircuit,
  backend: 'quantum_computer_alpha',
  shots: 1024,
};
```

## 3. Submit and Await Results
Finally, submit the job to the API. The `client.compute()` method returns a promise that resolves with the job results once the computation is complete.

```javascript
import { QuantumClient } from '@quantum-api/client';

const client = new QuantumClient({ apiKey: 'YOUR_API_KEY' });

async function runJob() {
  try {
    const results = await client.compute(jobConfig);
    console.log('Computation successful:', results);
  } catch (error) {
    console.error('Job failed:', error);
  }
}

runJob();
```
