<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body fullscreen>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm" :inline="true">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="组织标志"></el-step>
                    <el-step title="成立背景"></el-step>
                    <el-step title="组织经历"></el-step>
                    <el-step title="组织文化"></el-step>
                    <el-step title="组织关系"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel">

                    <el-tab-pane label="基本信息" name="basicInfo">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="上级组织" prop="parentId">
                                    <select-tree :props="defaultProps" :options="treeData" :value="editForm.parentId" @getValue="getValue($event,'1')"></select-tree>
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
                                <el-form-item label="状态" prop="statu">
                                    <el-select v-model="editForm.statu" placeholder="请选择" clearable>
                                        <el-option v-for="item in statuOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="性质" prop="nature">
                                    <el-select v-model="editForm.nature" placeholder="请选择" clearable>
                                        <el-option v-for="item in natureOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="诞生时间" prop="birth">
                                    <el-input v-model="editForm.birth" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="最高权力" prop="leader">
                                    <el-select v-model="editForm.leader" filterable placeholder="请选择" clearable>
                                        <el-option v-for="item in figureOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="总部" prop="headquarters">
                                    <el-select v-model="editForm.headquarters" filterable placeholder="请选择" clearable>
                                        <el-option v-for="item in islandsOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="初次登场" prop="debut">
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
                                        <i class="el-icon-download" ></i>
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

                    <el-tab-pane label="成立背景">
                        <el-tiptap v-model="editForm.background" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="组织经历">
                        <el-tiptap v-model="editForm.experience" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="组织文化">
                        <el-tiptap v-model="editForm.civilization" :extensions="extensions"></el-tiptap>
                    </el-tab-pane>

                    <el-tab-pane label="组织关系">
                        <div class="margin3">
                            <el-button type="primary" @click="addRecord('WarRecord')">添加</el-button>
                        </div>
                        <div v-for="(item,index) in organization.relationList" :key="index">
                            <el-row :gutter="10">
                                <el-col :span="9">
                                    <el-form-item label="关系类型" prop="relationType">
                                        <el-select v-model="item.relationType" placeholder="请选择" clearable>
                                            <el-option v-for="item in relationOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="组织名称" prop="relationOrganizationId">
                                        <select-tree :props="defaultProps" :options="treeData" :value="item.relationOrganizationId" @getValue="getValue($event,'2',index)"></select-tree>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item  class="floatRight">
                                        <el-button  @click.prevent="moveUpRecord(index,'WarRecord')">上移</el-button>
                                        <el-button  @click.prevent="moveDownRecord(index,'WarRecord')">下移</el-button>
                                        <el-button type="danger" @click.prevent="removeRecord(item,'WarRecord')">删除</el-button>
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

    // 富文本框上传图片
    export const fileUploadImage = data => request({
        url: "/file/uploadFile", // path路径
        method: 'POST', // 请求方法
        headers: { // 请求头
            'Content-Type': 'multipart/form-data' // 上传文件所要求的格式formdata
        },
        data // 请求体
    })

    import request from "@/axios";

    import SelectTree from "../../components/inc/SelectTree";

    export default {
        name: "OrganizationEdit",
        inject:['reload'],
        components: {'el-tiptap': ElementTiptap,SelectTree},
        data() {
            return {
                title: "",                         //对话框标题
                open: false,                      //是否显示对话框
                activeNumber:1,                   //步骤条高亮显示位置
                selectLabel:"basicInfo",          //选项卡高亮显示位置
                tabPosition: 'left',              //选项卡位置
                defaultProps: {             //树形默认配置
                    children: 'children',
                    label: "name",
                    value: "id",
                },
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
                            data.append("type","organization")
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
                        {required: true, message: '请输入组织名称', trigger: 'blur'}
                    ]
                },
                treeData:[],                    //组织信息列表
                deleteFileId: [],               //移除文件id
                fileList: [],                   //上传文件列表
                fileShowList: [],               //上传文件展示列表
                dialogImageUrl: '',             //图片地址
                dialogVisible: false,           //是否显示图片
                disabled: false,                //是否显示图片按钮
                natureOptions: [],              //组织性质
                islandsOptions:[],              //总部
                figureOptions:[],               //人物列表
                statuOptions: [],               //组织状态
                relationOptions:[],             //组织关系类型
                episodesOptions:[],             //剧集信息
                organization:{                  //组织关系
                    relationList:[{id:"",relationType:"",relationOrganizationId:"",synopsis:"",ownerId:"",sortNumber:1}]
                },
            }
        },
        created(){
            this.getTreeOrganization();
            this.getNatureOptions();
            this.getIslandsOptions();
            this.getFigureOptions();
            this.getStatuOptions();
            this.getRelationOptions();
            this.getEpisodesOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/organization/info/' + id).then(res => {
                            this.editForm = res.data.data.organization;              //组织基本信息
                            if(res.data.data.organization.parentId === "0"){         //若无上级组织，parentId设为空
                                this.editForm.parentId = "";
                            }
                            this.fileShowList = res.data.data.fileList;                 //上传文件展示信息
                            this.editForm.background = res.data.data.background         //组织背景
                            this.editForm.experience = res.data.data.experience         //组织经历
                            this.editForm.civilization = res.data.data.civilization     //组织文化
                            if(res.data.data.organization.sysOrganizationRelationList.length > 0){
                                this.organization.relationList = res.data.data.organization.sysOrganizationRelationList;     //组织关系回显
                            }
                        })
                    }
                    this.open = true;
                    this.title = "编辑组织信息";
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
                this.deleteFileId = [];
                this.fileList = [];
                this.fileShowList = [];
            },
            //获取树形组织
            getTreeOrganization(){
                this.$axios.get('sys/organization/tree').then(res =>{
                    this.treeData = res.data.data;
                })
            },
            // 取值
            getValue(value,type,index) {
                if(type == '1'){
                    this.editForm.parentId = value;
                }else if(type == '2'){
                    let list = this.organization.relationList;     //人物履历
                    list[index].relationOrganizationId = value;
                }
            },
            //获取组织性质
            getNatureOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"ORGANIZATION_NATURE"}}).then(res =>{
                    this.natureOptions = res.data.data;
                })
            },
            //获取岛屿
            getIslandsOptions(){
                this.$axios.get('sys/islands/getAll').then(res =>{
                    this.islandsOptions = res.data.data;
                })
            },
            //获取人物
            getFigureOptions(){
                this.$axios.get('sys/figure/getAll').then(res =>{
                    this.figureOptions = res.data.data;
                })
            },
            //获取剧集信息
            getEpisodesOptions(){
                this.$axios.get('sys/episodes/getAll').then(res =>{
                    this.episodesOptions = res.data.data;
                })
            },
            //获取组织状态
            getStatuOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"ORGANIZATION_STATU"}}).then(res =>{
                    this.statuOptions = res.data.data;
                })
            },
            //获取组织关系类型
            getRelationOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"ORGANIZATION_RELATION_TYPE"}}).then(res =>{
                    this.relationOptions = res.data.data;
                })
            },
            //添加记录
            addRecord(type){
                console.log(type)
                let list = this.organization.relationList;     //组织关系
                let obj={id:"",relationType:"",relationOrganizationId:"",synopsis:"",ownerId:"", sortNumber: list.length + 1}    //人物履历
                list.push(obj)
            },
            //删除记录
            removeRecord(item,type) {
                console.log(type)
                let list = this.organization.relationList;     //人物履历
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
                let list = this.organization.relationList;     //组织关系
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
                let list = this.organization.relationList;     //组织关系
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

                        //组织关系
                        this.editForm.sysOrganizationRelationList= this.organization.relationList;

                        //保存组织信息
                        this.$axios.post('/sys/organization/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
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
                    data.append("type","organization")
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
            },
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