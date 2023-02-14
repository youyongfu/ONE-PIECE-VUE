import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default({
    state: {
        menuList: [],
        hasNav:false,
        editableTabsValue: 'Index',
        editableTabs: [{
            title: '首页',
            name: 'Index',
        }]
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
        //添加标签
        addTab(state, menu) {
            //判断标签是否已打开
            let index = state.editableTabs.findIndex(e => e.name === menu.perms)
            if (index === -1) {
                state.editableTabs.push({
                    title: menu.name,
                    name: menu.perms,
                });
            }
            //标签高亮显示
            state.editableTabsValue = menu.perms;
        },
        //清空导航、标签信息
        resetState: (state) => {
            state.menuList = []
            state.hasNav = false
            state.editableTabsValue = 'Index'
            state.editableTabs = [{
                title: '首页',
                name: 'Index',
            }]
        }

    },
    actions: {},
    modules: {
    }
})
