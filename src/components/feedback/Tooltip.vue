<template>
  <div :class="[effect === 'dark' ? 'dark-tip':'light-tip','tool-tip']">
    <!-- <span class="tool-tip-icon"></span> -->
    <div class="tool-tip-icon">
      <slot name="tipIcon">
        <i class="tip-icon-interpret" slot="tipIcon"></i>
      </slot>
    </div>
    <!-- <transition name="fade"> -->
      <div class="tool-tip-content">
        <slot name="tipContent">
          {{content}}
        </slot>
      </div>
    <!-- </transition> -->

  </div>
</template>

<script>
export default {
  name: 'toop-tip',
  props: {
    content: String,
    effect: {
      type: String,
      default: 'light'
    },
    placement: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggleTip (state) {
      this.show = state
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/core.scss";
.tool-tip{
  display: inline-block;
  position: relative;
  &.light-tip{
     @include size(14px);
     vertical-align: -2px;
  }
  &.dark-tip{
    .tool-tip-content{
      width: 78px;
      height: 30px;
      left: 40px;
      line-height: 10px;
      padding: 10px;
      background: #192F45;
      border: 1px solid #D7DBE6;
      box-shadow: 0 2px 4px 0 #D7DBE6;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
      z-index: 2001;
      &::before{
        left: -4px;
        @include triangle($direction:'left',$borderColor:#192F45);
      }
    }
  }
  &.light-tip:hover{
    .tool-tip-content{
      opacity: 1;
      transform: translateY(-50%);
      pointer-events: auto;
      color: #666666;
    }
  }
  &.dark-tip:hover{
    .tool-tip-content{
      opacity: 0.7;
    }
  }
  .tip-icon-interpret{
    display: inline-block;
    width:14px;
    height:14px;
    position: absolute;
    top: 0;
    left: 0;
    background: url("../../assets/icons/tool-tip-icon.png") no-repeat center/contain;
    cursor: pointer;
  }
  .tool-tip-content{
    text-align: justify;
    @include center-translate(y);
    transition: opacity ease-in-out 0.3s;
    opacity: 0;
    transform-origin: 0 0;
    transform: translateY(-50%);
    // transform: scale(1) translateY(-50%);
    pointer-events: none;
    z-index: 10;
    line-height: 16px;
    &::before{
      content: '';
      display: inline-block;
      @include size(20px);
      position: absolute;
      top: 50%;
      left: -17px;
      z-index: 10;
      background:url(../../assets/icons//tool-tip-tri.png) no-repeat;
      background-position: 4px 2px;
      background-size: contain;
      transform: translateY(-50%);
    }

    left: 200%;
    width: 305px;
    padding: 10px;
    background: #FFF;
    border: 1px solid #D7DBE6;
    box-shadow: 0 2px 4px 0 #D7DBE6;
    border-radius: 3px;
    font-size: 12px;
    color: $info-text-color;
  }
}
</style>
