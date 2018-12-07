export const changeLimit = (context, payload) => {
  // localStorage.setItem('limit', JSON.stringify(context.getters.limitMap))
  context.commit({
    type: 'changeLimit',
    state: payload
  })
}
