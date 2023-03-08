<template>
    <el-container>

        <el-aside width="200px">
            <SideMenu></SideMenu>
        </el-aside>

        <el-container>
            <el-header>
                <strong>ONE-PIECE后台管理系统</strong>
                <div class="header-avatar">
                    <!-- 头像-->
                    <el-avatar size="medium">
                        <img :src="userInfo.avatar">
                    </el-avatar>
                    <el-dropdown>
                        <!--  用户名-->
						<span class="el-dropdown-link">
                            {{userInfo.username}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
						</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link to="/userCenter">
                                    <template @tab-remove="removeTab" @click="this.$store.commit('addTab',{name:'密码修改',perms: 'UserCenter'})">密码修改</template>
                                </router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-upload
                                        class="avatar-uploader"
                                        action=""
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                        上传头像
                                </el-upload>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </el-header>
            <el-main>
                <Tab></Tab>
                <div style="margin: 0 15px;">
                    <router-view/>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import SideMenu from "../components/inc/SideMenu";
    import Tab from "../components/inc/Tab";

    export default {
        name: "Home",
        components:{
            SideMenu,
            Tab
        },
        data(){
            return{
                userInfo:{
                    id: "",
                    username: "",
                    avatar: ""
                }
            }
        },
        created(){
            this.getUserInfo();
        },
        methods: {
            // 获取用户信息
            getUserInfo(){
                this.$axios.get("/sys/user/userInfo").then(res =>{
                    this.userInfo = res.data.data;
                })
            },
            //登出
            logout(){
                this.$confirm('确定退出系统吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/logout").then(res =>{
                        console.log(res);
                        localStorage.clear();
                        sessionStorage.clear();
                        this.$store.commit("resetState");
                        this.$router.push("/login");
                    })
                }).catch(() => {});
            },
            //上传头像校验
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false;
                }

                //上传头像
                var data = new FormData;
                data.append("file",file)
                data.append("type","headSculpture")
                this.$axios({
                        method: 'Post',
                        url:"/sys/user/uploadAvatar",
                        headers: { 'Content-Type': 'multipart/form-data' },
                        data : data
                }).then(res =>{
                    this.userInfo.avatar = res.data.data;
                })
            },
            handleAvatarSuccess(){
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 0;
        margin: 0;
        height: 100%;
    }
    .header-avatar {
        float: right;
        width: 150px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .el-dropdown-link {
        cursor: pointer;
    }
    .el-header {
        background-color: #17B3A3;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        line-height: 200px;
    }
    .el-main {
        color: #333;
        padding: 0;
    }
    a {
        text-decoration: none;
    }
</style>