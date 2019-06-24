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
                <img src="userInfo.photo" alt="">
                <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_Info'))
  }
}
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
