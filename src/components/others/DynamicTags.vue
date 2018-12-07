<template>
  <div class="dynamic-tags">
       <span v-for="tag in dynamicTags" :key="tag" class="text-tag">
              {{ tag }}
          <i class="el-icon-close" @click="handleClose(tag)"></i>
      </span>
      <template v-if="this.dynamicTags.length !== this.max">
        <el-input
          class="input-new-tag"
          v-model="inputValue"
          v-if="inputVisible"
          ref="saveTagInput"
          size="small"
          maxlength="20"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button @click="showInput" v-else class="button-new-tag" size="small" icon='el-icon-circle-plus-outline'>添加关键词</el-button>
      </template>
  </div>
</template>

<script>
export default {
  name: 'dynamic-tags',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    max: {
      type: Number,
      default: 20
    },
    validate: {
      type: Function,
      default: () => {
        return true
      }
    }
  },
  data () {
    return {
      dynamicTags: this.value,
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.$emit('input', this.dynamicTags)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue && this.validate(inputValue)) {
        this.dynamicTags.push(inputValue)
        this.$emit('input', this.dynamicTags)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/core.scss';

.dynamic-tags{
  // $inputH : 36px;
  max-height: 200px;
  overflow-y: auto;
  margin: -7px 0 -12px;
  font-size: 0;
  .text-tag{
    padding: 5px 10px;
    margin: 9px 12px 9px 0;
    background-color: #F9F9F9;
    vertical-align: middle;
    font-size: 14px;
  }
  .button-new-tag,.input-new-tag{
    margin: 9px 0;
    vertical-align: middle;
  }
  .button-new-tag {
    border-radius: 24px;
    line-height: 30px;
    padding: 0 14px;
    font-weight: normal;
  }
  .input-new-tag {
    line-height: 28px;
    .el-input__inner{
      width: 119px;
      border-radius: 24px;
      font-size: 14px;
    }
  }
}

</style>
