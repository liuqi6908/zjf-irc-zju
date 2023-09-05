<script setup lang="ts">
import { AUTH_TOKEN_KEY } from 'shared/constants'
import { objectPick, useEventListener } from '@vueuse/core'
import type { ItemList } from '~/components/nav/NavItem.vue'

import { useCms } from '~/composables/useCms'

const router = useRouter()

const { cmsProps, currComponent } = useCms()

const showQAndA = ref(false)
const userDropdown = ref(false)
const footerProps = ref<any[]>([])
const avatarRef = ref<any>()

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
const userCenter = ref<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 })

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

useEventListener(avatarRef, 'click', (e: PointerEvent) => {
  if (isToken.value) {
    userCenter.value.clientX = e.clientX - 60
    userCenter.value.clientY = e.clientY + 40
    userDropdown.value = !userDropdown.value
  }
  else { router.replace({ path: '/auth/login' }) }
})
if (typeof document !== 'undefined') {
  useEventListener(document, 'click', (e) => {
    if (!avatarRef.value?.$el.contains(e.target))
      userDropdown.value = false
  })
}

// cleanup()
</script>

<template>
  <main
    full
    text="center"
    flex="~ col" items-center
  >
    <div w-limited-1 bg-white>
      <div flex="~ row justify-between items-center">
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
            ref="avatarRef"
            flex="~ row gap-2 items-center"
            :avatar-url="userInfo?.avatar"
            :nickname="userInfo?.account"
          >
            <div>
              {{ isToken ? '' : '登录' }}
            </div>
          </Avatar>

          <q-list
            v-if="userDropdown" id="userDropdown"

            absolute z-999 bg-grey-1 p-2 filter-drop-shadow
            :style="{ left: `${userCenter.clientX}px`, top: `${userCenter.clientY}px` }"
          >
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
      </div>
      <!-- Navigation -->
      <div flex="~" mb4 w-full justify-center border-b-1 border-b-grey-3>
        <q-tabs v-model="nav" class="home-layout-tabs" text-bold>
          <q-route-tab
            v-for="tab in navList"
            :key="tab.id"
            v-bind="objectPick(tab, ['to'])"
          >
            <span text-16px font-bold text-primary-1>{{ tab.label }}</span>
          </q-route-tab>
        </q-tabs>
      </div>
    </div>

    <div w-full>
      <ZDialog
        v-model="showQAndA"
        title="常见问题解答(Q&A)"
      >
        <!-- <RectAngleCardSection title="国外，境外手机号注册" content="sdkhasgdjhasd<br/>skdhgakhjdkjh" /> -->
      </ZDialog>
      <slot />
      <!-- <RouterView /> -->
    </div>

    <component
      :is="currComponent('home', 'footer')"
      v-if="footerProps && footerProps.length" :list="footerProps "
    />
  </main>
</template>

<style lang="scss" scoped>
.nav-Br {
  border-radius:0.5rem 0 0 0.5rem ;
}
</style>

<style lang="sass">
.home-layout-tabs
  .q-tab__indicator
    padding: 0 18px
    background: none
    height: 4px
    &::after
      display: block
      content: ''
      width: 100%
      height: 100%
      background: #F99E34
</style>
