<script lang="ts" setup>
interface Customize {
  label: string
  header: string
  title: string
  ckey: string
  children?: Customize[]
}
defineProps<Customize>()
</script>

<template>
  <!-- 两个层级 -->
  <q-card rounded-4 class="q-pa-md row no-wrap">
    <q-expansion-item

      dense-toggle switch-toggle-side col-9 max-w-lg lg:max-w-4xl sm:max-w-lg xl:max-w-5xl
      header-class="font-600 text-5 text-grey-8"
      :label="label"
    >
      <q-expansion-item
        v-for="child in children"
        :key="child.ckey"
        dense-toggle
        switch-toggle-side
        :label="child.label"
        :header-inset-level="1"
        :content-inset-level="2"
        header-class="font-600 text-4 text-grey-8"
      >
        <q-card col-grow sm:grid-col-2 grid gap-2 lg:grid-cols-3 xl:grid-cols-4>
          <q-item
            v-for="i in child.children"
            :key="i.label"
            active-class="bg-primary-1 text-white"
            clickable
            text-grey-5
          >
            <q-item-section>
              {{ i.label }}
            </q-item-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-expansion-item>

    <div flex flex-auto justify-end>
      <span cursor-pointer font-500 text-primary-1>
        查看介绍
      </span>
    </div>
  </q-card>
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
