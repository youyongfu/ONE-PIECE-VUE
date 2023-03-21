<template>
    <div>

        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="名称" class="searchForm">
                <el-input v-model="searchForm.name" placeholder="名称"></el-input>
            </el-form-item>

            <el-form-item label="性质" class="searchForm">
                <el-select v-model="searchForm.nature" placeholder="请选择">
                    <el-option v-for="item in natureOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="上级组织" prop="parentId">
                <el-select v-model="searchForm.parentId" placeholder="请选择上级组织">
                    <template v-for="item in treeData">
                        <el-option :label="item.name" :value="item.id" :key="item.name"></el-option>
                        <template v-for="child in item.children">
                            <el-option :label="child.name" :value="child.id" :key="child.name">
                                <span>{{ "- " + child.name }}</span>
                            </el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item class="searchForm">
                <el-button type="primary" @click="getOrganizationList">查询</el-button>
            </el-form-item>
        </el-form>

        <el-divider></el-divider>

        <el-form :inline="true">
            <!-- 操作按钮-->
            <el-form-item>
                <el-button type="primary" @click="editHandle(null)" v-if="hasAuth('sys:organization:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe v-loading="loading">

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="name" label="名称" width="150"></el-table-column>

            <el-table-column prop="foreignName" label="外文名" width="160"></el-table-column>

            <el-table-column prop="nature" label="性质" width="120">
                <template slot-scope="scope">
                    {{getNatureSelect(scope.row.nature)}}
                </template>
            </el-table-column>

            <el-table-column prop="birth" label="诞生时间" width="120"></el-table-column>

            <el-table-column prop="debut" label="初次登场" width="220"></el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">

                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:organization:update')">编辑</el-button>
                    <el-divider direction="vertical" v-if="hasAuth('sys:organization:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:organization:delete')">删除</el-button>
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

        <OrganizationEdit title="编辑组织信息" v-if="dialogVisible" ref="OrganizationEdit"/>
    </div>
</template>

<script>
    import OrganizationEdit from "../data/OrganizationEdit";

    export default {
        name: "Organization",
        components:{OrganizationEdit},
        data() {
            return {
                loading: true,                  //是否显示加载动效
                searchForm: {},                 //搜索内容
                tableData: [],                  //列表数据
                total: 0,                       //总条数
                size: 10,                       //每页显示条数
                current: 1,                     //页数
                dialogVisible: false,           //是否显示编辑对话框
                natureOptions: [],                   //组织性质
                treeData:[],                    //组织信息列表
            }
        },
        created(){
            this.getOrganizationList();
            this.getNatureOptions();
            this.getTreeOrganization();
        },
        methods: {
            //获取组织列表
            getOrganizationList() {
                this.$axios.get('sys/organization/listPage', {params: {
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
                this.getOrganizationList()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getOrganizationList()
            },
            //获取树形组织
            getTreeOrganization(){
                this.$axios.get('sys/organization/tree').then(res =>{
                    this.treeData = res.data.data;
                })
            },
            //获取组织性质
            getNatureOptions(){
                this.$axios.get('sys/dict/getListByCode',{params:{code:"ORGANIZATION_NATURE"}}).then(res =>{
                    this.natureOptions = res.data.data;
                })
            },
            //回显性质
            getNatureSelect(value) {
                for (var i = 0; i < this.natureOptions.length; i++) {
                    if (this.natureOptions[i].value == value) {
                        return this.natureOptions[i].name;
                    }
                }
            },
            //编辑组织
            editHandle(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.OrganizationEdit.init(id);
                });
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该组织, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/organization/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getOrganizationList()
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