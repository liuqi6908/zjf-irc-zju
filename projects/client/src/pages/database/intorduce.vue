<script lang="ts" setup>
import * as mammoth from 'mammoth'
import { getDataDescribe } from '~/api/file/dataDescribe'

const route = useRoute()
const url = ref('')
const docHtml = ref('')

/** 解析 */
function parseDocFile(fileData: ArrayBuffer) {
  const unit8Arr = new Uint8Array(fileData)
  mammoth.convertToHtml({ arrayBuffer: unit8Arr }).then((res) => {
    const html = res.value
    docHtml.value = html
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
watch(() => route.query,
  async (query) => {
    url.value = getDataDescribe(query.rootId, `${query.nameEN}.doc`)
    downloadDoc(url.value)
  }, { immediate: true },
)
</script>

<template>
  <div flex="~ col  items-center" min-h-4xl bg-grey-1>
    <div full max-w-4xl>
      <header flex="~ row items-center" mb-10 font-600>
        <q-btn flat mr-2 text-grey-6 :to="{ path: '/database', query: { database: route.query.rootId } }">
          <div i-mingcute:left-line h-6 w-6 />
        </q-btn>
        <span text-grey-8> 数据库介绍</span>
      </header>

      <Empty v-if="!docHtml" label="暂无数据库介绍" />
      <div v-else v-html="docHtml" />
    </div>
  </div>
</template>

<style lang="">

</style>

<route lang="yaml">
meta:
  layout: home
</route>
