import github from '@actions/github';
import core from '@actions/core';

async function run() {
  const context = github.context;

  if (context.eventName === 'pull_request' && ['opened', 'reopened', 'synchronize'].includes(context.payload.action)) {
    // Handle PR open/reopen/synchronize
    console.log('PR opened, reopened, or code pushed');
  } else if (context.eventName === 'pull_request_target' && context.payload.pull_request.merged) {
    // Handle PR merged
    console.log('PR merged');
    // You could potentially manage creating/updating issues here
  }
}

run().catch(err => core.setFailed(`Action failed with error ${err}`));
