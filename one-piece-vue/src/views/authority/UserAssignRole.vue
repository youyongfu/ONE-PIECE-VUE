<template>
    <div>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">
            <el-form :model="roleForm">
                <el-tree :data="roleTreeData" show-checkbox ref="roleTree" :check-strictly=checkStrictly node-key="id" :default-expand-all=true :props="defaultProps"></el-tree>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitRoleForm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "UserAssignRole",
        data() {
            return {
                roleDialogFormVisible: false,   //是否显示分配角色对话框
                roleForm: {},               //分配角色信息
                defaultProps: {             //树形默认配置
                    children: 'children',
                    label: 'name'
                },
                roleTreeData: [],           //用户角色信息
                checkStrictly: true,       //表示在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
            }
        },
        created(){
            this.getRoleList()
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.$nextTick(() => {
                    this.$axios.get("/sys/user/info/" + id).then(res => {
                        this.$refs.roleTree.setCheckedKeys(res.data.data.roleIds)
                        this.roleForm = res.data.data;
                    })
                    this.roleDialogFormVisible = true;
                    this.title = "分配角色";
                });
            },
            //获取角色列表
            getRoleList(){
                this.$axios.get('sys/role/list').then(res =>{
                    this.roleTreeData = res.data.data;
                })
            },
            //提交分配角色
            submitRoleForm(){
                var roleIds = this.$refs.roleTree.getCheckedKeys();
                this.$axios.post("/sys/user/role/" + this.roleForm.id,roleIds).then(res => {
                    console.log(res);
                    this.$message({
                        showClose: true,
                        message: '分配角色成功',
                        type: 'success',
                        onClose:() => {

                        }
                    });
                    this.roleDialogFormVisible = false;
                })
            },
        }
    }
</script>

<style scoped>

</style>