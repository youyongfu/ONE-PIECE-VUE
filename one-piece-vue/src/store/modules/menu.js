import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default({
    state: {
        menuList: []
    },
    mutations: {
        //保存导航信息
        SET_MENULIST: (state, menuList) => {
            state.menuList = menuList
        },
    },
    actions: {},
    modules: {
    }
})
