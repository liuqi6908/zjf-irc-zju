<script lang="ts" setup>
interface Customize {
  nameZH: string
  nameEN: string
  id: string
  children?: Customize[]
  reference?: string
  label?: string
}

const props = defineProps<Customize>()
defineEmits(['update:id'])

const route = useRoute()
</script>

<template>
  <!-- 两个层级 -->
  <div bg="grey-2" p3>
    <db-expansion
      dense-toggle
      switch-toggle-side
      header-class="font-600 text-5"
      :label="nameZH"
    >
      <template #label>
        <div text-5 font-bold text-gray-8>
          {{ nameZH }}
        </div>
      </template>
      <div class="divider" flex="~ col" gap6 pl10 pt4>
        <db-expansion
          v-for="child in children"
          :key="child.id"
          dense-toggle
          switch-toggle-side
          :label="child.nameZH"
          header-class="font-600 text-4.5"
        >
          <template #label>
            <div text-4.5 font-600 text-gray-8>
              {{ child.nameZH }}
            </div>
          </template>
          <div
            v-if="child.children"
            gap4 py2 pl4
            class="tables-grid"
          >
            <q-item
              v-for="i in child.children"
              :key="i.nameEN"
              :to="{ path: '/database/dataIntroduce', query: { dataId: i.id, rootId: route.query.database, reference, label: props.label } }"
              clickable dense rounded-0 text-left text-nowrap text-grey-8
              :title="i.nameZH"
              @click="$emit('update:id', i.id)"
            >
              <q-item-section text-grey-8>
                <q-item-label lines="1">
                  {{ i.nameZH }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </db-expansion>
      </div>
    </db-expansion>
  </div>
</template>

<style  lang="scss" scoped>
.q-expansion-item :deep(.q-expansion-item__container) {
  & > .q-item {
    min-height: 30px;
    .q-item__section {
      text-align: start;
      color: var(--grey-8)
    }
    .q-item__section--avatar {
      width: auto;
      min-width: 0;
      padding-right: 0px;
      color: var(--grey-4);
      margin-right: 10px;

      i {
        font-size: 16px;
      }
    }
  }

  .q-focus-helper::after {
    opacity: 0.5 !important;
  }
}

.divider > div:not(:nth-last-child(1)) {
  position: relative;

  &::after {
    content: "";
    width: 100%;
    height: 1px;
    background: var(--grey-3);
    position: absolute;
    bottom: -12px;
    left: 0;
  }
}

.divider :deep(.q-expansion-item__container) {
  & > .q-item {
    min-height: 26px;
    padding: 4px;
  }
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
