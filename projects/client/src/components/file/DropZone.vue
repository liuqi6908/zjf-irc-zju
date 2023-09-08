<script setup lang="ts">
import { ref } from 'vue'

const active = ref(false)
const dropZoneFileRef = ref()

function toggleActive(event: Event) {
  active.value = !active.value
}
</script>

<template>
  <section
    p-3
    class="drop-zone-container"
    :class="{ 'active-dropzone': active }"
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
  >
    <label mt-5 cursor-pointer for="dropZoneFile">
      <div class="label-box" mb-2 border-1 text-primary-1 border-primary-1 w-14 h-14 flex items-center justify-center>
        <q-icon name="far fa-plus" />
      </div>
      <span font-500 text-primary-1>选择文件</span>
    </label>
    <input id="dropZoneFile" ref="dropZoneFileRef" class="drop-zone-file" type="file" @change="handleFileChange">

    <slot />

    <!-- <div flex="~ col">
      <div text-grey-5 flex="~ row">
        注：
        <div flex="~ col items-start">
          <span>
            （1）小于 100KB 的文件无需审核，每日最多外发5个。
          </span>
          <span>（2）大于 100KB 且小于 5 MB 的数据，需要通过后台审核。</span>
          <span>
            （3） 技术人员将在1-2个工作日内，对申请外发的文件进行审核，符合外发标准的文件将发送至您填写的邮箱地址。
          </span>
        </div>
      </div>
      <div flex="~ row items-center gap-2" mt-3 text-alert-error>
        <div h-2 w-2 rounded-999 bg-alert-error />
        未经允许，不得私自外发原始微观数据，违法者将依法追究法律责任
      </div>
    </div> -->
  </section>
</template>

<style scoped lang="scss">
$border-color: #D4DDEA;
.drop-zone-container {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  border: 2px dashed $border-color;
  background-color: #fff;
  transition: all 0.3s ease;

  label {
    // padding: 8px 12px;
    // color: #fff;
    .label-box {
      background-color: rgba(2, 92, 185, 0.12);
      transition: all 0.3s ease;
    }
  }

  input {
    display: none;
  }
}

.active-dropzone {
  border: 1px solid $border-color;
  // color: #fff;

  label {
    .label-box {
      background-color: rgba(2, 92, 185, 0.09) !important;
      color: $border-color !important;
    }
  }
}
</style>
