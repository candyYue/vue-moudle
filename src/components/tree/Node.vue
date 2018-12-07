<template>
  <g
    :ref="nodeData.data.id"
    :transform="transform"
    :style="initStyle"
  >
    <foreignObject
      :x="-nodeSize.x/2" :y="-nodeSize.y/2"
      :width="nodeSize.x" :height="nodeSize.y"
    >
      <ForeignObjectElement v-if="allowForeignObjects"
        :nodeData="nodeData"
        :renderForeignObjects="renderForeignObjects"
      />
    </foreignObject>

    <g v-if="nodeData.data.children && nodeData.data.children.length"
      :transform="collapseIcon" class="vue-tree__collapse-icon" @click="handleNodeToggle"
    >
        <circle r="7"></circle>
        <line x1="-4" y1="0" x2="4" y2="0"/>
        <line x1="0" y1="4" x2="0" y2="-4" v-show="nodeData.data._collapsed"/>
    </g>
  </g>
</template>

<script>
import { select } from 'd3'
// import { select, drag, event } from 'd3'
import ForeignObjectElement from './ForeignObjectElement'
export default {
  name: 'Node',
  components: {
    ForeignObjectElement
  },
  props: {
    nodeData: Object,
    nodeSize: Object,
    nodeSvgShape: String,
    nodeSvgShapeAttr: Object,
    transitionDuration: Number,
    orientation: String,
    allowForeignObjects: Boolean,
    renderForeignObjects: Function
  },
  data () {
    return {
      transform: '',
      initStyle: {
        opacity: 0
      }
    }
  },
  computed: {
    collapseIcon () {
      return this.orientation === 'horizontal'
        ? `translate(${this.nodeSize.x / 2},0)`
        // r = 7; gap = 2
        : `translate(0,${this.nodeSize.y / 2 + 7 + 2})`
    }
  },
  watch: {
    nodeData: {
      handler (val, oldVal) {
        const before = `translate(${oldVal.x},${oldVal.y})`
        const after = `translate(${val.x},${val.y})`
        this.applyTransform(after, before)
      }
    }
  },
  methods: {
    renderNodeElement () {
      const nodeEl = select(this.$refs[this.nodeData.data.id])
        .append(this.nodeSvgShape)

      Object.entries(this.nodeSvgShapeAttr).forEach(item => {
        nodeEl.attr(item[0], item[1])
      })
    },
    setTransform (deep, back = false) {
      const [x, y] = [this.nodeData.x, this.nodeData.y]
      const nodeDataParent = this.nodeData.parent
      const [parentX, parentY] = (nodeDataParent) ? [nodeDataParent.y, nodeDataParent.x] : [0, 0]
      const transform = this.orientation === 'horizontal' ? `translate(${y},${x})` : `translate(${x},${y})`
      let parentTransform = this.orientation === 'horizontal' ? `translate(${parentX},${parentY})` : `translate(${parentY},${parentX})`
      parentTransform = deep ? parentTransform : transform
      if (back) {
        this.applyTransform(parentTransform, transform)
      } else {
        this.applyTransform(transform, parentTransform)
      }
    },
    applyTransform (transform, parentTransform, opacity = 1, done = () => {}) {
      const node = select(this.$refs[this.nodeData.data.id])
      if (this.transitionDuration) {
        node
          .attr('transform', parentTransform)
          .transition()
          .duration(this.transitionDuration)
          .attr('transform', transform)
          .attr('style', `opacity: ${opacity}`)
        done()
      } else {
        node
          .attr('transform', transform)
          .attr('style', `opacity: ${opacity}`)
        done()
      }
    },
    handleNodeToggle () {
      this.$emit('handleNodeToggle', this.nodeData)
    }
  },
  mounted () {
    this.setTransform(true)
  }
  // beforeDestroy () {
  //   console.log('beforeDestroy')
  //   console.log(this.nodeData)
  //   this.setTransform(true, true)
  // }
}
</script>
