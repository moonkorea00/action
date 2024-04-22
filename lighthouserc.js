module.exports = {
  ci: {
    collect: {
      url: [
        'https://moonkorea.dev',
        'https://google.com',
        'https://www.moonkorea.dev/React-%EB%A0%8C%EB%8D%94%EB%A7%81-%EB%B0%8F-%EC%B5%9C%EC%A0%81%ED%99%94-(2)-React-memo',
        'https://naver.com',
        'https://github.com',
        'https://github.com/moonkorea00',
      ],
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
