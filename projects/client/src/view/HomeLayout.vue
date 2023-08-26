<script setup lang="ts">
import { AUTH_TOKEN_KEY } from 'shared/constants'
import Tabs from 'shared/component/base/tab/Tabs.vue'
import type { ItemList } from '~/components/nav/NavItem.vue'

import { useCms } from '~/composables/useCms'

const router = useRouter()

const { cmsProps, currComponent } = useCms()

const qandShow = ref(false)
const userDropdown = ref(false)
const footerProps = ref([])

/** hooks */
const { userInfo, useGetProfile, useLogout } = useUser()

const navList = [
  {
    id: 'home',
    label: '首页',
    to: '/home',
    icon: ' i-mingcute:home-4-line',
    isRequest: false,
    // authority: '',
  },
  {
    id: 'database',
    label: '数据库',
    icon: 'i-mingcute:shopping-bag-1-line',
    to: '/database',
    isRequest: false,
  },
  {
    id: 'question',
    label: '常见问题',
    icon: 'i-mingcute:folder-2-line',
    to: '/question',
    isRequest: false,
  },
  {
    id: 'request',
    label: '申请使用',
    icon: 'i-mingcute:chart-bar-line',
    to: '/request',
    isRequest: false,
  },
]
const nav = ref(navList[0].id)

const userList: Array<ItemList> = [
  {
    name: '用户中心',
    id: 'userCunt',
    clickEvent: () => router.replace({ path: '/userCenter' }),
  },
  { id: 'adminQRCode', name: '退出登录', back: true, clickEvent: () => useLogout() },
]

const isToken = computed(() => {
  let tokenStr: any = null
  if (typeof window !== 'undefined') {
  // Perform localStorage action
    tokenStr = localStorage.getItem(AUTH_TOKEN_KEY) || null
  }
  return tokenStr
})

onMounted(async () => {
  useGetProfile()
  footerProps.value = await cmsProps('footer')
})
</script>

<template>
  <main
    full
    text="center"
  >
    <q-layout container view="lHh lpr lFf">
      <q-header bg-white>
        <q-toolbar flex="~ row justify-between items-center">
          <div mx-8 my-4 flex="~ row">
            <img mr-2 h-6 src="../assets/layout/cloud.png">
            <div>
              <span text-xl font-600 text-primary-1>
                智能云科研平台 |
              </span>
              <span text-primary-1>CloudResearch</span>
            </div>
            <!-- <Icon text-grey-8 icon="mdi-light:home" /> -->
          </div>

          <div flex flex-row items-center text-primary-1>
            <Avatar
              flex="~ row gap-2 items-center"
              :avatar-url="userInfo?.avatar"
              :nickname="userInfo?.nickname"
              @update:route="isToken ? (userDropdown = !userDropdown) : router.replace({ path: '/auth/login' })"
            >
              <div>
                {{ isToken ? '' : '登录' }}
              </div>
            </Avatar>
            <q-list v-if="userDropdown" absolute right-3 top-20 z-999 bg-grey-1 p-2 filter-drop-shadow>
              <NavItem
                v-for="u in userList"
                :id="u.id"
                :key="u.id"
                :click-event="u.clickEvent"
                :back="u.back"
                :name="u.name"
              />
            </q-list>
          </div>
        </q-toolbar>
        <Tabs v-model="nav" :tab-list="navList" />
      </q-header>

      <q-page-container bg-grey-2>
        <q-page>
          <ZDialog
            v-model="qandShow"
            title="常见问题解答(Q&A)"
          >
            <!-- <RectAngleCardSection title="国外，境外手机号注册" content="sdkhasgdjhasd<br/>skdhgakhjdkjh" /> -->
          </ZDialog>
          <slot />
          <!-- <RouterView /> -->
        </q-page>
      </q-page-container>

      <component :is="currComponent('home', 'footer')" :list="footerProps" />
    </q-layout>
  </main>
</template>

<style lang="scss" scoped>
.nav-Br {
  border-radius:0.5rem 0 0 0.5rem ;
}
</style>
