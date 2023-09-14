<script lang="ts" setup>
import HomeLayout from './home.vue'

const $router = useRouter()
const { isLogin } = useUser()

const userList = ref([
  {
    nameZH: '我的认证',
    id: 'authentication',
    router: { path: 'authentication' },
  },
  {
    nameZH: '我的云桌面',
    id: 'cloudDesktop',
    router: { path: 'cloudDesktop' },
  },
  {
    nameZH: '我的数据',
    id: 'myData',
    router: { path: 'myData' },
  },
  {
    nameZH: '我的作品',
    id: 'myWorks',
    router: { path: 'myWorks' },
  },
])

onBeforeMount(() => {
  if (!isLogin.value)
    $router.push('/')
})
</script>

<template>
  <HomeLayout layout>
    <div flex="~ col" class="fit">
      <header class="userCenter" w-full flex-center h-64 shrink-0>
        <div text-grey-1 title-1>
          用户中心
        </div>
      </header>

      <div flex="~ row" w-limited-1 gap10 pb20 pt10>
        <div flex="~ col" gap2>
          <router-link
            v-for="item in userList"
            :key="item.id"
            active-class="bg-gray-2 text-primary-1!"
            :to="item.router"
            flex="~"
            w28 items-center h12 px4 py2.5 hover:bg-gray-2
            class="text-grey-8!"
          >
            <div text="4" font-600 text-nowrap>
              {{ item.nameZH }}
            </div>
          </router-link>
        </div>
        <div style="flex: 1 1 auto;">
          <router-view />
        </div>
      </div>
    </div>
  </HomeLayout>
</template>

<style scoped lang="scss">
.userCenter {
  background: no-repeat center / cover url("../assets/layout/userCenter.png");
}
</style>
