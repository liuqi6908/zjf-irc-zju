<script setup lang="ts">
import { isClient } from '@vueuse/core'

const $router = useRouter()
const $route = useRoute()
const { isLogin, rolePermission, useGetProfile } = useUser()

const navs = computed(() => {
  return navList.filter(v => rolePermission.value?.includes(v.name))
})

useHead({
  title: '南方科技大学云科研平台-管理后台',
  meta: [
    { name: 'description', content: '「南方科技大学云科研平台」是一整套供科研人员处理分析大数据和开展学术研究的云端超融合系统的简称。' },
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
  const name = to.name as string

  if (!navList.map(v => v.id).includes(name)) {
    next()
  }
  else if (!isLogin.value) {
    next('/auth/login')
  }
  else if (!navs.value.length) {
    next('/denied')
  }
  else {
    if (navs.value.map(v => v.id).includes(name))
      next()
    else
      next(`/${navs.value[0].id}`)
  }
})

onBeforeMount(async () => {
  if (isLogin.value) {
    await useGetProfile()
    const { name } = $route
    if (!navs.value?.length)
      $router.push('/denied')
    else if (!navs.value.find(v => v.id === name))
      $router.push(`/${navs.value[0].id}`)
  }
  else {
    $router.push('/auth/login')
  }
})
</script>

<template>
  <RouterView />
</template>
