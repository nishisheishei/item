import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'
// 进度条的样式
import 'nprogress/nprogress.css'
import JSONbig from 'json-bigint'

// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的 index
import router from './router'

// 引入公共样式文件，最好在element 样式文件之后，可以自定义修改 element内置样式
import './styles/index.less'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'

//
axios.defaults.transformResponse = [function (data) {
  // return data
  // 如何解决后端返回数据中的数字超出安全整数范围问题？
  // 这里使用 JSONbig 转换原始数据
  // 类似于 JSON.parse
  // 但是它会处理其中超出安全整数范围的整数问题
  // 严谨一点，如果 data 不是 json 格式字符串就会报错
  try {
    // 如果 json 格式字符串，就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
} ]

// Axios 请求拦截器：axios 发出的请求会先经过这里
axios.interceptors.request.use(config => {
  // console.log('请求进入了拦截器')
  const user = getUser()

  // config 是本次请求相关的配置对象

  // 如果有 user 数据，则往本次请求中添加用户 token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // return config 是允许请求发送的开关
  // 我们可以在这之前进行一些业务逻辑操作
  return config
}, error => {
// Do something with request error
  return Promise.reject(error)
})

// Axios 响应拦截器：axios 收到的响应会先经过这里
axios.interceptors.response.use(response => {
  // response 就是响应结果对象
  // 这里将response 原样返回，那么你发请求的地方收到的就是 response
  // 我们可以控制请求收到的响应数据格式
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >= 400 的状态码会进入这里
  // 如果用户 token 无效，让其跳转到登录页面
  if (error.response.status === 401) {
    // error.response.status === 401
    // 清除本地存储的无效 token 的用户信息
    removeUser()
    // 跳转到登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

Vue.use(ElementUI)

// 所有的组件都是 Vue 的实例
// 我们可以把一些需要早组件中频繁使用的成员放到 Vue.prototype 中
// Vue.prototype.foo = 'bar'

// 给 Vue 原型对象扩展成员的时候，最好加一个 $ 前缀，避免和组件内部的数据成员冲突
// 几乎所有组件都要去发请求，这样配置完以后，我们在组件中发请求就可以直接 this.$http({ methos、url })
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
