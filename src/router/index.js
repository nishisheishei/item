import Vue from 'vue'
import Router from 'vue-router'
// 引入导航条
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'
Vue.use(Router)
const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home'),
    // },
    {
      // name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'image',
          path: '/image',
          component: () => import('@/views/image')
        },
        {
          name: 'fans',
          path: '/fans',
          component: () => import('@/views/fans')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

// 全局前置守卫
// 当你访问路由页面的时候，会先进入这里
// to 要去哪里
// from 来自哪里
// next 允许通过的方法

router.beforeEach((to, from, next) => {
  // 开启进度条
  nprogress.start()
  // console.log(to)
  // 获取是否登录
  // const userInfo = window.localStorage.getItem('user_Info')
  const userInfo = getUser()
  // console.log(userInfo)
  // 非登录页面
  if (to.path !== '/login') {
    // 没有登录，跳转到登录页面
    if (!userInfo) {
      // 三种都可以跳转页面 建议用前两种
      next({ name: 'login' })
      // next({ path: '/login' })
      // next({ '/login' })
    } else {
      // 登录了，允许通过
      next()
    }
  } else {
    // 登录页面
    if (!userInfo) {
      // 没有登录，允许通过
      next()
    } else {
      // 登录了，不允许通过
      // next(false)  //中断当前导航
      // next({ name: 'home' })
      // 登录过后 不能再去登录页面 如果要去登录页面 就叫页面强制刷新
      window.location.href = '/#/'
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  // 路由导航完成，结束进度条
  nprogress.done()
})

export default router
