module.exports = {
  ci: {
    collect: {
      url: ['https://moonkorea.dev', 'https://google.com'],
      numberOfRuns: 1,
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci',
      reportFilenamePattern: '%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
