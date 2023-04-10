<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="上级菜单" prop="parentId">
                    <select-tree :props="defaultProps" :options="treeData" :value="editForm.parentId" @getValue="getValue($event)"></select-tree>
                </el-form-item>

                <el-form-item label="菜单名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限编码" prop="perms" label-width="100px">
                    <el-input v-model="editForm.perms" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon" label-width="100px">
                    <el-input v-model="editForm.icon" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单URL" prop="path" label-width="100px">
                    <el-input v-model="editForm.path" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单组件" prop="component" label-width="100px">
                    <el-input v-model="editForm.component" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type" label-width="100px">
                    <el-radio-group v-model="editForm.type">
                        <el-radio v-for="item in menuType" :key="item.value" :label="item.value" :value="item.value">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum" label-width="100px">
                    <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
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

    import SelectTree from "../../components/inc/SelectTree";

    export default {
        name: "MenuEdit",
        inject:['reload'],
        components: {SelectTree},
        data() {
            return {
                dialogVisible: false,               //是否显示对话框
                editForm: {},                       //编辑内容
                editFormRules: {                    //检验规则
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    perms: [
                        {required: true, message: '请输入权限编码', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                treeData:[],                        //树形菜单数据
                menuType: [],                      //菜单类型
                defaultProps: {                     //树形默认配置
                    children: 'children',
                    label: "name",
                    value: "id",
                },
            }
        },
        created(){
            this.getTreeMenu()
            this.getMenuType()
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.$nextTick(() => {
                    if(id){
                        this.$axios.get('/sys/menu/info/' + id).then(res => {
                            this.editForm = res.data.data;
                            this.editForm.type = res.data.data.type.toString();
                            if(this.editForm.parentId === "0"){
                                this.editForm.parentId = "";
                            }
                        })
                    }
                    this.dialogVisible = true;
                    this.title = "编辑角色";
                });
            },
            //获取树形菜单
            getTreeMenu(){
                this.$axios.get('sys/menu/tree').then(res =>{
                    this.treeData = res.data.data;
                })
            },
            // 取值
            getValue(value) {
                this.editForm.parentId = value;
            },
            //获取菜单类型
            getMenuType(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"MENU_TYPE"}}).then(res =>{
                    this.menuType = res.data.data;
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
                        this.$axios.post('/sys/menu/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
                                    this.reload()
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