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
    <div py-10 w-full flex="~ col" items-center>
      <label cursor-pointer for="dropZoneFile">
        <div class="label-box" mb-2 border-1 text-primary-1 border-primary-1 w-14 h-14 flex items-center justify-center>
          <q-icon name="far fa-plus" />
        </div>
        <div font-500 text="sm primary-1">选择文件</div>
      </label>
      <input id="dropZoneFile" ref="dropZoneFileRef" class="drop-zone-file" type="file" @change="handleFileChange">
      <slot />
    </div>
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
  border: 1px dashed $border-color;
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
