import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 导入阿里字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/normalize.css'
// 导入自己写的样式
import './assets/css/base.css'

Vue.config.productionTip = false

// 默认请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // 给每次请求头中添加一个Authorization成员携带token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 添加静态成员到vue上，其他地方可以用this获得Vue实例
Vue.prototype.$http = axios

//  把包组测成全局组件
Vue.component('tree-table', TreeTable)

// 创建一个全局的时间过滤器
Vue.filter('dataFormat', function (value) {
  const date = new Date(value)
  const dateY = date.getFullYear()
  const dateM = (date.getMonth() + 1 + '').padStart(2, 0)
  const dateD = ((date.getDate() + '')).padStart(2, 0)
  const dateH = (date.getHours() + '').padStart(2, 0)
  const datem = (date.getMinutes() + '').padStart(2, 0)
  const dateS = (date.getSeconds() + '').padStart(2, 0)

  return `${dateY}-${dateM}-${dateD} ${dateH}:${datem}:${dateS}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
