<script lang="ts" setup>
import type { ItemList } from '~/components/nav/NavItem.vue'
import HomeLayout from '~/view/HomeLayout.vue'

const userList = ref<ItemList[]>([
  {
    name: '我的认证',
    id: 'authentication',
  },
  {
    name: '我的云桌面',
    id: 'cloudDesktop',
  },
  {
    name: '我的数据',
    id: 'myData',
  },
])

const clickId = ref('authentication')
</script>

<template>
  <HomeLayout>
    <div full bg-grey-2 p-8>
      <header border-b-1 pb-6 text-5 font-600 text-grey-8 flex="~ row justify-start">
        用户中心
      </header>

      <div flex="~ row" flat mt-8 rounded-3 bg-grey-1 p-6>
        <div border-r-1 border-grey-3 pr-6>
          <router-link
            v-for="u in userList"
            :key="u.id"
            :to="`${u.id}`"
          >
            <nav-item
              :id="u.id"
              :name="u.name"
              :click-id="clickId"
              @update:id="(val) => clickId = val"
            />
          </router-link>
        </div>
        <div class="col-grow" pl-6>
          <router-view />
        </div>
      </div>
    </div>
  </HomeLayout>
</template>
