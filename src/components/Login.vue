<template>
  <div class="login">
    <div class="login-box">
      <div>
        <img src="../../public/logo.jpg">
      </div>
      <el-form  class="login-info" ref="loginform" label-width="40px" :rules="rules" :model="form">
        <el-form-item class="label" label="账号" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item class="label" label="密码" prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="form.password"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        name: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      // 重置输入的信息
      this.$refs.loginform.resetFields()
    },
    login() {
      // 表单验证的方法
      this.$refs.loginform.validate(value => {
        // 如果值为空直接终止下面代码
        if (!value) return
        // 否则发送post请求 携带form信息
        this.$http.post('login', this.form)
          .then(result => {
            // 判断状态码
            if (result.data.meta.status !== 200) {
              // alert(result.data)
              this.$message.error(result.data.meta.msg)
            } else {
              // 正确进入这里
              this.$message.success(result.data.meta.msg)
              // 把token信息放到session里保存这个登陆状态
              window.sessionStorage.setItem('token', result.data.data.token)
              this.$router.push('/home')
            }
          })
      })
    }
  }
}
</script>

<style scoped>
  .login{
    height: 100%;
    background: url("../assets/bg.jpg") center center  no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .login .login-box{
    width: 450px;
    height: 300px;
    border-radius: 10px;
    background-color: lightblue;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .login .login-box img{
    width: 120px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: -50%;
    transform: translate(-50%,100%);
  }
  .login-info{
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%);
  }
  .login-info .login-btn{
    margin-left:20%;
  }
  .login-info .label>:before {
    display: none;
  }
</style>
