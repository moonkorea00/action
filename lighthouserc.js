module.exports = {
  ci: {
    collect: {
      url: ['https://moonkorea.dev'],
      numberOfRuns: 1,
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci',
      reportFilenamePattern: '%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
