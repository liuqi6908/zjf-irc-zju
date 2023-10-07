<script lang="ts" setup>
import * as mammoth from 'mammoth'
import { getDataDescribe } from '~/api/file/dataDescribe'

const route = useRoute()
const url = ref('')
const docHtml = ref('')
const link = ref('')
const navHtml = ref<{
  toc: {
    text: string
    id: number
    level: number
  }[]
  article: HTMLElement
}>()

// const tableStyle

function judegeISHEaderHtml(node: HTMLElement) {
  return Object.prototype.toString.call(node) === '[object HTMLHeadingElement]'
}

function resolveHTML(html: string) {
  if (typeof document !== 'undefined') {
    const article = document.createElement('article')
    article.innerHTML = html
    const hs = article.querySelectorAll('h1, h2, h3 ,h4')
    const hsArr = Array.from(hs) as HTMLElement[]

    const parentCursorMap = {} as any
    const toc = []
    let id = 0

    for (const h of hsArr) {
      id++
      const level = +h.tagName.slice(1)

      h.setAttribute('id', id)

      if (id === 1)
        h.setAttribute('style', 'width: 100% !important;display: flex !important;flex-direction: inherit;align-items: center')

      const node = { text: h.innerText, id, level }

      if (level === 1) {
        toc.push(node)
        parentCursorMap[level] = node

        continue
      }

      const parentLevel = level - 1
      const parentCursor = parentCursorMap[parentLevel]

      if (!parentCursor)
        throw new Error(`parent level ${parentLevel} not found`)

      if (!parentCursor.children)
        parentCursor.children = []

      parentCursor.children.push(node)
      parentCursorMap[level] = node
    }
    return { toc, article }
  }
}

const navList = computed(() => {
  const nodeList = []
  if (navHtml.value?.article.childNodes) {
    for (const node of navHtml.value?.article.childNodes) {
      if (judegeISHEaderHtml(node))
        nodeList.push(node)
    }
  }
  return nodeList
})

/** 解析 */
function parseDocFile(fileData: ArrayBuffer) {
  mammoth.convertToHtml({ arrayBuffer: fileData }).then((res) => {
    const html = res.value
    docHtml.value = html
    navHtml.value = resolveHTML(docHtml.value)
  }).catch((err) => {
    console.error('error', err)
  })
}

function downloadDoc(url: string) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer'
  xhr.onload = function () {
    const fileData = xhr.response
    parseDocFile(fileData)
  }
  xhr.send()
}

function scrollTo(title: string, index: number) {
  link.value = title
  if (typeof document !== 'undefined') {
    const target = document.getElementById(`${index + 1}`)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
}

onMounted(() => {
  const { rootId, nameEN } = route.query
  url.value = getDataDescribe(rootId, `${nameEN}.docx`)
  // console.log({ url })
  downloadDoc(url.value)
})
</script>

<template>
  <div w-limited-1 flex="~ col justify-center items-center">
    <header flex="~ row" w-full items-center font-600 gap4 py6>
      <q-btn flat dense h6 min-h6 w6 p0 text-grey-6 @click="() => $router.back()">
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#6E7686" />
        </svg>
      </q-btn>
      <span text="grey-8 5" cursor-pointer @click="() => $router.back()"> 数据库介绍</span>
    </header>

    <Empty v-if="!docHtml" label="暂无数据库介绍" min-h-160 />
    <div v-else full pn-10 flex="~ row gap-10">
      <div>
        <q-list text-grey-8 sticky top-0 h-100vh overflow-x-hidden overflow-y-auto class="navs">
          <q-item
            v-for="(node, index) in navList"
            :key="index" class="ellipsis"
            flex="~ col justify-center items-start" min-h-10 p-0 font-600 clickable w-50 px2 :active="link === node.textContent"
            active-class="text-primary-1 bg-grey-2" @click="scrollTo(node.textContent, index)"
          >
            <q-item-section>
              <q-item-label lines="1">
                {{ node.textContent }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="docHtml" pb4 flex="~ col justify-start items-start" v-html="navHtml?.article.innerHTML" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.docHtml :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.docHtml :deep(th) {
    padding: 8px;
    text-align: left;
    font-weight: bold;
    border: 1px solid #ccc;
}

  /* 数据单元格样式 */
.docHtml :deep(td) {
    padding: 8px;
    border: 1px solid #ccc;
}

.navs {
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* 修改滚动条的轨道背景颜色 */
  &::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 24px;
    border: 1px solid #D4DDEA;
    &:hover {
      border-color: #cdd6e4;
    }
  }

  /* 修改滚动条的滑块样式 */
  &::-webkit-scrollbar-thumb {
    background-color: #D4DDEA;
    border-radius: 24px;
    &:hover {
      background-color: #cdd6e4;
    }
  }
}
</style>

<style lang="sass">
.docHtml

  tr:nth-child(1)
    background-color: #e0e0e0
  tbody tr:nth-child(1)
    background-color: unset

  p
    line-height: 1.8
    text-align: left
    text-indent: 2em
    word-break: break-all
    margin-bottom: 10px

  img
    margin: 40px auto

  table p
    margin-bottom: 0
</style>

<route lang="yaml">
meta:
  layout: home
</route>
