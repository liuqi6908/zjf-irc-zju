<script setup lang="ts">
import { isClient } from '@vueuse/core'

const $router = useRouter()
const { isLogin, rolePermission } = useUser()

useHead({
  title: '智能云科研平台-管理后台',
  meta: [
    { name: 'description', content: '「智能云科研平台」是一整套供科研人员处理分析大数据和开展学术研究的云端超融合系统的简称。' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})

const { width } = useWindowSize()
watch(
  width,
  (newVal) => {
    if (isClient) {
      nextTick(() => {
        const body = document.body
        const base = 900
        if (body) {
          if (newVal < base) {
            body.style.transform = `scale(${newVal / base})`
            body.style.width = `${base / newVal * 100}%`
            body.style.height = `${base / newVal * 100}%`
          }
          else {
            body.style.transform = ''
            body.style.width = '100%'
            body.style.height = '100%'
          }
        }
      })
    }
  },
  {
    immediate: true,
  },
)

$router.beforeEach((to, _, next) => {
  const navs = computed(() => {
    return navList.filter(v => rolePermission.value?.includes(v.name))
  })

  const { name } = to
  if (name === 'denied' || (name === 'auth-login' && !isLogin.value)) {
    next()
  }
  else if (!isLogin.value) {
    next('auth-login')
  }
  else if (!navs.value.length) {
    next('denied')
  }
  else {
    if (navs.value.find(v => v.id === name))
      next()
    else
      next(navs.value[0].id)
  }
})
</script>

<template>
  <RouterView />
</template>
