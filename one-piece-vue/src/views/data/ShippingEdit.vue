<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body fullscreen>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm" :inline="true">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="船只图片"></el-step>
                    <el-step title="船只背景"></el-step>
                    <el-step title="船只外观"></el-step>
                    <el-step title="船只功能"></el-step>
                    <el-step title="船只经历"></el-step>
                    <el-step title="相关角色"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel">

                    <el-tab-pane label="基本信息" name="basicInfo">
                        <el-row :gutter="10">
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
                                <el-form-item label="型号" prop="model">
                                    <el-select v-model="editForm.model" filterable placeholder="请选择" clearable>
                                        <el-option v-for="item in modelOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="建造日" prop="bulidDate">
                                    <el-input v-model="editForm.bulidDate" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="全长" prop="length">
                                    <el-input v-model="editForm.length" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="总高" prop="height">
                                    <el-input v-model="editForm.height" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="状态" prop="statu">
                                    <el-select v-model="editForm.statu" placeholder="请选择" clearable>
                                        <el-option v-for="item in statuOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
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
                                <el-form-item label="简介" prop="synopsis">
                                    <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="editForm.synopsis"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="船只图片">
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

                    <el-tab-pane label="船只背景">
                        <el-tiptap v-model="editForm.background" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="船只外观">
                        <el-tiptap v-model="editForm.appearance" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="船只功能">
                        <el-tiptap v-model="editForm.function" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="船只经历">
                        <el-tiptap v-model="editForm.experience" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="相关角色">
                        <div class="margin3">
                            <el-button type="primary" @click="addRecord('Related')">添加</el-button>
                        </div>
                        <div v-for="(item,index) in related.roleList" :key="index">
                            <el-row :gutter="10">
                                <el-col :span="9">
                                    <el-form-item label="身份类型" prop="relationIdentity" label-width="100px"  style="width: 200vh" >
                                        <el-radio-group v-model="item.relationIdentity">
                                            <el-radio  label="1">个人</el-radio>
                                            <el-radio  label="2">组织</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item  label="姓名" prop="relationId" label-width="100px" v-if="item.relationIdentity === '1'">
                                        <el-select v-model="item.relationId" filterable placeholder="请选择" clearable>
                                            <el-option v-for="item in figureOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="组织名称" prop="relationId" label-width="100px" v-if="item.relationIdentity === '2'" >
                                        <el-select v-model="item.relationId" filterable placeholder="请选择" clearable>
                                            <el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item  class="floatRight">
                                        <el-button  @click.prevent="moveUpRecord(index,'Related')">上移</el-button>
                                        <el-button  @click.prevent="moveDownRecord(index,'Related')">下移</el-button>
                                        <el-button type="danger" @click.prevent="removeRecord(item,'Related')">删除</el-button>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="关系类型" prop="relation">
                                        <el-input v-model="item.relation" autocomplete="off"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="19">
                                    <el-form-item label="简介" prop="synopsis">
                                        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="item.synopsis" class="el-textarea123"></el-input>
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
        name: "ShippingEdit",
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
                            data.append("type","shipping")
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
                editForm: {                        //编辑内容
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
                disabled: false,                //是否显示图片按钮
                modelOptions: [],               //船只型号
                statuOptions: [],               //船只状态
                figureOptions:[],               //人物列表
                related:{                       //相关角色
                    roleList:[{id:"",relation:"",relationIdentity:"",relationId:"",synopsis:"",shippingId:"",sortNumber:1}]
                },
                organizationOptions:[],         //所属组织
                episodesOptions:[],             //剧集信息
            }
        },
        created(){
            this.getModelOptions();
            this.getStatuOptions();
            this.getFigureOptions();
            this.getOrganizationOptions();
            this.getEpisodesOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/shipping/info/' + id).then(res => {
                            this.editForm = res.data.data.shipping;              //组织基本信息
                            this.fileShowList = res.data.data.fileList;             //上传文件展示信息
                            this.editForm.background = res.data.data.background     //船只背景
                            this.editForm.appearance = res.data.data.appearance     //船只外观
                            this.editForm.function = res.data.data.function         //船只功能
                            this.editForm.experience = res.data.data.experience     //船只经历
                            if(res.data.data.shipping.sysShippingRoleList.length > 0){
                                this.related.roleList = res.data.data.shipping.sysShippingRoleList;     //相关角色回显
                            }
                        })
                    }
                    this.open = true;
                    this.title = "编辑船只信息";
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
            //获取船只型号
            getModelOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"SHIPPING_MODEL"}}).then(res =>{
                    this.modelOptions = res.data.data;
                })
            },
            //获取船只状态
            getStatuOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"SHIPPING_STATU"}}).then(res =>{
                    this.statuOptions = res.data.data;
                })
            },
            //获取人物
            getFigureOptions(){
                this.$axios.get('sys/figure/getAll').then(res =>{
                    this.figureOptions = res.data.data;
                })
            },
            //获取组织
            getOrganizationOptions(){
                this.$axios.get('sys/organization/getAll').then(res =>{
                    this.organizationOptions = res.data.data;
                })
            },
            //获取剧集信息
            getEpisodesOptions(){
                this.$axios.get('sys/episodes/getAll').then(res =>{
                    this.episodesOptions = res.data.data;
                })
            },
            //添加记录
            addRecord(type){
                console.log(type)
                let list = this.related.roleList;     //相关角色
                let obj={id:"",relation:"",relationIdentity:"1",relationId:"",synopsis:"",shippingId:"", sortNumber: list.length + 1}    //相关角色
                list.push(obj)
            },
            //删除记录
            removeRecord(item,type) {
                console.log(type)
                let list = this.related.roleList;     //相关角色
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
                let list = this.related.roleList;     //相关角色
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
                let list = this.related.roleList;     //相关角色
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

                        if(this.editForm.id){
                            this.editForm.fileIds = this.deleteFileId.toString();
                        }

                        //相关角色
                        this.editForm.sysShippingRoleList= this.related.roleList;

                        //保存组织信息
                        this.$axios.post('/sys/shipping/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
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
                    data.append("type","shipping")
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