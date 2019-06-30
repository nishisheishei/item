<template>
  <el-card>
    <div slot= 'header '>
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span= '10 '>
        <el-form v-loading= 'loading '>
          <el-form-item label= '媒体名称 '>
            <el-input v-model= 'user.name '></el-input>
          </el-form-item>
          <el-form-item label= '媒体简介 '>
            <el-input v-model= 'user.intro '></el-input>
          </el-form-item>
          <el-form-item label= '头条号ID '>
            <el-input disabled :value= 'user.id && user.id.toString()'></el-input>
          </el-form-item>
          <el-form-item label= '绑定手机 '>
            <el-input disabled :value= 'user.mobile '></el-input>
          </el-form-item>
          <el-form-item label= '邮箱 '>
            <el-input v-model= 'user.email '></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type= 'primary' @click="handleSave">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="10">
        <p>头像设置</p>
        <!--
          文件上传组件
            headers 配置上传请求的请求头,不经过axios,如果想要加token，则需要手动配置到这里
            data 默认只携带文件，如果需要别的数据，可以放到data中
            name 上传的文件字段名称，默认叫file,如果你的接口要求的名字和这个不一致，则需要单独配置
            action 上传请求地址，必须的
            show-file-list 是否显示文件预览列表
            on-success 文件上传成功触发的回调
            before-upload 文件上传之前触发的回调
            ***********************************
            :http-request 如果它的默认配置无法满足你，则我们可以自己去发请求上传文件,因为这个默认是post,而我们是path
            注意：这个组件的请求方法默认是post,不能配置
         -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :http-request="handleUpload">
          <!-- 用来预览上传的图片 -->
          <img v-if="user.photo" :src="user.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p>点击上传头像</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      user: {}
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

<style lang= 'less ' scoped>
</style>
