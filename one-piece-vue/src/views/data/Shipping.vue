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
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:shipping:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border stripe v-loading="loading">

            <el-table-column type="selection" min-width="3"></el-table-column>

            <el-table-column prop="name" label="名称" min-width="10"></el-table-column>

            <el-table-column prop="foreignName" label="外文名" min-width="10"></el-table-column>

            <el-table-column prop="alias" label="别名" min-width="10"></el-table-column>

            <el-table-column prop="model" label="型号" min-width="10">
                <template slot-scope="scope">
                    {{getModelSelect(scope.row.model)}}
                </template>
            </el-table-column>

            <el-table-column prop="bulidDate" label="建造日" min-width="10"></el-table-column>

            <el-table-column prop="length" label="全长" min-width="10"></el-table-column>

            <el-table-column prop="height" label="总高" min-width="10"></el-table-column>

            <!--  操作按钮-->
            <el-table-column prop="icon" label="操作" min-width="20">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:shipping:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:shipping:update')"></el-divider>
                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:shipping:delete')">删除</el-button>
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

        <ShippingEdit title="编辑船只信息" v-if="dialogVisible" ref="ShippingEdit"/>
    </div>
</template>

<script>
    import ShippingEdit from "../data/ShippingEdit";

    export default {
        name: "Shipping",
        components:{ShippingEdit},
        data() {
            return {
                loading: true,                  //是否显示加载动效
                searchForm: {},                 //搜索内容
                tableData: [],                  //列表数据
                total: 0,                       //总条数
                size: 10,                       //每页显示条数
                current: 1,                     //页数
                dialogVisible: false,           //是否显示编辑对话框
                modelOptions: [],           //是否显示编辑对话框
            }
        },
        created(){
            this.listPage();
            this.getModelOptions();
        },
        methods: {
            //获取
            listPage() {
                this.$axios.get('sys/shipping/listPage', {params: {
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
            //获取船只型号
            getModelOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"SHIPPING_MODEL"}}).then(res =>{
                    this.modelOptions = res.data.data;
                })
            },
            //回显型号
            getModelSelect(value) {
                for (var i = 0; i < this.modelOptions.length; i++) {
                    if (this.modelOptions[i].value == value) {
                        return this.modelOptions[i].name;
                    }
                }
            },
            //编辑
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.ShippingEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该船只, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/shipping/delete/" + id).then(res => {
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