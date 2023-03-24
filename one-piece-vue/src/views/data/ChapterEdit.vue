<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body fullscreen>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm" :inline="true">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="篇章内容"></el-step>
                    <el-step title="所属章节"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel" style="margin:30px 20px 30px 15px">

                    <el-tab-pane label="基本信息" name="basicInfo">

                        <el-form-item label="篇章名称" prop="name" label-width="100px">
                            <el-input v-model="editForm.name" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="篇章开始" prop="boss" label-width="100px">
                            <el-select style="width:30vh" v-model="editForm.beginEpisodesId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in episodesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="篇章结束" prop="boss" label-width="100px">
                            <el-select style="width:30vh" v-model="editForm.endEpisodesId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in episodesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="简介" prop="synopsis" label-width="100px">
                            <el-input style="width:135vh" type="textarea" :rows="10" placeholder="请输入内容" v-model="editForm.synopsis"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="篇章内容">
                        <el-tiptap v-model="editForm.content" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="所属章节">
                        <div v-for="(item,index) in chapter.sections" :key="index">
                            <el-form-item label="名称" prop="name" label-width="60px">
                                <el-input style="width: 20vh" v-model="item.name" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="章节开始" prop="boss" label-width="100px">
                                <el-select style="width:50vh" v-model="item.beginEpisodesId" filterable placeholder="请选择" clearable>
                                    <el-option v-for="item in episodesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="章节结束" prop="boss" label-width="100px">
                                <el-select style="width:50vh" v-model="item.endEpisodesId" filterable placeholder="请选择" clearable>
                                    <el-option v-for="item in episodesOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item style="float: right">
                                <el-button type="primary" @click="addSections">添加</el-button>
                                <el-button @click.prevent="removeSections(item)">删除</el-button>
                            </el-form-item>

                            <el-divider></el-divider>
                        </div>
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
        name: "ChapterEdit",
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
                            data.append("type","devilnut")
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
                episodesOptions:[],               //剧集列表
                chapter:{                        //所属章节
                    sections:[{id:"",name:"",beginEpisodesId:"",endEpisodesId:"",chapterId:""}]
                },
            }
        },
        created(){
            this.getEpisodesOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/chapter/info/' + id).then(res => {
                            this.editForm = res.data.data.chapter;                 //篇章基本信息
                            if(res.data.data.chapter.sysChapterSectionsList.length > 0){
                                this.chapter.sections = res.data.data.chapter.sysChapterSectionsList;     //登场角色回显
                            }
                            this.editForm.content = res.data.data.content           //篇章内容
                        })
                    }
                    this.open = true;
                    this.title = "编辑篇章信息";
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
            },
            //获取剧集
            getEpisodesOptions(){
                this.$axios.get('sys/episodes/getAll').then(res =>{
                    this.episodesOptions = res.data.data;
                })
            },
            //添加章节
            addSections(){
                let obj={
                    id:"",
                    name:"",
                    beginEpisodesId:"",
                    endEpisodesId:"",
                    chapterId:""
                }
                this.chapter.sections.push(obj)
            },
            //删除章节
            removeSections(item) {
                if(this.chapter.sections.length > 1){
                    var index = this.chapter.sections.indexOf(item)
                    if (index !== -1) {
                        this.chapter.sections.splice(index, 1)
                    }
                }
            },
            //提交
            async submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //登场角色
                        this.editForm.sysChapterSectionsList= this.chapter.sections;

                        //保存剧集信息
                        this.$axios.post('/sys/chapter/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res);
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
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