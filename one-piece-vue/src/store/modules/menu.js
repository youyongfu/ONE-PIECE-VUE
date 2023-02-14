import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default({
    state: {
        menuList: [],
        hasNav:false
    },
    mutations: {
        //保存导航信息
        SET_MENULIST: (state, menuList) => {
            state.menuList = menuList
        },
        //保存是否已获取导航信息状态
        SET_HASNAV: (state, hasNav) => {
            state.hasNav = hasNav
        },
    },
    actions: {},
    modules: {
    }
})
