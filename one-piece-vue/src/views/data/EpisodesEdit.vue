<template>
    <div>
        <!-- 添加或修改业务对话框 -->
        <el-dialog :title="title" :visible.sync="open" :before-close="handleClose" append-to-body fullscreen>

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm" :inline="true">

                <el-steps :active="activeNumber" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="登场角色"></el-step>
                </el-steps>

                <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="selectLabel">

                    <el-tab-pane label="基本信息" name="basicInfo">
                        <el-row :gutter="10">
                            <el-col :span="9">
                                <el-form-item label="标题" prop="name">
                                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="剧集号" prop="orderNum">
                                    <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="BOSS" prop="boss">
                                    <el-select v-model="editForm.boss" filterable placeholder="请选择" clearable>
                                        <el-option v-for="item in figureOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
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

                    <el-tab-pane label="登场角色">
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

    export default {
        name: "EpisodesEdit",
        inject:['reload'],
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
                figureOptions:[],                //人物列表
                onstage:{                        //登场角色
                    character:[{id:"",figureId:"",synopsis:"",episodesId:"",sortNumber:1}]
                },
            }
        },
        created(){
            this.getFigureOptions();
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.activeNumber = 1;
                this.$nextTick(() => {
                    if(id){
                        //获取组织信息
                        this.$axios.get('/sys/episodes/info/' + id).then(res => {
                            this.editForm = res.data.data.episodes;                 //组织基本信息
                            if(res.data.data.episodes.sysEpisodesCharacterList.length > 0){
                                this.onstage.character = res.data.data.episodes.sysEpisodesCharacterList;     //登场角色回显
                            }
                        })
                    }
                    this.open = true;
                    this.title = "编辑剧集信息";
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
                        this.editForm.sysEpisodesCharacterList= this.onstage.character;

                        //保存剧集信息
                        this.$axios.post('/sys/episodes/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
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