function Time () {
  this.token = {
    'YY': 'year',
    'MM': 'month',
    'DD': 'day',
    'hh': 'hour',
    'mm': 'minute',
    'ss': 'second'
  }
  this.zeroFill = (number) => (+number < 10 ? ('0' + number) : number)
  this.format = (tmp = 'hh:mm:ss') => {
    return tmp.replace(/YY|MM|DD|hh|mm|ss/g, (match) => this[this.token[match]])
  }
}

function TimeStamp (value = +new Date() / 1000) {
  Time.call(this, arguments)
  value = +value * 1000
  let date = new Date(value)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let sencond = date.getSeconds()
  this.year = year
  this.month = this.zeroFill(month)
  this.day = this.zeroFill(day)
  this.hour = this.zeroFill(hour)
  this.minute = this.zeroFill(minute)
  this.second = this.zeroFill(sencond)
}

function Duration (value = 0) {
  Time.call(this, arguments)
  let second = Math.ceil(value)
  let hour = Math.floor(second / 3600)
  let minute = Math.floor(second % 3600 / 60)
  let sencond = second % 60
  this.hour = this.zeroFill(hour)
  this.minute = this.zeroFill(minute)
  this.second = this.zeroFill(sencond)
}
export const timeStamp = (value) => (tmp) => (value === 0 ? '' : new TimeStamp(value).format(tmp))
export const duration = (value) => (tmp) => new Duration(value).format(tmp)
