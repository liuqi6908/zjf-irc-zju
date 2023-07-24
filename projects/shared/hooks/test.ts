import { onMounted, onUnmounted } from "vue"

export function useTest() {
  onMounted(() => console.log("__mounted__"))
  onUnmounted(() => console.log("__unmounted__"))
}