<template>
    <div>
        <el-form :inline="true">

            <!-- 搜索-->
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="searchHandle">搜索</el-button>
            </el-form-item>

            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:user:save')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="deleteHandle()"  :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="username" label="用户名" width="120"></el-table-column>

            <el-table-column prop="email" label="邮箱"></el-table-column>

            <el-table-column prop="phone" label="手机号"></el-table-column>

            <el-table-column prop="city" label="城市" width="200"></el-table-column>

            <el-table-column prop="createdTime" label="创建时间" >
                <template slot-scope="scope">{{scope.row.createdTime | formatDate('yyyy-MM-dd')}}</template>
            </el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" width="260px" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="roleHandle(scope.row.id)" v-if="hasAuth('sys:user:role')">分配角色</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:user:role')"></el-divider>

                    <el-button type="text" @click="repassHandle(scope.row.id, scope.row.username)" v-if="hasAuth('sys:user:repass')">重置密码</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:user:repass')"></el-divider>

                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:user:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:user:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:user:delete')">删除</el-button>
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

        <UserEdit title="编辑用户" v-if="dialogVisible" ref="UserEdit"/>

        <UserAssignRole title="分配角色" v-if="roleDialogFormVisible" ref="UserAssignRole"/>

    </div>
</template>

<script>

    import UserEdit from "../authority/UserEdit";
    import UserAssignRole from "../authority/UserAssignRole";

    export default {
        name: "User",
        components:{UserEdit,UserAssignRole},
        data() {
            return {
                searchForm: {},             //搜索内容
                delBtlStatu: true,          //是否可操作批量删除按钮
                multipleSelection: [],      //复选框勾选数据
                tableData: [],              //列表数据
                total: 0,                   //总条数
                size: 10,                   //条数
                current: 1,                 //页数
                dialogVisible: false,       //是否显示编辑对话框
                roleDialogFormVisible: false,   //是否显示分配角色对话框
            }
        },
        created(){
            this.searchHandle()
        },
        methods: {
            //获取用户列表
            searchHandle() {
                this.$axios.get('sys/user/listPage',{params: {
                        keyword: JSON.stringify(this.searchForm),
                        current: this.current,
                        size: this.size
                }}).then(res => {
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
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
                    this.$refs.UserEdit.init(id);
                });
            },
            //打开分配角色
            roleHandle(id){
                this.roleDialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs.UserAssignRole.init(id);
                });
            },
            //复选框勾选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.delBtlStatu = val.length == 0
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除用户, 是否继续?', '提示', {
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

                    this.$axios.post("/sys/user/delete", ids).then(res => {
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
            //重置密码
            repassHandle(id, username) {
                this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/user/repass", id).then(res => {
                        console.log(res);
                        this.$message({
                            showClose: true,
                            message: '密码重置成功',
                            type: 'success',
                            onClose: () => {
                                this.getUserList();
                            }
                        });
                    })
                })
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