<script setup>
import { inBrowser, useData, useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useSetTheme } from './set-theme';

const { Layout } = DefaultTheme
const { frontmatter } = useData()

useSetTheme(135)

const route = useRoute()
const router = useRouter()

if (inBrowser && navigator.language.startsWith('zh') && !route.path.startsWith('/zh/')) {
  router.go('/zh' + route.path, { replace: true })
}
</script>

<template>
  <Layout>
  </Layout>
</template>
