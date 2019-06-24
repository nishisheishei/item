<template>
    <div>
      <div class="aside-img">
        <a href="/">
          <img src="./logo_admin.png" alt="">
        </a>
      </div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-setting"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/publish"><i class="iconfont icon-wenzhang1"></i>发布文章</el-menu-item>
            <el-menu-item index="/article"><i class="iconfont icon-liebiao2"></i>内容列表</el-menu-item>
            <el-menu-item index="/comment"><i class="iconfont icon-liebiao"></i>评论列表</el-menu-item>
            <el-menu-item index="/image"><i class="iconfont icon-xiangmuguanli"></i>素材管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>粉丝管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/fans"><i class="iconfont icon-shuju"></i>图文数据</el-menu-item>
            <el-menu-item index="/fans/overview"><i class="iconfont icon-quanshixiangmugaikuang"></i>粉丝概况</el-menu-item>
            <el-menu-item index="/fans/portrayal"><i class="iconfont icon-fensi"></i>粉丝画像</el-menu-item>
            <el-menu-item index="/fans/list"><i class="iconfont icon-liebiao1"></i>粉丝列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/account">
          <i class="el-icon-setting"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </div>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {

    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.aside-img {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
