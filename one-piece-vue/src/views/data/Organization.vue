<template>
    <div>
        <el-form :inline="true">

            <el-form-item>
                <el-button type="primary" @click="editOrganization(null)" v-if="hasAuth('sys:organization:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe>

            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="name" label="名称" width="120"></el-table-column>

            <el-table-column prop="properties" label="性质" width="120"></el-table-column>

            <el-table-column prop="birth" label="诞生时间" width="120"></el-table-column>

            <el-table-column prop="station" label="驻地" width="120"></el-table-column>

            <el-table-column prop="supremePower" label="最高权力" width="120"></el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">

                    <el-button type="text" @click="editOrganization(scope.row.id)" v-if="hasAuth('sys:organization:update')">编辑</el-button>
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

        <EditOrganization title="编辑组织" v-if="dialogVisible" ref="EditOrganization"/>
    </div>
</template>

<script>
    import EditOrganization from "../data/EditOrganization";

    export default {
        name: "Organization",
        components:{EditOrganization},
        data() {
            return {
                searchForm: {},
                tableData: [],
                total: 0,
                size: 10,
                current: 1,
                dialogVisible: false,
            }
        },
        created(){
            this.getOrganizationList()
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
            //编辑组织
            editOrganization(id){
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.EditOrganization.init(id);
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