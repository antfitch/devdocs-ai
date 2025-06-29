---
tags:
  - how-to
---
# How to Check Job Status

For long-running jobs, you may want to submit them and check their status later instead of awaiting the result directly.

## Submit the Job
tags: jobs, submit, status, sample

When you submit a job without awaiting the final result, the API immediately returns a job object with a unique ID.

```javascript
async function submit() {
  const job = await client.submitJob(jobConfig);
  console.log(`Job submitted with ID: ${job.id}`);
  return job.id;
}

const jobId = await submit();
```

## Poll for Status
tags: jobs, status, polling, sample

You can then use the `jobId` to poll for the job's status periodically. This is useful for providing progress updates in a user interface.

```javascript
async function checkStatus(id) {
  const status = await client.getJobStatus(id);
  console.log(`Current status for job ${id}: ${status}`);
  return status;
}

// Check the status every 10 seconds
setInterval(() => checkStatus(jobId), 10000);
```

## Handle Different Statuses
tags: jobs, status, handling, sample

The job status can be `QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, or `CANCELLED`. Your application should handle these different states accordingly.

```javascript
const status = await checkStatus(jobId);

switch (status) {
  case 'COMPLETED':
    console.log('Job finished! You can now retrieve results.');
    break;
  case 'FAILED':
    console.error('Job failed. Check logs for details.');
    break;
  case 'RUNNING':
    console.log('Job is still running...');
    break;
  default:
    console.log('Job is in the queue.');
}
```
