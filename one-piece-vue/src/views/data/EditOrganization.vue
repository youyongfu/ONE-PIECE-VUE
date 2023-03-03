<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="组织标志"></el-step>
                    <el-step title="组织历史"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel" style="margin:30px 20px 30px 15px">

                    <el-tab-pane label="基本信息" name="basicInfo">

                        <el-form-item label="上级组织" prop="parentId">
                            <el-select v-model="editForm.parentId" placeholder="请选择上级组织">
                                <template v-for="item in treeData">
                                    <el-option :label="item.chineseName" :value="item.id" :key="item.chineseName"></el-option>
                                    <template v-for="child in item.children">
                                        <el-option :label="child.chineseName" :value="child.id" :key="child.chineseName">
                                            <span>{{ "- " + child.chineseName }}</span>
                                        </el-option>
                                    </template>
                                </template>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="中文名" prop="chineseName" label-width="100px">
                            <el-input v-model="editForm.chineseName" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="英文名" prop="englishName" label-width="100px">
                            <el-input v-model="editForm.englishName" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="组织性质" prop="properties" label-width="100px">
                            <el-input v-model="editForm.properties" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="诞生时间" prop="birth" label-width="100px">
                            <el-input v-model="editForm.birth" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="组织驻地" prop="station" label-width="100px">
                            <el-input v-model="editForm.station" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="最高权力" prop="supremePower" label-width="100px">
                            <el-input v-model="editForm.supremePower" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="组织标志">
                        <el-upload
                                action=""
                                :before-upload="handleFile"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                list-type="picture"
                                multiple style="text-align: center">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="组织历史">
                        <el-tiptap v-model="editForm.history" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>
                </el-tabs>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    import {
        // 罗列出需要的功能按钮
        Doc,
        Text,
        Paragraph,
        Heading,
        Bold,
        Underline,
        Italic,
        Strike,
        ListItem,
        BulletList,
        OrderedList,
    } from 'element-tiptap';

    export default {
        name: "EditOrganization",
        data() {
            return {
                selectLabel:"basicInfo",
                activeNumber:1,
                title: "",
                open: false,
                tabPosition: 'left',
                editForm: {
                    sign : ""
                },
                editFormRules: {
                    chineseName: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'}
                    ]
                },
                treeData:[],
                fileList:[],
                signData:[],
                extensions: [
                    new Doc(),
                    new Text(),
                    new Paragraph(),
                    new Heading({ level: 5 }), // 支持多级标题，设置为5级
                    new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
                    new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
                    new Italic(),
                    new Strike(),
                    new ListItem(),
                    new BulletList(),
                    new OrderedList(),
                ],
            }
        },
        created(){
            this.getTreeOrganization()
        },
        methods: {
            //获取树形组织
            getTreeOrganization(){
                this.$axios.get('sys/organization/tree').then(res =>{
                    this.treeData = res.data.data;
                })
            },
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id != ""){
                        this.$axios.get('/sys/organization/info/' + id).then(res => {
                            this.editForm = res.data.data.organization;
                            this.fileList = res.data.data.fileList;
                            if(this.editForm.parentId === 0){
                                this.editForm.parentId = "";
                            }
                        })
                    }
                    this.open = true;
                    this.title = "编辑组织";
                });
            },
            //选项卡选中事件
            handleClick(tab,event){
                console.log(event)
                this.activeNumber = parseInt(tab.index) + 1
            },
            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editForm = {}
            },
            //关闭对话框
            handleClose() {
                this.resetForm('editForm')
                this.open = false;
                this.activeNumber = 1;
                this.selectLabel = "basicInfo";
                this.fileList = [];
                this.signData = [];
            },
            //提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editForm.sign = this.signData.toString();
                        this.$axios.post('/sys/organization/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {

                                }
                            });
                            this.resetForm('editForm')
                            this.open = false;
                            this.activeNumber = 1;
                            this.selectLabel = "basicInfo";
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //上传图片
            handleFile(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false;
                }

                //上传头像
                var data = new FormData;
                data.append("file",file)
                this.$axios({
                    method: 'Post',
                    url:"/file/uploadFile",
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data : data
                }).then(res =>{
                    this.fileList.push(res.data.data);
                    this.signData.push(res.data.data.id);
                })
            },
            //删除图片
            handleRemove(file){
                var index = this.fileList.findIndex(item => {
                    if (item.id == file.id){
                        return true;
                    }
                })
                this.fileList.splice(index, 1)
                index = this.signData.findIndex(item => {
                    if (item.id == file.id){
                        return true;
                    }
                })
                this.signData.splice(index, 1)
            }
        }
    }
</script>

<style scoped>

</style>