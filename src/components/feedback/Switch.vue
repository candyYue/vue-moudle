<template>
  <div class="el-radio-group common-radio">
    <label v-for="button in buttons" :key="button.value"
      class="el-radio-button"
      @click="change(button)"
    >
        <span :class="['el-radio-button__inner', {'el-radio-button__active': button.value === switchValue}]">{{button.label}}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'switch-button',
  props: {
    autoChange: {
      type: Boolean,
      default: true
    },
    value: [String, Number],
    buttons: {
      type: Array,
      default: () => {
        return [
          {
            label: '启用',
            value: 1
          },
          {
            label: '停用',
            value: 0
          }
        ]
      }
    }
  },
  data () {
    return {
      switchValue: this.value,
      disabled: false
    }
  },
  watch: {
    value (val) {
      this.switchValue = val
      this.disabled = false
    }
  },
  methods: {
    change (button) {
      if (this.disabled) {
        return false
      }
      const changeState = button.value !== this.switchValue
      if (this.autoChange && changeState) {
        this.switchValue = button.value
        this.$emit('change', button.value)
        this.$emit('input', button.value)
        return
      }
      if (changeState) {
        this.disabled = true
        this.$emit('change', button.value)
        this.$emit('input', button.value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/core.scss";
.el-radio-button__inner{
  padding: 7px 27px;
}
.el-radio-button__active{
  background-color: $theme-color;
  color: #fff;
  border-color: $theme-color;
  box-shadow: -1px 0 0 0 $theme-color;
}
</style>
