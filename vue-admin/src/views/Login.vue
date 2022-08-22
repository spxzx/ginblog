<template>
  <div class="container">
    <div class="loginBox">
      <a-form-model ref="loginFormRef" :rules="rules" :model="formData" class="loginForm">
        <a-form-model-item prop="username">
          <a-input 
            v-model="formData.username" 
            placeholder="请输入用户名"
          >
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"></a-icon>
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input 
            v-model="formData.password" 
            placeholder="请输入密码" 
            type="password"
            v-on:keyup.enter="login"
          >
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"></a-icon>
          </a-input>
        </a-form-model-item>
        <a-form-model-item class="loginButton">
          <a-button type="primary" style="margin:10px" @click="login">登录</a-button>
          <a-button type="info" style="margin:10px" @click="resetForm">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      formData:{
        username: '',
        password: ''
      },
      rules:{
        username:[
          {required: true, message: '请输入用户名', trigger:'blur'},
          {min:4, max:12, message:'用户名长度为4到12位之间', trigger:'blur'},
        ],
        password:[
          {required: true, message: '请输入密码', trigger:'blur'},
          {min:6, max:20, message:'密码长度为6到20位之间', trigger:'blur'},
        ]
      }
    }
  },
  methods:{
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        if (!valid) return this.$message.errorset("输入非法数据，请重新输入")
        const {data : res}  = await this.$http.post('login', this.formData)
        if (res.status != 200) return this.$message.error(res.message)  // 输入错误信息
        window.sessionStorage.setItem('token', res.token) // 设置token
        this.$router.push('/index') // 跳转到管理员页面
      })
    },
    resetForm(){
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.container{
  height: 100%;
  background-color: #282c34;
  /* display: flex;
  justify-content: center;
  align-items: center; */
}

.loginBox{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute; /* 绝对定位 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 9px;
}

.loginForm{
  width: 100%;
  position:absolute;
  bottom: 10%;
  padding: 0 20px;
  box-sizing: border-box;
}

.loginButton{
  display: flex;
  justify-content: flex-end;
}
</style>