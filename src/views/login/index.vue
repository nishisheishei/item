<template>
  <div class="login-wrap">
    <!-- 给组件加 class ，会把这个 class作用到组件的根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form class="form-content" ref="form" :model="form" :rules="rules">
        <el-form-item  prop="mobile">
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item  prop="code">
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
            <el-button @click="handleSendCode" :disabled="!!codeTimer" :loading="codeLoading">{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
          </el-col>
        </el-form-item>

        <!-- <el-form-item>
          <input type="checkbox">
          <span>我已阅读并同意<a style="color:#3296fa">用户协议</a>和<a style="color:#3296fa">隐私条款</a></span>
        </el-form-item> -->

        <el-form-item prop="agree">
            <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
            <span class="agree-text">我已阅读并同意<a href="#" style="color:#3296fa">用户协议</a>和<a href="#" style="color:#3296fa">隐私条款</a></span>
        </el-form-item>

        <el-form-item class="login-btn">
          <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入axios
// import axios from 'axios'
// 引入极验 JavaScript SDK 文件， 通过 window。initGeetest 使用
import '@/vendor/gt'

// 按需加载，加载模快中非 export default 成员
import { saveUser } from '@/utils/auth'
import initGeetest from '@/utils/init-geetest'
let initCodeTimeSeconds = 300
export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入正确的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds, // 倒计时时间
      loginLoading: false, // login 登录按钮禁用
      codeLoading: false // 获取验证码按钮禁用
    }
  },
  methods: {
    // 点击登录 跳转页面
    handleLogin () {
      // console.log (123)
      // const { mobile, code } = this.form
      // 使用 form 组件的 validate 方法触发效验，获取效验的结果状态
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.submitLogin()
      })
    },
    // 点击登录按钮 发送的axios请求
    async submitLogin () {
      // 发送请求的时候禁用
      this.loginLoading = true
      try {
        const userInfo = await this.$http({
          method: 'POST',
          url: '/authorizations',
          data: this.form
        })
        // 登录成功  >=200 && < 400
        // window.localStorage.setItem('user_Info', JSON.stringify(userInfo))
        saveUser(userInfo)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        // 登录失败
        this.$message.error('登录失败，手机号或验证码错误')
      }
      // 登录失败的时候可以使用
      this.loginLoading = false
    },

    // 点击按钮发送验证码
    handleSendCode () {
      // validateField 对单个字段进行效验的方法  第一个参数参数是字符串，第二个参数是个函数
      // 验证手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        // console.log('errorMessage =>' + errorMessage)
        // 判断 当手机号正确的时候 发送验证码
        if (errorMessage) {
          return
        }
        this.showGeetest()
      })
    },
    // 验证通过，初始化显示人机交互验证码
    async showGeetest () {
      try {
        this.codeLoading = true
        const { mobile } = this.form
        const data = await this.$http({
          method: 'GET',
          url: `/captchas/${mobile}`
        })

        // console.log(res.data)
        const captchaObj = await initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        })
        // console.log(captchaObj)
        captchaObj.onReady(() => { // 弹出验证码内容框
          this.codeLoading = false
          // 验证码ready之后才能调用verify方法显示验证码
          captchaObj.verify()
        }).onSuccess(async () => {
          try {
            // your code
            // console.log(captchaObj.getValidate())
            const { geetest_challenge: challenge, geetest_seccode: seccode, geetest_validate: validate } = captchaObj.getValidate()
            await this.$http({
              method: 'GET',
              url: `/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            })
            // console.log(res.data)
            // 开启倒计时效果
            this.codeCountDown()
          } catch (err) {
            this.$message.error('获取验证码失败')
            this.codeLoading = false
          }
        })
      } catch (err) {
        this.$message.error('获取验证码失败')
        this.codeLoading = false
      }
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        // 判断 当时间小于等于0 的时候
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器
          window.clearInterval(this.codeTimer)
          // 让定时器的时间回归初始状态
          this.codeTimeSeconds = initCodeTimeSeconds
          // 将存储定时器引用的变量重新赋值为null
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  // background-color: #2b3e4a;
  // background-image: url("");
  background: url('./login_bg.jpg') no-repeat;
  background-size: 100%;
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
      width: 400px;
    }
  }
  .login-btn {
    display: flex;
    justify-content: center;
    // align-items: center;
  }
}
</style>
