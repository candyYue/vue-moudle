import {
  getProps
} from '../utils/treeDataHelper'
import { mapGetters } from 'vuex'
export default {
  name: 'TreeNode',
  props: ['nodeData', 'rootEdited'],
  computed: {
    ...mapGetters({
      clustersList: 'AICall/clustersList'
    })
  },
  methods: {
    handleContextMenu ($event) {
      $event.preventDefault()
      this.$emit('handleContextMenu', $event, this.nodeData)
    }
  },
  render (h) {
    // console.log(this.nodeData)
    const nodeProps = getProps(this.nodeData)
    const end = !this.nodeData.children || this.nodeData.children.length === 0
    const {
      type,
      script,
      clusterId,
      default: mainprocess,
      bargein,
      instructManual,
      instructSms,
      allowJump,
      edited
    } = nodeProps

    const cluster = this.clustersList.find(d => d.id === clusterId)
    const clusterName = cluster ? cluster.title : ''
    const icons = [
      {
        name: 'mainprocess',
        value: mainprocess,
        title: '未匹配继续流程'
      },
      {
        name: 'bargein',
        value: bargein,
        title: '允许打断'
      },
      {
        name: 'manual',
        value: instructManual,
        title: '转为人工坐席'
      },
      {
        name: 'sms',
        value: instructSms,
        title: '发送短信'
      },
      {
        name: 'jump',
        value: allowJump,
        title: '问题跳转话术'
      },
      {
        name: 'end',
        value: end,
        title: '结束'
      }
    ]
    let hasError = false
    if (this.rootEdited && type === 'root') {
      hasError = !cluster || !script
    }
    if (type !== 'root') {
      hasError = !cluster || !script
    }
    return (
      <div class={`base-ivrnode ${hasError ? 'has-error' : ''} ${edited ? 'has-edited' : ''}`} on-contextmenu={this.handleContextMenu}>
        <div class="ivrnode-props">
          {
            icons.map(d => {
              if (d.value) {
                return (
                  <svg-icon icon-class={`script-${d.name}`} class-name="script-icon"/>
                )
              }
            })
          }
        </div>
        <p title={clusterName}><b>聚类：</b>{clusterName}</p>
        <p title={script}><b>话术：</b>{script}</p>
      </div>
    )
  }
}
