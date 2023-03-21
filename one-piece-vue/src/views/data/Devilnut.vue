<template>
    <div>

        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="名称" class="searchForm">
                <el-input v-model="searchForm.name" placeholder="名称"></el-input>
            </el-form-item>

            <el-form-item label="类别" class="searchForm">
                <el-select v-model="searchForm.category" placeholder="请选择">
                    <el-option v-for="item in categoryOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="searchForm">
                <el-button type="primary" @click="listPage">查询</el-button>
            </el-form-item>
        </el-form>

        <el-form :inline="true">
            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:devilnut:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe>

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="name" label="名称" width="120"></el-table-column>

            <el-table-column prop="foreignName" label="外文名" width="170"></el-table-column>

            <el-table-column prop="alias" label="别名" width="200"></el-table-column>

            <el-table-column prop="category" label="类别" width="120">
                <template slot-scope="scope">
                    {{getCategorySelect(scope.row.category)}}
                </template>
            </el-table-column>

            <el-table-column prop="nature" label="性质" width="200"></el-table-column>

            <el-table-column prop="debut" label="初次出现" width="150"></el-table-column>

            <!--  操作按钮-->
            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:devilnut:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:devilnut:update')"></el-divider>
                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:devilnut:delete')">删除</el-button>
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

        <DevilnutEdit title="编辑果实信息" v-if="dialogVisible" ref="DevilnutEdit"/>
    </div>
</template>

<script>
    import DevilnutEdit from "../data/DevilnutEdit";

    export default {
        name: "Devilnut",
        components:{DevilnutEdit},
        data() {
            return {
                searchForm: {},                 //搜索内容
                tableData: [],                  //列表数据
                total: 0,                       //总条数
                size: 10,                       //每页显示条数
                current: 1,                     //页数
                dialogVisible: false,           //是否显示编辑对话框
                categoryOptions: []                   //果实分类
            }
        },
        created(){
            this.listPage();
            this.getCategoryOptions();
        },
        methods: {
            //获取
            listPage() {
                this.$axios.get('sys/devilnut/listPage', {params: {
                        keyword: JSON.stringify(this.searchForm),
                        current: this.current,
                        size: this.size
                    }}
                ).then(res => {
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
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
            //获取果实分类
            getCategoryOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"DEVILNUT_CATEGORY"}}).then(res =>{
                    this.categoryOptions = res.data.data;
                })
            },
            //回显果实分类
            getCategorySelect(value) {
                for (var i = 0; i < this.categoryOptions.length; i++) {
                    if (this.categoryOptions[i].value == value) {
                        return this.categoryOptions[i].name;
                    }
                }
            },
            //编辑
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.DevilnutEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该果实, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/devilnut/delete/" + id).then(res => {
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

</style>