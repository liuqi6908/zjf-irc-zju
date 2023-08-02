<script lang="ts" setup>

</script>

<template>
  <div class="confirmation" full flex-center>
    <svg preserveAspectRatio="none" class="confirmation_ellipse" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1639 1080" fill="none">
      <g filter="url(#filter0_di_102_10500)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M144.502 1141.97C144.502 1141.98 144.502 1141.99 144.502 1142H804.5C901.5 1138.83 1164.7 1043.6 1441.5 688C1565.03 529.297 1669.59 339.859 1752.5 160.02V-228C1272.49 -97 746.026 71.4971 476.003 348C217.047 613.169 147.285 950.23 144.502 1121.03V1141.97Z" fill="#1877F2" />
      </g>
      <defs>
        <filter id="filter0_di_102_10500" x="0.501953" y="-345" width="1808" height="1570" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="-44" dy="-17" />
          <feGaussianBlur stdDeviation="50" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_102_10500" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_102_10500" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="-14" dy="-29" />
          <feGaussianBlur stdDeviation="40" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_102_10500" />
        </filter>
      </defs>
    </svg>

    <!-- auth card  -->
    <q-card flex="~ col" style="width: 30%;" min-w-sm rounded-4 p-10>
      <header flex="~ flex col items-center justify-center">
        <img h-18 w-18 src="../assets/layout/cloud.svg">
        <span text-5 font-600 text-grey-8>智能云科研平台</span>
      </header>
      <div class="input_group">
        <RouterView />
      </div>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
$confirmation-bg:#1877F2;

.confirmation {
    overflow:hidden;
    background-color: $confirmation-bg;
    &_ellipse{
        position:fixed;
        top:0;
        left:0;
        height:100%;
        width:100%
    }
}
</style>
