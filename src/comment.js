const { getLightHouseIssue } = require('./issue');

const createPullRequestComment = async ({ octokit, context, body }) => {
  const comments = await octokit.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
  });
  console.log('creating PR : ', body);
  const lighthouseReportTrackerComment = comments.data.find(
    comment => comment.user.login === 'github-actions[bot]'
  );

  if (lighthouseReportTrackerComment) {
    return await octokit.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      comment_id: lighthouseReportTrackerComment.id,
      body,
    });
  }
  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
    body,
  });
  console.log('DONE');
};

const formatMetricValueDifference = (curr, prev) => {
  if (prev === '➖') return '➖';
  const diff = prev - curr;
  const absoluteDiff = Math.abs(diff).toFixed(2);
  return `${
    diff === 0 ? '➖' : diff > 0 ? `🔻${absoluteDiff}` : `🔺${absoluteDiff}`
  }`;
};

const createReportComparisonTable = async ({
  octokit,
  context,
  currentReports,
}) => {
  const lighthouseIssue = await getLightHouseIssue(octokit, context);
  const previousReports = lighthouseIssue
    ? JSON.parse(lighthouseIssue.body)
    : [];

  let commentBody = `### Lighthouse Report\n\n`;

  currentReports.reports.forEach(currReport => {
    // optional chaining?
    const prevReport = previousReports[0]?.reports.find(
      prevReport => prevReport.url === currReport.url
    );

    const tableHeading = `#### ${currReport.url} \n`;
    const rowHeader = `| Metric | Previous Score ${
      prevReport ? `(#${previousReports[0].pr})` : ''
    } | Current Score(#${
      context.payload.pull_request.number
    }) | Difference |\n`;
    const seperator = `|:------:|:----------------:|:-----------------:|:----------:|\n`;

    let baseTable = tableHeading + rowHeader + seperator;

    Object.keys(currReport.summary).forEach(metric => {
      const currValue = currReport.summary[metric] * 100;
      const prevValue = prevReport ? prevReport.summary[metric] * 100 : '➖';
      const difference = formatMetricValueDifference(currValue, prevValue);

      baseTable += `| ${metric} | ${prevValue} | ${currValue} | ${difference} |\n`;
    });

    commentBody += baseTable + '\n\n';
  });

  return commentBody;
};

module.exports = { createPullRequestComment, createReportComparisonTable };
