import Vue from 'vue'

import Modal from '@/components/feedback/Modal'
import LazyLoadSelect from '@/components/form/LazyLoadSelect'
import ServiceGroupSelect from '@/components/form/ServiceGroupSelect'
import TablePagination from '@/components/layout/TablePagination'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Icon,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Pagination,
  Input,
  Form,
  FormItem,
  Select,
  Cascader,
  Option,
  DatePicker,
  TimePicker,
  TimeSelect,
  Upload,
  Loading,
  Col,
  Progress,
  Slider,
  Tooltip,
  Row
} from 'element-ui'
import {
  messageBox,
  messageTip
} from '@/components/feedback/Message'
import {
  timeStamp,
  duration
} from '@/utils/helper/filter.js'
import {
  numberOnly,
  toolTip
} from '@/utils/directives'

import '@/assets/css/common/theme.scss'
import '@/assets/css/widget/table.scss'
import '@/assets/css/widget/pagination.scss'
import '@/assets/css/widget/tabs.scss'
import '@/assets/css/widget/form.scss'
import '@/assets/css/widget/message.scss'
import '@/assets/css/widget/modal.scss'
import '@/assets/css/widget/select.scss'
import '@/assets/css/widget/cascader.scss'
import '@/assets/css/widget/loading.scss'
import '@/assets/css/widget/button.scss'
import '@/assets/css/widget/datetimepicker.scss'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const filter = function (Vue) {
  Vue.prototype.timeStamp = timeStamp
  Vue.prototype.duration = duration
  Vue.filter('timeStamp', timeStamp)
  Vue.filter('duration', duration)
  Vue.filter('formatSecond', (value) => duration(value)('hh:mm:ss'))
  Vue.filter('formatTime', (value) => timeStamp(value)('YY-MM-DD hh:mm:ss'))
}

zhLocale.el.pagination.total = '共 {total} 条，每页'
zhLocale.el.pagination.pagesize = ''
zhLocale.el.datepicker.now = '取消'

Vue.use(Button)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Icon)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(TimeSelect)
Vue.use(Upload)
Vue.use(Col)
Vue.use(Progress)
Vue.use(Slider)
Vue.use(Tooltip)
Vue.use(Row)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$messageTip = messageTip
Vue.prototype.$messageBox = messageBox
Vue.component('Modal', Modal)
Vue.component('LazyLoadSelect', LazyLoadSelect)
Vue.component('ServiceGroupSelect', ServiceGroupSelect)
Vue.component('TablePagination', TablePagination)
Vue.directive('number-only', numberOnly)
Vue.directive('tool-tip', toolTip)

Vue.use(filter)
