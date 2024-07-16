/**
 * Vuex状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import theme from './modules/theme'
import user from './modules/user'
import server from './modules/server'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        theme,
        user,
        server
    },
    getters
})
