const highlightText = function (value, arg) {
  arg.sort(sortString)
  var b = value.split(arg[arg.length - 1]).join('<span class="highlight">' + arg[arg.length - 1] + '</span>')
  if (arg.length > 1) {
    return this.highlightText(b, arg.slice(0, -1))
  }
  return b
}
const sortString = function (a, b) {
  if (a.length > b.length) {
    return 1
  } else {
    return 0
  }
}
export {
  highlightText
}
