<template>
    <div>

        <el-form :inline="true">
            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary"  @click="editHandle(null)" v-if="hasAuth('sys:menu:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" :load="getChildrenList" lazy style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}" v-loading="loading">

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
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:menu:update')">编辑</el-button>

                    <el-divider direction="vertical" v-if="hasAuth('sys:menu:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:menu:delete')">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="current"
                :page-size="size"
                :total="total">
        </el-pagination>

        <MenuEdit title="编辑菜单" v-if="dialogVisible" ref="MenuEdit"/>

    </div>
</template>

<script>

    import MenuEdit from "../authority/MenuEdit";

    export default {
        name: "Menu",
        components:{MenuEdit},
        data() {
            return {
                loading: true,           //是否显示加载动效
                tableData:[],           //列表数据
                total: 0,               //总条数
                size: 10,               //每页显示条数
                current: 1,             //页数
                dialogVisible: false,   //是否显示编辑对话框
            }
        },
        created(){
            this.getListMenu()
        },
        methods: {
            //获取菜单列表
            getListMenu(){
                this.$axios.get('sys/menu/listPage',{params: {
                        current: this.current,
                        size: this.size
                }}).then(res =>{
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                    this.loading = false;
                })
            },
            //获取子菜单
            getChildrenList(tree,treeNode,resolve){
                this.$axios.get('sys/menu/getChildrenList/'+ tree.id).then(res =>{
                    resolve(res.data.data);
                })
            },
            //条数改变触发
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getListMenu()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getListMenu()
            },
            //编辑
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.MenuEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/menu/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getListMenu()
                            }
                        });
                    })
                }).catch(() => {});
            }
        },
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

</style>