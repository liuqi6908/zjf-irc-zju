const { $patch } = useRequest()

/**
 * 更新引用规范
 * @param id
 * @param reference
 * @returns
 */
export function updateReference(id: string, reference: string) {
  return $patch(`/data/reference/${id}`, { reference })
}
