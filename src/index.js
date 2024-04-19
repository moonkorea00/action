const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');

const {
  createPullRequestComment,
  createReportComparisonTable,
} = require('./comment');
const {getLightHouseIssue, mutateLighthouseIssue } = require('./issue');

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
      core.info('✅ Start running lighthouse report tracker v1.0.0..');
const issue = await getLightHouseIssue();
console.log('THIS IS ISSUE : ',issue)
console.log('THIS IS REPO: ', context.repo);
  console.log('THIS IS REPO.REPO: ', context.repo.repo);
      // const commentBody = await createReportComparisonTable({
      //   context,
      //   currentReports: JSON.parse(reports),
      // });

      // await createPullRequestComment({ octokit, context, body: commentBody });
    } else if (
      context.eventName === 'pull_request_target' &&
      context.payload.pull_request.merged
    ) {
      mutateLighthouseIssue({
        octokit,
        context,
        body: reports,
      });
    }
  } catch (err) {
    core.setFailed(`❌ Failed running action with error : ${err}`);
  } finally {
    core.info('✅ End running lighthouse report tracker v1.0.0..');
  }
}

main();
