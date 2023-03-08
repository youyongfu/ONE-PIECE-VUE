<template>
  <div id="app">
    <router-view v-if="isRouterShow"></router-view>
  </div>
</template>

<script>
  export default {
    name : 'App',
    provide(){
      return{
        reload: this.reload
      }
    },
    data(){
        return{
          isRouterShow: true
        }
    },
    methods:{
        reload(){
            this.isRouterShow = false;
            this.$nextTick(() => {
                this.isRouterShow = true;
            });
        }
    },
    //监听路由跳转
    watch: {
      $route(to, from) {
          console.log(from)
          console.log(to)
          if (to.path != '/login') {
              let obj = {
                name: to.meta.title,
                perms: to.name
              }
              this.$store.commit("addTab", obj)
          }
      }
    }
  }
</script>

<style>

  html,body,#app {
    height:100%;
  }

</style>
