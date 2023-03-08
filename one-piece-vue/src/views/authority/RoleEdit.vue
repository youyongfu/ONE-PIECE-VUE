<template>
    <div>
        <!-- 添加或修改业务对话框 -->
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
                        <el-radio v-for="item in roleStatu" :key="item.value" :label="item.value" :value="item.value">{{item.name}}</el-radio>
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
        name: "RoleEdit",
        inject:['reload'],
        data() {
            return {
                dialogVisible: false,               //是否显示对话框
                editForm: {},                       //编辑内容
                editFormRules: {                    //检验规则
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
                roleStatu: []                      //角色状态
            }
        },
        created(){
            this.getRoleStatu()
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.$nextTick(() => {
                    if(id){
                        //获取角色信息
                        this.$axios.get('/sys/role/info/' + id).then(res => {
                            this.editForm = res.data.data;
                            this.editForm.statu = res.data.data.statu.toString();
                        })
                    }
                    this.dialogVisible = true;
                    this.title = "编辑角色";
                });
            },
            //获取角色状态
            getRoleStatu(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"ROLE_STATU"}}).then(res =>{
                    this.roleStatu = res.data.data;
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
                                    this.reload();
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
        }
    }
</script>

<style scoped>

</style>