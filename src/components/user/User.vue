<template>
  <div>
<!--    头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    列表-->
    <el-card  shadow="hover" class="main">
<!--      头部搜索-->
      <section class="box-header">
        <el-input
                placeholder="请输入搜索内容"
                class="input-with-select"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        <el-button type="primary" round @click="addVisible = true">添加用户</el-button>
      </section>
<!--      用户列表-->
      <section class="user-main">
        <el-table
                :data="tableData"
                border
                style="width: 100%">
          <el-table-column type="index" width="100">
          </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
          <el-table-column label="状态" width="180">
            <template slot-scope="scope">
              <el-switch
                      v-model="scope.row.mg_state"
                      active-color="#13ce66"
                      inactive-color="#3C3F41"
                      @change="stateChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="inquireEditUser(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="deleterUser(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" @click="settingRole(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <!--    分页-->
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
<!--      添加用户弹出框-->
      <el-dialog
              title="添加用户"
              :visible.sync="addVisible"
              width="40%" @close="closeAddUser">
<!--        添加用户的表单-->
        <el-form :model="newUser" :rules="rules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username" label-width="100px" size="small">
            <el-input v-model="newUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="100px" size="small">
            <el-input v-model="newUser.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" label-width="100px" size="small">
            <el-input v-model="newUser.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile" label-width="100px" size="small">
            <el-input v-model="newUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUser">确 定</el-button>
        </span>
      </el-dialog>
<!--      修改用户信息的弹出框-->
      <el-dialog
              title="修改信息"
              :visible.sync="editVisible"
              width="40%" @close="closeEditUser">
        <!--        添加用户的表单-->
        <el-form :model="editUserInfo" :rules="rules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username" label-width="100px" size="small">
            <el-input v-model="editUserInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" label-width="100px" size="small">
            <el-input v-model="editUserInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile" label-width="100px" size="small">
            <el-input v-model="editUserInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
<!--      删除操作的弹出框-->
      <el-dialog
              title="删除操作"
              :visible.sync="deleteVisible"
              width="30%">
        <span>确认删除该用户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteBox">确 定</el-button>
        </span>
      </el-dialog>
<!--      分配角色弹出框-->
      <el-dialog
              title="分配角色"
              :visible.sync="contributeVisible"
              width="30%">
        <p>当前用户：{{contributeRole.username}}</p>
        <p>当前角色：{{contributeRole.role_name}}</p>
        <span>选择你要分配的角色：</span>
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="contributeVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      // 请求信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 保存返回的请求信息里面的user对象数组
      tableData: [],
      total: null,
      status: true,
      // 弹出框可视性
      addVisible: false,
      editVisible: false,
      deleteVisible: false,
      contributeVisible: false,
      // 添加新用户的信息
      newUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的信息
      editUserInfo: {},
      // 添加新用户的验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '请输入电话', trigger: 'blur' }
        ]
      },
      deleteId: null,
      // 角色列表
      roleList: [],
      // 选中的角色id值
      selectRoleId: '',
      //  当前要被分配用户的信息
      contributeRole: {}
    }
  },
  // 组件挂载执行的代码
  created() {
    this.getUserList()
  },
  methods: {
  //  获取用户列表信息
    getUserList() {
      this.$http.get('/users', { params: this.queryInfo }).then(result => {
        if (!result) return
        this.tableData = result.data.data.users
        this.total = result.data.data.total
      })
    },
    // 分页展示多少个信息
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //  页码值的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //  监听状态按钮的变化并修改状态
    stateChange(info) {
      this.$http.put(`users/${info.id}/state/${info.mg_state}`)
    },
    //  监听添加用户表单的对话框重置信息
    closeAddUser() {
      // 根据addFormRef引用清空对应表单的数据
      this.$refs.addFormRef.resetFields()
    },
    // 检查表单信息填写是否正确
    submitUser() {
      this.$refs.addFormRef.validate(value => {
        if (!value) {
          this.$message.error('信息填写不正确')
        } else {
          // 发送添加用户的请求
          this.$http.post('users', this.newUser).then(result => {
            if (result.data.meta.status !== 201) {
              this.$message.error('添加失败')
            } this.$message.success(result.data.meta.msg)
            this.addVisible = false
            // 重新加载列表
            this.getUserList()
          })
        }
      })
    },
    //  查询修改用户信息
    inquireEditUser(id) {
      this.editVisible = true
      // 根据 ID 查询用户信息
      this.$http.get('users/' + id).then(result => {
        this.editUserInfo = result.data.data
      })
    },
    // 关闭修改窗口重置信息
    closeEditUser() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改信息提交事件
    editUser() {
      // 验证修改信息符不符合规则
      this.$refs.editFormRef.validate(value => {
        if (!value) {
          return false
        } else {
          this.$http.put('users/' + this.editUserInfo.id, this.editUserInfo).then(result => {
            if (result.data.meta.status !== 200) return
            this.$message.success(result.data.meta.msg)
            this.getUserList()
            this.editVisible = false
          })
        }
      })
    },
    // 删除提示框操作
    deleteBox() {
      this.$http.delete('users/' + this.deleteId).then(result => {
        if (result.data.meta.status === 400) {
          this.$message.warning(result.data.meta.msg)
          this.deleteVisible = false
        } else {
          this.$message.success(result.data.meta.msg)
          this.getUserList()
          this.deleteVisible = false
        }
      })
    },
    // 删除按钮操作
    deleterUser(id) {
      this.deleteVisible = true
      this.deleteId = id
    },
    // 角色分配事件
    settingRole(info) {
      this.contributeRole = info
      this.$http.get('roles/').then(res => {
        this.roleList = res.data.data
      })
      this.contributeVisible = true
    },
    // 确认按钮保存分配的角色
    saveRole() {
      if (!this.selectRoleId) {
        this.$message.warning('你没有选择分配的角色')
      } else {
        this.$http.put('users/' + this.contributeRole.id + '/role', {
          rid: this.selectRoleId
        }).then(res => {
          this.$message.success(res.data.meta.msg)
          this.getUserList()
          this.contributeVisible = false
        })
      }
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
