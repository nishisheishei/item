<template>
    <!-- 文章管理页面 -->
    <div>
      <!-- 数据筛选 -->
      <el-card class="filter-card">
      <el-form ref="filterParams" :model="filterParams" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio v-for="(item, index) in statTypes" :key="item.label" :label="index">{{ item.label }}</el-radio>
        </el-radio-group>
        <el-form-item label="频道列表" class="article-label">
          <el-select v-model="filterParams.channel_id" placeholder="请选择" clearable>
            <!-- <article-channel v-model="filterParams.channel_id"></article-channel> -->
            <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="filterParams.range_date"
            @change="handleDtaeChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter" :loading="articleLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- /数据筛选 -->
    <!-- 文章列表 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>一共有<strong>{{ totalCount }}</strong>条数据</span>
      </div>
      <!--
      talbel 表格不需要我们自己去手动 v-for 遍历
        只需要将数组数据交给 table 表格的 data 属性就可以了
        然后配置 el-table-column 表格列组件即可
          label 列表标题
          prop 遍历项目中的数据字段
          width 列表的
      表格默认吧数据当做文本去输出
      如果需要其他数据格式，侧可以自定义表格列
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        v-loading="articleLoading">
        <el-table-column
          label="封面"
          width="180">
          <!--
            template 中的内容就是自定义表格列内容
            如果需要早 template中访问遍历项数据，则需要给 template 配置 slot-scope="scope"
              slot-scope 属性名是固定的
              scope 值是自己随便起的名字
          -->
          <template slot-scope="scope">
            <img
              width="20"
              v-for="item in scope.row.cover.images"
              :key="item"
              :src="item">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain>修改</el-button>
            <el-button size="mini" type="warning" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-card>
      <!-- /文章列表 -->
      <!-- 数据分页
          page-size 配置每页大小，默认是 10
          total 用来配置总记录数
          分页组件会根据每页大小和总记录数进行分页
          current-page 当前高亮的页码，需要和数据保持同步
      -->
      <el-pagination
        background
        :current-page="page"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="handleCurrentChange"
        :disabled="articleLoading">
      </el-pagination>
      <!-- /数据分页 -->
    </div>
</template>

<script>
// import ArticleChannel from '@/components/article-channel'
// import { getUser } from '@/utils/auth'
export default {
  name: 'ArticleList',
  // components: {
  //   ArticleChannel
  // },
  data () {
    return {
      filterParams: {
        status: '', // 状态
        channel_id: '', // 频道
        begin_pubdate: '', // 起始时间
        end_pubdate: '' // 截止时间
      },
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10, // 每页数量
      totalCount: 0, // 总数量
      page: 1, // 当前页码
      articleLoading: false, // 加载中
      channels: [], // 频道数据
      range_date: '' // 时间范围绑定值，这个字段的意义是为了绑定 date 组件触发change 事件
    }
  },
  created () {
    // 加载文章列表
    this.loadArticles()

    // 加载频道列表
    this.loadChannels()
  },
  methods: {
    // 点击删除
    async handleDelete (item) {
      try {
        // 删除确认提示
        await this.$confirm('确定要删除吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // .catch (() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   })
        // })
        // 确认：执行删除操作
        await this.$http({
          method: 'DELETE',
          url: `/articles/${item.id}`
        })

        this.$message({
          type: 'success',
          message: '删除成功'
        })

        // 删除成功重新加载数据列表
        this.loadArticles()
      } catch (err) {
        // console.log(err)
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
      }
    },
    handleDtaeChange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    },
    async loadChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        // console.log(data)
        this.channels = data.channels
      } catch (err) {
        console.log(err)
        this.$message.error('获取频道数据失败')
      }
    },

    handleFilter () {
      // console.log('submit!')
      this.page = 1 // 查询从第一页查询
      this.loadArticles()
    },

    async loadArticles () {
      try {
        // 请求开始 加载loading
        this.articleLoading = true
        // const token = getUser().token
        // 处理登录相关接口之后，其他接口都必须在请求头中通过 Authorization 字段提供用户 token
        // 当我们登录成功，服务端会生成一个 token 令牌，放到用户信息中
        const filterDate = {}
        for (let key in this.filterParams) {
          const item = this.filterParams[key]
          if (item !== null && item !== undefined && item !== '') {
            filterDate[key] = item
          }
        }
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            page: this.page, // 页数
            per_page: this.pageSize, // 每页大小
            ...filterDate
          }
        })
        // console.log(data)
        this.articles = data.results
        this.totalCount = data.total_count

        // 请求结束 , 停止 loading
        this.articleLoading = false
      } catch (err) {
        console.log(err)
        this.$message.error('加载文章列表失败')
      }
    },

    handleCurrentChange (page) {
      // console.log(page)
      // 将数据中的页码修改为最新改变的数据页码
      this.page = page
      // 页码改变，重新加载当前文章列表
      this.loadArticles()
    }

  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 30px;
}
.article-label {
  margin-bottom: 10px;
}
</style>
