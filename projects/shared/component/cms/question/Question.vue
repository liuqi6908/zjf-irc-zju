<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute,useRouter }  from 'vue-router'

interface Question {
  title: string
  richText: string
}

interface Props {
  list: Question[]
}
defineProps<Props>()

const link = ref('')

const route = useRoute()
const router = useRouter()

function scrollTo(title: string, index: number) {
  link.value = title
  if(typeof document !=='undefined'){
    const target = document.querySelector(`#title${index}`)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
      router.replace({query:{title,index}})
    }
  }
}

onMounted(() => {
  const { title, index } = route.query
  scrollTo(title, index)
})
</script>

<template>
  <div flex="~ row gap-15" max-w-6xl>
    <q-list text-grey-8>
      <div sticky top-0>
        <q-item
          w-50 v-for="(item, index) in list" class="ellipsis" flex="~ col justify-center items-start" font-600
          clickable @click="scrollTo(item.title, index)" :active="link === item.title"
          active-class="text-primary-1 bg-grey-2"
        >
          <q-item-section>
            <q-item-label lines="1">
              {{ item.title }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <div flex="~ col" w-1000>
      <q-expansion-item
        py-12 border-b border-grey-3 dense dense-toggle switch-toggle-side
        header-class="font-600 text-5 text-grayness-8" v-for="(item, index) in list" :key="index"
        :id="`title${index}`" :label="item.title"
      >
        <div mt-4 ml-10 w-150 border-l-2  p-5 style="border-color:#025CB9B2">
          <div w-150 v-html="item.richText" />
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-expansion-item :deep(.q-expansion-item__container) {
  .q-item {
    .q-item__section {
      align-items: start;
      i {
          font-size: 18px
      }
    }
    .q-item__section--avatar{
      min-width: 20px;
    }
  }
}
</style>