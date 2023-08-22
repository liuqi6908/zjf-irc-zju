<script lang="ts" setup>
import CurrentData from './CurrentData.vue'

const { geRootData, rootData } = useDataBase()

const databaseId = ref('')
const router = useRouter()

onBeforeMount(() => {
  geRootData().finally(() => {
    if (rootData.value && rootData.value.length) {
      rootData.value = rootData.value.map((item) => {
        return {
          ...item,
          router: { path: '/database', query: { database: item.id } },
        }
      })
    }
    router.push({ query: { database: rootData.value[0].id } })
  },
  )
})
</script>

<template>
  <div flex="~ col" full bg-grey-1>
    <header class="database" h-40 w-full flex-center>
      <div text-grey-1 title-1>
        常见问题解答(Q&A)
      </div>
    </header>
    <div class="col-grow" flex-start mt-15 justify-center flex="~ row gap-10">
      <SliderList :list="rootData" router @update:id="(id) => databaseId = id" />

      <CurrentData />
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
