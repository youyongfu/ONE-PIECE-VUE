<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body>
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="角色图片"></el-step>
                    <el-step title="角色背景"></el-step>
                    <el-step title="角色形象"></el-step>
                    <el-step title="角色生活"></el-step>
                    <el-step title="角色能力"></el-step>
                    <el-step title="角色经历"></el-step>
                    <el-step title="人际关系"></el-step>
                    <el-step title="对战记录"></el-step>
                </el-steps>

                <div class="dialogDiv">
                    <el-tabs class="dialogDiv" :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel" style="margin:30px 20px 30px 15px">

                        <el-tab-pane label="基本信息" name="basicInfo">

                            <el-form-item label="名称" prop="name" label-width="100px">
                                <el-input v-model="editForm.name" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="外文名" prop="foreignName" label-width="100px">
                                <el-input v-model="editForm.foreignName" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="别名" prop="alias" label-width="100px">
                                <el-input v-model="editForm.alias" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="性别" prop="sex" label-width="100px">
                                <el-radio-group v-model="editForm.sex">
                                    <el-radio v-for="item in figureSex" :key="item.value" :label="item.value" :value="item.value">{{item.name}}</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="生日" prop="birth" label-width="100px">
                                <el-date-picker v-model="editForm.birth" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="年龄" prop="age" label-width="100px">
                                <el-input v-model="editForm.age" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="血型" prop="blood" label-width="100px">
                                <el-input v-model="editForm.blood" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="身高" prop="height" label-width="100px">
                                <el-input v-model="editForm.height" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="悬赏金" prop="bounty" label-width="100px">
                                <el-input v-model="editForm.bounty" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="初次登场" prop="debut" label-width="100px">
                                <el-input v-model="editForm.debut" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="职位" prop="position" label-width="100px">
                                <el-input v-model="editForm.position" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="饮食习惯" prop="eatingHabits" label-width="100px">
                                <el-input v-model="editForm.eatingHabits" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="霸气" prop="overbearing" label-width="100px">
                                <el-input v-model="editForm.overbearing" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="星座" prop="constellation" label-width="100px">
                                <el-input v-model="editForm.constellation" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="正义观" prop="justiceView" label-width="100px">
                                <el-input v-model="editForm.justiceView" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="恶魔果实" prop="devilnutIds" label-width="100px">
                                <el-select v-model="editForm.devilnutIds" filterable multiple placeholder="请选择">
                                    <el-option v-for="item in devilnutOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="所属组织" prop="organizationIds" label-width="100px">
                                <el-select v-model="editForm.organizationIds" filterable multiple placeholder="请选择">
                                    <el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="出身" prop="islandsIds" label-width="100px">
                                <el-select v-model="editForm.islandsIds" filterable multiple placeholder="请选择">
                                    <el-option v-for="item in islandsOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="所乘船只" prop="shippingIds" label-width="100px">
                                <el-select v-model="editForm.shippingIds" filterable multiple placeholder="请选择">
                                    <el-option v-for="item in shippingOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="所用武器" prop="weaponIds" label-width="100px">
                                <el-select v-model="editForm.weaponIds" filterable multiple placeholder="请选择">
                                    <el-option v-for="item in weaponOptions" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="简介" prop="synopsis" label-width="100px">
                                <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="editForm.synopsis"></el-input>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="角色图片">
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
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
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

                        <el-tab-pane label="角色背景">
                            <el-tiptap v-model="editForm.background" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>

                        <el-tab-pane label="角色形象">
                            <el-tiptap v-model="editForm.image" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>

                        <el-tab-pane label="角色生活">
                            <el-tiptap v-model="editForm.life" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>

                        <el-tab-pane label="角色能力">
                            <el-tiptap v-model="editForm.ability" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>

                        <el-tab-pane label="角色经历">
                            <el-tiptap v-model="editForm.experience" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>

                        <el-tab-pane label="人际关系">
                            <el-tiptap v-model="editForm.interpersonalRelationship" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>

                        <el-tab-pane label="对战记录">
                            <el-tiptap v-model="editForm.warRecord" :extensions="extensions"></el-tiptap>
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <el-form-item>
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
        name: "FigureEdit",
        inject:['reload'],
        components: {'el-tiptap': ElementTiptap,},
        data() {
            return {
                title: "",                         //对话框标题
                open: false,                      //是否显示对话框
                activeNumber:1,                   //步骤条高亮显示位置
                selectLabel:"basicInfo",          //选项卡高亮显示位置
                tabPosition: 'left',              //选项卡位置
                editForm: {                         //编辑内容
                    fileIds:""                     //上传文件id列表
                },
                editFormRules: {                  //校验规则
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                },
                treeData:[],                    //组织信息列表
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
                            data.append("type","figure")
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
                deleteFileId: [],                //移除文件id
                fileList: [],                   //上传文件列表
                fileShowList: [],               //上传文件展示列表
                dialogImageUrl: '',             //图片地址
                dialogVisible: false,           //是否显示图片
                disabled: false,                 //是否显示图片按钮
                figureSex: [],                   //人物性别
                devilnutOptions:[],               //恶魔果实
                organizationOptions:[],               //所属组织
                islandsOptions:[],               //出身
                shippingOptions:[],               //所乘船只
                weaponOptions:[],               //所用武器
            }
        },
        created(){
            this.getFigureSex();
            this.getDevilnutOptions();
            this.getOrganizationOptions();
            this.getIslandsOptions();
            this.getShippingOptions();
            this.getWeaponOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/figure/info/' + id).then(res => {
                            this.editForm = res.data.data.figure;              //人物基本信息
                            this.editForm.background = res.data.data.background     //角色背景
                            this.editForm.image = res.data.data.image     //角色形象
                            this.editForm.life = res.data.data.life     //角色生活
                            this.editForm.ability = res.data.data.ability     //角色能力
                            this.editForm.experience = res.data.data.experience     //角色经历
                            this.editForm.interpersonalRelationship = res.data.data.interpersonalRelationship     //人际关系
                            this.editForm.warRecord = res.data.data.warRecord     //对战记录
                            this.fileShowList = res.data.data.fileList;             //上传文件展示信息
                            if(res.data.data.figure.sex){
                                this.editForm.sex = res.data.data.figure.sex.toString();            //性别回显
                            }
                            this.editForm.devilnutIds = res.data.data.devilnutList;                   //恶魔果实
                            this.editForm.organizationIds = res.data.data.organizationList;                   //所属组织
                            this.editForm.islandsIds = res.data.data.islandsList;                   //出身
                            this.editForm.shippingIds = res.data.data.shippingList;                   //shippingOptions
                            this.editForm.weaponIds = res.data.data.weaponList;                   //所用武器
                        })
                    }
                    this.open = true;
                    this.title = "编辑人物信息";
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
            //获取人物性别
            getFigureSex(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"FIGURE_SEX"}}).then(res =>{
                    this.figureSex = res.data.data;
                })
            },
            //获取恶魔果实
            getDevilnutOptions(){
                this.$axios.get('sys/devilnut/getAll').then(res =>{
                    this.devilnutOptions = res.data.data;
                })
            },
            //获取组织
            getOrganizationOptions(){
                this.$axios.get('sys/organization/getAll').then(res =>{
                    this.organizationOptions = res.data.data;
                })
            },
            //获取岛屿
            getIslandsOptions(){
                this.$axios.get('sys/islands/getAll').then(res =>{
                    this.islandsOptions = res.data.data;
                })
            },
            //获取船只
            getShippingOptions(){
                this.$axios.get('sys/shipping/getAll').then(res =>{
                    this.shippingOptions = res.data.data;
                })
            },
            //获取武器
            getWeaponOptions(){
                this.$axios.get('sys/weapon/getAll').then(res =>{
                    this.weaponOptions = res.data.data;
                })
            },
            //提交
            async submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if(this.editForm.id){
                            this.editForm.fileIds = this.deleteFileId.toString();
                        }
                        if(this.editForm.devilnutIds){
                            this.editForm.devilnutIds = this.editForm.devilnutIds.join(",");
                        }
                        if(this.editForm.organizationIds){
                            this.editForm.organizationIds = this.editForm.organizationIds.join(",");
                        }
                        if(this.editForm.islandsIds){
                            this.editForm.islandsIds = this.editForm.islandsIds.join(",");
                        }
                        if(this.editForm.shippingIds){
                            this.editForm.shippingIds = this.editForm.shippingIds.join(",");
                        }
                        if(this.editForm.weaponIds){
                            this.editForm.weaponIds = this.editForm.weaponIds.join(",");
                        }
                        //保存组织信息
                        this.$axios.post('/sys/figure/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
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
                    data.append("type","figure")
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
                console.log(file);
            }
        }
    }
</script>

<style scoped>
    .dialogDiv{
        height: 50vh;
        overflow: auto;
        margin-bottom: 30px;
    }
</style>