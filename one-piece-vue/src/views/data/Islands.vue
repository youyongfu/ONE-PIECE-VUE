<template>
    <div>

        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="名称" class="searchForm">
                <el-input v-model="searchForm.name" placeholder="名称"></el-input>
            </el-form-item>

            <el-form-item class="searchForm">
                <el-button type="primary" @click="listPage">查询</el-button>
            </el-form-item>
        </el-form>

        <el-form :inline="true">
            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:islands:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe v-loading="loading">

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="name" label="名称" width="120"></el-table-column>

            <el-table-column prop="foreignName" label="外文名" width="170"></el-table-column>

            <el-table-column prop="alias" label="别名" width="120"></el-table-column>

            <el-table-column prop="position" label="地理位置" width="120"></el-table-column>

            <el-table-column prop="characteristic" label="特征" width="150"></el-table-column>

            <el-table-column prop="climate" label="气候条件" width="120"></el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">

                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:islands:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:islands:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:islands:delete')">删除</el-button>
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

        <IslandsEdit title="编辑岛屿信息" v-if="dialogVisible" ref="IslandsEdit"/>
    </div>
</template>

<script>
    import IslandsEdit from "../data/IslandsEdit";

    export default {
        name: "Islands",
        components:{IslandsEdit},
        data() {
            return {
                loading: true,                  //是否显示加载动效
                searchForm: {},                 //搜索内容
                tableData: [],                  //列表数据
                total: 0,                       //总条数
                size: 10,                       //每页显示条数
                current: 1,                     //页数
                dialogVisible: false,           //是否显示编辑对话框
            }
        },
        created(){
            this.listPage()
        },
        methods: {
            //获取列表
            listPage() {
                this.$axios.get('sys/islands/listPage', {params: {
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
            //编辑组织
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.IslandsEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该岛屿, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/islands/delete/" + id).then(res => {
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