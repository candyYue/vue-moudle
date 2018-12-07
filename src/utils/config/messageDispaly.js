import * as TYPES from './types'
/**
 * @description 错误提示信息配置
 */
export default {
  // 话术相关
  script: {
    removeNode: '您确定要删除该节点吗？该节点下的子节点也将被删除。',
    /**
     * @description 根节点校验 root
     */
    rootEmptyAdd: '请先编辑开始节点再新增节点',
    rootEmptyCopy: '请先编辑开始节点再进行复制',
    rootRemove: '无法删除开始节点，您可以对它进行编辑',
    /**
     * @description 聚类 cluster
    */
    changeCluster: '您确定要将此节点设为其他聚类节点？（同级节点将不再是其他聚类节点，请为其设置聚类。） ',
    /**
     * @description 未匹配继续流程 default
     */
    // onlyMainProcess: '话术需要一个标准流程，可在同级节点勾选设为标准流程节点', // 同级只能有一个标准流程
    changeMainProcess: '您确定要将此节点设为未匹配继续流程节点？同级节点将不再是未匹配继续流程节点。 ', // 同级更改标准流程
    /**
     * @description 人工客服 manual
     */
    manualEnd: '此节点结束后转为人工坐席，无法新增子结点', // 转人工结束
    manualEdit: '您确定要将此节点设置为转为人工坐席吗？如果勾选， 则此节点的子节点将自动删除。 ', // 编辑有子节点的人工客服
    manualCopy: '目标节点为转人工节点，请修改后进行粘贴',
    /**
     * @description 校验tree
     */
    treeError: {
      [TYPES.IVRNODE_ERROR.CLUSTER]: '请将聚类设置完整。',
      [TYPES.IVRNODE_ERROR.SCRIPT]: '请将节点话术设置完整。',
      [TYPES.IVRNODE_ERROR.CLUSTER_SCRIPT]: '请将节点话术和聚类设置完整'
    }
  },
  // 聚类相关
  cluster: {
    delCluster: ''
  },

  // 标签相关
  labels: {

  }
}
