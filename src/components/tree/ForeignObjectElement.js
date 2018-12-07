const ForeignObjectElement = {
  name: 'ForeignObjectElement',
  inject: ['$$tree'],
  props: {
    nodeData: Object,
    renderForeignObjects: Function
  },
  // render: function (createElement, context) {
  //   return this.renderForeignObjects(createElement, this.nodeData)
  // },
  created () {
    if (this.$$tree.$scopedSlots) {
      const $node = this.$options.parent
      const nodeData = $node.$options.propsData.nodeData.data
      this.$options.render = h => h('div', [
        this.$$tree.$scopedSlots.default(nodeData)
      ])
    }
  }
}

export default ForeignObjectElement
