const issueTitle = 'Lighthouse Report Log';

const getLightHouseIssue = async (octokit, context) => {
  const issues = await octokit.rest.issues.listForRepo({
    owner: context.owner,
    repo: context.repo.repo,
  });
  return issues.data?.find(issue => issue.title === issueTitle);
};

const mutateLighthouseIssue = async ({ octokit, context, body }) => {
  const lighthouseIssue = getLightHouseIssue(octokit, context);

  if (lighthouseIssue) {
    return await octokit.rest.issues.update({
      owner: context.owner,
      repo: context.repo.repo,
      issue_number: lighthouseIssue.number,
      body,
    });
  }
  await octokit.rest.issues.create({
    ...repo,
    title: issueTitle,
    body,
    labels: ['lighthouse'],
  });
};

module.exports = { getLightHouseIssue, mutateLighthouseIssue };
