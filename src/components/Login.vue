<template>
  <div class="login">
    <el-form ref="form" :rules="rules" :model="form" status-icon label-width="80px">
      <img src="../assets/avatar.jpg" class="logo">
      <el-form-item label="用户名" prop = "username">
        <el-input v-model="form.username" placeholder="请输入用户名" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop = "password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-login" @click = "login">登陆</el-button>
        <el-button @click = "reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { min: 4, max: 12, message: '用户名在4-12位之间', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 4, max: 12, message: '密码在4-12位之间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(isValid => {
        if (!isValid) return
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            this.$message.success('恭喜，登陆成功')
            this.$router.push({ name: 'index' })
          } else {
            this.$message({
              message: '登陆失败！',
              type: 'error',
              duraction: 1000
            })
          }
        })
      })
    }
  }
}
</script>

<style lang = 'scss'>
.login {
  width: 400px;
  padding: 20px;
  padding-top: 80px;
  background-color: #fff;
  margin: 0 auto;
  margin-top: 200px;
  position: relative;
  .logo {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 5px solid #fff;
  }
  .btn-login {
    margin-right: 60px;
  }
}
</style>
