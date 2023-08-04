<script setup lang="ts">
import type { ItemList } from '~/components/nav/NavItem.vue'

const router = useRouter()

const drawer = ref(false)
const qrCodeshow = ref(false)
const qandShow = ref(false)
const userDropdown = ref(false)

const questionLinkId = ref('')
const routerLink = ref('')

/** hooks */
const { userInfo, useGetProfile, useLogout } = useUser()

const link = computed({
  get: () => { return router.currentRoute.value.name as string },
  set: (val: string) => {
    routerLink.value = val
  },
})
const navList: Array<ItemList> = [
  {
    id: 'home',
    name: '首页',
    icon: ' i-mingcute:home-4-line',
    // authority: '',
  },
  {
    id: 'buyData',
    name: '已购数据资源',
    icon: 'i-mingcute:shopping-bag-1-line',
  },
  {
    id: 'selfData',
    name: '自建数据库',
    icon: 'i-mingcute:folder-2-line',
  },
  {
    id: 'publicData',
    name: '公共数据资源',
    icon: 'i-mingcute:chart-bar-line',
  },
  {
    id: 'preData',
    name: '预购数据资源',
    icon: 'i-mingcute:shopping-cart-1-line',
  },
]

const question: Array<ItemList> = [
  {
    icon: '<div i-mingcute:question-line style="width:24px;height:24px"/>',
    name: '常见问题解答(Q&A)',
    id: 'QandA',
  },
  { icon: '<div i-mingcute:user-setting-line style="width:24px;height:24px"/>', id: 'adminQRCode', name: '管理员二维码', back: true },
]

const userList: Array<ItemList> = [
  {
    name: '用户中心',
    id: 'userCunt',
    clickEvent: () => router.push({ path: '/userCenter' }),
  },
  { id: 'adminQRCode', name: '退出登录', back: true, clickEvent: () => useLogout() },
]
function toquestionLinkId(id: any) {
  questionLinkId.value = id
  if (id === 'adminQRCode')
    qrCodeshow.value = !qrCodeshow.value
  else if (id === 'QandA')
    qandShow.value = true
}

const isToken = computed(() => localStorage.getItem('auth_token'))

onMounted(() => {
  useGetProfile()
})
</script>

<template>
  <main
    full
    text="center"
  >
    <q-layout container view="hHh Lpr lff">
      <q-header bg-white>
        <q-toolbar flex="~ row justify-between">
          <div mx-8 my-4 flex="~ row">
            <img mr-2 h-6 src="../assets/layout/cloud.png">
            <span text-xl font-600 text-grey-8>
              智能云科研平台
            </span>
            <!-- <Icon text-grey-8 icon="mdi-light:home" /> -->
          </div>

          <div flex flex-row items-center>
            <Btn label="申请使用" transparent m-r-2 />
            <Avatar
              :avatar-url="userInfo?.avatar"
              :nickname="userInfo?.nickname"
              @update:route="isToken ? (userDropdown = !userDropdown) : router.push({ path: 'auth/login' })"
            />
            <q-list v-if="userDropdown" absolute right-3 top-16 border-rd-2 bg-grey-1 p-2>
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
      </q-header>

      <q-drawer
        style="border-right: 1px solid var(--grey-3, #D4DDEA);"
        show-if-above flex flex-col bg-grey-2
        :width="260"
        :mini-width="80"
        :mini="drawer"
        :breakpoint="500"
      >
        <q-toolbar q-none p-0 flex="~ items-center justify-end">
          <div
            class="nav-Br my-1"
            h-8 w-6 flex-center cursor-pointer bg-white
            @click="drawer = !drawer"
          >
            <q-icon :name="`fas fa-chevron-${drawer ? 'right' : 'left'}`" size="0.25rem" text-grey-5 />
          </div>
        </q-toolbar>
        <div class="q-px-md col-grow" flex flex-col>
          <!-- menu -->
          <q-list>
            <RouterLink
              v-for="item in navList"
              :key="item.id"
              :to="item.id"
            >
              <NavItem
                :id="item.id"
                v-ripple
                :name="item.name"
                :icon="item.icon"
                :click-id="link"
                @update:id="(val) => link = val"
              />
            </RouterLink>
          </q-list>
          <div class="col-grow" />
          <!-- question -->
          <q-list>
            <NavItem
              v-for="item in question"
              :id="item.id"
              :key="item.id"
              :name="item.name"
              :icon="item.icon"
              :back="item.back"
              :click-id="questionLinkId"
              @update:id="(val) => toquestionLinkId(val)"
            />
          </q-list>

          <q-item :class="drawer ? '' : 'bg-white'" m-y flex flex-col items-center border-rd-2 p-4 font-500 text-grey-8>
            <q-item-section avatar m-b>
              <img :class="drawer ? 'w-8 h-8' : '' " src="../assets/layout/qiyan.svg">
            </q-item-section>
            <q-item-section>
              技术支持单位：
            </q-item-section>
            <q-item-section>
              企研数据科技（杭州）有限公司
            </q-item-section>
          </q-item>
        </div>
        <!-- QRCode  -->
        <div
          v-show="qrCodeshow"
          style="background-image: url('src/assets/layout/qyQRcode.png') ;"
          absolute bottom-20 right--140px h-40 w-40 bg-cover
        />
      </q-drawer>

      <q-page-container bg-grey-2>
        <q-page>
          <ZDialog
            v-model="qandShow"
            title="常见问题解答(Q&A)"
          >
            <!-- <RectAngleCardSection title="国外，境外手机号注册" content="sdkhasgdjhasd<br/>skdhgakhjdkjh" /> -->
          </ZDialog>
          <RouterView />
        </q-page>
      </q-page-container>
    </q-layout>
  </main>
</template>

<style lang="scss" scoped>
.nav-Br {
  border-radius:0.5rem 0 0 0.5rem ;
}
</style>
