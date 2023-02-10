import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: ''
    },
    mutations: {
        //保存token信息到localStorage
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem("token", token)
        },
        //清空token信息
        resetState: (state) => {
            state.token = ""
        },
    },
    actions: {},
    modules: {
    }
})
