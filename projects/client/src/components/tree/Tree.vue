<script lang="ts" setup>
interface Customize {
  nameZH: string
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
  <div class="q-pa-md row no-wrap my-10 bg-grey-2">
    <q-expansion-item
      dense-toggle
      switch-toggle-side
      col-9
      max-w-lg
      lg:max-w-4xl sm:max-w-lg xl:max-w-5xl
      header-class="font-600 text-5 text-grayness-8"
      :label="nameZH"
    >
      <q-expansion-item
        v-for="child in children"
        :key="child.id"
        dense-toggle
        switch-toggle-side
        :label="child.nameZH"
        :header-inset-level="1"
        :content-inset-level="2"
        header-class="font-600 text-4 text-grayness-8"
      >
        <div
          v-if="child.children"
          :class="child.children.length < 3 ? 'lg:grid-cols-2 sm:grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'"
          grid gap-1
        >
          <q-item
            v-for="i in child.children"
            :key="i.nameZH"
            v-ripple
            :to="{ path: '/database/dataIntroduce', query: { dataId: i.id, rootId: route.query.database, reference, label: props.label } }"
            clickable
            rounded-0
            text-nowrap
            class="col-grow"
            text-grey-8 @click="$emit('update:id', i.id)"
          >
            <q-item-section text-grey-8>
              <q-item-label lines="1">
                {{ i.nameZH }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-expansion-item>
    </q-expansion-item>
  </div>
</template>

<style  lang="scss" scoped>
.q-expansion-item :deep(.q-expansion-item__container){
    .q-item {
        border-radius:8px;
        .q-item__section{
            align-items:start
        }
    }

}
</style>
