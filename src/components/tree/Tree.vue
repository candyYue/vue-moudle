<template>
  <div :class="['vue-tree-container','vue-tree-grabbable']"
  >
    <svg :ref="svgRef" width="100%" height="100%">
      <transition>
        <g :ref="gRef"
         :transform="`translate(${translateValue.x},${translateValue.y}) scale(${scale})`"
        >

        <Link v-for="(link,index) in tree.links" :key="index"
          :orientation="orientation"
          :linkData="link"
          :transitionDuration="transitionDuration"
        />

        <Node v-for="node in tree.nodes" :key="node.data.id"
            :nodeData="node"
            :nodeSize="nodeSize"
            :transitionDuration="transitionDuration"
            :orientation="orientation"
            :nodeSvgShape="nodeSvgShape"
            :nodeSvgShapeAttr="nodeSvgShapeAttr"
            :allowForeignObjects="allowForeignObjects"
            :renderForeignObjects="renderForeignObjects"
            @handleNodeToggle="handleNodeToggle"
        />
        </g>
      </transition>
    </svg>
    <div class="vue-tree-tool-bar">
      <el-button type="primary" plain icon="el-icon-plus" @click="changeScale(1)"/>
      <el-slider v-model="scaleValue" vertical :show-tooltip="false" height="98px"/>
      <el-button type="primary" plain icon="el-icon-minus" @click="changeScale(-1)"/>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid'
import NP from 'number-precision'
import { tree, hierarchy, select, event, zoom } from 'd3'
import { oneOf, typeOf } from '@/utils/helper/assist'
import { assignProperties } from './utils/dataHelper'
import Link from './Link'
import Node from './Node'
export default {
  name: 'tree',
  provide () {
    return {
      $$tree: this
    }
  },
  components: {
    Link,
    Node
  },
  props: {
    initData: {
      type: Array,
      required: true
    },
    orientation: {
      type: String,
      default: 'vertical',
      validator (value) {
        return oneOf(value, ['horizontal', 'vertical'])
      }
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    nodeSvgShape: {
      type: String,
      default: 'circle'
    },
    nodeSvgShapeAttr: {
      type: Object,
      default () {
        return {
          r: 10
        }
      }
    },
    pathFunc: {
      type: Function
    },
    nodeSize: {
      type: Object,
      default () {
        return {
          x: 234,
          y: 88
        }
      }
    },
    separation: {
      type: Object,
      default () {
        return {
          siblings: 1.2,
          nonSiblings: 1
        }
      }
    },
    zoomable: {
      type: Boolean,
      default: false
    },
    scaleExtent: {
      type: Object,
      default () {
        return { min: 0.1, max: 1 }
      }
    },
    translate: {
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        }
      },
      validator (value) {
        return typeOf(value.x) === 'number' && typeOf(value.y) === 'number'
      }
    },
    transitionDuration: {
      type: Number,
      default: 500
    },
    allowForeignObjects: Boolean,
    renderForeignObjects: {
      type: Function,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      svgRef: uuid.v4(),
      gRef: uuid.v4(),
      data: assignProperties(this.initData),
      nodes: [],
      links: [],
      scaleValue: 70,
      translateValue: this.translate
    }
  },
  computed: {
    scale: {
      get () {
        const { min, max } = this.scaleExtent
        const extent = NP.minus(max, min)
        const scale = NP.plus(NP.times(extent, NP.divide(this.scaleValue, 100)), min)
        // console.log(scale)
        return scale
      },
      set (val) {
        const { min, max } = this.scaleExtent
        const extent = NP.minus(max, min)
        const diff = NP.minus(val, min)
        this.scaleValue = NP.divide(diff, extent) * 100
      }
    },
    treemap () { // tree layout
      const { x, y } = this.nodeSize
      const treemap =
        tree()
          .nodeSize(this.orientation === 'horizontal' ? [ y, x / 0.9 ] : [ x / 0.9, y ])
          .separation((a, b) =>
            (a.parent.data.id === b.parent.data.id ? this.separation.siblings : this.separation.nonSiblings))
      return treemap
    },
    root () {
      const root =
        hierarchy(this.data[0], (d) => (d._collapsed ? null : d.children))
      return root
      // return hierarchy(this.data[0])
    },
    tree () {
      const treeData = this.treemap(this.root)
      const nodes = treeData.descendants()
      nodes.forEach(function (d) { d.y = d.depth * 180 })
      const links = treeData.descendants().slice(1)
      nodes.forEach(node => {
        node.y = node.y * 0.8
      })
      return { nodes, links }
    }
  },
  watch: {
    initData (val) {
      this.data = assignProperties(val)
    },
    translate (val) {
      this.translateValue = val
    }
  },
  methods: {
    bindZoomListener () {
      const self = this
      const svg = select(this.$refs[this.svgRef])
      const g = select(this.$refs[this.gRef])

      if (this.zoomable) {
        svg.call(
          zoom()
            .scaleExtent([this.scaleExtent.min, this.scaleExtent.max])
            .on('zoom', () => {
              const [lastX, lastY] = [this.translate.x, this.translate.y]
              const { x, y, k } = event.transform
              g.attr('transform', `translate(${lastX + x},${lastY + y}) scale(${k})`)
            })
        )
      } else {
        svg.call(
          zoom()
            .scaleExtent([1, 1])
            .on('zoom', () => {
              const [lastX, lastY] = [this.translate.x, this.translate.y]
              const { x, y } = event.transform
              self.translateValue = {
                x: lastX + x,
                y: lastY + y
              }
              // g.attr('transform', `translate(${lastX + x},${lastY + y}) scale(${this.scale})`)
            })
        )
      }
    },
    setInitialTreeDepth (nodeSet, initialDepth) {
      nodeSet.forEach(n => {
        n._collapsed = n.depth >= initialDepth
      })
    },
    changeScale (type) {
      const { max, min } = this.scaleExtent
      const interval = NP.divide(NP.minus(max, min), 10)
      if (type === 1) {
        const value = NP.plus(this.scale, interval)
        this.scale = (value > max) ? max : value
      } else {
        const value = NP.minus(this.scale, interval)
        this.scale = (value < min) ? min : value
      }
    },
    findNodeById (nodeId, nodeSet, hits = []) {
      if (hits.length > 0) {
        return hits
      }
      hits = hits.concat(nodeSet.filter(node => node.id === nodeId))
      nodeSet.forEach(node => {
        if (node._children && node._children.length > 0) {
          hits = this.findNodeById(nodeId, node._children, hits)
          return hits
        }
        return hits
      })
      return hits
    },
    handleNodeToggle (node) {
      const data = [...this.data]
      const targetNode = this.findNodeById(node.data.id, data)[0]
      targetNode._collapsed
        ? this.expandNode(targetNode)
        : this.collapseNode(targetNode)
      this.data = data
      // console.log(this.data)
    },
    expandNode (node) {
      node._collapsed = false
    },
    collapseNode (node) {
      node._collapsed = true
      // 深度折叠
      // if (node._children && node._children.length > 0) {
      //   node._children.forEach(child => {
      //     this.collapseNode(child)
      //   })
      // }
    }
  },
  mounted () {
    this.bindZoomListener()
  }
}
</script>
