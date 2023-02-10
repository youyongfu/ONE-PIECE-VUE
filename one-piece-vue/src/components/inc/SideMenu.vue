<template>
    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统管理</span>
            </template>
            <router-link to="/user">
                <el-submenu index="1-1">
                    <template slot="title">用户管理</template>
                </el-submenu>
            </router-link>
            <router-link to="/role">
                <el-submenu index="1-2">
                    <template slot="title">角色管理</template>
                </el-submenu>
            </router-link>
            <router-link to="/menu">
                <el-submenu index="1-2">
                    <template slot="title">菜单管理</template>
                </el-submenu>
            </router-link>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu"
    }
</script>

<style scoped>
    .el-menu-vertical-demo{
        height: 100%;
    }
</style>