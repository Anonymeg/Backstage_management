<template>
  <div>
<!--    // 面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
<!--    // 主要内容-->
    <el-card shadow="hover" class="main">
      <el-alert
              title="注意：只允许为第三分类设置相关参数"
              type="warning"
              center
              :closable="false"
              show-icon>
      </el-alert>
<!--      选择行-->
      <el-row class="select">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
                  v-model="selectedKeys"
                  :options="cateList"
                  :props="cascaderProps"
                  @change="getParams"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isSelect" @click="addVisible = true">动态参数</el-button>
<!--          动态参数列表-->
          <el-table :data="manyData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag class="attr-value"
                        v-for="(item, index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="deleteTag(scope.row, index)">{{item}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="TagInputRef"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加新标签</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isSelect" @click="addVisible = true">静态属性</el-button>
<!--          静态参数列表-->
          <el-table :data="onlyData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag class="attr-value"
                        v-for="(item, index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="deleteTag(scope.row, index)">{{item}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="TagInputRef"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加新标签</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-deleter" size="mini" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
<!--      添加参数的弹出框-->
    <el-dialog
            :title="'添加' + textLable"
            :visible.sync="addVisible"
            width="40%"
            @close="closeAddDialog">
      <!--        添加参数的表单-->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
        <el-form-item :label="textLable" prop="attr_name" label-width="100px" size="small">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>
<!--    修改参数的弹出框-->
    <el-dialog
            :title="'添加' + textLable"
            :visible.sync="editVisible"
            width="40%"
            @close="closeEditDialog">
      <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="70px">
        <el-form-item :label="textLable" prop="attr_name" label-width="100px" size="small">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>
    <!--    删除参数的弹出框-->
    <el-dialog
            title="确认删除参数"
            :visible.sync="deleteVisible"
            width="40%">
      <p>确定删除当前的参数？</p>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteParams">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'click'
      },
      // 选中的分类的所有级别的id数组
      selectedKeys: [],
      // 当前tab选中的选择项的name
      activeName: 'many',
      // 选中的分类的id
      currentId: null,
      // 动态参数
      manyData: [],
      // 静态参数
      onlyData: [],
      // 弹出框可视化
      addVisible: false,
      editVisible: false,
      deleteVisible: false,
      // 添加参数信息
      addForm: {},
      // 修改参数信息
      editForm: {},
      //  规则
      addRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsCategories()
  },
  computed: {
    // 判断商品分类是否被选择,来判断按钮是否被禁用
    isSelect() {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    textLable() {
      if (this.activeName === 'many') {
        return '动态参数：'
      } else {
        return '静态参数：'
      }
    }
  },
  methods: {
    //  获得分类列表信息
    getGoodsCategories() {
      this.$http.get('categories/').then(res => {
        this.cateList = res.data.data.slice(0, 5)
      })
    },
    //  tab点击后的响应事件
    tabClick(res) {
      this.activeName = res.name
      this.getParams()
    },
    // 获取当前选择的最低级分类id
    getCurrentId() {
      if (this.selectedKeys.length !== 3) {
        return false
      } else {
        this.currentId = this.selectedKeys[2]
      }
    },
    // 输入框内改变分类后的操作，发起网络请求获取参数列表
    getParams() {
      if (this.selectedKeys.length !== 3) {
        // 选择不是三级菜单的时候把所有数据清空
        this.selectedKeys = []
        this.manyData = []
        this.onlyData = []
      } else {
        this.getCurrentId()
        this.$http.get(`categories/${this.currentId}/attributes`, { params: { sel: this.activeName } }).then(res => {
          // 把获得数据中的描述信息由字符串转为数组
          res.data.data.forEach(item => {
            // 判断字符串是否为空，空的话返回空数组  要不然会返回一个带有空字符串的数组
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 给每个展开列添加inputVisible 和 inputValue属性防止modle绑定同一个属性
            item.inputVisible = false
            // 标签输入框内输入的内容
            item.inputValue = ''
          })
          //  判断是获取的动态数据还是惊天数据分开来保存
          if (this.activeName === 'many') {
            this.manyData = res.data.data
          } else {
            this.onlyData = res.data.data
          }
        })
      }
    },
    // 关闭添加弹出框清空表单信息
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭修改弹出框清空表单信息
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加参数操作
    addParams() {
      this.$refs.addFormRef.validate(val => {
        if (!val) {
          return false
        } else {
          this.$http.post(`categories/${this.currentId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }).then(() => {
            this.$message.success('添加成功')
            this.getParams()
            this.addVisible = false
          })
        }
      })
    },
    // 显示修改弹出框，并根据 ID 查询参数
    showEditDialog(id) {
      this.editVisible = true
      this.$http.get(`categories/${this.currentId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }).then(res => {
        this.editForm = res.data.data
      })
    },
    // 修改参数的操作
    editParams() {
      this.$refs.editFormRef.validate(val => {
        if (!val) {
          return false
        } else {
          this.$http.put(`categories/${this.currentId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(() => {
            this.$message.success('修改成功')
            this.getParams()
            this.editVisible = false
          })
        }
      })
    },
    // 显示删除参数弹窗
    showDeleteDialog(id) {
      this.deleteVisible = true
      this.$http.get(`categories/${this.currentId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }).then(res => {
        this.editForm = res.data.data
      })
    },
    // 删除操作
    deleteParams() {
      this.deleteVisible = false
      this.$http.delete(`categories/${this.currentId}/attributes/${this.editForm.attr_id}`).then(() => {
        this.$message.success('删除成功')
        this.getParams()
      })
    },
    // 点击时展示输入框
    showInput(info) {
      info.inputVisible = true
      // $nextTick是在页面元素重新渲染执行内部的代码
      this.$nextTick(() => {
        this.$refs.TagInputRef.$refs.input.focus()
      })
    },
    // 可编辑标签失去焦点或者回车执行的函数
    handleInputConfirm(info) {
      let inputValue = info.inputValue
      if (inputValue && inputValue.trim() !== '') {
        info.attr_vals.push(inputValue.trim())
        // 把数据提交到数据库
        this.$http.put(`categories/${this.currentId}/attributes/${info.attr_id}`, {
          attr_name: info.attr_name,
          attr_sel: this.activeName,
          attr_vals: info.attr_vals.join(' ')
        }).then(() => {
          this.$message.success('添加标签成功')
        })
      }
      info.inputValue = ''
      info.inputVisible = false
    },
    // 删除标签
    deleteTag(info, index) {
      // 根据索引删除对应的数组
      info.attr_vals.splice(index, 1)
      this.$http.put(`categories/${this.currentId}/attributes/${info.attr_id}`, {
        attr_name: info.attr_name,
        attr_sel: this.activeName,
        attr_vals: info.attr_vals.join(' ')
      }).then(() => {
        this.$message.success('删除标签成功')
      })
    }
  }
}
</script>

<style scoped>
  .select{
    margin-top: 20px;
  }
  .attr-value{
    margin-left: 20px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
