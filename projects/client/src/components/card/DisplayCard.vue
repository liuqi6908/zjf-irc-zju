<script lang="ts" setup>
interface Props {
  title: string
  icon: string
  article: string
}
defineProps<Props>()
</script>

<template>
  <q-card border-rd-3 p-x-10 p-b-6 p-t-12>
    <div class="card-icon" absolute h-14 w-14 flex-center bg-primary-1>
      <div v-html="icon" />
    </div>
    <div text-5 font-600 text-grey-8>
      {{ title }}
    </div>
    <br>
    <span indent-1 text-grey-6>
      {{ article }}
    </span>
  </q-card>
</template>

<style lang="scss" scoped>
.card-icon {
    left:calc(50% - 2.5rem);
    top:-30px;
    border-radius:50% !important;
}
</style>
