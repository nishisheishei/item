<template>
  <div id="app">
    <!-- <h1>{{ $store.state.user.name }}</h1> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;
}
</style>
