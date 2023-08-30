/**
 * 选择4个坐标值
 * @param array
 * @param numElements
 */
export function selectEquallyDistributedElements(array: Array<any>, numElements = 4) {
  const interval = Math.floor(array.length / numElements)
  const selectedElements = []

  for (let i = 0; i < numElements; i++)
    selectedElements.push(array[i * interval])

  return selectedElements
}
