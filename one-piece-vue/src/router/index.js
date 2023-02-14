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
import UserCenter from "../components/sys/UserCenter";

//路由
const routes = [
    {
        path : '/home',
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

    if(to.path == "/login" || to.path == "/"){
        next()
    }else if(!hasNav){
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

            // 动态绑定路由
            var newRoutes = router.options.routes
            res.data.data.menuList.forEach(menu => {
                if (menu.children) {
                    menu.children.forEach(e => {
                        // 导航转成路由
                        let route = menuToRoute(e)
                        // 把路由添加到路由管理中
                        if (route) {
                            newRoutes[0].children.push(route)
                        }

                    })
                }
            })
            router.addRoutes(newRoutes)
        })
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
    route.component = () => import('@/components/' + menu.component +'.vue')
    return route
}


//暴露路由对象
export default router;