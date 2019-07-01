<template>
<!-- 素材管理页面 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图片管理</span>
      </div>
       <div class="action">
        <el-radio-group v-model="active">
          <el-radio-button @click.native="loadImages(false)" label="全部"></el-radio-button>
          <el-radio-button @click.native="loadImages(true)" label="收藏"></el-radio-button>
        </el-radio-group>
        <el-upload
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
          name="image"
          :on-success="handleUploadSuccess"
          :show-file-list="false">
          <!-- () => { this.loadImages(false) } -->
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>

      <!-- 图片列表 -->
      <el-row :gutter="20">
        <el-col :span="4" v-for="item in images" :key="item.id" style="margin-bottom: 20px">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.url" class="image" style="max-width: 100%; width:200px;  height: 150px">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <time class="time"></time>
                <el-button
                  plain type="primary"
                  :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                  circle
                  @click="handleCollect(item)"></el-button>
                <el-button
                  plain
                  type="primary"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(item)"></el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
export default {
  name: 'Media',
  data () {
    return {
      active: '全部',
      images: []
    }
  },

  created () {
    this.loadImages()
  },

  methods: {
    async loadImages (collect = false) {
      // this.disabled = true
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect // 是否查询收藏图片，默认查所有
            // page: 1,
            // per_page: 10
          }
        })
        // console.log(data)
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片失败')
      }

      // this.disabled = false
    },
    async handleCollect (item) {
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        // console.log(data)
        item.is_collected = data.collect

        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        this.$message.error('收藏图片失败')
      }
    },
    // 点击删除
    async handleDelete (item) {
      try {
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })

        this.loadImages()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (err) {
        this.$message.error('删除失败')
      }
    },
    handleUploadSuccess () {
      // 上传成功，重新加载所有图片列表
      this.loadImages(false)
    }
  }

}
</script>

<style lang="less" scoped>
.action {
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>
