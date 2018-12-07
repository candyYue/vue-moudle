export const numberOnly = {
  bind (el, binding, vnode) {
    const $this = vnode.componentInstance
    const $el = el.querySelector('input')
    el.handler = (e) => {
      const value = e.target.value.replace(/\D+/, '')
      setTimeout(() => {
        $this.$emit('input', value)
      }, 0)
    }
    $el.addEventListener('input', el.handler)
  },
  unbind (el) {
    const $el = el.querySelector('input')
    $el.removeEventListener('input', el.handler)
  }
}

export const toolTip = {
  bind (el, binding, vnode) {
    const initToolTip = () => {
      const $toolTip = document.createElement('span')
      $toolTip.classList.add('table-icon-tool-tip')
      $toolTip.innerHTML = binding.value
      document.body.appendChild($toolTip)
      el.toolTipWidth = $toolTip.getBoundingClientRect().width + 'px'
      return $toolTip
    }
    el.fadeInHandler = () => {
      el.$toolTip = el.$toolTip || initToolTip()
      const {
        x, y,
        width
      } = el.getBoundingClientRect()
      el.$toolTip.style.left = (x + (width / 2)) + 'px'
      el.$toolTip.style.top = (y + 25) + 'px'
      el.$toolTip.style.opacity = 1
      el.$toolTip.style.width = el.toolTipWidth
    }
    el.fadeOutHandler = () => {
      el.$toolTip.style.opacity = 0
    }

    el.addEventListener('mouseenter', el.fadeInHandler)
    el.addEventListener('mouseleave', el.fadeOutHandler)
  },
  unbind (el) {
    el.$toolTip && document.body.removeChild(el.$toolTip)
    el.removeEventListener('mouseenter', el.fadeInHandler)
    el.removeEventListener('mouseleave', el.fadeOutHandler)
  }
}
