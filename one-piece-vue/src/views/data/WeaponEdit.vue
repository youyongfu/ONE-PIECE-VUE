<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body fullscreen>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm" :inline="true">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="武器图片"></el-step>
                    <el-step title="来历"></el-step>
                    <el-step title="造型"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel" style="margin:30px 20px 30px 15px">

                    <el-tab-pane label="基本信息" name="basicInfo">

                        <el-form-item label="名称" prop="name" label-width="100px">
                            <el-input v-model="editForm.name" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="外文名" prop="foreignName" label-width="100px">
                            <el-input v-model="editForm.foreignName" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="位阶" prop="level" label-width="100px">
                            <el-select v-model="editForm.level" placeholder="请选择" clearable>
                                <el-option v-for="item in levelOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="价值" prop="money" label-width="100px">
                            <el-input v-model="editForm.money" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="铸造者" prop="foundry" label-width="100px">
                            <el-select v-model="editForm.foundry" placeholder="请选择" clearable>
                                <el-option v-for="item in figureOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="使用者" prop="user" label-width="100px">
                            <el-select v-model="editForm.user" placeholder="请选择" clearable>
                                <el-option v-for="item in figureOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="初次出现" prop="debut" label-width="100px">
                            <el-select v-model="editForm.debut" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in episodesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态" prop="statu" label-width="100px">
                            <el-select v-model="editForm.statu" placeholder="请选择" clearable>
                                <el-option v-for="item in statuOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="简介" prop="synopsis" label-width="100px">
                            <el-input style="width:135vh" type="textarea" :rows="10" placeholder="请输入内容" v-model="editForm.synopsis"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="武器图片">
                        <el-upload action="#" list-type="picture-card" :file-list="fileShowList" :on-change="handleFile" :auto-upload="false">
                            <i slot="default" class="el-icon-plus"></i>
                            <div slot="file" slot-scope="{file}">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                <span class="el-upload-list__item-actions">
                                    <!-- 预览-->
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                    <!-- 下载-->
                                    <span v-if="!disabled && file.id" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                        <i class="el-icon-download"></i>
                                    </span>
                                    <!-- 移除-->
                                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                        <i class="el-icon-delete"></i>
                                    </span>
                                </span>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-tab-pane>

                    <el-tab-pane label="来历">
                        <el-tiptap v-model="editForm.origin" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="造型">
                        <el-tiptap v-model="editForm.modelling" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>
                </el-tabs>

                <el-form-item class="btn">
                    <el-button type="primary" @click="submitForm('editForm')" style="margin-right: 30px;">提交</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    //引入富文本框控件
    import {
        // 罗列出需要的功能按钮
        ElementTiptap,
        Doc,
        Text,
        Paragraph,
        Heading,
        Bold,
        Underline,
        Italic,
        Image,
        Strike,
        ListItem,
        BulletList,
        OrderedList,
        TodoItem,
        TodoList,
        HorizontalRule,
        Fullscreen,
        Preview,
        CodeBlock,
        TextColor
    } from 'element-tiptap';

    import request from "@/axios";
    // 富文本框上传图片
    export const fileUploadImage = data => request({
        url: "/file/uploadFile", // path路径
        method: 'POST', // 请求方法
        headers: { // 请求头
            'Content-Type': 'multipart/form-data' // 上传文件所要求的格式formdata
        },
        data // 请求体
    })

    export default {
        name: "WeaponEdit",
        inject:['reload'],
        components: {'el-tiptap': ElementTiptap,},
        data() {
            return {
                title: "",                         //对话框标题
                open: false,                      //是否显示对话框
                activeNumber:1,                   //步骤条高亮显示位置
                selectLabel:"basicInfo",          //选项卡高亮显示位置
                tabPosition: 'left',              //选项卡位置
                extensions: [                   //富文本框工具栏
                    new Doc(),
                    new Text(),
                    new Paragraph(),
                    new Heading({ level: 3 }),
                    new Bold({ bubble: true }),             // 在气泡菜单中渲染菜单按钮
                    new Image({
                        // 图片的上传方法，返回一个 Promise<url>
                        uploadRequest (file) {
                            var data = new FormData;
                            data.append("file",file)
                            data.append("type","weapon")
                            return fileUploadImage(data).then(res =>{
                                return res.data.data.url;
                            })
                        }
                    }),
                    new Underline(),        // 下划线
                    new Italic(),           // 斜体
                    new Strike(),           // 删除线
                    new HorizontalRule(),   // 华丽的分割线
                    new ListItem(),
                    new BulletList(),       // 无序列表
                    new OrderedList(),      // 有序列表
                    new TodoItem(),
                    new TodoList(),
                    new Fullscreen(),
                    new Preview(),
                    new CodeBlock(),
                    new TextColor()
                ],
                editForm: {                         //编辑内容
                    fileIds:""                     //上传文件id列表
                },
                editFormRules: {                  //校验规则
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                },
                treeData:[],                    //组织信息列表
                deleteFileId: [],                //移除文件id
                fileList: [],                   //上传文件列表
                fileShowList: [],               //上传文件展示列表
                dialogImageUrl: '',             //图片地址
                dialogVisible: false,           //是否显示图片
                disabled: false,                //是否显示图片按钮
                levelOptions: [],               //位阶
                figureOptions:[],               //人物信息列表
                statuOptions: [],               //武器状态
                episodesOptions:[],             //剧集信息
            }
        },
        created(){
            this.getLevelOptions();
            this.getFigureOptions();
            this.getStatuOptions();
            this.getEpisodesOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/weapon/info/' + id).then(res => {
                            this.editForm = res.data.data.weapon;                   //组织基本信息
                            this.fileShowList = res.data.data.fileList;             //上传文件展示信息
                            this.editForm.origin = res.data.data.origin             //来历
                            this.editForm.modelling = res.data.data.modelling       //造型
                        })
                    }
                    this.open = true;
                    this.title = "编辑武器信息";
                });
            },
            //选项卡选中事件-步骤条联动
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
                this.fileShowList = [];
                this.fileList = [];
                this.deleteFileId = [];
            },
            //获取武器位阶
            getLevelOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"WEAPON_LEVEL"}}).then(res =>{
                    this.levelOptions = res.data.data;
                })
            },
            //获取人物
            getFigureOptions(){
                this.$axios.get('sys/figure/getAll').then(res =>{
                    this.figureOptions = res.data.data;
                })
            },
            //获取武器状态
            getStatuOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"WEAPON_STATU"}}).then(res =>{
                    this.statuOptions = res.data.data;
                })
            },
            //获取剧集信息
            getEpisodesOptions(){
                this.$axios.get('sys/episodes/getAll').then(res =>{
                    this.episodesOptions = res.data.data;
                })
            },
            //提交
            async submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if(this.editForm.id){
                            this.editForm.fileIds = this.deleteFileId.toString();
                        }
                        //保存组织信息
                        this.$axios.post('/sys/weapon/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
                                    this.saveFile(res.data.data.id);
                                    this.handleClose();
                                    this.reload();
                                }
                            });
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //上传文件校验
            handleFile(file) {
                console.log("上传文件")
                let fileName = file.name;
                let index = fileName.lastIndexOf(".");
                let type = fileName.substring(index+1);
                const isJPG = type === 'jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false;
                }
                this.fileList.push(file.raw);
                this.fileShowList.push(file);
            },
            //上传文件
            saveFile(id){
                this.fileList.forEach(file =>{
                    var data = new FormData;
                    data.append("file",file)
                    data.append("type","weapon")
                    data.append("id",id)
                    this.$axios({
                        method: 'Post',
                        url:"/file/uploadFileAndRecord",
                        headers: { 'Content-Type': 'multipart/form-data' },
                        data : data
                    }).then(res =>{
                        console.log(res)
                    })
                })
            },
            //删除文件
            handleRemove(file){
                this.deleteFileId.push(file.id);            //添加要删除的文件id

                //将该图片从上传文件展示列表移除
                var index = index = this.fileShowList.findIndex(item => {
                    if (item.id == file.id){
                        return true;
                    }
                })
                this.fileShowList.splice(index, 1)

                //将该图片从上传文件列表移除
                index = this.fileList.findIndex(item => {
                    if (item.id == file.id){
                        return true;
                    }
                })
                if(index != -1){
                    this.fileList.splice(index, 1)
                }
            },
            //图片预览
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //图片下载
            handleDownload(file) {
                var elemIF = document.createElement('iframe')
                elemIF.src = file.url;
                elemIF.style.display = 'none'
                document.body.appendChild(elemIF)
            }
        }
    }
</script>

<style scoped>
    .el-tiptap-editor {
        height: 65vh;
    }

    .el-input {
        width: 60vh
    }

    .el-select {
        width: 60vh
    }

    .btn {
        display: flex;
        justify-content: center;
    }
</style>