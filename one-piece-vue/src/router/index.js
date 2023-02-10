//引入Vue
import Vue from 'vue'
//引入路由
import VueRouter from 'vue-router'
//使用router
Vue.use(VueRouter);

//引入组件
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import User from "../components/sys/User";
import Role from "../components/sys/Role";
import Menu from "../components/sys/Menu";
import UserCenter from "../components/sys/UserCenter";

//创建router实例对象并暴露
export default new VueRouter({
    routes : [
        {
            path : '/',
            name : Login,
            component : Login
        },
        {
            path : '/home',
            name : Home,
            component : Home,
            children: [
                {
                    path : '/index',
                    name : Index,
                    component : Index
                },
                {
                    path : '/user',
                    name : User,
                    component : User
                },
                {
                    path : '/userCenter',
                    name : UserCenter,
                    component : UserCenter
                },
                {
                    path : '/role',
                    name : Role,
                    component : Role
                },
                {
                    path : '/menu',
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
    ],
    mode : 'history',
})


