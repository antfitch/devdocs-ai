---
tags:
  - how-to
---
# How to Run a Quantum Circuit

This guide demonstrates the basic workflow for defining a quantum circuit and submitting it to a backend for execution.

## Define Your Circuit
tags: circuit, define, run

First, you need to define your quantum circuit. Our client library uses a simple, string-based representation for circuits. This example creates a circuit with one Hadamard gate and one CNOT gate.

```javascript
const myCircuit = `
  H q[0];
  CX q[0], q[1];
`;
```

## Configure the Job
tags: circuit, jobs, configuration

Next, create a job configuration object. This specifies the circuit to run, the backend to use, and the number of "shots" (how many times to run the circuit).

```javascript
const jobConfig = {
  circuit: myCircuit,
  backend: 'quantum_computer_alpha',
  shots: 1024,
};
```

## Submit and Await Results
tags: circuit, submit, results

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
