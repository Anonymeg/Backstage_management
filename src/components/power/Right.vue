<template>
  <div>
    <!--  面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover" class="main">
      <el-table
              ref="PowerListRef"
              :data="powerList"
              style="width:100%" border>
        <el-table-column type="index" width="100">
        </el-table-column>
        <el-table-column
                prop="authName"
                label="权限名称"
                width="auto"
                column-key="powerList.authName">
        </el-table-column>
        <el-table-column
                prop="path"
                label="路径"
                width="auto">
        </el-table-column>
        <el-table-column
                prop="level"
                label="标签"
                width="auto"
                :filters="[{ text: '一级', value: '0' }, { text: '二级', value: '1' }, { text: '三级', value: '2' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
                    :type="judgeLevel(scope.row.level)"
                    disable-transitions>{{scope.row.level}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Right',
  data() {
    return {
      powerList: []
    }
  },
  created() {
    this.getPowerList()
  },
  methods: {
    // 获取权限列表
    getPowerList() {
      this.$http.get('rights/' + 'list').then(result => {
        this.powerList = result.data.data
      })
    },
    // 判断级别
    judgeLevel(level) {
      if (level === '0') {
        return 'primary'
      } else if (level === '1') {
        return 'success'
      } else { return 'warning' }
    },
    // 筛选级别
    filterTag(value, row) {
      return row.level === value
    }
  }
}
</script>

<style scoped>

</style>
