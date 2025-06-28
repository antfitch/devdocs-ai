---
tags:
  - how-to
---
# How to Batch Multiple Jobs

Submitting multiple jobs in a single request (batching) can be more efficient than sending them one by one.

## 1. Prepare Multiple Circuits
First, prepare an array of job configuration objects. Each object represents a single job you want to run.

```javascript
const circuits = [
  { circuit: 'H q[0];', backend: 'local_simulator', shots: 100 },
  { circuit: 'X q[0];', backend: 'local_simulator', shots: 100 },
  { circuit: 'H q[0]; CX q[0], q[1];', backend: 'quantum_computer_alpha', shots: 1024 },
];
```

## 2. Submit a Batch Request
Use the `client.submitBatch()` method, passing the array of job configurations. This method returns an array of job objects, each with its own ID.

```javascript
async function submitBatch(jobs) {
  try {
    const submittedJobs = await client.submitBatch(jobs);
    console.log('Batch submitted successfully!');
    submittedJobs.forEach(job => {
      console.log(`- Job ${job.id} for backend ${job.backend} created.`);
    });
    return submittedJobs;
  } catch (error) {
    console.error('Batch submission failed:', error);
  }
}

const jobs = await submitBatch(circuits);
```

## 3. Handle Batch Responses
After submitting, you can manage each job individually using its unique ID, just as you would with a single job submission. For example, you can retrieve all their results.

```javascript
async function getAllResults(jobList) {
  const resultsPromises = jobList.map(job => client.getJobResults(job.id));
  const allResults = await Promise.all(resultsPromises);
  
  allResults.forEach((result, index) => {
    console.log(`Results for job ${jobList[index].id}:`, result.counts);
  });
}

// You would need to wait for jobs to complete before calling this.
// await getAllResults(jobs);
```
