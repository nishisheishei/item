<template>
    <div>
        <!-- <p>AppHeader</p> -->
        <el-row :gutter="20" class="header-wrap">
            <el-col :span="16">
                <div class="grid-content bg-purple">
                    <p><i class="iconfont icon-shouye hander-you"></i>江苏传智播客教育科技股份有限公司</p>
                </div>
            </el-col>
            <el-col :span="8" class="header-img">
                <!-- <span class="demonstration">click 激活</span> -->
                <img :src="userInfo.photo" alt="">
                <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <!--
                        我可以使用 .native 事件修饰符将原始的 HTML 页面注册到组件的根元素上
                     -->
                    <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getUser, removeUser } from '@/utils/auth'
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    //   获取存储数据
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_Info'))
    this.userInfo = getUser()
  },
  methods: {
    handleLogout () {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 退出成功清除持久存储中的 user_Info 数据
        // window.localStorage.removeItem('user_Info')
        removeUser('user_Info')
        // 跳转到登录页面
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取退出'
        })
      })
    }
  }
}
// {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjE0NDcwOTYsInVzZXJfaWQiOjExNDIzMjU0NDI4MDg2NDM1ODQsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.kEs8iuSL29k3N_dFMzRCy-aKZgf_AC0VeZyA4UbA0mI","refresh_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjI2NDk0OTYsInVzZXJfaWQiOjExNDIzMjU0NDI4MDg2NDM1ODQsInJlZnJlc2giOnRydWUsInZlcmlmaWVkIjp0cnVlfQ.3HE4728m8SEuAK2VJuB1ZXt3az_QwKHpaw9tdD1sVhA","id":1142325442808643600,"name":"17501116111","photo":"http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi"}   user_Info
</script>

<style lang="less" scoped>
.header-wrap {
    line-height: 60px;
    .hander-you {
        padding-right: 10px;
    }
    .header-img {
        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            // margin-right: 10px;
            // display: flex;
            // justify-content: center;
            // align-items: center;
        }
    }
}
</style>
