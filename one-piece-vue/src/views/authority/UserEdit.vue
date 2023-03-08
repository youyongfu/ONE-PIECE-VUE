<template>
    <div>
        <!-- 添加或修改业务对话框 -->
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
                    <el-radio-group v-model="editForm.statu" >
                        <el-radio v-for="item in userStatu" :key="item.value" :label="item.value" :value="item.value">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    //导入省市区联动控件
    import VDistpicker from "v-distpicker";

    export default {
        name: "UserEdit",
        components:{VDistpicker},
        inject:['reload'],
        data() {
            return {
                dialogVisible: false,               //是否显示对话框
                placeholders: {
                    province: '',                   //省
                    city: '',                       //市
                    area: '',                       //区
                },
                editForm: {},                       //编辑内容
                editFormRules: {                    //检验规则
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
                userStatu: []                      //用户状态
            }
        },
        created(){
            this.getUserStatu()
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.$nextTick(() => {
                    if(id){
                        //获取用户信息
                        this.$axios.get('/sys/user/info/' + id).then(res => {
                            this.editForm = res.data.data;
                            this.editForm.statu = res.data.data.statu.toString();
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
                    }else {
                        this.placeholders.province = ''
                        this.placeholders.city = ''
                        this.placeholders.area = ''
                    }
                    this.dialogVisible = true;
                    this.title = "编辑用户";
                });
            },
            //获取用户状态
            getUserStatu(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"USER_STATU"}}).then(res =>{
                    this.userStatu = res.data.data;
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