/* eslint-disable key-spacing */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  projectRole: state => state.project.projectRole,
  deptInfo: state => state.project.deptInfo,
  DialogFlag: state => state.project.DialogFlag
}
export default getters
