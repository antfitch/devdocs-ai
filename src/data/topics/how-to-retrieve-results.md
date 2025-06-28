---
tags:
  - how-to
---
# How to Retrieve Job Results

Once a job has completed, you can fetch its results using the job ID.

## 1. Ensure Job Completion
Before attempting to retrieve results, you should confirm that the job's status is `COMPLETED`. Trying to fetch results for a job in any other state will result in an error.

```javascript
const jobId = 'job-123-abc';
const status = await client.getJobStatus(jobId);

if (status !== 'COMPLETED') {
  throw new Error('Cannot retrieve results. Job is not yet complete.');
}
```

## 2. Fetching the Results
Use the `client.getJobResults()` method with the `jobId` to get the measurement outcomes.

```javascript
async function fetchResults(id) {
  try {
    const results = await client.getJobResults(id);
    console.log('Results received:', results);
    return results;
  } catch (error) {
    console.error(`Failed to fetch results for job ${id}:`, error);
  }
}

const jobResults = await fetchResults(jobId);
```

## 3. Parsing the Output
The results object contains the measurement outcomes as keys and the number of times that outcome was observed (counts) as values.

```javascript
if (jobResults) {
  console.log('Measurement outcomes:');
  for (const [outcome, count] of Object.entries(jobResults.counts)) {
    const percentage = (count / jobResults.shots) * 100;
    console.log(`- State ${outcome}: ${count} times (${percentage.toFixed(2)}%)`);
  }
}
```
