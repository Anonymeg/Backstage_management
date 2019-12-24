<template>
  <div>
    <!--    面包屑头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover" class="main">
      <section id="report" class="report-box"></section>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Reports',
  data() {
    return {
      // 合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    var myChart = echarts.init(document.getElementById('report'), 'light')
    this.$http.get('reports/type/1').then(res => {
      const finalData = Object.assign(this.options, res.data.data)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(finalData)
    })
  }
}
</script>

<style scoped>
  .report-box{
    height: 575px;
    width: 1000px;
    margin: 0 auto;
  }
</style>
