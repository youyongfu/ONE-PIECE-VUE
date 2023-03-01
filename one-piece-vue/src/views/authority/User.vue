<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="用户名" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getUserList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addStatu" v-if="hasAuth('sys:user:save')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="deleteHandle()"  :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column label="头像" width="50">
                <template slot-scope="scope">
                    <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>

            <el-table-column prop="username" label="用户名" width="120"></el-table-column>

<!--            <el-table-column prop="code" label="角色名称">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-tag size="small" type="info" v-for="item in scope.row.sysRoles" :key="item">{{item.name}}</el-tag>-->
<!--                </template>-->
<!--            </el-table-column>-->

            <el-table-column prop="email" label="邮箱"></el-table-column>

            <el-table-column prop="phone" label="手机号"></el-table-column>

            <el-table-column prop="city" label="城市"></el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="createdTime" width="200" label="创建时间" >
                <template slot-scope="scope">{{scope.row.createdTime | formatDate('yyyy-MM-dd')}}</template>
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

        <!--新增对话框-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm">

                <el-form-item label="用户名" prop="username" label-width="100px">
                    <el-input v-model="editForm.username" autocomplete="off" :disabled="editForm.id != null"></el-input>
                    <el-alert title="初始密码为888888" :closable="false" type="info" style="line-height: 12px;"></el-alert>
                </el-form-item>

                <el-form-item label="邮箱"  prop="email" label-width="100px">
                    <el-input v-model="editForm.email" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="手机号"  prop="phone" label-width="100px">
                    <el-input v-model="editForm.phone" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="城市"  prop="city" label-width="100px">
                    <v-distpicker @province = "changeProvince($event,'province')"  :province="placeholders.province"
                                  @city = "changeCity($event,'city')" :city="placeholders.city"
                                  @area = "changeArea($event,'area')" :area="placeholders.area"></v-distpicker>
                </el-form-item>

                <el-form-item label="状态"  prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">
            <el-form :model="roleForm">
                <el-tree :data="roleTreeData" show-checkbox ref="roleTree" :check-strictly=checkStrictly node-key="id" :default-expand-all=true :props="defaultProps"></el-tree>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitRoleForm()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import VDistpicker from "v-distpicker";
    export default {
        name: "User",
        data() {
            return {
                searchForm: {},
                delBtlStatu: true,
                multipleSelection: [],
                tableData: [],
                dialogVisible: false,
                editForm: {
                },
                total: 0,
                size: 10,
                current: 1,
                editFormRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                roleDialogFormVisible: false,
                roleForm: {},
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleTreeData: [],
                treeCheckedKeys: [],
                checkStrictly: true,
                placeholders: {
                    province: '',
                    city: '',
                    area: '',
                }
            }
        },
        created(){
            this.getUserList()
            this.getRoleList()
        },
        methods: {
            //获取用户列表
            getUserList() {
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
            //获取角色列表
            getRoleList(){
                this.$axios.get('sys/role/list').then(res =>{
                    this.roleTreeData = res.data.data;
                })
            },
            //条数改变触发
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getUserList()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getUserList()
            },
            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editForm = {};
            },
            //关闭对话框
            handleClose() {
                this.resetForm('editForm')
                this.dialogVisible = false
            },
            //新增
            addStatu(){
                this.dialogVisible = true
                this.placeholders.province = ''
                this.placeholders.city = ''
                this.placeholders.area = ''
            },
            //提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editForm.city = this.placeholders.province + "-" + this.placeholders.city + "-" + this.placeholders.area
                        this.$axios.post('/sys/user/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success',
                                onClose:() => {
                                    this.getUserList()
                                }
                            });
                            this.resetForm('editForm')
                            this.dialogVisible = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //编辑
            editHandle(id){
                this.$axios.get('/sys/user/info/' + id).then(res => {
                    this.editForm = res.data.data;
                    if(this.editForm.city){
                        let citys =(this.editForm.city || "").split('-')
                        this.placeholders.province = citys[0]
                        this.placeholders.city = citys[1]
                        this.placeholders.area = citys[2]
                    }else {
                        this.placeholders.province = ''
                        this.placeholders.city = ''
                        this.placeholders.area = ''
                    }
                })
                this.dialogVisible = true
            },
            //复选框勾选
            handleSelectionChange(val) {
                console.log(val)
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
                                this.getUserList()
                            }
                        });
                    })
                }).catch(() => {});
            },
            //打开分配角色
            roleHandle(id){
                this.roleDialogFormVisible = true;
                this.$axios.get("/sys/user/info/" + id).then(res => {
                    this.$refs.roleTree.setCheckedKeys(res.data.data.roleIds)
                    this.roleForm = res.data.data;
                })
            },
            //提交分配角色
            submitRoleForm(){
                var roleIds = this.$refs.roleTree.getCheckedKeys();
                this.$axios.post("/sys/user/role/" + this.roleForm.id,roleIds).then(res => {
                    console.log(res);
                    this.$message({
                        showClose: true,
                        message: '分配角色成功',
                        type: 'success',
                        onClose:() => {
                            this.getRoleList()
                        }
                    });
                    this.roleDialogFormVisible = false;
                })
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
            //省选择
            changeProvince(event,value){
                console.log(value)
                this.placeholders.province = event.value
                this.placeholders.city = ''
                this.placeholders.area = ''
            },
            //市选择
            changeCity(event,value){
                console.log(value)
                this.placeholders.city = event.value
                this.placeholders.area = ''
            },
            //区选择
            changeArea(event,value){
                console.log(value)
                this.placeholders.area = event.value
            },

        },
        components:{VDistpicker}
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

</style>