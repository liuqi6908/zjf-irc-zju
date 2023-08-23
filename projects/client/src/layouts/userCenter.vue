<script lang="ts" setup>
import HomeLayout from '~/view/HomeLayout.vue'

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

const editDialog = ref(false)
</script>

<template>
  <HomeLayout>
    <div flex="~ col" class="fit" bg-grey-2>
      <header class="userCenter" h-40 w-full flex-center>
        <div text-grey-1 title-1>
          用户中心
        </div>
      </header>

      <div flex="~ row" class="col-grow" flat rounded-3 bg-grey-1 p-6>
        <div border-r-1 border-grey-3 pr-6>
          <SliderList :list="userList" />
        </div>
        <div class="col-grow" pl-6>
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
