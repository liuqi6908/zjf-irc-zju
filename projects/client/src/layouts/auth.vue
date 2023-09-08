<script lang="ts" setup>
const $router = useRouter()
</script>

<template>
  <div class="confirmation" full flex="~ row">
    <!-- <img src="../assets/auth/authRect.svg"> -->
    <div class="confirmation-bgImg col-grow">
      <header flex="~ row items-center" text-grey-1 absolute top-8 left-8 cursor-pointer @click="$router.push('/')">
        <img h-12 w-12 src="../assets/auth/couldTitle.png">
        <span text-7 font-600>智能云科研平台 |</span>
        <span text-4 font-400>&nbsp;CloudResearch</span>
      </header>
    </div>

    <!-- auth card  -->
    <div class="col-5 flex-center" mr-40>
      <div
        flex="~ col" class="confirmation-card"
        min-w-sm p-10 backdrop-blur-md
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
      background: no-repeat center / cover url("../assets/auth/authBgRect.svg");
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
