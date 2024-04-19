const github = require('@actions/github');
const core = require('@actions/core');

const {
  createPullRequestComment,
  createReportComparisonTable,
} = require('./comment');

async function main() {
  try {
    const context = github.context;
    const token = core.getInput('secret');
    const octokit = github.getOctokit(token);
    const outputDir = core.getInput('outputDir');
    const reports = JSON.parse(fs.readFileSync(`${outputDir}/manifest.json`));

    if (
      context.eventName === 'pull_request' &&
      ['opened', 'reopened', 'synchronize'].includes(context.payload.action)
    ) {
      core.info('Start running lighthouse report tracker v1.0.0..');

      // const previousReports = issues.find(issue => issue.id === `lighthouse-report-log`) // update using github api
      const curr = JSON.parse(
        JSON.stringify([
          {
            url: 'http://localhost:3000/',
            pr: 15,
            summary: {
              performance: 0.88,
              accessibility: 0.74,
              'best-practices': 0.81,
              seo: 0.92,
              pwa: 0.88,
            },
          },
          {
            url: 'http://localhost:3000/post',
            pr: 13,
            summary: {
              performance: 0.88,
              accessibility: 0.74,
              'best-practices': 0.81,
              seo: 0.92,
              pwa: 0.88,
            },
          },
        ])
      );

      const commentBody = createReportComparisonTable(
        context,
        reports,
        (previousReports = [])
      );
      await createPullRequestComment(octokit, context, commentBody);
    } else if (
      context.eventName === 'pull_request_target' &&
      context.payload.pull_request.merged
    ) {
      // createOrUpdateIssue();
    }
  } catch (err) {
    core.setFailed(`Failed running action with error : ${err}`);
  } finally {
    core.info('End running lighthouse report tracker v1.0.0..');
  }
}

main();
// main().catch(err => core.setFailed(`Action failed with error ${err}`)).finally;
