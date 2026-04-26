import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'GIF Loop Coder',
  description: 'Code looping animations in JavaScript and export them as GIFs.',
  base: '/gifloopcoder/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Intro', link: '/intro' },
      { text: 'Objects', link: '/objects' },
      { text: 'Styles', link: '/styles' },
      { text: 'Properties', link: '/properties' },
      { text: 'Tips', link: '/tips' },
      { text: 'Embed', link: '/embed' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Introduction', link: '/intro' },
          { text: 'Objects', link: '/objects' },
          { text: 'Styles', link: '/styles' },
          { text: 'Property Types', link: '/properties' },
          { text: 'Tips & Advanced Use', link: '/tips' },
        ],
      },
      {
        text: 'Embedding',
        items: [{ text: 'Using @glc/engine in your app', link: '/embed' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/bit101/gifloopcoder' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Keith Peters',
    },
    search: {
      provider: 'local',
    },
  },
});
