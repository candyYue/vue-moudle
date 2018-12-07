export function getCursorXY (input, selectionStart) {
  // const input = e.target
  const inputDimensions = input.getBoundingClientRect()
  const {
    left: inputX,
    top: inputY,
    width: inputWidth
  } = inputDimensions

  const inputValue = input.value
  const div = document.createElement('div')
  const span = document.createElement('span')
  div.classList.add('el-textarea__inner', 'el-textarea__copy')
  div.style.width = inputWidth + 'px'
  div.innerText = inputValue.substr(0, selectionStart)
  span.innerText = inputValue.substr(selectionStart) || '.'
  div.appendChild(span)
  document.body.appendChild(div)
  const spanDimensions = span.getBoundingClientRect()
  const {
    left: spanX,
    top: spanY,
    width: spanW,
    height: spanH
  } = spanDimensions
  document.body.removeChild(div)

  return {
    x: inputX + spanX + spanW,
    y: inputY + spanY + spanH
  }
}

export function contextmenuPos (e, target) {
  // const {
  //   innerWidth,
  //   innerHeight
  // } = window
  const x = e.clientX || (e.touches && e.touches[0].pageX)
  const y = e.clientY || (e.touches && e.touches[0].pageY)
  const targetDimensions = target.getBoundingClientRect()
  let postition = {
    top: y,
    left: x
  }
  const scrollLeft = document.body.getBoundingClientRect().x || document.body.getBoundingClientRect().left
  // const {
  //   x: scrollLeft
  // } = document.body.getBoundingClientRect()
  postition.left = postition.left - scrollLeft
  // if (y + targetDimensions.height > innerHeight) {
  //   postition.top -= targetDimensions.height
  // }
  // console.log(targetDimensions)
  // if (x + targetDimensions.width > innerWidth) {
  //   postition.left -= targetDimensions.width
  // }
  if (y + targetDimensions.height > document.body.clientHeight) {
    postition.top = document.body.clientHeight - targetDimensions.height - 80
    // console.log(targetDimensions.height)
    // postition.top = targetDimensions.height < innerHeight ? (innerHeight - targetDimensions.height) / 2 : 0
  }

  // if (postition.left < 0) {
  //   postition.left = targetDimensions.width < innerWidth ? (innerWidth - targetDimensions.width) / 2 : 0
  // }

  return postition
}
