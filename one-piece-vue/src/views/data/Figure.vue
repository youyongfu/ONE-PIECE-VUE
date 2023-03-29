<template>
    <div>

        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="名称" class="searchForm">
                <el-input v-model="searchForm.name" placeholder="名称"></el-input>
            </el-form-item>

            <el-form-item label="性别" class="searchForm">
                <el-select v-model="searchForm.sex" placeholder="请选择">
                    <el-option v-for="item in figureSex" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="searchForm">
                <el-button type="primary" @click="listPage">查询</el-button>
            </el-form-item>
        </el-form>

        <el-divider></el-divider>

        <el-form :inline="true">
            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:figure:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border stripe v-loading="loading">

            <el-table-column type="selection" min-width="3"></el-table-column>

            <el-table-column prop="name" label="名称" min-width="10"></el-table-column>

            <el-table-column prop="foreignName" label="外文名" min-width="13"></el-table-column>

            <el-table-column prop="alias" label="别名" min-width="14"></el-table-column>

            <el-table-column prop="sex" label="性别" min-width="10">
                <template slot-scope="scope">
                    {{getFigureSexSelect(scope.row.sex)}}
                </template>
            </el-table-column>

            <el-table-column prop="height" label="身高" min-width="10"></el-table-column>

            <el-table-column prop="age" label="年龄" min-width="10"></el-table-column>

            <el-table-column prop="birth" label="生日" min-width="10" ></el-table-column>

            <!--  操作按钮-->
            <el-table-column prop="icon" label="操作" min-width="20">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:figure:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:figure:update')"></el-divider>
                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:figure:delete')">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="current"
                :page-size="size"
                :total="total">
        </el-pagination>

        <FigureEdit title="编辑人物信息" v-if="dialogVisible" ref="FigureEdit"/>
    </div>
</template>

<script>
    import FigureEdit from "../data/FigureEdit";

    export default {
        name: "Figure",
        components:{FigureEdit},
        data() {
            return {
                loading: true,                  //是否显示加载动效
                searchForm: {},                 //搜索内容
                tableData: [],                  //列表数据
                total: 0,                       //总条数
                size: 10,                       //每页显示条数
                current: 1,                     //页数
                dialogVisible: false,           //是否显示编辑对话框
                figureSex: [],                   //人物性别
            }
        },
        created(){
            this.listPage();
            this.getFigureSex();
        },
        methods: {
            //获取人物性别
            getFigureSex(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"FIGURE_SEX"}}).then(res =>{
                    this.figureSex = res.data.data;
                })
            },
            //回显性别
            getFigureSexSelect(value) {
                for (var i = 0; i < this.figureSex.length; i++) {
                    if (this.figureSex[i].value == value) {
                        return this.figureSex[i].name;
                    }
                }
            },
            //获取
            listPage() {
                this.$axios.get('sys/figure/listPage', {params: {
                        keyword: JSON.stringify(this.searchForm),
                        current: this.current,
                        size: this.size
                    }}
                ).then(res => {
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                    this.loading = false;
                })
            },
            //条数改变触发
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.listPage()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.listPage()
            },
            //编辑
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.FigureEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该人物, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/figure/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.listPage()
                            }
                        });
                    })
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

    .searchForm {
        margin-top: 10px;
        margin-left: 20px;
    }
</style>