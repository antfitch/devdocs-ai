---
tags:
  - how-to
---
# How to List Available Backends

You can programmatically query the API to see which quantum computers and simulators are available to run your jobs.

## 1. Querying for All Backends
The `client.listBackends()` method returns an array of all available backend devices.

```javascript
async function getBackends() {
  const backends = await client.listBackends();
  console.log('Available backends:');
  backends.forEach(backend => {
    console.log(`- ${backend.name} (Qubits: ${backend.qubits})`);
  });
  return backends;
}

const allBackends = await getBackends();
```

## 2. Filtering for Simulators
Each backend object includes a `type` property, which can be `QUANTUM_COMPUTER` or `SIMULATOR`. You can filter this list to find what you need.

```javascript
const simulators = allBackends.filter(b => b.type === 'SIMULATOR');
console.log('\nAvailable simulators:');
simulators.forEach(sim => console.log(`- ${sim.name}`));
```

## 3. Selecting a Backend for a Job
When submitting a job, you can use the name of a backend from the list you retrieved. This allows for dynamic selection based on criteria like the number of qubits required.

```javascript
const myCircuitQubits = 5;
const suitableBackend = allBackends.find(b => b.qubits >= myCircuitQubits && b.status === 'ONLINE');

if (suitableBackend) {
  const jobConfig = {
    circuit: '...',
    backend: suitableBackend.name,
    shots: 2048,
  };
  // await client.compute(jobConfig);
  console.log(`Job submitted to backend: ${suitableBackend.name}`);
} else {
  console.error('No suitable backend found.');
}
```
