<script lang="ts" setup>
import CurrentData from './CurrentData.vue'
import EmptyData from '~/components/empty/EmptyData.vue'

const { geRootData, rootData, loading } = useDataBase()

const databaseId = ref('')
const $router = useRouter()
const $route = useRoute()

onBeforeMount(() => {
  geRootData().finally(() => {
    if (rootData.value && rootData.value.length) {
      rootData.value = rootData.value.map((item) => {
        return {
          ...item,
          router: { path: '/database', query: { database: item.id, label: item.nameZH } },
        }
      })
    }
    const rootIds = rootData.value.map(item => item.id)
    if (rootIds.includes($route.query.database as string)) {
      databaseId.value = $route.query.database as string
      return
    }

    $router.push({ query: { database: rootData.value[0].id, label: rootData.value[0].nameZH } })
    databaseId.value = rootData.value[0].id
  },
  )
})

const empty = computed(() => !rootData.value.length || !rootData.value)
</script>

<template>
  <div flex="~ col" full min-h-4xl items-center bg-grey-1>
    <header class="database" h-40 w-full flex-center>
      <div text-grey-1 title-1>
        数据库
      </div>
    </header>
    <div
      class="col-grow" flex-start w-limited-1 mt-15 justify-center
      flex="~ row gap-10"
    >
      <SliderList :list="rootData" :current-id="databaseId" router @update:current-id="(id) => databaseId = id" />

      <div min-w-4xl flex-center>
        <q-spinner
          v-if="loading"
          color="primary-1"
          size="5rem"
          :thickness="2"
          label-class="text-primary-1"
          label-style="font-size: 1.1em"
        />
        <div v-else-if="empty">
          <EmptyData label="暂无数据" />
        </div>
        <CurrentData v-else :init-database="databaseId" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.database {
    background: no-repeat center / cover url("../../assets/layout/database.png");
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
