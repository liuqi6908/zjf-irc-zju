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
}
const props = defineProps<Props>()
const emits = defineEmits(['update:id'])

const router = useRouter()

function goooo(item: Item) {
  const clickedIdList = props.list.filter(i => i.id !== item.id)
  for (const c of clickedIdList)
    c.clicked = false

  item.clicked = true
  emits('update:id', item.id)
}
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
      @click="goooo(item)"
    >
      {{ item. nameZH }}
    </q-item>
  </q-list>
</template>

<style lang="">

</style>
