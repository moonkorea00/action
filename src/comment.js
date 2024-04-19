const createPullRequestComment = async (octokit, context, commentBody) => {
  const commentId = `lighthouse-report-tracker-${context.payload.pull_request.number}`;
  const comments = await octokit.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
  });
  console.log('THIS IS COMMENTS : ', comments);

  // const comment = comments.data.find(
  //   c =>
  //     c.user.login === 'your-bot-username' &&
  //     c.body.startsWith('Specific identifier or content')
  // );
  // const commentId = comment.id;

  // const mutateComment = comments.find(
  //   comment => comment.comment_id === commentId
  // )
  //   ? octokit.rest.issues.updateComment
  //   : octokit.rest.issues.createComment;

  // return mutateComment({
  //   owner: context.repo.owner,
  //   repo: context.repo.repo,
  //   issue_number: context.payload.pull_request.number,
  //   comment_id: commentId,
  //   body: commentBody,
  // });
  return octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request.number,
    body: commentBody,
  });
};

const formatMetricValueDifference = (curr, prev) => {
  if (prev === '➖') return '➖';
  const diff = prev - curr;
  return `${
    diff === 0 ? '➖' : diff > 0 ? '🔻' + -diff : '🔺' + Math.abs(diff)
  }`;
};

const createReportComparisonTable = (
  context,
  currentReports,
  previousReports
) => {
  let commentBody = `### Lighthouse Report\n\n`;

  currentReports.forEach(currReport => {
    const prevReport = previousReports?.find(
      prevReport => prevReport.url === currReport.url
    );

    const tableHeading = `#### ${currReport.url} \n`;
    const rowHeader = `| Metric | Previous Score${
      prevReport && `(#${prevReport.pr})`
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

  return baseTable;
};

module.exports = { createPullRequestComment, createReportComparisonTable };
