<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body fullscreen>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm" :inline="true">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="组织标志"></el-step>
                    <el-step title="历史"></el-step>
                    <el-step title="地理环境"></el-step>
                    <el-step title="登场人物"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel">

                    <el-tab-pane label="基本信息" name="basicInfo">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="所属区域" prop="parentId">
                                    <el-select v-model="editForm.parentId" placeholder="请选择所属区域">
                                        <template v-for="item in treeData">
                                            <el-option :label="item.name" :value="item.id" :key="item.name"></el-option>
                                            <template v-for="child in item.children">
                                                <el-option :label="child.name" :value="child.id" :key="child.name">
                                                    <span>{{ "- " + child.name }}</span>
                                                </el-option>
                                            </template>
                                        </template>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="外文名" prop="foreignName">
                                    <el-input v-model="editForm.foreignName" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="别名" prop="alias">
                                    <el-input v-model="editForm.alias" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="地理位置" prop="position">
                                    <el-input v-model="editForm.position" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="特征" prop="characteristic">
                                    <el-input v-model="editForm.characteristic" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="气候条件" prop="climate">
                                    <el-input v-model="editForm.climate" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="初次出现" prop="debut">
                                    <el-select v-model="editForm.debut" filterable placeholder="请选择" clearable>
                                        <el-option v-for="item in episodesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="简介" prop="synopsis" label-width="100px">
                                    <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="editForm.synopsis"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="标志">
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

                    <el-tab-pane label="历史">
                        <el-tiptap v-model="editForm.source" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="地理环境">
                        <el-tiptap v-model="editForm.geography" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="登场人物">
                        <div class="margin3">
                            <el-button type="primary" @click="addRecord('Onstage')">添加</el-button>
                        </div>
                        <div v-for="(item,index) in onstage.character" :key="index">
                            <el-row :gutter="10">
                                <el-col :span="9">
                                    <el-form-item label="名称" prop="opponentFigureId" label-width="100px">
                                        <el-select v-model="item.figureId" filterable placeholder="请选择" clearable>
                                            <el-option v-for="item in figureOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="9">
                                    <el-form-item label="简介" prop="synopsis" label-width="100px">
                                        <el-input v-model="item.synopsis" autocomplete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item  class="floatRight">
                                        <el-button  @click.prevent="moveUpRecord(index,'Onstage')">上移</el-button>
                                        <el-button  @click.prevent="moveDownRecord(index,'Onstage')">下移</el-button>
                                        <el-button type="danger" @click.prevent="removeRecord(item,'Onstage')">删除</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-divider></el-divider>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <el-form-item class="btn">
                    <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
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
        name: "IslandsEdit",
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
                            data.append("type","islands")
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
                deleteFileId: [],               //移除文件id
                fileList: [],                   //上传文件列表
                fileShowList: [],               //上传文件展示列表
                dialogImageUrl: '',             //图片地址
                dialogVisible: false,           //是否显示图片
                disabled: false,                 //是否显示图片按钮
                episodesOptions:[],             //剧集信息
                figureOptions:[],                //人物列表
                onstage:{                        //登场角色
                    character:[{id:"",figureId:"",synopsis:"",episodesId:"",sortNumber:1}]
                },
            }
        },
        created(){
            this.getTreeOrganization();
            this.getEpisodesOptions();
            this.getFigureOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/islands/info/' + id).then(res => {
                            this.editForm = res.data.data.islands;              //组织基本信息
                            if(this.editForm.parentId === "0"){                   //若无上级组织，parentId设为空
                                this.editForm.parentId = "";
                            }
                            this.fileShowList = res.data.data.fileList;             //上传文件展示信息
                            this.editForm.source = res.data.data.source             //历史
                            this.editForm.geography = res.data.data.geography       //地理环境
                            if(res.data.data.islands.sysIslandsCharacterList.length > 0){
                                this.onstage.character = res.data.data.islands.sysIslandsCharacterList;     //登场角色回显
                            }
                        })
                    }
                    this.open = true;
                    this.title = "编辑岛屿信息";
                });
            },
            //获取树形组织
            getTreeOrganization(){
                this.$axios.get('sys/islands/tree').then(res =>{
                    this.treeData = res.data.data;
                })
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
            //获取剧集信息
            getEpisodesOptions(){
                this.$axios.get('sys/episodes/getAll').then(res =>{
                    this.episodesOptions = res.data.data;
                })
            },
            //获取人物
            getFigureOptions(){
                this.$axios.get('sys/figure/getAll').then(res =>{
                    this.figureOptions = res.data.data;
                })
            },
            //添加记录
            addRecord(type){
                console.log(type)
                let list = this.onstage.character;     //登场角色
                let obj={id:"",figureId:"",synopsis:"",episodesId:"", sortNumber: list.length + 1}    //登场角色
                list.push(obj)
            },
            //删除记录
            removeRecord(item,type) {
                console.log(type)
                let list = this.onstage.character;     //登场角色
                let length = list.length;
                if(length > 1){
                    var index = list.indexOf(item)
                    if (index !== -1) {
                        if(index + 1 < length){
                            list.slice(index+1,length).forEach(e =>{
                                e.sortNumber -= 1
                            })
                        }
                        list.splice(index, 1)
                    }
                }
            },
            //上移记录
            moveUpRecord(index,type) {
                console.log(type)
                let list = this.onstage.character;     //登场角色
                if(index > 0){
                    let sortNumber = list[index - 1].sortNumber;
                    list[index - 1].sortNumber = list[index].sortNumber;
                    list[index].sortNumber = sortNumber;
                    list.splice(index - 1, 1, ...list.splice(index, 1, list[index - 1]))
                }
            },
            //下移记录
            moveDownRecord(index,type) {
                console.log(type)
                let list = this.onstage.character;     //登场角色
                if(index != list.length -1){
                    let sortNumber = list[index + 1].sortNumber;
                    list[index + 1].sortNumber = list[index].sortNumber;
                    list[index].sortNumber = sortNumber;
                    list.splice(index, 1, ...list.splice(index + 1, 1, list[index]))
                }
            },
            //提交
            async submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        //登场角色
                        this.editForm.sysIslandsCharacterList= this.onstage.character;

                        if(this.editForm.id){
                            this.editForm.fileIds = this.deleteFileId.toString();
                        }
                        //保存组织信息
                        this.$axios.post('/sys/islands/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
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
                    data.append("type","islands")
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

                var index = index = this.fileShowList.findIndex(item => {
                    if (item.id == file.id){
                        return true;
                    }
                })
                this.fileShowList.splice(index, 1)

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

    .el-tabs{
        margin-top: 5vh;
    }

    .el-tiptap-editor {
        height: 65vh;
    }

    .el-input{
        width: 50vh;
    }

    .el-input30{
        width: 30vh;
    }

    .el-select{
        width: 50vh;
    }

    .el-select30{
        width: 30vh;
    }

    .el-textarea{
        width: 146vh;
    }

    .el-textarea123{
        width: 123vh;
    }

    .floatRight{
        float: right;
    }

    .margin3{
        margin: 3vh;
    }

    .btn {
        display: flex;
        justify-content: center;
    }

    .btn .el-button{
        margin-right: 10vh;
    }
</style>