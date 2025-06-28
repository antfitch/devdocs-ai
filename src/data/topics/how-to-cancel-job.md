---
tags:
  - how-to
---
# How to Cancel a Running Job

If you have a job that is queued or running, you can request to cancel it.

## Identify the Job to Cancel
tags: jobs, cancel, identify

First, you need the ID of the job you wish to cancel. You would typically get this ID when you first submit the job.

```javascript
const jobConfig = { /* ... */ };
const job = await client.submitJob(jobConfig);
const jobIdToCancel = job.id;

console.log(`Job ${jobIdToCancel} is currently ${job.status}.`);
```

## Send the Cancel Request
tags: jobs, cancel, request

Use the `client.cancelJob()` method with the job ID. The API will attempt to stop the job from running. Cancellation is not always instantaneous or guaranteed.

```javascript
async function cancel(id) {
  try {
    const response = await client.cancelJob(id);
    console.log(response.message); // e.g., "Cancellation request accepted."
    return true;
  } catch (error) {
    console.error(`Failed to cancel job ${id}:`, error.message);
    return false;
  }
}

await cancel(jobIdToCancel);
```

## Verify Cancellation
tags: jobs, cancel, status, verification

After requesting cancellation, you can check the job's status. It should eventually transition to `CANCELLED`.

```javascript
setTimeout(async () => {
  const status = await client.getJobStatus(jobIdToCancel);
  console.log(`Final status for job ${jobIdToCancel}: ${status}`);
  if (status === 'CANCELLED') {
    console.log('Job was successfully cancelled.');
  }
}, 5000); // Check status after 5 seconds
```
