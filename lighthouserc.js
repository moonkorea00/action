module.exports = {
  ci: {
    collect: {
      url: ['https://moonkorea.dev'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 1 }],
      },
    },
    upload: {
      // target: 'temporary-public-storage',
      target: 'filesystem',
      outputDir: './lhci_reports',
      reportFilenamePattern: '%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
