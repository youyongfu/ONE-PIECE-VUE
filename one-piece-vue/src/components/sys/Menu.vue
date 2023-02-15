<template>
    <div>

        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="name" label="名称" sortable width="180"></el-table-column>

            <el-table-column prop="perms" label="权限编码" sortable width="180"></el-table-column>

            <el-table-column prop="icon" label="图标"></el-table-column>

            <el-table-column prop="type" label="类型">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
                    <el-tag size="small" v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
                    <el-tag size="small" v-else-if="scope.row.type === 2" type="info">按钮</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="path" label="菜单URL"></el-table-column>

            <el-table-column prop="component" label="菜单组件"></el-table-column>

            <el-table-column prop="orderNum" label="排序号"></el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>

                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" slot="reference">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Menu",
        data() {
            return {
                tableData:[]
            }
        },
        created(){
            this.getTreeMenu()
        },
        methods: {
            //获取菜单列表
            getTreeMenu(){
                this.$axios.get('sys/menu/list').then(res =>{
                    this.tableData = res.data.data;
                })
            }
        },
    }
</script>

<style scoped>

</style>