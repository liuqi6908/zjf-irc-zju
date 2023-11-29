<script lang="ts" setup>
import { onMounted, ref, reactive, nextTick, computed } from 'vue'
import { useRoute, useRouter }  from 'vue-router'
import { RichTextProcessor } from '../../../utils/rich-text.processor'

interface Question {
  title: string
  richText: string
}

interface Props {
  list: Question[]
}
const props = defineProps<Props>()

const link = ref('')
const openState = reactive<Record<string, boolean>>({})

const route = useRoute()
const router = useRouter()

function scrollTo(title: string, index: number) {
  openState[title] = true

  if (typeof document !=='undefined'){
    nextTick(() => {
      link.value = title
      const target = document.querySelector(`#title${index}`)
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
        });
        router.replace({query:{title,index}})
      }
    })
  }
}

onMounted(() => {
  const { title, index } = route.query
  scrollTo(String(title), Number(index))
})

const processedList = computed(() => props.list.map(q => ({
  ...q,
  richText: RichTextProcessor.from(q.richText).lazyLoadImages().html
})))
</script>

<template>
  <div flex="~ row gap-15" w-full>
    <q-list text-grey-8>
      <div sticky top-10 flex="~ col" gap2>
        <q-item
          w-50 v-for="(item, index) in processedList"
          class="ellipsis"
          flex="~ col"
          text-4
          justify-center items-start font-600
          clickable @click="scrollTo(item.title, index)"
          :active="link === item.title"
          active-class="text-primary-1 bg-gray-2"

        >
          <q-item-section>
            <q-item-label lines="1">
              {{ item.title }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <div flex="~ col 1" w0 gap-16 pb16>
      <div
        :id="`title${index}`" :label="item.title"
        v-for="(item, index) in processedList" :key="index" relative
      >
        <q-item clickable flex="~" items-center gap-2 @click="openState[item.title] = !openState[item.title]">
          <div
            w6 h6 transition-all flex-center
            :style="{ transform: openState[item.title] ? 'rotate(0deg)' : 'rotate(-90deg)' }"
          >
            <svg  width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5L0 0H10L5 5Z" fill="black"/>
            </svg>
          </div>
          <span text="5 grey-8" font-bold>{{ item.title }}</span>
        </q-item>
        <q-expansion-item
          v-model="openState[item.title]"
          header-class="display-none"
        >
          <div w-full overflow-hidden pl12 pt4>
            <div relative full pl4>
              <div absolute w2px left-0 top="1/2" translate-y="-1/2" bg="primary-1/70" style="height: calc(100% - 10px)"></div>
              <div class="question-content" w-150 v-html="item.richText" />
            </div>
          </div>
        </q-expansion-item>

        <div v-if="index !== 0" w-full px4 absolute left-0 top="-8">
          <div w-full h1px bg-grey-3 />
        </div>
      </div>
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

<style lang="sass">
.question-content
  color: var(--grey-6)
  text-align: start
</style>