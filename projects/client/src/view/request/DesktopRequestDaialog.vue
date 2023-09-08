<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Notify } from 'quasar'
import { putDesktopRequest } from '../../api/file/putDesktopRequest'
import { desktopRequest } from '../../api/desktop/desktopRequest'

import ZDialog from '../../components/dialog/ZDialog.vue'
import ZSelect from '../../components/select/ZSelect.vue'
import UploadFile from '../../components/file/UploadFile.vue'

defineProps<Props>()
const $emit = defineEmits(['update:modelValue', 'callback'])

const options = [
  { label: '6个月', id: 180 },
  { label: '12个月', id: 360 },
  { label: '长期', id: 999 },
]

const select = ref(options[0])
const files = ref<File[]>([])
const file = ref<File>()
const attachments = ref<Array<string>>([])
const read = ref(false)

interface Props {
  modelValue: boolean
}

async function confirm() {
  const requestRes = await desktopRequest(select.value.id, attachments.value)
  if (requestRes) {
    Notify.create({
      message: '申请成功',
      type: 'success',
    })
    $emit('callback')
  }
}

watch(file, async (newFile) => {
  if (newFile) {
    const name = await putDesktopRequest(newFile.name, newFile)
    if (name) {
      attachments.value.push(name)
      files.value.push(newFile)
    }
    else {
      Notify.create({
        message: '文件上传失败',
        type: 'danger',
      })
    }
  }
})

/**
 * 移除文件
 * @param index
 */
function removeFile(index: number) {
  files.value.splice(index, 1)
  attachments.value.splice(index, 1)
}
</script>

<template>
  <ZDialog
    confirm-text="提交"
    :wrapper-style="{ maxWidth: '488px' }"
    title="申请使用"
    caption=" （申请结果前往“用户中心”查看）"
    :disable-confirm="!read || !files.length"
    :model-value="modelValue"
    footer
    @ok="confirm"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <div flex="~ col" gap2>
      <span text-3.5 font-600 text-grey-8>云桌面使用时长</span>
      <ZSelect v-model="select" class="req-duration-select" :options="options" />
    </div>

    <div my-6 flex="~ col">
      <div flex="~ row justify-between items-center" mb-2>
        <span text-3.5 font-600 text-grey-8>研究计划/其他材料</span>
        <UploadFile v-model="file">
          <q-btn bg="primary-1/12" flat square h8 px4 text-primary-1>
            <div flex="~" items-center gap-2>
              <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.935547 13.6673V0.333984H7.60221L9.26888 2.00065H17.6022V3.66732H8.58138L6.91471 2.00065H2.60221V12.0007L4.60221 5.33398H18.8522L16.3522 13.6673H0.935547ZM4.35221 12.0007H15.1022L16.6022 7.00065H5.85221L4.35221 12.0007Z" fill="#025CB9" />
              </svg>
              <span>提交文件</span>
            </div>
          </q-btn>
        </UploadFile>
      </div>

      <div flex="~ col" gap2>
        <div v-for="(item, index) in files" :key="index" flex="~ row" items-center justify-between text-grey-5 class="file-item">
          <div flex="~" items-center gap1>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.570312 13.6673V0.333984H7.23698L11.237 4.33398V13.6673H0.570312ZM6.57031 5.00065V1.66732H1.90365V12.334H9.90365V5.00065H6.57031Z" fill="#6E7686" />
            </svg>
            <span text-grey-8>{{ item.name }}</span>
          </div>
          <div flex="~ center" h4 w4 cursor-pointer @click="removeFile(index)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.50495 10.334L6.90495 7.93398L9.30495 10.334L10.2383 9.40065L7.83828 7.00065L10.2383 4.60065L9.30495 3.66732L6.90495 6.06732L4.50495 3.66732L3.57161 4.60065L5.97161 7.00065L3.57161 9.40065L4.50495 10.334ZM6.90495 13.6673C5.98273 13.6673 5.11606 13.4922 4.30495 13.142C3.49384 12.7918 2.78828 12.3169 2.18828 11.7173C1.58828 11.1173 1.11339 10.4118 0.763615 9.60065C0.413837 8.78954 0.238726 7.92287 0.238281 7.00065C0.238281 6.07843 0.413392 5.21176 0.763615 4.40065C1.11384 3.58954 1.58873 2.88398 2.18828 2.28398C2.78828 1.68398 3.49384 1.2091 4.30495 0.859318C5.11606 0.50954 5.98273 0.334429 6.90495 0.333984C7.82717 0.333984 8.69384 0.509096 9.50495 0.859318C10.3161 1.20954 11.0216 1.68443 11.6216 2.28398C12.2216 2.88398 12.6967 3.58954 13.0469 4.40065C13.3972 5.21176 13.5721 6.07843 13.5716 7.00065C13.5716 7.92287 13.3965 8.78954 13.0463 9.60065C12.6961 10.4118 12.2212 11.1173 11.6216 11.7173C11.0216 12.3173 10.3161 12.7924 9.50495 13.1426C8.69384 13.4929 7.82717 13.6678 6.90495 13.6673Z" fill="#A6B1C2" />
            </svg>
          </div>
          <!-- <q-icon class="remove" name="fas fa-close" relative cursor-pointer top-1px hidden @click="removeFile(index)" /> -->
        </div>
      </div>
    </div>

    <ProtocolFooter v-model="read" />
  </ZDialog>
</template>

<style lang="scss" scoped>
.file-item {
  &:hover {
    .remove {
      display: inline-block;
    }
  }
}
</style>

<style lang="sass">
.req-duration-select .q-field__native > div
  color: var(--grey-5)
</style>
