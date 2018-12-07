import uuid from 'uuid'

export const assignProperties = (data) => {
  return data.map(node => {
    node.id = node.id || uuid.v4()
    node._collapsed = node._collapsed || false
    if (node.children && node.children.length > 0) {
      node.children = assignProperties(node.children)
      node._children = node._children || node.children
    }
    return node
  })
}
