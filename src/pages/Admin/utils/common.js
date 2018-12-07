import Vue from 'vue'
import Modal from '@/components/feedback/Modal'
import TablePagination from '@/components/layout/TablePagination'
import {
  Icon,
  Button,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Pagination,
  Input,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  RadioButton,
  Form,
  FormItem
} from 'element-ui'
import {
  messageBox,
  messageTip
} from '@/components/feedback/Message'
import {
  timeStamp,
  duration
} from '@/utils/helper/filter.js'

import '@/assets/css/common/theme.scss'
import '@/assets/css/widget/table.scss'
import '@/assets/css/widget/pagination.scss'
import '@/assets/css/widget/tabs.scss'
import '@/assets/css/widget/form.scss'
import '@/assets/css/widget/message.scss'
import '@/assets/css/widget/modal.scss'
import '@/assets/css/widget/button.scss'
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
Vue.use(Icon)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.prototype.$messageTip = messageTip
Vue.prototype.$messageBox = messageBox
Vue.component('Modal', Modal)
Vue.component('TablePagination', TablePagination)
Vue.use(filter)
