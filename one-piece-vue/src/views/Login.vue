<template>
    <div id="app">
        <el-row type="flex" class="row-bg" justify="center">
            <el-col :xl="6" :lg="7">
                <h2>欢迎来到one-piece管理系统</h2>
                <el-image :src="require('@/assets/fm.jpeg')" style="height: 180px;width: 250px"></el-image>
                <p>为什么遇到如此强大的敌人你也不愿逃跑？</p>
                <p>那是因为身后，有至爱之人。</p>
            </el-col>

            <el-col :span="1">
                <el-divider direction="vertical"></el-divider>
            </el-col>

            <el-col :xl="6" :lg="7">
                <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username" style="width: 380px">
                        <el-input v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" style="width: 380px">
                        <el-input v-model="loginForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="captcha" style="width: 380px">
                        <el-input v-model="loginForm.captcha" style="width: 150px;float: left"></el-input>
                        <el-image :src="captchaImg" class="captchaImage" @click="getCaptcha"></el-image>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                        <el-button @click="resetForm('loginForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                    captcha: '',
                    token: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    captcha: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { min: 5, max: 5, message: '长度为5个字符', trigger: 'blur' }
                    ]
                },
                captchaImg : null
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/login?'+ qs.stringify(this.loginForm)).then(res => {
                            console.log(res)
                            const jwt = res.headers['authorization']
                            this.$store.commit('SET_TOKEN', jwt)
                            this.$router.push("/index")
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getCaptcha(){
                this.$axios.get('/captcha').then(res => {
                    console.log(res.data)
                    this.captchaImg = res.data.data.captchaImg
                    this.loginForm.token = res.data.data.token
                })
            }
        },
        created() {
            this.getCaptcha();
        }
    }
</script>

<style scoped>

    .el-row {
        height: 100%;
        background-color: #fafafa;
        display: flex;
        align-items: center;
        text-align: center;
    }

    .el-divider {
        height: 200px;
    }

    .captcha {
        float: left;
        margin-left: 8px;
        border-radius: 4px;
    }
</style>