//引入Vue
import Vue from 'vue'
//引入路由
import VueRouter from 'vue-router'
//使用router
Vue.use(VueRouter);

import axios from "../axios";
import store from "../store";

//引入组件
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import User from "../components/sys/User";
import Role from "../components/sys/Role";
import Menu from "../components/sys/Menu";
import UserCenter from "../components/sys/UserCenter";

//路由
const routes = [
    {
        path : '/',
        name : Home,
        component : Home,
        children: [
            {
                path : '/index',
                name : Index,
                component : Index
            },
            {
                path : '/sys/users',
                name : User,
                component : User
            },
            {
                path : '/userCenter',
                name : UserCenter,
                component : UserCenter
            },
            {
                path : '/sys/role',
                name : Role,
                component : Role
            },
            {
                path : '/sys/menu',
                name : Menu,
                component : Menu
            },
        ]
    },
    {
        path : '/login',
        name : Login,
        component : Login
    },
]

//创建路由对象
const router = new VueRouter({
    mode : 'history',
    routes: routes
});

//路由控制
router.beforeEach((to, from, next) => {

    if(to.path == "/login" || to.path == "/"){
        next()
    }else {
        //获取导航
        axios.get("sys/menu/nav",{
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res =>{
            console.log(res.data.data);
            store.commit('SET_MENULIST', res.data.data.menuList)
        })
    }

    next()
})

//暴露路由对象
export default router;