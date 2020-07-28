import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)

export default () => {
  return new Vuex.Store({
    state: {
      isLogin: false,
      user: {
        uid: '',
        name: '',
        sex: -1,
        phone: ''
      },
    },
    mutations,
    actions,
    getters
  })
}