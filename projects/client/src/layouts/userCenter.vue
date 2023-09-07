<script lang="ts" setup>
import HomeLayout from '~/view/HomeLayout.vue'

const $route = useRoute()

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
const currentId = ref(userList.value.find(v => $route.path.includes(v.router.path))?.id || userList.value[0].id)
</script>

<template>
  <HomeLayout>
    <div flex="~ col" class="fit">
      <header class="userCenter" h-64 w-full flex-center shrink-0>
        <div text-grey-1 title-1>
          用户中心
        </div>
      </header>

      <div flex="~ row" w-limited-1 rounded-3 bg-grey-1 p-6>
        <div flex="~ col" gap6>
          <!-- <SliderList v-model:current-id="currentId" :list="userList" /> -->
          <router-link
            v-for="item in userList"
            :key="item.id"
            active-class="bg-gray-2 text-primary-1!"
            :to="item.router"
            flex="~"
            h12 w28 items-center px4 py2.5 hover:bg-gray-2
            class="text-grey-8!"
          >
            <div text="4" font-600>
              {{ item.nameZH }}
            </div>
          </router-link>
        </div>

        <div pl-6 style="flex: 1 1 auto;">
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
