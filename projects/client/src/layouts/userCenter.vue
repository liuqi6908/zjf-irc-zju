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
])

const clickId = ref('authentication')
</script>

<template>
  <HomeLayout>
    <div flex="~ col" class="fit" bg-grey-2>
      <header border-b-1 pb-6 text-5 font-600 text-grey-8 flex="~ row justify-start">
        用户中心
      </header>

      <div flex="~ row" class="col-grow" flat mt-8 rounded-3 bg-grey-1 p-6>
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
