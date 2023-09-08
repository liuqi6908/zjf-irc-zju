import { useQuasar } from 'quasar'
import { defineAsyncComponent } from 'vue'

export interface ConfirmDialogProps {
  /** 标题内容 */
  title?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮文本 */
  okText?: string
  /** 主题色 */
  color?: string
  /** 主体内容 */
  content?: string
}

export function useDialog() {
  const $q = useQuasar()

  /**
   * 显示普通的确认对话框
   * @param options
   */
  async function showConfirmDialog(options?: ConfirmDialogProps) {
    return $q.dialog({
      component: await defineAsyncComponent(
        () => import('./confirm.dialog.vue'),
      ).__asyncLoader(),
      componentProps: { options },
    })
  }

  return { showConfirmDialog }
}
