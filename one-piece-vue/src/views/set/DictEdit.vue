<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="上级数据字典" prop="parentId">
                    <el-select v-model="editForm.parentId" placeholder="请选择上级数据字典">
                        <template v-for="item in tableData">
                            <el-option :label="item.name" :value="item.id" :key="item.name"></el-option>
                            <template v-for="child in item.children">
                                <el-option :label="child.name" :value="child.id" :key="child.name">
                                    <span>{{ "- " + child.name }}</span>
                                </el-option>
                            </template>
                        </template>
                    </el-select>
                    <el-alert title="未选择上级数据字典，则默认为添加一级数据字典" :closable="false" type="info" style="line-height: 12px;"></el-alert>
                </el-form-item>

                <el-form-item label="字典名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="字典编码" prop="code" label-width="100px">
                    <el-input v-model="editForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="字典值" prop="value" label-width="100px">
                    <el-input v-model="editForm.value" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio v-for="item in dictStatu" :key="item.value" :label="item.value" :value="item.value">{{item.name}}</el-radio>
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
        name: "DictEdit",
        inject:['reload'],
        data() {
            return {
                dialogVisible: false,           //是否显示对话框
                tableData: [],                  //列表数据
                editForm: {},                   //编辑内容
                editFormRules: {                //检验规则
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                dictStatu:[]                //字典状态
            }
        },
        created(){
            this.getTreeDict()
            this.getDictStatu()
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.$nextTick(() => {
                    if(id){
                        this.$axios.get('/sys/dict/info/' + id).then(res => {
                            this.editForm = res.data.data;
                            this.editForm.statu = res.data.data.statu.toString();
                            if(this.editForm.parentId === 0){
                                this.editForm.parentId = "";
                            }
                        })
                    }
                    this.dialogVisible = true;
                    this.title = "编辑数据字典";
                });
            },
            //获取数据字典列表
            getTreeDict(){
                this.$axios.get('sys/dict/list').then(res =>{
                    this.tableData = res.data.data;
                })
            },
            //获取字典状态
            getDictStatu(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"DICT_STATU"}}).then(res =>{
                    this.dictStatu = res.data.data;
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
                        this.$axios.post('/sys/dict/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
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