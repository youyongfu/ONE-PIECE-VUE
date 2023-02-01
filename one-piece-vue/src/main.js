//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'

//引入Element-ui
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//使用Element-ui
Vue.use(Element);

//引入router
import VueRouter from 'vue-router'
//使用router
Vue.use(VueRouter);
//引入router实例
import router from "./router";

//关闭生产提示
Vue.config.productionTip = false

new Vue({
  //解析App模板
  render: h => h(App),
  //使用路由
  router,
}).$mount('#app')