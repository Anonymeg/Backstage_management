<template>
  <div>
    <!--    // 面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
                @clear="getOrdersList">
          <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
        </el-input>
      </section>
<!--      订单列表区域-->
      <el-table :data="ordersList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-button type="danger" v-if="scope.row.order_pay !== 0" size="mini">未付款</el-button>
            <el-button type="success" v-else size="mini">付款</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAddress">修改地址</el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="showLogistics">定位</el-button>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
              class="page"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 4, 8, 12]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--    修改地址弹出框-->
    <el-dialog
            title="修改地址"
            :visible.sync="editAdressVisible"
            width="40%">
      <el-form :model="adressForm" :rules="rules" ref="editFormRef">
        <el-form-item label="请选择地址：" prop="address1">
          <el-cascader
                  v-model="adressForm.address1"
                  :options="cityData"
                  :props="{ expandTrigger: 'hover' }"
                  @change="cascaderChange"></el-cascader>
        </el-form-item>
        <el-form-item label="请输入详细地址：" prop="address2">
          <el-input v-model="adressForm.address2" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editAdressVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAdressVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!--    物流信息的弹出框-->
    <el-dialog
            title="物流信息"
            :visible.sync="logisticsVisible"
            width="40%">
<!--      物流时间线-->
      <el-timeline :reverse="true">
        <el-timeline-item
                v-for="(item, index) in logisticsList"
                :key="index"
                :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
          <el-button @click="logisticsVisible = false">取 消</el-button>
          <el-button type="primary" @click="logisticsVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Orders',
  data() {
    return {
      // 订单列表
      ordersList: [],
      // 查询商品信息，用来获取订单
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 获取的条数
      total: null,
      // 修改地址的信息
      // 属性名和属性值一样可以用简写
      cityData,
      adressForm: {
        address1: [],
        address2: ''
      },
      // 弹出框可视化
      editAdressVisible: false,
      logisticsVisible: false,
      // 获取的物流信息
      logisticsList: null,
      // 规则
      rules: {
        address1: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    getOrdersList() {
      this.$http.get('orders', { params: this.queryInfo }).then(res => {
        this.ordersList = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 分页展示多少个信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    //  页码值的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 修改地址按钮操作
    showEditAddress() {
      this.editAdressVisible = true
    },
    // 级联选择改变触发得事件
    cascaderChange() {
      console.log('change')
    },
    // 展示物流信息
    showLogistics() {
      this.logisticsVisible = true
      this.$http.get(`/kuaidi/804909574412544580`).then(res => {
        this.logisticsList = res.data.data
      })
    }
  }
}
</script>

<style scoped>
  .main{
    width: 100%;
    height: auto;
    background-color: white;
    margin-top: 20px;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .main .el-input {
    width: 350px;
    margin:20px 30px 20px 30px;
  }
  .page{
    width: 50%;
    margin: 20px auto;
  }
</style>
