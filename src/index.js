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
    // if(!core.getInput('secret'))core.setFailed('missing token')
    const token = core.getInput('secret');
    const octokit = github.getOctokit(token);
    const outputDir = core.getInput('outputDir');
    const context = github.context;
    const formatTrackerReports = reports => {
      const trackerReports = reports.map(report => ({
        url: report.url,
        summary: {
          performance: report.summary.performance,
          accessibility: report.summary.accessibility,
          'best-practices': report.summary['best-practices'],
          seo: report.summary.seo,
          pwa: report.summary.pwa,
        },
      }));
      const newReport = {
        pr: context.payload.pull_request.number,
        createdAt: new Date().toISOString,
        reports: trackerReports,
      };
      return newReport;
    };
    const reports = formatTrackerReports(
      JSON.parse(fs.readFileSync(`${outputDir}/manifest.json`))
    );

    if (
      context.eventName === 'pull_request' &&
      ['opened', 'reopened', 'synchronize'].includes(context.payload.action)
    ) {
      core.info('✅ Running lighthouse report tracker..');

      const commentBody = await createReportComparisonTable({
        octokit,
        context,
        currentReports: reports,
      });

      core.info('✅ Creating Lighthouse comparison table in pull request..');

      await createPullRequestComment({ octokit, context, body: commentBody });

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
