<template>
  <div>
    <!--    面包屑头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    主要内容-->
    <el-card shadow="hover" class="main">
<!--      搜索区域-->
      <section class="box-header">
        <el-input
                placeholder="请输入搜索内容"
                class="input-with-select"
                v-model="queryInfo.query"
                clearable
                @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
        <el-button type="primary" round @click="goAddGoodsPage">添加商品</el-button>
      </section>
<!--      商品列表-->
      <el-table :data="goodsList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="650px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="80px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column prop="expand" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
              class="page"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 5, 10, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
<!--    删除商品弹出框-->
    <el-dialog
            title="确认删除商品"
            :visible.sync="deleteVisible"
            width="40%">
      <el-alert
              title="删除商品"
              description="是否确认删除当前商品？"
              type="warning"
              center
              :closable="false"
              show-icon>
      </el-alert>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteGoods">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      goodsList: [],
      // 弹出窗口可视化
      deleteVisible: false,
      // 查询商品信息，用来获取商品
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 获取商品的总条数
      total: null,
      // 要删除商品的id
      deleteId: null
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取所有的商品列表
    getGoodsList() {
      this.$http.get('goods', { params: this.queryInfo }).then(res => {
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 分页展示多少个信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //  页码值的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 去添加商品的页面
    goAddGoodsPage() {
      this.$router.push('/goods/add')
    },
    //  删除按钮的操作
    showDeleteDialog(id) {
      this.deleteVisible = true
      this.deleteId = id
    },
    // 删除商品
    deleteGoods() {
      this.$http.delete(`goods/${this.deleteId}`).then(() => {
        this.deleteVisible = false
        this.$message.success('删除成功')
        this.getGoodsList()
      })
    }
  }
}
</script>

<style scoped>
  .main .el-input {
    width: 350px;
    margin:20px 30px 20px 30px;
  }
  .page{
    width: 50%;
    margin: 20px auto;
  }
</style>
