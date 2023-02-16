<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" slot="reference">批量删除</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe>

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
                    <el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--新增对话框-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="editForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="editForm.remark" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Role",
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                editForm: {
                },
                editFormRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入唯一编码', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
            }
        },
        created(){
            this.getRoleList()
        },
        methods: {
            //获取角色列表
            getRoleList() {
                this.$axios.get('sys/role/list').then(res => {
                    this.tableData = res.data.data;
                })
            },
            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editForm = {}
            },
            //关闭对话框
            handleClose() {
                this.resetForm('editForm')
                this.dialogVisible = false
            },
            //提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/role/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
                                    this.getRoleList()
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
                this.$axios.get('/sys/role/info/' + id).then(res => {
                    this.editForm = res.data.data;
                })
                this.dialogVisible = true
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/role/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getRoleList()
                            }
                        });
                    })
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped>

</style>