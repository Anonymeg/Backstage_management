<template>
  <div>
    <!--    // 面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow class="main">
<!--    提示信息-->
      <el-alert
              title="添加商品信息"
              type="info"
              center
              :closable="false"
              show-icon>
      </el-alert>
<!--    进度条-->
      <el-steps :active="Number(activeIndex)" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="baseInfo" :rules="rules" ref="addGoodsRef" label-width="100px" label-position="top" class="demo-ruleForm">
<!--      右侧的导航栏-->
        <el-tabs v-model="activeIndex" tab-position="right">
          <el-tab-pane label="基本信息" name="0">
  <!--          基本信息的界面表单-->
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="baseInfo.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="baseInfo.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="baseInfo.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="baseInfo.goods_number" type="number"></el-input>
              </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--          选择分类 级联选择器-->
              <el-cascader
                      :options="cateList"
                      :props="cascaderProps"
                      v-model="baseInfo.goods_cat"
                      @change="cascaderChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
<!--            商品参数信息-->
            <el-form-item :label="item.attr_name" v-for="(item, index) in manyParamsList" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="iitem"
                             v-for="(iitem, i) in item.attr_vals"
                             :key="i"
                             border>{{iitem}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
<!--            商品属性-->
            <el-form-item :label="item.attr_name" v-for="(item, index) in onlyParamsList" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
<!--            商品图片上传-->
            <el-upload
                    class="upload-demo"
                    action="http://127.0.0.1:8888/api/private/v1/upload"
                    :headers="headerObj"
                    :on-preview="imagePreview"
                    :on-remove="imageRemove"
                    :on-success="uploadSeccess"
                    list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
<!--            预览图片的弹出框-->
            <el-dialog
                    title="预览图片"
                    :visible.sync="previewVisible"
                    width="40%">
              <img :src="previewPath" class="previewImg">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
<!--            商品内容-->
            <el-form-item label="请输入产品内容">
              <el-input v-model="baseInfo.goods_introduce" type="textarea" :autosize="textSize"></el-input>
              <el-button class="addGoods" type="primary" @click="addGoods">确定添加商品</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddGoodsPage',
  data() {
    return {
      // 导航栏当前选中的值
      activeIndex: '0',
      // 基本信息
      baseInfo: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        // 添加商品的所属分类
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品内容
        goods_introduce: '',
        // 参数
        attrs: []
      },
      // 分类列表
      cateList: [],
      // 动态参数列表
      manyParamsList: [],
      // 静态参数列表
      onlyParamsList: [],
      // 上传图片的请求头,因为upload组件的网络请求有自己的请求方式  不是我们定义的axios请求
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的弹出框
      previewVisible: false,
      // 预览图片的绝对路径
      previewPath: null,
      // 内容输入框的大小
      textSize: {
        minRows: 10,
        maxRows: 15
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 验证规则
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品所属的分类', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsCategories()
  },
  methods: {
    // 获取商品分类数据
    getGoodsCategories() {
      this.$http.get('categories/').then(res => {
        this.cateList = res.data.data.slice(0, 5)
      })
    },
    // 级联选择器改变会调用这个函数
    cascaderChange() {
      if (this.baseInfo.goods_cat.length !== 3) {
        this.baseInfo.goods_cat = []
      } else {
        this.getManyParamsList()
        this.getOnlyParamsList()
      }
    },
    // 获取动态参数属性
    getManyParamsList() {
      this.$http.get(`categories/${this.baseInfo.goods_cat[2]}/attributes`, { params: { sel: 'many' } }).then(res => {
        res.data.data.forEach(item => {
          // 判断字符串是否为空，空的话返回空数组  要不然会返回一个带有空字符串的数组
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyParamsList = res.data.data
      })
    },
    // 获取静态参数属性
    getOnlyParamsList() {
      this.$http.get(`categories/${this.baseInfo.goods_cat[2]}/attributes`, { params: { sel: 'only' } }).then(res => {
        this.onlyParamsList = res.data.data
      })
    },
    // 图片预览
    imagePreview(info) {
      this.previewPath = info.response.data.url
      this.previewVisible = true
    },
    // 图片移除
    imageRemove(removeInfo) {
      const rimgPath = removeInfo.response.data.tmp_path
      // 通过findIndex查找到要移除的图片在数组中的索引值  然后对应删除
      const i = this.baseInfo.pics.findIndex(imgs => imgs.pic === rimgPath)
      this.baseInfo.pics.splice(i, 1)
    },
    // 图片上传成功的钩子函数
    uploadSeccess(res) {
      const imgPath = { pic: res.data.tmp_path }
      this.baseInfo.pics.push(imgPath)
    },
    // 添加商品
    addGoods() {
      this.$refs.addGoodsRef.validate(val => {
        if (!val) {
          this.$message.warning('信息没有填完整！！')
        } else {
          // 先把添加商品的所属分类又数组转为字符串
          this.baseInfo.goods_cat = this.baseInfo.goods_cat.join(',')
          // 处理动态参数添加到新商品里面
          this.manyParamsList.forEach(item => {
            const newAttr = {
              attr_id: item.attr_id,
              // 因为后台那边是字符串 所以要把数组转为以空格分隔的字符串再保存
              attr_value: item.attr_vals.join(' ')
            }
            this.baseInfo.attrs.push(newAttr)
          })
          // 处理静态属性添加到新商品里面
          this.onlyParamsList.forEach(item => {
            const newAttr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.baseInfo.attrs.push(newAttr)
          })
          // 发送添加商品请求
          this.$http.post('goods', this.baseInfo).then(res => {
            this.$message.success('添加商品成功')
            // window.location.href = 'http://localhost:8080/goods'
            this.$router.push('/goods')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-steps{
    margin: 20px 0 20px 0;
  }
  .el-checkbox{
    margin: 0 5px 0 5px !important;
  }
  .previewImg{
    width: 100%;
  }
  .addGoods{
    margin-top: 40px;
  }
</style>
