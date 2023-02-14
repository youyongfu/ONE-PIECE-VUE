<template>
    <el-menu
            :default-active="this.$store.state.menu.editableTabsValue"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">

        <router-link to="/index">
            <el-menu-item index="Index"  @click="addTab({perms: 'Index', name: '首页'})">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">首页</span>
                </template>
            </el-menu-item>
        </router-link>

        <el-submenu :index="menu.perms" v-for="menu in menuList" :key="menu.name">
            <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{menu.name}}</span>
            </template>

            <router-link :to="childMenu.path" v-for="childMenu in menu.children" :key="childMenu.name">
                <el-menu-item :index="childMenu.perms" @click="addTab(item)">
                    <template slot="title">
                        <i :class="childMenu.icon"></i>
                        <span slot="title">{{childMenu.name}}</span>
                    </template>
                </el-menu-item>
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
            //获取导航信息
            menuList : {
                get(){
                    return this.$store.state.menu.menuList;
                }
            }
        },
        methods: {
            //添加标签
            addTab(item){
                this.$store.commit("addTab",item);
            }
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo{
        height: 100%;
    }
</style>