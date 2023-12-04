<script setup lang="ts">
import type { Node } from '../SetRoles.vue'

interface Props {
  tree: Node[]
  id: string[]
  title: string
}

const props = defineProps<Props>()
defineEmits(['update:list'])

const list = reactive(props.id)
const expanded: string[] = reactive([])

/**
 * 获取id对应的label
 * @param id
 */
function findLabelById(id: string, tree = props.tree): string | undefined {
  for (const node of tree) {
    if (node.id === id)
      return node.label
    if (node.children) {
      const label = findLabelById(id, node.children)
      if (label)
        return label
    }
  }
  return undefined
}

/**
 * 全选
 */
function checkAll() {
  if (isStringArrayContainsAll(props.tree.map(v => v.id), list))
    list.splice(0, list.length)
  else
    list.splice(0, list.length, ...props.tree.map(v => v.id))
}

/**
 * 判断字符串数组是否完全包含另一个字符串数组
 * @param source
 * @param target
 */
function isStringArrayContainsAll(source: string[], target: string[]): boolean | null {
  let count = 0
  for (let i = 0; i < target.length; i++) {
    if (source.includes(target[i]))
      count++
  }

  return count ? (count >= source.length ? true : null) : false
}

/**
 * 选中权限
 * @param id
 */
function checkRole(id: string) {
  if (list.includes(id))
    list.splice(list.indexOf(id), 1)
  else
    list.push(id)
}
</script>

<template>
  <div flex="~ 1 col" gap-2 h-0>
    <!-- title 和 全选 -->
    <div text-base font-600>
      {{ title }}
      <q-checkbox
        toggle-indeterminate
        :model-value="isStringArrayContainsAll(tree.map(v => v.id), list)"
        label="全选"
        @click="checkAll()"
      />
    </div>
    <!-- 权限 -->
    <q-scroll-area flex-1 h-0>
      <div flex="~ row" h-full gap-4>
        <!-- 类 -->
        <div class="roles">
          <div
            v-for="item in tree"
            :key="item.id"
            class="role"
            :class="{
              active: expanded[0] === item.id,
            }"
          >
            <q-checkbox
              :model-value="list.includes(item.id)"
              size="sm"
              @click="checkRole(item.id)"
            />
            <div @click="() => expanded[0] === item.id ? expanded[0] = '' : expanded[0] = item.id">
              <div v-text="item.label" />
              <q-icon v-if="item.children && item.children.length" name="fas fa-chevron-right" />
            </div>
          </div>
        </div>
        <!-- 数据库 -->
        <div class="roles">
          <div
            v-for="item in tree.find(v => v.id === expanded[0])?.children"
            :key="item.id"
            class="role"
            :class="{
              active: expanded[1] === item.id,
            }"
          >
            <q-checkbox
              :model-value="list.includes(item.id)"
              size="sm"
              @click="checkRole(item.id)"
            />
            <div @click="() => expanded[1] === item.id ? expanded[1] = '' : expanded[1] = item.id">
              <div v-text="item.label" />
              <q-icon v-if="item.children && item.children.length" name="fas fa-chevron-right" />
            </div>
          </div>
        </div>
        <!-- 子库 -->
        <div class="roles">
          <div
            v-for="item in tree.find(v => v.id === expanded[0])?.children?.find(v => v.id === expanded[1])?.children"
            :key="item.id"
            class="role"
            :class="{
              active: expanded[2] === item.id,
            }"
          >
            <q-checkbox
              :model-value="list.includes(item.id)"
              size="sm"
              @click="checkRole(item.id)"
            />
            <div @click="() => expanded[2] === item.id ? expanded[2] = '' : expanded[2] = item.id">
              <div v-text="item.label" />
              <q-icon v-if="item.children && item.children.length" name="fas fa-chevron-right" />
            </div>
          </div>
        </div>
        <!-- 模块 -->
        <div class="roles">
          <div
            v-for="item in tree.find(v => v.id === expanded[0])?.children?.find(v => v.id === expanded[1])?.children?.find(v => v.id === expanded[2])?.children"
            :key="item.id"
            class="role"
            :class="{
              active: expanded[3] === item.id,
            }"
          >
            <q-checkbox
              :model-value="list.includes(item.id)"
              size="sm"
              @click="checkRole(item.id)"
            />
            <div @click="() => expanded[3] === item.id ? expanded[3] = '' : expanded[3] = item.id">
              <div v-text="item.label" />
              <q-icon v-if="item.children && item.children.length" name="fas fa-chevron-right" />
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="roles">
          <div
            v-for="item in tree.find(v => v.id === expanded[0])?.children?.find(v => v.id === expanded[1])?.children?.find(v => v.id === expanded[2])?.children?.find(v => v.id === expanded[3])?.children"
            :key="item.id"
            class="role"
          >
            <q-checkbox
              :model-value="list.includes(item.id)"
              size="sm"
              @click="checkRole(item.id)"
            />
            <div>
              <div v-text="item.label" />
              <q-icon v-if="item.children && item.children.length" name="fas fa-chevron-right" />
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>
    <!-- 已选择 -->
    <div flex gap="x-4 y-2" flex-wrap items-center max-h-20 overflow-hidden hover:overflow-auto>
      <div h-9 leading-9 v-text="'已选择：'" />
      <q-chip
        v-for="(item, index) in list"
        :key="item"
        :label="findLabelById(item) || item"
        square color="grey-2"
        removable m-0 h-9
        @remove="list.splice(index, 1)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.roles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar-track {
    background-color: transparent;
    border: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover {
    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 4px;
      border: 1px solid #D4DDEA;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #A6B1C2;
      border-radius: 4px;
    }
  }

  .role {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 35px;

    > div:last-child {
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      > div {
        white-space: nowrap;
      }

      > .q-icon {
        margin-left: 16px;
      }
    }

    &.active {
      color: var(--primary);
    }
  }
}
.q-chip {
  :deep(.q-icon) {
    font-size: 16px;
    color: #A6B1C2;
    margin: 0 2px 0 4px;
  }
}
/* 滚动条样式 */
* {
  &::-webkit-scrollbar {
    width: 8px;
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 4px;
    border: 1px solid #D4DDEA;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #A6B1C2;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #6E7686;
  }
}

.q-scrollarea {
  :deep(.q-scrollarea__content) {
    height: 100%;
  }
}
</style>
