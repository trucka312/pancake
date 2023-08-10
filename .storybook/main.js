// Initial:
// module.exports = {
//   stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
//   addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
//   framework: '@storybook/react',
// }

// Solution:
module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/uikit/src/components/**/*.stories.mdx',
    '../packages/uikit/src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  framework: '@storybook/react',
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    '@storybook/addon-knobs',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    'themeprovider-storybook/register',
  ],
}
