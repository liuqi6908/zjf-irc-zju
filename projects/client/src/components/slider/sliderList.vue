<script lang="ts" setup>
import { useRouter } from 'vue-router'

interface Item {
  nameZH: string
  id: string
  clicked?: boolean
  router?: { path: string; query?: any }
}

interface Props {
  list: Item[]
  currentId: string
}
const props = defineProps<Props>()
const emits = defineEmits(['update:currentId'])

const router = useRouter()

function updateId(item: Item) {
  const clickedIdList = props.list.filter(i => i.id !== item.id)
  for (const c of clickedIdList)
    c.clicked = false

  item.clicked = true
  emits('update:currentId', item.id)
}
onMounted(() => {
  const itemToClick = props.list.find(item => item.id === props.currentId)
  if (!itemToClick)
    return
  updateId(itemToClick)
  // if (itemToClick.router)
  //   router.push(itemToClick.router)
})
</script>

<template>
  <q-list>
    <q-item
      v-for="item in list"
      :key="item.id"
      :to="item.router"
      clickable font-600
      :active="item.clicked || false"
      active-class="text-primary-1"
      @click="updateId(item)"
    >
      {{ item. nameZH }}
    </q-item>
  </q-list>
</template>

<style lang="">

</style>
