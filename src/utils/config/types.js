export const UserType = {
  'system': '0',
  'enterprise': '1',
  '0': { // 系统管理员
    key: 'admin',
    title: '运营管理平台',
    home: '/admin',
    login: '/admin/login'
  },
  '1': { // 企业管理员
    key: 'AICall',
    title: '智能语音机器人',
    home: '/',
    login: '/login'
  }
}

// 意向性选项
// export const intentionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
export const intentionOptions = ['A', 'B', 'C', 'D', 'E']
export const responsive = {
  $md: 1024,
  $lg: 1366
}
/**
 * @description 话术节点错误提示类型
 */
export const IVRNODE_ERROR = {
  'CLUSTER': 1, // 聚类未填写
  'SCRIPT': 2, // 话术未填写完整
  'CLUSTER_SCRIPT': 3 // 聚类未填写 & 话术未填写完整
}

/**
 * @description 话术操作
 */
export const TREE_HANDLER = {
  'ADD': Symbol('add'),
  'EDIT': Symbol('edit'),
  'REMOVE': Symbol('remove'),
  'COPY': Symbol('copy'),
  'PASTE': Symbol('past')
}

/**
 * @description 定义话术异常部分类型
 */
export const CATCH_TYPES = {
  'node': 0,
  'nomatch': 1,
  'noinput': 1,
  'intention': 2,
  'session': 2
}

/**
 * @description 分页操作类型
 */

export const PAGE_HANDLER = {
  'ADD': Symbol('add'),
  'EDIT': Symbol('edit'),
  'DEL': Symbol('delete'),
  'SEARCH': Symbol('search')
}
