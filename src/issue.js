const issueTitle = 'Lighthouse Report Log';

const getLightHouseIssue = async (octokit, context) => {
  const issues = await octokit.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: ['lighthouse'],
  });
  return issues.data?.find(issue => issue.title === issueTitle);
};

const createIssueBody = () => {};

const mutateLighthouseIssue = async ({ octokit, context, reports }) => {
  const lighthouseIssue = await getLightHouseIssue(octokit, context);
  const prevReports = lighthouseIssue ? JSON.parse(lighthouseIssue.body) : [];
  console.log('THIS IS BODY : ', prevReports);
  console.log('THIS IS REPORT', reports);
  // check for max length
  const issueBody = JSON.stringify([reports, ...prevReports]);
  console.log('THIS IS ISSUE BODYd : ', issueBody);

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

// [
//   {
//     pr: 13,
//     createdAt: '2024-04-22T03:07:37.945Z',
//     reports: [
//       {
//         url: 'https://localhost:3000/post/post',
//         summary: {
//           performance: 0.99,
//           accessibility: 0.99,
//           bestpractice: 0.99,
//           seo: 0.99,
//           pwa: 0.99,
//         },
//       },
//       {
//         url: 'https://localhost:3000/post/post',
//         summary: {
//           performance: 0.99,
//           accessibility: 0.99,
//           bestpractice: 0.99,
//           seo: 0.99,
//           pwa: 0.99,
//         },
//       },
//     ],
//   },
// ];
