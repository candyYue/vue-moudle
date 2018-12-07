<template>
  <div>
    <script-nav :navList="navList"/>
    <transition name="fade-transform" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ScriptNav from '@/components/layout/ScriptNav'
import { uniqBy } from 'lodash'

const defaultRouterList = [
  {
    label: '话术',
    name: 'AICall-talk-script'
  },
  {
    label: '聚类',
    name: 'AICall-talk-clusters'
  },
  {
    label: '标签',
    name: 'AICall-talk-labels'
  }
]

const dynamicRouterList = {
  fields: {
    label: '变量',
    name: 'AICall-talk-fields'
  },
  messages: {
    label: '短信',
    name: 'AICall-talk-messages'
  }
}

export default {
  components: {
    ScriptNav
  },
  data () {
    return {
      navList: defaultRouterList
    }
  },
  computed: {
    ...mapGetters({
      EpInfo: 'AICall/EpInfo',
      EpConfig: 'AICall/EpConfig'
    })
  },
  watch: {
    EpInfo: {
      handler (val, oldVal) {
        if (val.sms_count && (JSON.stringify(val) !== JSON.stringify(oldVal))) {
          this.navList = uniqBy(this.navList.concat(dynamicRouterList.messages), 'name')
        }
      },
      immediate: true
    },
    EpConfig: {
      handler (val, oldVal) {
        if (val.tts_status && (JSON.stringify(val) !== JSON.stringify(oldVal))) {
          const preNavList = this.navList.slice(0)
          preNavList.splice(2, 0, dynamicRouterList.fields)
          this.navList = uniqBy(preNavList, 'name')
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      getEpInfo: 'AICall/getEpInfo',
      getConfig: 'AICall/getConfig'
    })
  }
}
</script>
