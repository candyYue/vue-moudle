<template>
  <div>
    <el-input type="textarea" :maxlength="maxLength" ref="script"
      :autosize="autosize"
      @input="handleInput"
      @keydown.native="selFields"
      :placeholder="placeholder"
      v-model="textareaValue"
      :disabled='disabled'></el-input>
    <ul class="v-contextmenu v-contextmenu--default" ref="fields"
        v-if="selectOpts.length && fieldsShow"
        :style="fieldStyle"
    >
      <li v-for="select in selectOpts" :key="select.id" class="v-contextmenu-item"
        @mouseover="removeLight"
        @click="addFields(select.title)">
        {{ select.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getCursorXY } from '@/utils/helper/position'
import { debounce } from 'lodash'
// import 'v-contextmenu/dist/index.css'
// eslint-disable-next-line
const ClASS_ACTIVE = 'v-contextmenu-item--hover'

export default {
  name: 'editable-textarea',
  data () {
    return {
      selectOpts: this.selectList,
      textareaValue: this.value,
      fieldsShow: false,
      fieldStyle: {
        top: 0,
        left: 0
      },
      // 编辑字段状态
      selectionStart: 0, // @位置
      context: {
        before: '',
        key: '',
        behind: ''
      },
      end: false
    }
  },
  props: {
    getList: {
      type: Function,
      default: () => {}
    },
    maxLength: {
      type: Number,
      default: 200
    },
    value: {
      type: String,
      default: ''
    },
    usingFields: {
      type: Boolean,
      default: true
    },
    selectList: {
      type: Array,
      default () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    autosize: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.textareaValue = val
    },
    fieldsShow (val) {
      val ? this.selectOpts = this.selectList : this.selectOpts = []
    },
    selectOpts (val) {
      if (this.fieldsShow && val.length) {
        setTimeout(() => {
          this.selectOpts.length && this.$refs.fields.firstChild.classList.add(ClASS_ACTIVE)
        }, 200)
      }
    }
  },
  methods: {
    handleInput (val) {
      this.$emit('input', this.textareaValue)
      if (this.usingFields) {
        const $input = this.$refs.script.$refs.textarea
        if (this.textareaValue.substring(0, $input.selectionStart).slice(-1) === '@') {
          this.getFieldList($input)
        }

        if (this.selectionStart > this.textareaValue.substring(0, $input.selectionStart).length) {
          this.removeFieldList()
        }

        if (this.fieldsShow) {
          const {
            behind
          } = this.context
          const tempstr = val.substring(this.selectionStart, val.length)
          const querykey = (val.substring(this.selectionStart, val.length)).substring(0, tempstr.length - behind.length)
          // console.log(querykey)
          this.$set(this.context, 'key', querykey)
          this.selectOpts = this.selectList.filter(d => d.title.includes(querykey))
        }
      }
    },
    async getFieldList ($input) {
      if (this.end) {
        this.selectOpts = this.selectList
      } else {
        this.selectOpts = await this.getList()
        this.end = true
      }

      this.selectionStart = $input.selectionStart
      this.$set(this.context, 'before', this.textareaValue.slice(0, this.selectionStart))
      this.$set(this.context, 'behind', this.textareaValue.slice(this.selectionStart))
      this.fieldsShow = true
      this.getPosition($input)
    },
    removeFieldList () {
      this.fieldsShow = false
    },
    addFields (field) {
      const $input = this.$refs.script.$refs.textarea
      const { before, behind } = this.context
      this.textareaValue = `${before}${field} ${behind}`
      this.$emit('input', this.textareaValue)
      setTimeout(() => {
        const pos = this.selectionStart + field.length + 1
        $input.focus()
        $input.setSelectionRange(pos, pos)
      }, 20)
    },
    selFields (e) {
      if (this.selectOpts.length && this.fieldsShow) {
        let activeItem
        const mouseover = document.createEvent('MouseEvents')
        mouseover.initEvent('mouseover', true, false)
        for (let node of this.$refs.fields.childNodes) {
          if (node.classList.contains(ClASS_ACTIVE)) {
            activeItem = node
            node.removeEventListener('mouseover', this.removeLight)
          }
        }
        switch (e.which) {
          case 13: // enter
            e.stopPropagation()
            e.preventDefault()
            this.addFields(activeItem.textContent.trim())
            this.removeFieldList()
            break
          case 38: // up
            if (activeItem.previousSibling) {
              this.hightLight(activeItem.previousSibling)
              this.scroll(activeItem.previousSibling)
            }
            break
          case 40: // down
            if (activeItem.nextSibling) {
              this.hightLight(activeItem.nextSibling)
              this.scroll(activeItem.nextSibling)
            }
            break
        }
      }
    },
    scroll (el) {
      const $fields = this.$refs.fields
      const $fieldsBox = $fields.getBoundingClientRect()
      const wrapH = $fieldsBox.height
      const innerH = el.offsetTop + el.getBoundingClientRect().height
      // const scrollH = $fields.scrollHeight - wrapH
      if (innerH - wrapH > 0) {
        $fields.scrollTop = innerH - wrapH
      } else {
        $fields.scrollTop = 0
      }
    },
    hightLight (el) {
      let siblings = [].filter.call(this.$refs.fields.childNodes, child => child !== this)
      siblings.forEach(item => item.classList.remove(ClASS_ACTIVE))
      el.classList.add(ClASS_ACTIVE)
    },
    removeLight (e) {
      this.hightLight(e.target)
    },
    getPosition () {
      if (this.fieldsShow) {
        const $input = this.$refs.script.$refs.textarea
        if (this.selectList.length) {
          const position = getCursorXY($input, this.selectionStart)
          const [left, top] = [position.x, position.y]
          this.fieldStyle = {
            top: top + 'px',
            left: left + 'px'
          }
        }
      }
    }
  },
  mounted () {
    document.body.addEventListener('click', v => {
      this.fieldsShow = false
    })
    this.$nextTick(() => {
      document.querySelector('#view')
        .addEventListener('scroll', debounce(this.getPosition))
    })
  },
  destroyed () {
    document.querySelector('#view')
      .removeEventListener('scroll', debounce(this.getPosition))
  }
}
</script>
<style scoped>
.v-contextmenu{
  position: fixed;
  background: #fff;
  z-index: 9;
  transition: top 0.3s ease-out, left 0.3s ease-out;
}
.v-contextmenu .v-contextmenu-item{
  line-height: 14px;
}
</style>
