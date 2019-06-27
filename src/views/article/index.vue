<template>
    <!-- 文章管理页面 -->
    <div>
      <!-- 数据筛选 -->
      <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>一共有xxx条数据</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
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
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
    <!-- /数据筛选 -->
    <!-- 文章列表 -->
    <el-table
      :data="articles"
      style="width: 100%">
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
        <template>
          <el-button size="mini" type="primary" plain>修改</el-button>
          <el-button size="mini" type="warning" plain>删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <!-- /文章列表 -->
      <!-- 数据分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="handleCurrentChange">
      </el-pagination>
      <!-- /数据分页 -->
    </div>
</template>

<script>
// import { getUser } from '@/utils/auth'
export default {
  name: 'AppArticle',
  data () {
    return {
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
          label: '删除'
        }
      ],
      pageSize: 10, // 每页数量
      totalCount: 0, // 总数量
      page: 1 // 当前页码
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      // const token = getUser().token
      // 处理登录相关接口之后，其他接口都必须在请求头中通过 Authorization 字段提供用户 token
      // 当我们登录成功，服务端会生成一个 token 令牌，放到用户信息中
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page, // 页数
          per_page: this.pageSize // 每页大小
        }
      })
      console.log(data)
      this.articles = data.results
      this.totalCount = data.total_count
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
</style>
