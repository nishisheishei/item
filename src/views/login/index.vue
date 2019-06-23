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
            <el-button @click="handleSendCode" :disabled="!!codeTimer">{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
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
const initCodeTimeSeconds = 300

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
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
      codeTimer: null,
      codeTimeSeconds: initCodeTimeSeconds
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
    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // 登录成功  >=200 && < 400
        console.log(res.data)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      }).catch((e) => { // 登录失败，给个提示语 >=400
        this.$message.error('登录失败，手机号或验证码错误')
      })
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
    showGeetest () {
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
        }, captchaObj => {
          // console.log(captchaObj)
          captchaObj.onReady(() => { // 弹出验证码内容框
          // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify()
          }).onSuccess(() => {
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
              // console.log(res.data)
              // 开启倒计时效果
              this.codeCountDown()
            })
          }).onError(() => {
          // your code
          })
        })
      })
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
