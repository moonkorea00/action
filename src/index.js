const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');

const {
  createPullRequestComment,
  createReportComparisonTable,
} = require('./comment');
const { mutateLighthouseIssue } = require('./issue');

async function main() {
  try {
    const token = core.getInput('secret');
    const octokit = github.getOctokit(token);
    const outputDir = core.getInput('outputDir');
    const reports = fs.readFileSync(`${outputDir}/manifest.json`);
    const context = github.context;

    if (
      context.eventName === 'pull_request' &&
      ['opened', 'reopened', 'synchronize'].includes(context.payload.action)
    ) {
      core.info('✅ Running lighthouse report tracker..');

      const commentBody = await createReportComparisonTable({
        octokit,
        context,
        currentReports: JSON.parse(reports),
      });

      core.info('✅ Creating Lighthouse comparison table in pull request..');

      await createPullRequestComment({ octokit, context, body: commentBody });
    }
    if (
      context.eventName === 'pull_request_target' &&
      context.payload.pull_request.merged
    ) {
      core.info('✅ Updating Lighthouse report log..');
      await mutateLighthouseIssue({
        octokit,
        context,
        body: reports,
      });
    }
  } catch (err) {
    core.setFailed(`❌ Failed running action with error : ${err}`);
  } finally {
    core.info('End running lighthouse report tracker v1.0.0..');
  }
}

main();
