<script lang="ts" setup>
const $router = useRouter()
</script>

<template>
  <div class="confirmation" absolute inset-0 flex="~ row">
    <div class="col-grow confirmation-bgImg">
      <header flex="~ items-center gap-2" text-grey-1 absolute cursor-pointer left-12 top-10 @click="$router.push('/')">
        <img w-12 src="../assets/auth/couldTitle.png">
        <div text-7 font-600>
          智能云科研平台
        </div>
        <div w-3px h-8 bg-grey-1 />
        <div text-lg>
          CloudResearch
        </div>
      </header>
    </div>

    <!-- auth card  -->
    <div class="flex-center col-5" mr-40>
      <div
        flex="~ col" class="confirmation-card"
        w-26rem p-10 backdrop-blur-md
      >
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$confirmation-bg: linear-gradient(90deg, #2F96FB 0%, #2041B7 100%);
$linear: linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.01) 100%);

.confirmation {
    overflow: hidden;
    background: $confirmation-bg;
    &_ellipse {
        position: fixed;
        top:0;
        left:0;
        height:100%;
        width:100%
    }
    &-bgImg {
      background: no-repeat url(~/assets/auth/authBgRect.svg);
      background-size: cover;
    }
    &-card {
      border: 1px solid transparent;
      border-image: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1))  1;
      background: $linear;
    }
}
</style>

<style lang="sass">
.confirmation-card label.q-input
  --q-primary: white
  .q-field__control::after
    border-width: 1px
</style>
