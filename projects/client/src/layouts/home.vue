<script setup lang="ts">
const router = useRouter()

const drawer = ref(false)
const qrCodeshow = ref(false)
const questionLink = ref('')
const routerLink = ref('')

const link = computed({
  get: () => { return router.currentRoute.value.name as string },
  set: (val: string) => {
    routerLink.value = val
  },
})
const navList = [
  {
    id: 'home',
    name: '首页',
    icon: ' <div  i-mingcute:home-4-line  style="width:24px;height:24px"/>',
    authority: '',
  },
  {
    id: 'buyData',
    name: '已购数据资源',
    icon: '<div i-mingcute:shopping-bag-1-line style="width:24px;height:24px"/ >',
  },
  {
    id: 'selfData',
    name: '自建数据库',
    icon: '<div i-mingcute:folder-2-line style="width:24px;height:24px"/>',
  },
  {
    id: 'publicData',
    name: '公共数据资源',
    icon: '<div i-mingcute:chart-bar-line style="width:24px;height:24px"/>',
  },
  {
    id: 'preData',
    name: '预购数据资源',
    icon: '<div i-mingcute:shopping-cart-1-line style="width:24px;height:24px"/ >',
  },
]

const question = [
  {
    icon: '<div i-mingcute:question-line style="width:24px;height:24px"/>',
    name: '常见问题解答(Q&A)',
    id: 'QandA',
  },
  { icon: '<div i-mingcute:user-setting-line style="width:24px;height:24px"/>', id: 'adminQRCode', name: '管理员二维码', back: 'fas fa-chevron-right' },
]
function toQuestionLink(item: any) {
  questionLink.value = item.id
  if (item.id === 'adminQRCode')
    qrCodeshow.value = !qrCodeshow.value
  else
    qrCodeshow.value = false
}
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
            <img mr-2 src="../assets/layout/cloud.svg">
            <span text-xl font-600 text-grey-8>
              智能云科研平台
            </span>
            <!-- <Icon text-grey-8 icon="mdi-light:home" /> -->
          </div>

          <div>
            <Btn label="申请使用" transparent />
            <span text-primary-1>登录/注册</span>
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
              <q-item
                v-ripple
                :active="link === item.id"
                active-class="bg-primary-1 text-white"
                clickable border-rd-2 text-grey-5
                @click="() => link = item.id"
              >
                <NavItemSection :icon="item.icon" :name="item.name" />
              </q-item>
            </RouterLink>
          </q-list>
          <div class="col-grow" />
          <!-- question -->
          <q-list>
            <q-item
              v-for="item in question"
              :key="item.id"
              :active="questionLink === item.id"
              active-class="text-primary-1 opacity-primary-1"
              clickable border-rd-2 text-grey-5
              @click="toQuestionLink(item)"
            >
              <NavItemSection :icon="item.icon" :name="item.name" :back="item.back" />
            </q-item>
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
.opacity-primary-1 {
  background-color: rgba(48, 123, 246, 0.12);
}
</style>
