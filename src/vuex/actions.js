import * as types from './mutation-types'

export const setLoginState = ({
  commit
}, user) => {
  commit(types.SET_LOGIN_STATE, user)
}