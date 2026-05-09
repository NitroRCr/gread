import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Gread',
  description: 'Give your agent access to the source code and docs of all open-source libraries',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/NitroRCr/gread' },
    ],
  },
  rewrites: {
    'en/:slug+': ':slug+',
  },
  cleanUrls: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Self Host', link: '/self-host' },
        ],
      },
    },
    zh: {
      label: '中文',
      lang: 'zh',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '自部署', link: '/zh/self-host' },
        ],
      },
    },
  },
})
