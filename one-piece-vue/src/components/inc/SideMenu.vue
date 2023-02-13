<template>
    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">

        <router-link to="/index">
            <el-menu-item index="Index">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">首页</span>
                </template>
            </el-menu-item>
        </router-link>

        <el-submenu :index="menu.perms" v-for="(menu,menuKey) in menuList" :key="menuKey">
            <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{menu.name}}</span>
            </template>

            <router-link :to="childMenu.path" v-for="(childMenu,childMenuKey) in menu.children" :key="childMenuKey">
                <el-submenu :index="childMenu.perms">
                    <template slot="title">
                        <i :class="childMenu.icon"></i>
                        <span>{{childMenu.name}}</span>
                    </template>
                </el-submenu>
            </router-link>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu",
        data(){
            return{

            }
        },
        computed:{
            menuList : {
                get(){
                    return this.$store.state.menu.menuList;
                }
            }
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo{
        height: 100%;
    }
</style>