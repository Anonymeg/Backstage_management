<template>
  <div>
<!--    面包屑头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
<!--    主要内容-->
    <el-card shadow="hover" class="main">
      <el-row>
        <!--    添加用户按钮-->
        <el-button class="add-btn" type="primary" round @click="addCateBox">添加商品</el-button>
      </el-row>
      <!--      展示列表-->
      <tree-table :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border>
        <!--          是否有效-->
        <template slot="isEffect" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: #00A000"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!--          排序-->
        <template slot="order" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="" v-else>三级</el-tag>
        </template>
        <!--          操作-->
        <template slot="operate">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="warning" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!--      分页-->
      <div class="page">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 4, 8]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!--      添加分类的弹出框-->
    <el-dialog
            title="添加分类"
            :visible.sync="addVisible"
            width="40%">
      <!--        修改角色的表单-->
      <el-form :model="addCateInfo" :rules="addRules" ref="addFormRef" label-width="70px">
        <el-form-item label="分类名称：" prop="cate_name" label-width="100px" size="small">
          <el-input v-model="addCateInfo.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="cat_pid" label-width="100px" size="small">
          <el-cascader
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="changeForm"
                  clearable
                  style="width: 100%"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      // 弹出框的可视性
      addVisible: false,
      // 分类列表信息
      cateList: [],
      // 查询信息
      queryInfo: {
        type: null,
        pagenum: 1,
        pagesize: 4
      },
      // 获取的条数`
      total: null,
      columns: [{ label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isEffect' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'operate' }],
      // 添加分类的信息
      addCateInfo: {
        cate_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //  规则
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    this.getGoodsCategories()
  },
  methods: {
    //  获得分类列表信息
    getGoodsCategories() {
      this.$http.get('categories/', { params: this.queryInfo }).then(res => {
        this.cateList = res.data.data.result
        this.total = res.data.data.total
      })
    },
    // 分页展示多少个信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCategories()
    },
    //  页码值的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCategories()
    },
    // 弹出添加分类的弹出框
    addCateBox() {
      this.getParentCateList()
      this.addVisible = true
    },
    // 获取父级分类列表
    getParentCateList() {
      this.$http.get('categories/', { params: { type: 2 } }).then(res => {
        this.parentCateList = res.data.data
      })
    },
    // 弹出框内改变分类后的操作
    changeForm(res) {
      if (this.selectedKeys.length > 0) {
        this.addCateInfo.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateInfo.cat_level = this.selectedKeys.length
      } else {
        this.addCateInfo.cat_pid = 0
        this.addCateInfo.cat_level = 0
      }
    },
    //  添加分类
    addCate() {
      this.$http.post('categories/', this.addCateInfo).then(() => {
        this.$message.success('添加分类成功')
        this.getGoodsCategories()
        this.addVisible = false
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
.page{
  width: 40%;
  margin: 20px auto;
}
.add-btn{
  margin: 0 0 20px 0;
}
</style>
