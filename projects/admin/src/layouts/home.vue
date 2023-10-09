<script setup lang="ts">
const $router = useRouter()
const { isLogin, roleName, useLogout } = useUser()
const drawer = ref(false)
const routerLink = ref('')

const link = computed({
  get: () => { return $router.currentRoute.value.name as string },
  set: (val: string) => {
    routerLink.value = val
  },
})

watch(
  link,
  () => {
    if (!isLogin.value)
      $router.replace({ path: 'auth/login' })
    else if (roleName.value !== 'root')
      $router.replace({ path: 'denied' })
  },
  {
    immediate: true,
  },
)

const navList = [
  {
    id: 'home',
    name: '首页管理',
    icon: ' i-mingcute:home-4-line',
  },
  {
    id: 'qnaAdmin',
    name: '问答管理',
    icon: 'i-mingcute:question-line',
  },
  {
    id: 'userAdmin',
    name: '用户管理',
    icon: 'i-mingcute:user-setting-line',
  },
  {
    id: 'dataAdmin',
    name: '数据管理',
    icon: 'i-mingcute:chart-bar-line',
  },
  {
    id: 'logAdmin',
    name: '日志管理',
    icon: 'i-mingcute:list-search-line',
  },
  {
    id: 'authorityAdmin',
    name: '权限管理',
    icon: 'i-mingcute:profile-line',
  },

  {
    id: 'desktopAdmin',
    name: '桌面管理',
    icon: 'i-mingcute:cloud-line',
  },
  {
    id: 'adminClient',
    name: '管理员分配',
    icon: 'i-mingcute:user-add-2-line',
  },
  {
    id: 'workAdmin',
    name: '作品管理',
    icon: 'i-mingcute:notebook-line',
  },
  {
    id: 'requestPurchase',
    name: '申请采购',
    icon: 'i-mingcute:pencil-2-line',
  },
  {
    id: 'exportFile',
    name: '文件外发',
    icon: 'i-mingcute:file-export-line',
  },
]
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
            <span text-xl font-600 text-grey-8>
              管理后台
            </span>
          </div>
          <q-btn
            label="退出登录"
            color="primary"
            @click="useLogout()"
          >
            <div i-mingcute:exit-fill ml-2 />
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        style="border-right: 1px solid var(--grey-3, #D4DDEA);"
        flex flex-col bg-grey-2 show-if-above
        :width="260"
        :mini-width="80"
        :mini="drawer"
        :breakpoint="500"
      >
        <q-toolbar p-0 q-none flex="~ items-center justify-end">
          <div
            class="nav-Br my-1"
            w-6 flex-center cursor-pointer bg-white h-8
            @click="drawer = !drawer"
          >
            <q-icon :name="`fas fa-chevron-${drawer ? 'right' : 'left'}`" size="0.25rem" text-grey-5 />
          </div>
        </q-toolbar>
        <div class="col-grow q-px-md" flex flex-col>
          <!-- menu -->
          <q-list>
            <RouterLink
              v-for="item in navList"
              :key="item.id"
              replace
              :to="`/${item.id}`"
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
        </div>
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
</style>
