module.exports = {
  branches: [
    { name: 'latest' },
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'next',
      prerelease: true,
    },
    {
      name: 'tmp',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    'semantic-release-license',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      { assets: ['CHANGELOG.md', 'package.json', 'LICENSE'] },
    ],
    [
      '@semantic-release/exec',
      { generateNotesCmd: 'echo -n "${nextRelease.version}" > VERSION && echo -n "${nextRelease.channel}" > RELEASE_CHANNEL' },
    ],
  ],
};
