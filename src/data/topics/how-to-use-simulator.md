---
tags:
  - how-to
---
# How to Use a Local Simulator

Simulators are essential tools for debugging quantum circuits without needing to wait for access to a real quantum computer.

## 1. Choose the Simulator Backend
Our API provides access to several high-performance simulators. You can find them by listing the backends and filtering for `type: 'SIMULATOR'`.

```javascript
const backends = await client.listBackends();
const simulator = backends.find(b => b.name === 'cloud_aer_simulator');

if (!simulator) {
  throw new Error('Could not find the target simulator.');
}
```

## 2. Run a Circuit Locally
To use a simulator, simply specify its name in the `backend` property of your job configuration. The rest of the process is identical to running on real hardware.

```javascript
const myCircuit = 'H q[0]; MEASURE q[0];';

const jobConfig = {
  circuit: myCircuit,
  backend: simulator.name, // Use the simulator backend
  shots: 4096,
};

const results = await client.compute(jobConfig);
console.log('Simulation results:', results.counts);
```

## 3. Understand the Advantages
Simulators provide several key benefits:
- **Speed:** Results are often returned much faster.
- **Cost:** Running on simulators is typically free or much cheaper.
- **Perfect Fidelity:** Simulators are noiseless, allowing you to verify that your algorithm logic is correct before running it on noisy quantum hardware.

```javascript
// On a perfect simulator, a single Hadamard gate on |0>
// should yield '0' and '1' with almost exactly 50% probability.
const p0 = results.counts['0'] / results.shots;
const p1 = results.counts['1'] / results.shots;

console.log(`Probability of '0': ${p0.toFixed(4)}`);
console.log(`Probability of '1': ${p1.toFixed(4)}`);
```
