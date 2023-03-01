//引入Vue
import Vue from 'vue'
//引入路由
import VueRouter from 'vue-router'
//使用router
Vue.use(VueRouter);

//解决vue路由重复导航错误
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

import axios from "../axios";
import store from "../store";

//引入组件
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import UserCenter from "../views/authority/UserCenter";

//路由
const routes = [
    {
        path : '/',
        name : 'Home',
        component : Home,
        children: [
            {
                path : '/index',
                name : 'Index',
                component : Index
            },
            {
                path : '/userCenter',
                name : 'UserCenter',
                component : UserCenter
            },
        ]
    },
    {
        path : '/login',
        name : 'Login',
        component : Login
    },
]

//创建路由对象
const router = new VueRouter({
    mode : 'history',
    routes: routes
});

//路由前置守卫处
router.beforeEach((to, from, next) => {

    //是否已获取导航信息状态
    var hasNav = store.state.menu.hasNav;

    var token = localStorage.getItem("token");

    if(to.path == "/login"){
        //登录页放行
        next()
    }else if(!token){
        next({path: '/login'})
    }else if(token && !hasNav){
        //获取导航
        axios.get("sys/menu/nav",{
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res =>{
            console.log(res.data.data);
            //保持导航信息
            store.commit('SET_MENULIST', res.data.data.menuList)
            //状态为已获取导航信息
            store.commit('SET_HASNAV', true)

            //保持权限信息
            store.commit('SET_PERMLIST', res.data.data.permList)

            //获取路由
            var newRoutes = router.options.routes

            //遍历路由，找到Home路由
            var homeRoute;
            newRoutes.map(item =>{
                if(item.name === 'Home'){
                    homeRoute = item;
                }
            })

            // 动态绑定路由
            res.data.data.menuList.forEach(menu => {
                if (menu.children) {
                    menu.children.forEach(e => {
                        // 导航转成路由
                        let route = menuToRoute(e)
                        if (route) {
                            //Home路由添加子路由
                            homeRoute.children.push(route)
                        }
                    })
                }
            })

            //把路由添加到路由管理中
            router.addRoutes(newRoutes)
        })
    }

    if(to.path == "/userCenter"){
        store.commit("addTab",{name:'个人中心',perms: 'UserCenter'});
    }
    next()
})

// 导航转成路由
const menuToRoute = (menu) => {

    if (!menu.component) {
        return null
    }

    let route = {
        name: menu.perms,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.name
        }
    }
    route.component = () => import('@/views/' + menu.component +'.vue')
    return route
}

//暴露路由对象
export default router;