<template>
    <div>

        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:dict:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="name" label="名称" sortable width="180"></el-table-column>

            <el-table-column prop="code" label="编码" sortable width="180"></el-table-column>

            <el-table-column prop="value" label="值"></el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:dict:update')">编辑</el-button>

                    <el-divider direction="vertical" v-if="hasAuth('sys:dict:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:dict:delete')">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!--新增对话框-->
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
        name: "Dict",
        data() {
            return {
                tableData:[],
                dialogVisible: false,
                editForm: {},
                editFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
            }
        },
        created(){
            this.getDictMenu()
        },
        methods: {
            //获取菜单列表
            getDictMenu(){
                this.$axios.get('sys/dict/list').then(res =>{
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
                        this.$axios.post('/sys/dict/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
                                    this.getDictMenu()
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
                this.$axios.get('/sys/dict/info/' + id).then(res => {
                    this.editForm = res.data.data;
                })
                this.dialogVisible = true
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该数据字典, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/dict/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getDictMenu()
                            }
                        });
                    })
                }).catch(() => {});
            }
        },
    }
</script>

<style scoped>

</style>