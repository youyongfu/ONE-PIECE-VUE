//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'

//引入store
import store from './store'

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

//引入axios
import axios from './axios'
Vue.prototype.$axios = axios

//引入过滤器js
import filter from './common/filter'
Object.keys(filter).forEach(key=>{
  Vue.filter(key,filter[key])
})

// eslint-disable-next-line no-unused-vars
import global from './globalFun'

//引入地区选择器
import VDistpicker from "v-distpicker";
Vue.component('v-distpicker',VDistpicker);

//引入富文本框
import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-tiptap/lib/index.css';
Vue.use(ElementTiptapPlugin, {
  lang: 'zh', // 设置语言为中文
});

//关闭生产提示
Vue.config.productionTip = false

new Vue({
  //使用路由
  router,
  store,
  //解析App模板
  render: h => h(App),
}).$mount('#app')



