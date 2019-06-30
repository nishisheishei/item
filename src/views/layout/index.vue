<template>
    <el-container>
        <el-aside width="200px">
            <!-- 侧边栏 -->
            <AppAside/>
        </el-aside>
        <el-container>
            <el-header>
            <!-- 头部 -->
                <AppHeader/>
            </el-header>
            <!-- 内容 -->
            <el-header>
                <router-view/>
            </el-header>
        </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return { }
  }
}
</script>

<style lang="less" scoped>
.el-container{
     height: 100%;
}
.el-aside {
    background-color: #343a46;
}
.el-header {
    // background-color: #aec0d1;
}
.el-main {
    background-color: #e8eff4;
}
</style>
