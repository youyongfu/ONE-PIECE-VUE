<template>
    <div>

        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:timeline:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <vue-loadmore :on-refresh="refresh" :on-loadmore="loadMone" :finished="lastPage" style="margin-top: 20px">
            <el-timeline v-for="(item,index) of tableData" :key="index">
                <el-timeline-item placement="top" >
                    <el-card>
                            <h2>{{item.stage}}</h2>
                            <p>{{item.content}}</p>
                            <el-button type="text" @click="editHandle(item.id)" v-if="hasAuth('sys:timeline:update')">编辑</el-button>

                            <el-divider direction="vertical" v-if="hasAuth('sys:timeline:update')"></el-divider>

                            <el-button type="text" @click="deleteHandle(item.id)" v-if="hasAuth('sys:timeline:delete')">删除</el-button>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </vue-loadmore>

        <!--新增对话框-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="时间节点" prop="stage" label-width="100px">
                    <el-input v-model="editForm.stage" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="事件" prop="content" label-width="100px">
                    <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.content"></el-input>
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
        name: "Timeline",
        data() {
            return {
                tableData:[],
                dialogVisible: false,
                size: 10,
                current: 1,
                editForm: {},
                editFormRules: {
                    stage: [
                        {required: true, message: '请输入时间节点', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入事件内容', trigger: 'blur'}
                    ]
                },
                lastPage: false
            }
        },
        mounted(){
            this.getList()
        },
        methods: {
            //获取菜单列表
            getList(){
                if(this.lastPage) return;
                this.$axios.get('sys/timeline/listPage',{params: {
                        current: this.current,
                        size: this.size
                }}).then(res =>{
                    let list = res.data.data.records;
                    this.tableData.push(...list);
                    this.lastPage = list.length < this.size;
                })
            },
            //重新加载
            refresh(done){
                this.current = 1;
                this.lastPage = false;
                this.getList()
                done();
            },
            //加载更多
            loadMone(done){
                this.current ++;
                this.getList()
                done();
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
                        this.$axios.post('/sys/timeline/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
                                    this.getList()
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
                this.$axios.get('/sys/timeline/info/' + id).then(res => {
                    this.editForm = res.data.data;
                })
                this.dialogVisible = true
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该时间线, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/timeline/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getList()
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