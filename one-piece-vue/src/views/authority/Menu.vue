<template>
    <div>

        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:menu:save')">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" :load="getChildrenList" lazy style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

            <el-table-column prop="name" label="名称" sortable width="180"></el-table-column>

            <el-table-column prop="perms" label="权限编码" sortable width="180"></el-table-column>

            <el-table-column prop="icon" label="图标"></el-table-column>

            <el-table-column prop="type" label="类型">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
                    <el-tag size="small" v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
                    <el-tag size="small" v-else-if="scope.row.type === 2" type="info">按钮</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="path" label="菜单URL"></el-table-column>

            <el-table-column prop="component" label="菜单组件"></el-table-column>

            <el-table-column prop="orderNum" label="排序号"></el-table-column>

            <el-table-column prop="statu" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editHandle(scope.row.id)" v-if="hasAuth('sys:menu:update')">编辑</el-button>

                    <el-divider direction="vertical" v-if="hasAuth('sys:menu:update')"></el-divider>

                    <el-button type="text" slot="reference" @click="deleteHandle(scope.row.id)" v-if="hasAuth('sys:menu:delete')">删除</el-button>
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

        <!--新增对话框-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="上级菜单" prop="parentId">
                    <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
                        <template v-for="item in treeData">
                            <el-option :label="item.name" :value="item.id" :key="item.name"></el-option>
                            <template v-for="child in item.children">
                                <el-option :label="child.name" :value="child.id" :key="child.name">
                                    <span>{{ "- " + child.name }}</span>
                                </el-option>
                            </template>
                        </template>
                    </el-select>
                    <el-alert title="未选择上级菜单，则默认为添加一级菜单" :closable="false" type="info" style="line-height: 12px;"></el-alert>
                </el-form-item>

                <el-form-item label="菜单名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="权限编码" prop="perms" label-width="100px">
                    <el-input v-model="editForm.perms" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon" label-width="100px">
                    <el-input v-model="editForm.icon" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单URL" prop="path" label-width="100px">
                    <el-input v-model="editForm.path" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单组件" prop="component" label-width="100px">
                    <el-input v-model="editForm.component" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type" label-width="100px">
                    <el-radio-group v-model="editForm.type">
                        <el-radio :label=0>目录</el-radio>
                        <el-radio :label=1>菜单</el-radio>
                        <el-radio :label=2>按钮</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="状态" prop="statu" label-width="100px">
                    <el-radio-group v-model="editForm.statu">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum" label-width="100px">
                    <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Menu",
        data() {
            return {
                tableData:[],
                treeData:[],
                dialogVisible: false,
                total: 0,
                size: 10,
                current: 1,
                editForm: {},
                editFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    perms: [
                        {required: true, message: '请输入权限编码', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
            }
        },
        created(){
            this.getListMenu()
            this.getTreeMenu()
        },
        methods: {
            //获取树形菜单
            getTreeMenu(){
                this.$axios.get('sys/menu/list').then(res =>{
                    this.treeData = res.data.data;
                })
            },
            //获取菜单列表
            getListMenu(){
                this.$axios.get('sys/menu/listPage',{params: {
                        current: this.current,
                        size: this.size
                }}).then(res =>{
                    this.tableData = res.data.data.records;
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                })
            },
            //获取子菜单
            getChildrenList(tree,treeNode,resolve){
                this.$axios.get('sys/menu/getChildrenList/'+ tree.id).then(res =>{
                    resolve(res.data.data);
                })
            },
            //条数改变触发
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getListMenu()
            },
            //页数改变触发
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getListMenu()
            },
            //重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editForm = {}
            },
            //关闭对话框
            handleClose() {
                this.resetForm('editForm')
                this.dialogVisible = false
            },
            //提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/menu/' + (this.editForm.id?'update' : 'save'), this.editForm).then(res => {
                            console.log(res)
                            this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose:() => {
                                    this.getListMenu()
                                }
                            });
                            this.resetForm('editForm')
                            this.dialogVisible = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //编辑
            editHandle(id){
                this.$axios.get('/sys/menu/info/' + id).then(res => {
                    this.editForm = res.data.data;
                    if(this.editForm.parentId === 0){
                        this.editForm.parentId = "";
                    }
                })
                this.dialogVisible = true
            },
            //删除
            deleteHandle(id){
                this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/menu/delete/" + id).then(res => {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose:() => {
                                this.getListMenu()
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