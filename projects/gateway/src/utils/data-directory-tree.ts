import { objectOmit } from '@catsjuice/utils'
import type { DataDirectory } from 'src/entities/data-directory'

export function createDataDirectoryTree(
  nodes: DataDirectory[],
  scope: DataDirectory['id'][],
) {
  // 将 nodes 转换为树结构，并且只保留 scope 中的节点
  const nodesIdMap = new Map(nodes.map(node => [node.id, node]))
  const parentMap = new Map<DataDirectory['id'], DataDirectory[]>()
  const roots: DataDirectory[] = []

  for (const node of nodes) {
    const { parentId } = node
    if (parentId) {
      const parent = nodesIdMap.get(parentId)
      if (parent) {
        const children = parentMap.get(parentId) || []
        children.push(node)
        parentMap.set(parentId, children)
      }
    }
    else {
      roots.push(node)
    }
  }

  const tree = (function buildTree(nodes: DataDirectory[]) {
    return nodes.map((node) => {
      const children = parentMap.get(node.id)
      return {
        ...node,
        children: children ? buildTree(children) : [],
      }
    })
  }
  )(roots)

  // scope 为树节点的 id，将树中不在 scope （及其子节点）中的节点删除
  function filterTree(tree: DataDirectory[]) {
    return tree.filter((node) => {
      if (scope.includes(node.id))
        return true
      node.children = filterTree(node.children)
      return node.children.length > 0
    })
  }

  function sortAndMap(list: DataDirectory[]) {
    return list.sort((a, b) => a.order - b.order).map((node) => {
      const children = node.children
      return {
        ...objectOmit(node, ['children', 'path', 'rootId', 'order', 'level', 'parentId']),
        children: children ? sortAndMap(children) : undefined,
      }
    })
  }

  return sortAndMap(filterTree(tree))
}