import * as types from './mutation-types'

export default {
  [types.SET_LOGIN_STATE](state, user) {
    state.user = user
    state.isLogin = true
  }
}