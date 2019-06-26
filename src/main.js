import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 进度条的样式
import 'nprogress/nprogress.css'
// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的 index
import router from './router'

// 引入公共样式文件，最好在element 样式文件之后，可以自定义修改 element内置样式
import './styles/index.less'

// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'

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
