<script setup lang="ts">
import { objectPick } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { getUsername } from 'shared/utils'
import { validatePassword } from 'zjf-utils'
import { changePasswordOld } from '~/api/user/changePassword'

defineProps<{ layout?: boolean }>()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { cmsProps, currComponent } = useCms()
const { userInfo, useGetProfile, useLogout, isLogin } = useUser()

const userDropdown = ref(false)
const showLogoutConfirmDialog = ref(false)
const footerProps = ref<any[]>([])
const avatarRef = ref<any>()

const navList = [
  {
    id: 'home',
    label: '首页',
    to: '/home',
    isRequest: false,
  },
  {
    id: 'database',
    label: '数据库',
    to: '/database',
    isRequest: false,
  },
  {
    id: 'question',
    label: '常见问题',
    to: '/question',
    isRequest: false,
  },
  {
    id: 'request',
    label: '申请使用',
    to: '/request',
    isRequest: false,
  },
]

const nav = ref(navList[0].id)
const userCenter = ref<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 })

const userList: Array<any> = [
  {
    name: '用户中心',
    id: 'userCunt',
    to: { path: '/userCenter' },
  },
  {
    id: 'adminQRCode',
    name: '退出登录',
    action: () => showLogoutConfirmDialog.value = true,
  },
]

/** 是否使用 url 中的 token 登录 */
let isUrlLogin = false

/** 修改密码 */
const changePasswordDialog = ref(false)
const password = ref('')
const repeatPassword = ref('')

/** 需要校验的input */
const acceptObj = reactive({
  password: false,
  repeatPassword: false,
})

/** 输入校验 */
function passwordRules(val: string) {
  return validatePassword(val) || true
}
function passwordRule(val: string) {
  return val === password.value || '两次密码不一致'
}

onBeforeMount(() => {
  // 组件挂载前处理用户token
  const { query = {}, name } = route
  const { token } = query
  if (token && name === 'home' && !isLogin.value) {
    isUrlLogin = true
    router.push({ query: {} })
    authToken.value = token as string
  }
})

onMounted(async () => {
  cmsProps('footer').then(data => {
    footerProps.value = data
  })
  if (isLogin.value) {
    await useGetProfile()
    if (isLogin.value && isUrlLogin && !userInfo.value?.password) {
      changePasswordDialog.value = true
    }
  }
})

useEventListener(avatarRef, 'click', (e: PointerEvent) => {
  if (isLogin.value) {
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

/**
 * 修改密码
 */
async function changePassword() {
  if (Object.values(acceptObj).includes(false))
    return

  const res = await changePasswordOld(password.value, password.value)
  if (res) {
    $q.notify({
      message: '设置成功',
      type: 'success',
    })
  }
}
</script>

<template>
  <main
    full
    text="center"
    flex="~ col" items-center
  >
    <div w-limited-1 bg-grey-1>
      <div flex="~ row justify-between items-center">
        <div my-4 flex="~ row gap-2 items-center" text-primary-1>
          <img w-10 src="../assets/layout/cloud.png">
          <div font-600 text-2xl>
            数智三农云科研平台
          </div>
          <div w-3px h-8 bg-primary-1 />
          <div text-lg>
            CloudResearch
          </div>
        </div>

        <div flex items-center text-primary-1 flex-row>
          <Avatar
            ref="avatarRef"
            flex="~ row gap-2 items-center"
            :avatar-url="userInfo?.avatar"
            :nickname="getUsername(userInfo)"
          >
            <div v-if="!isLogin">
              {{ '登录' }}
            </div>
            <q-menu
              style="box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);"
              rounded-0
              :offset="[0, 16]"
              anchor="bottom right" self="top right"
            >
              <q-list
                w50 py2 filter-drop-shadow
              >
                <q-item
                  v-for="u in userList"
                  :key="u.id"
                  v-close-popup
                  :to="u.to"
                  h12 dense clickable
                  style="--q-primary: var(--grey-2); color: var(--grey-2) !important;"
                  @click="() => u.action?.()"
                >
                  <div flex="~" w-full items-center justify-between>
                    <span text="4 grey-8">{{ u.name }}</span>
                    <div>
                      <svg
                        v-if="u.to"
                        width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4.50033 5L0.666992 1.16667L1.83366 0L6.83366 5L1.83366 10L0.666992 8.83333L4.50033 5Z" fill="#6E7686" />
                      </svg>
                    </div>
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </Avatar>
        </div>
      </div>
      <!-- Navigation -->
      <div flex="~" w-full mb4 justify-center border-b-1 border-b-grey-3>
        <q-tabs v-model="nav" class="home-layout-tabs" text-bold>
          <q-route-tab
            v-for="tab in navList"
            :key="tab.id"
            px8
            v-bind="objectPick(tab, ['to'])"
          >
            <span text-primary-1 text-base font-600>{{ tab.label }}</span>
          </q-route-tab>
        </q-tabs>
      </div>
    </div>

    <div w-full>
      <slot v-if="layout" />
      <RouterView v-else />
    </div>

    <component
      v-if="footerProps && footerProps.length"
      :is="currComponent('home', 'footer')"
      :list="footerProps"
    />

    <ZDialog
      v-model="showLogoutConfirmDialog"
      title="退出登录"
      confirm-text="退出"
      footer
      @ok="useLogout()"
    >
      是否退出登录
    </ZDialog>

    <ZDialog
      v-model="changePasswordDialog"
      title="设置密码"
      confirm-text="确认"
      footer
      :disable-confirm="Object.values(acceptObj).includes(false)"
      @ok="changePassword()"
    >
      欢迎“区域发展政策大脑”用户登录本平台，考虑到安全因素，您在政策大脑使用的密码不会被同步到本平台，请在下方设置默认密码，以便后续使用！
      <div mt-2 v-text="'密码'" />
      <PasswordInput
        v-model:password="password"
        :rules="[(val: string) => passwordRules(val)]"
        :dark="false"
        @update:accept="(val) => acceptObj.password = val"
      />

      <div v-text="'确认密码'" />
      <PasswordInput
        v-model:password="repeatPassword"
        reactive-rules
        :rules="[(val: string) => passwordRule(val)]"
        :dark="false"
        @update:accept="(val) => acceptObj.repeatPassword = val"
      />
    </ZDialog>
  </main>
</template>

<style lang="scss" scoped>
.nav-Br {
  border-radius:0.5rem 0 0 0.5rem ;
}
</style>

<style lang="sass">
.home-layout-tabs
  .q-tab--inactive
    opacity: 1
  .q-tab__indicator
    padding: 0 32px
    background: none
    height: 4px
    &::after
      display: block
      content: ''
      width: 100%
      height: 100%
      background: #F99E34
</style>
