<template>
    <div>
        <el-form :inline="true">

            <!-- 搜索-->
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="searchHandle">搜索</el-button>
            </el-form-item>

            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:role:save')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="deleteHandle()" :disabled="delBtlStatu" v-if="hasAuth('sys:role:delete')">批量删除</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange" v-loading="loading">

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="name" label="名称" width="120"></el-table-column>

            <el-table-column prop="code" label="唯一编码" show-overflow-tooltip></el-table-column>

            <el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="permHandle(scope.row.id)" v-if="hasAuth('sys:role:perm')">分配权限</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:role:perm')"></el-divider>

                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:role:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:role:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:role:delete')">删除</el-button>
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

        <RoleEdit title="编辑角色" v-if="dialogVisible" ref="RoleEdit"/>

        <RoleAssignMenu title="分配权限" v-if="permDialogVisible" ref="RoleAssignMenu"/>

    </div>
</template>

<script>

    import RoleEdit from "../authority/RoleEdit";
    import RoleAssignMenu from "../authority/RoleAssignMenu";

    export default {
        name: "Role",
        components:{RoleEdit,RoleAssignMenu},
        data() {
            return {
                loading: true,                  //是否显示加载动效
                searchForm: {},                 //搜索内容
                delBtlStatu: true,              //是否可操作批量删除按钮
                multipleSelection: [],          //复选框勾选数据
                tableData: [],                  //列表数据
                total: 0,                       //总条数
                size: 10,                       //每页显示条数
                current: 1,                     //页数
                dialogVisible: false,           //是否显示编辑对话框
                permDialogVisible: false,       //是否显示分配权限对话框
            }
        },
        created(){
            this.searchHandle()
        },
        methods: {
            //获取角色列表
            searchHandle() {
                this.$axios.get('sys/role/listPage', {params: {
                        keyword: JSON.stringify(this.searchForm),
                        current: this.current,
                        size: this.size
                    }}
                ).then(res => {
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                    this.loading = false;
                })
            },
            //条数改变触发
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.searchHandle()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.searchHandle()
            },
            //编辑
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.RoleEdit.init(id);
                });
            },
            //复选框勾选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.delBtlStatu = val.length == 0
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    var ids = [];
                    if(id){
                        //单个删除
                        ids.push(id);
                    }else{
                        //批量删除
                        this.multipleSelection.forEach(row => {
                            ids.push(row.id)
                        })
                    }

                    this.$axios.post("/sys/role/delete", ids).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.searchHandle()
                            }
                        });
                    })
                }).catch(() => {});
            },
            //打开分配权限
            permHandle(id){
                this.permDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.RoleAssignMenu.init(id);
                });
            },
        }
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

</style>