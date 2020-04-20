/**
 * 前端鉴权模块
 */

import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 判断是否有权限
 * @param roles 请求返回的用户权限
 * @param route 本地配置的需要鉴权的路由
 */
function hasPermission(roles, route) {
  // 如果传入的当前路由有meta标签，并且meta下有roles字段，则进行鉴权
  if (route.meta && route.meta.roles) {
    // 返回的roles中是否至少有一个存在于传入的路由的meta标签中，是返回true有权限，否没有权限
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 如果传入的路由没有meta标签，直接认为不需要鉴权，即一直有权限，直接返回true
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes 过滤前端配置的需要鉴权的异步路由表
 * @param roles 请求返回的用户权限 ['admin']
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  // 全部路由
  routes: [],
  // 需要异步加载的路由
  addRoutes: []
}

const mutations = {
  // 修改state
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 如果后台返回的用户权限包含管理员admin，直接加载全部异步路由即可
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果后台返回用户权限不包含管理员admin，则调用过滤函数，得到对应权限路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      // 提交mutations
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
