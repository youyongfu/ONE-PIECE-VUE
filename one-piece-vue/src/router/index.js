//引入Vue
import Vue from 'vue'
//引入路由
import VueRouter from 'vue-router'
//使用router
Vue.use(VueRouter);

//引入组件
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'

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
            component : Home
        },
        {
            path : '/login',
            name : Login,
            component : Login
        }
    ],
    mode : 'history'
})
