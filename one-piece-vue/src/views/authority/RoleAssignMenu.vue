<template>
    <div>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
            <el-form :model="permForm">
                <el-tree :data="permTreeData" show-checkbox ref="permTree" :default-expand-all=true node-key="id" :check-strictly=true :props="defaultProps"></el-tree>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="permDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="submitPermForm()">提交</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "RoleAssignMenu",
        data() {
            return {
                permDialogVisible: false,           //是否显示分配权限对话框
                permForm: {},                       //分配权限信息
                defaultProps: {                     //树形默认配置
                    children: 'children',
                    label: 'name'
                },
                permTreeData: []                    //角色权限信息
            }
        },
        created(){
            this.getMenuList()
        },
        methods: {
            // 窗口初始化方法
            init(id) {
                this.$nextTick(() => {
                    this.permDialogVisible = true;
                    this.$axios.get("/sys/role/info/" + id).then(res => {
                        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
                        this.permForm = res.data.data;
                    })
                    this.title = "分配权限";
                });
            },
            //获取菜单列表
            getMenuList(){
                this.$axios.get('sys/menu/list').then(res =>{
                    this.permTreeData = res.data.data;
                })
            },
            //提交分配权限
            submitPermForm(){
                var menuIds = this.$refs.permTree.getCheckedKeys();
                this.$axios.post("/sys/role/perm/" + this.permForm.id,menuIds).then(res => {
                    console.log(res);
                    this.$message({
                        showClose: true,
                        message: '分配权限成功',
                        type: 'success',
                        onClose:() => {

                        }
                    });
                    this.permDialogVisible = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>