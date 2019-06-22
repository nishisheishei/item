<template>
  <div class="login-wrap">
    <!-- 给组件加 class ，会把这个 class作用到组件的根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form class="form-content" ref="form" :model="form">
        <el-form-item>
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <el-button @click="handleSendCode">获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入axios
import axios from 'axios'
// 引入极验 JavaScript SDK 文件， 通过 window。initGeetest 使用
import '@/vendor/gt'
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 点击登录 跳转页面
    handleLogin () {
      // console.log (123)
      // const { mobile, code } = this.form
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      })
        .then(res => { // 登录成功  >=200 && < 400
          console.log(res.data)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          this.$router.push({
            name: 'home'
          })
        })
        .catch((e) => { // 登录失败，给个提示语 >=400
          this.$message.error('登录失败，手机号或验证码错误')
        })
    },

    // 点击按钮发送验证码
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data)
        const { data } = res.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        }, function (captchaObj) {
          // console.log(captchaObj)
          captchaObj.onReady(function () { // 弹出验证码内容框
          // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify()
          }).onSuccess(function () {
          // your code
            // console.log(captchaObj.getValidate())
            const { geetest_challenge: challenge, geetest_seccode: seccode, geetest_validate: validate } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              console.log(res.data)
              // 开启倒计时效果
            })
          }).onError(function () {
          // your code
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  // background-color: #2b3e4a;
  // background-image: url("");
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
      // color: aqua;
    }
  }
  .form-wrap {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100px;
    }
  }
  .login-btn {
    display: flex;
    justify-content: center;
    // align-items: center;
  }
}
</style>
