const issueTitle = 'Lighthouse Report Log';

const getLightHouseIssue = async (octokit, context) => {
  const issues = await octokit.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  return issues.data?.find(issue => issue.title === issueTitle);
};

const mutateLighthouseIssue = async ({ octokit, context, body }) => {
  const lighthouseIssue = await getLightHouseIssue(octokit, context);
  const issueBody = JSON.stringify(
    body.map(issue => ({
      ...issue,
      pr: context.payload.pull_request.number,
    }))
  );
  console.log('ISSUE BODY WITH PR NUBMER', issueBody);
  console.log('ISSUE FROM GITHUB', lighthouseIssue);

  if (lighthouseIssue) {
    return await octokit.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: lighthouseIssue.number,
      body: issueBody,
    });
  }
  await octokit.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: issueTitle,
    body: issueBody,
    labels: ['lighthouse'],
  });
};

module.exports = { getLightHouseIssue, mutateLighthouseIssue };
