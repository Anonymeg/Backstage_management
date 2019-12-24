<template>
  <div>
<!--    // 面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      用户列表-->
    <el-card shadow="hover" class="main">
      <el-button class="add-btn" type="primary" round @click="addVisible = true">添加角色</el-button>
      <el-table
              :data="roleList"
              border
              style="width: 100%">
<!--        展开列-->
        <el-table-column type="expand" width="100">
          <template slot-scope="scope">
            <el-row v-for="(item1, id1) in scope.row.children" :key="id1">
<!--            // 一级列-->
              <el-col :span="5" class="power-boder">
                <el-tag type="danger"
                        closable
                        @close="removePower(scope.row,scope.row.id,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--            // 二级列-->
              <el-col :span="19">
                <el-row v-for="(item2,id2) in item1.children" :key="id2">
                  <el-col class="power-boder" :span="10">
                    <el-tag type="success"
                            closable
                            @close="removePower(scope.row,scope.row.id,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
<!--                  三级列-->
                  <el-col :span="14" class="power-boder">
                    <el-tag type="warning"
                            closable
                            v-for="(item3,id3) in item2.children"
                            :key="id3"
                            @close="removePower(scope.row,scope.row.id,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"  @click="inquireEditRole(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="authorize(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--    添加角色弹出框-->
    <el-dialog
            title="添加用户"
            :visible.sync="addVisible"
            width="40%"
            @close="closeAddRole">
      <!--        添加角色的表单-->
      <el-form :model="newRole" :rules="addRules" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName" label-width="100px" size="small">
          <el-input v-model="newRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px" size="small">
          <el-input v-model="newRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddRole">取 消</el-button>
          <el-button type="primary" @click="submitRole">确 定</el-button>
        </span>
    </el-dialog>
    <!--      修改角色信息的弹出框-->
    <el-dialog
            title="修改信息"
            :visible.sync="editVisible"
            width="40%"
            @close="closeEditRole">
      <!--        修改角色的表单-->
      <el-form :model="editRoleInfo" :rules="addRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="roleName" label-width="100px" size="small">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="roleDesc" label-width="100px" size="small">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
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
<!--    分配权限的弹出框-->
    <el-dialog
            title="分配权限"
            :visible.sync="powerVisible"
            width="30%"
    @close="clearDefaultKeys">
      <el-tree
              :data="rightList"
              show-checkbox
              :default-checked-keys="defaultKeys"
              node-key="id"
              ref="tree"
              highlight-current
              :props="treeProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="powerVisible = false">取 消</el-button>
    <el-button type="primary" @click="allowEditPower">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 列表信息
      roleList: [],
      addVisible: false,
      editVisible: false,
      deleteId: null,
      deleteVisible: false,
      powerVisible: false,
      // 添加角色的信息
      newRole: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色的信息
      editRoleInfo: {},
      // 获取的权限数据
      rightList: [],
      // 树控件的props绑定的数据
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认勾选的节点数组
      defaultKeys: [],
      // 为分配角色的id
      roleId: '',
      // 规则
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      this.$http.get('roles').then(result => {
        this.roleList = result.data.data
      })
    },
    // 添加角色操作
    submitRole() {
      this.$refs.addFormRef.validate(value => {
        if (!value) {
          this.$message.error('信息填写不正确')
        } else {
          this.$http.post('roles', this.newRole).then(result => {
            this.$message.success(result.data.meta.msg)
            this.addVisible = false
            this.getRoleList()
          })
        }
      })
    },
    //  取消添加角色清空填写信息
    closeAddRole() {
      // 根据addFormRef引用清空对应表单的数据
      this.$refs.addFormRef.resetFields()
      this.addVisible = false
    },
    //  查询修改用户信息
    inquireEditRole(id) {
      this.editVisible = true
      // 根据 ID 查询用户信息
      this.$http.get('roles/' + id).then(result => {
        this.editRoleInfo = result.data.data
      })
    },
    // 关闭修改窗口重置信息
    closeEditRole() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改信息提交事件
    editRole() {
      // 验证修改信息符不符合规则
      this.$refs.editFormRef.validate(value => {
        if (!value) {
          return false
        } else {
          this.$http.put('roles/' + this.editRoleInfo.roleId, this.editRoleInfo).then(result => {
            if (result.data.meta.status !== 200) {
              return false
            } else {
              this.$message.success('修改成功！')
              this.getRoleList()
              this.editVisible = false
            }
          })
        }
      })
    },
    // 删除提示框操作
    deleteBox() {
      this.$http.delete('roles/' + this.deleteId).then(result => {
        if (result.data.meta.status === 400) {
          this.$message.warning(result.data.meta.msg)
          this.deleteVisible = false
        } else {
          this.$message.success(result.data.meta.msg)
          this.getRoleList()
          this.deleteVisible = false
        }
      })
    },
    //  删除角色
    deleteRole(id) {
      this.deleteVisible = true
      this.deleteId = id
    },
    //  移除权限
    removePower(role, roleId, rightId) {
      this.$http.delete('roles/' + roleId + '/rights/' + rightId).then(result => {
        this.$message.success(result.data.meta.msg)
        // 这里调用重新获取列表的话会导致展开列关闭
        // 把服务器返回的值赋值给原来数据就不会关闭了
        role.children = result.data.data
      })
    },
    // 授权操作
    authorize(role) {
      this.roleId = role.id
      this.$http.get('rights/tree').then(res => {
        this.rightList = res.data.data
      })
      this.getDefaultKeys(role, this.defaultKeys)
      this.powerVisible = true
    },
    // 获取默认的有的节点数据
    getDefaultKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getDefaultKeys(item, arr)
        })
      }
    },
    // 关闭窗口后清空默认的选中节点
    clearDefaultKeys() {
      this.defaultKeys = []
    },
    // 通过弹出框修改权限
    allowEditPower() {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr }).then(res => {
        console.log(res)
      })
      this.getRoleList()
      this.powerVisible = false
    }
  }
}
</script>

<style scoped>
  .el-card{
    position: relative;
  }
  .el-card .add-btn{
    position: absolute;
    right: 100px;
    top: 20px;
  }
  .el-table{
    width: 100%;
    height: auto;
    background-color: white;
    margin-top: 60px;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .el-tag{
    margin: 5px 5px 5px 0;
  }
  .power-boder{
    border-bottom: 1px solid lightgrey;
  }
  /*.el-col-center{*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*}*/
</style>
