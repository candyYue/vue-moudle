<template>
  <path
    class='vue-tree-link-base'
    :d="linkPath"
    :style = "initStyle"
    :ref="`link-${linkData.data.id}`"
  />
</template>

<script>
import { select } from 'd3'

export default {
  name: 'Link',
  props: {
    linkData: Object,
    transitionDuration: Number
  },
  data () {
    return {
      initStyle: {
        opacity: 0
      }
    }
  },
  computed: {
    linkPath () {
      const d = this.linkData
      // 偏移量 18 = 2r+2gap = 2*7 + 2*2
      const [sx, sy] = [d.x, d.y - 44]
      // r = 7; gap = 2
      const [px, py] = [d.parent.x, d.parent.y + 44 + 18]
      let factor = 0
      let dx = parseInt(sx - px)
      if (dx > 10) {
        factor = 1
      }
      if (dx < -10) {
        factor = -1
      }
      const dt = (py - sy) / 2
      const path =
        'M' + sx + ',' + sy +
        'Q' + sx + ',' + (sy + dt * 0.9) +
        ' ' + (sx + dt * factor) + ',' + (sy + dt) +
        'L' + (px - dt * factor) + ',' + (sy + dt) +
        'Q' + (px) + ',' + (sy + dt * 1.2) +
        ' ' + px + ',' + py
      return path
    }
  },
  methods: {
    applyOpacity (opacity = 1, oldOpacity = 0) {
      if (this.transitionDuration) {
        select(this.$refs[`link-${this.linkData.data.id}`])
          .style('opacity', oldOpacity)
          .attr('transform', `scale(1, ${oldOpacity})`)
          .transition()
          .duration(this.transitionDuration)
          .style('opacity', opacity)
          .attr('transform', `scale(1, ${opacity})`)
      } else {
        select(this.$refs[`link-${this.linkData.data.id}`])
          .style('opacity', opacity)
      }
    }
  },
  mounted () {
    this.applyOpacity()
  },
  beforeDestroy () {
    this.applyOpacity(0, 1)
  }
}
</script>
