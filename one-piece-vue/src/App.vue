<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name : 'App',
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
