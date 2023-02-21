import Vue from "vue"

Vue.mixin({
    methods: {
        //判断用户是否有权限
        hasAuth(perm) {
            var authority = this.$store.state.menu.permList
            return authority.indexOf(perm) > -1
        }
    }
})