<template>
    <div>

        <el-form :inline="true">
            <!--搜索-->
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getTreeDict">搜索</el-button>
            </el-form-item>

            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:dict:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" :load="getChildrenList" lazy style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}" v-loading="loading">

            <el-table-column prop="name" label="名称" sortable width="180"></el-table-column>

            <el-table-column prop="code" label="编码" sortable width="180"></el-table-column>

            <el-table-column prop="value" label="值"></el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:dict:update')">编辑</el-button>

                    <el-divider direction="vertical" v-if="hasAuth('sys:dict:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:dict:delete')">删除</el-button>
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

        <DictEdit title="编辑数据字典" v-if="dialogVisible" ref="DictEdit"/>

    </div>
</template>

<script>

    import DictEdit from "../set/DictEdit";

    export default {
        name: "Dict",
        components:{DictEdit},
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
            this.getTreeDict()
        },
        methods: {
            //获取数据字典列表
            getTreeDict(){
                this.$axios.get('sys/dict/listPage',{params: {
                        keyword: JSON.stringify(this.searchForm),
                        current: this.current,
                        size: this.size
                }}).then(res =>{
                    this.tableData = res.data.data;
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                    this.loading = false;
                })
            },
            //获取子菜单
            getChildrenList(tree,treeNode,resolve){
                this.$axios.get('sys/dict/getChildrenList/'+ tree.id).then(res =>{
                    resolve(res.data.data);
                })
            },
            //条数改变触发
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getTreeDict()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getTreeDict()
            },
            //编辑
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.DictEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该数据字典, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/dict/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getTreeDict()
                            }
                        });
                    })
                }).catch(() => {});
            }
        },
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

</style>