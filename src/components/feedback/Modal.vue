<template>
    <div :class="['modal', modalShow?'modal-open':'']">
        <transition name="fade-in">
          <div class="modal-mask" @click="maskClose" v-show="visible"></div>
        </transition>
        <transition name="modal-fade-up" @after-leave="leave">
          <div class="modal-content" v-drag="draggable" v-show="visible">
              <div class="modal-header" :class="{'drag': draggable}" v-if="showHeader">
                  <slot name="title">
                      {{title}}
                  </slot>
            </div>
              <span class="modal-close" @click="close" v-if="showClose">
                  <i class="el-icon-close"></i>
              </span>
              <hr v-if='showLine' class="cutline">
              <div class="modal-body">
                  <slot>{{content}}</slot>
              </div>
              <hr v-if='showLine' class="cutline">
              <div class="modal-footer"  v-if="showFooter">
                  <slot name="footer" v-if="btnChange">
                      <el-button @click="comfirm">{{ comfirmText }}</el-button>
                      <el-button @click="cancel" type="primary">
                          {{ cancelText }}
                      </el-button>
                  </slot>
                  <slot name="footer" v-else>
                      <el-button @click="cancel" size="medium" v-if="showCancel">{{ cancelText }}</el-button>
                      <el-button type="primary" size="medium" @click="comfirm" :disabled="comfirmBtnDisabled || loading" :class="{'loading-btn':loading}">
                          <Loading v-show="loading"/>
                          {{ comfirmText }}
                      </el-button>
                  </slot>
              </div>
          </div>
        </transition>
    </div>
</template>

<script>
import Loading from './Loading'
export default {
  name: 'modal',
  // mixins: [emitter],
  components: {
    Loading
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '提示'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    comfirmText: {
      type: String,
      default: '保存'
    },
    comfirmBtnDisabled: {
      type: Boolean,
      default: false
    },
    content: {
      type: String
    },
    draggable: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    // close 和 cancel 方法一致
    syncCancel: {
      type: Boolean,
      default: true
    },
    // @cancel & @comfirm 事件互换
    btnChange: Boolean,
    showLine: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.value,
      modalShow: false
      // wait: false
    }
  },
  directives: {
    drag: {
      bind (el, binding) {
        if (binding.value) {
          const $header = el.querySelector('.modal-header')
          const {width: docW, height: docH} = document.body.getBoundingClientRect()
          $header.onmousedown = function (e) {
            const {width: modalW, height: modalH} = el.getBoundingClientRect()
            const disX = e.clientX - el.offsetLeft
            const disY = e.clientY - el.offsetTop
            document.onmousemove = function (e) {
              let l = e.clientX - disX
              let t = e.clientY - disY
              if (l < 0) {
                l = 0
              }
              if (l >= docW - modalW) {
                l = docW - modalW
              }
              if (t < 0) {
                t = 0
              }
              if (t >= docH - modalH) {
                t = docH - modalH
              }
              el.style.position = 'fixed'
              el.style.left = l + 'px'
              el.style.top = t + 'px'
              // console.log(`left:${l}`)
            }
            document.onmouseup = function (e) {
              document.onmousemove = null
              document.onmouseup = null
            }
          }
        }
      }
    }
  },
  methods: {
    maskClose () {
      if (this.maskClosable) {
        this.close()
      }
    },
    close () {
      if (this.syncCancel) {
        this.cancel()
      } else {
        this.$emit('close')
      }
    },
    comfirm () {
      // if (this.loading) {
      //   this.wait = true
      // }
      this.$emit('comfirm')
    },
    cancel () {
      this.$emit('cancel')
      this.$emit('update:value', false)
    },
    leave (el, done) {
      this.modalShow = false
      this.$emit('leave', el, done)
      if (this.draggable && el.style.position === 'fixed') {
        // 还原偏移位置
        el.style.position = 'relative'
        el.style.left = ''
        el.style.top = ''
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
      if (!val) {
        // console.log(val)

        // el.style.left = 0
        // el.style.top = 0
        // this.wait = false
        // document.body.classList.remove("overflow-hidden");
      } else {
        this.modalShow = true
        // document.body.classList.add("overflow-hidden");
      }
    }
  },
  mounted () {
    this.modalShow = this.visible
  },
  destroyed () {
    if (this.appendToBody && this.$el) {
      this.$el.parentNode.removeChild(this.$el)
      // this.wait = false
      this.modalShow = false
    }
  }
}
</script>
