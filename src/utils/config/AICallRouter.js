/**
 * title: 页面title，面包屑title
 * name: 路由跳转name
 * path: 路由跳转路径
 */
export default {
  statistics: {
    title: '数据统计',
    name: 'AICall-statistics',
    path: 'statistics'
  },
  talk: {
    title: '话术管理',
    name: 'AICall-talk',
    path: 'talk',
    children: {
      script: {
        title: '话术',
        name: 'AICall-talk-script',
        path: 'script'
      },
      scriptId: {
        title: '编辑话术',
        newTitle: '新建话术',
        name: 'AICall-talk-script-id',
        path: 'script/:id'
      },
      clusters: {
        title: '聚类',
        name: 'AICall-talk-clusters',
        path: 'clusters'
      },
      fields: {
        title: '变量',
        name: 'AICall-talk-fields',
        path: 'fields'
      },
      labels: {
        title: '标签',
        name: 'AICall-talk-labels',
        path: 'labels'
      },
      messages: {
        title: '短信',
        name: 'AICall-talk-messages',
        path: 'messages'
      }
    }
  },
  question: {
    title: '问题库',
    name: 'AICall-question',
    path: 'question'
  },
  questionId: {
    title: '编辑问题',
    newTitle: '新建问题',
    name: 'AICall-question-id',
    path: 'question/:id'
  },
  task: {
    title: '任务管理',
    name: 'AICall-task',
    path: 'task'
  },
  taskId: {
    title: '任务详情',
    name: 'AICall-task-id',
    path: 'task/:id'
  }
}
