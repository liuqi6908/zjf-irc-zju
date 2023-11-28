<script lang="ts" setup>
import { watch } from 'vue'

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

function updateId(item: Item) {
  const clickedIdList = props.list.filter(i => i.id !== item.id)
  for (const c of clickedIdList)
    c.clicked = false

  item.clicked = true
  emits('update:currentId', item.id)
}

watch(
  () => props.currentId,
  (id) => {
    if (!id)
      return
    const itemToClick = props.list.find(item => item.id === id)
    updateId(itemToClick || props.list[0])
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <q-list flex="~ col" gap2 text-grey-8>
    <q-item
      v-for="item in list"
      :key="item.id"
      :to="item.router"
      flex="~ col justify-center"
      :active="item.clicked || false"
      :class="{
        'text-grey-#292D36': !item.clicked,
        'text-primary-1': item.clicked,
      }"
      clickable max-w-200px px-16px py-10px text-left text-nowrap text-4 font-600
      active-class="bg-gray-2"
      @click="updateId(item)"
    >
      {{ item.nameZH }}
    </q-item>
  </q-list>
</template>
