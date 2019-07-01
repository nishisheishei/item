<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span="10">
        <el-form v-loading="loading">
          <el-form-item label="媒体名称">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体简介">
            <el-input v-model="user.intro"></el-input>
          </el-form-item>
          <el-form-item label="头条号ID">
            <el-input disabled :value="user.id"></el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input disabled :value="user.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave" :disabled="disabled">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="10">
        <p>上传头像</p>
        <!--
            文件上传组件
                action 上传请求地址，必须的
                headers 配置上传请求的请求头
                    如果有 token 则需要手动配置到这里
                data 默认只携带文件，如果需要别的数据，可以放到 data 中
                name 上传的文件字段名称，默认叫 file ，如果你的接口要求的名子和这个不一致，则需要单独配置
                show-file-list 是否显示文件预览列表
                on-success 文件上传成功触发的回调
                before-upload 文件上传之前触发的回调
                http-request 如果它的默认配置无法满足你，则我们可以自己去发请求上传文件

                注意：这个组件不能配置请求方法
         -->
        <el-upload
            v-loading="loadingLoad"
            element-loading-text="拼命加载中"
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :http-request="handleUpload">
            <!-- 用来预览上传的图片 -->
            <img v-if="user.photo" :src="user.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      loading: false,
      // 保存更新按钮禁用
      disabled: false,
      // 上传头像loading加载
      loadingLoad: false
    }
  },
  created () {
    this.loadUser()
  },

  methods: {
    //   加载数据
    async loadUser () {
      this.loading = true
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })

        // console.log(data)
        this.user = data
      } catch (err) {
        this.$message.error('获取账户信息失败')
      }
      this.loading = false
    },
    // 点击按钮 保存用户信息
    async handleSave () {
      this.disabled = true
      try {
        const { name, intro, email } = this.user
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          }
        })

        this.$message({
          type: 'success',
          message: '保存修改成功'
        })

        // this.$store.commit('changeUser', data)
        // 提交 mutation，也就是调用 mutation 函数
        this.$store.commit('changeUser', data)
      } catch (err) {
        this.$message.error('保存修改失败')
      }
      this.disabled = false
    },
    async handleUpload (upliadConfig) {
      this.loadingLoad = true
      // console.log(upliadConfig)
      try {
        // Axios 上传文件
        // 1. 构建一个 FormData 对象
        // 将文件添加到 FormData 对象中
        // 2. 发送请求，将 FormData 对象作为 axios 的data 请求体
        const formData = new FormData()
        formData.append('photo', upliadConfig.file)
        await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: formData
        })

        // this.loadUser()
        // this.$store.commit('changeUser', this.user)
        this.$message({
          type: 'success',
          message: '上传头像成功'
        })
      } catch (err) {
        this.$message.error('上传头像失败')
      }
      this.loadingLoad = false
    }
  }
}
</script>

<!-- 无作用域的样式，作用到全局 -->
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="less" scoped>

</style>
