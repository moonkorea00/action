const issueTitle = 'Lighthouse Report Log';

const getLightHouseIssue = async (octokit, context) => {
  const issues = await octokit.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: ['lighthouse'],
  });
  const issue = issues.data?.find(issue => issue.title === issueTitle);

  return {
    issue,
    body: issue ? JSON.parse(issue.body) : [],
  };
};

const createIssueBody = ({ currentReports, previousReports }) => {
  const maxLength = 50000;
  let issueBody = [currentReports, ...previousReports];
  if (JSON.stringify(previousReports).length > maxLength) {
    issueBody = [currentReports, ...previousReports.slice(0, -10)];
  }
  return JSON.stringify(issueBody);
};

const mutateLighthouseIssue = async ({ octokit, context, reports }) => {
  const { issue, body } = await getLightHouseIssue(octokit, context);

  let issueBody = [reports, ...body];
  const maxLength = 300;

  if (JSON.stringify(issueBody).length > maxLength) {
    issueBody = [reports, ...body.slice(0, -1)];
  }
  const serializedIssueBody = JSON.stringify(issueBody);

  if (issue) {
    return await octokit.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: serializedIssueBody,
    });
  }
  await octokit.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: issueTitle,
    body: serializedIssueBody,
    labels: ['lighthouse'],
  });
};

module.exports = { getLightHouseIssue, mutateLighthouseIssue };
