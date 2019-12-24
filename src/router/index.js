import Vue from 'vue'
import VueRouter from 'vue-router'
// 懒加载只有用到这个组件时才会去引入组件模块
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../components/user/User.vue')
const Right = () => import('../components/power/Right.vue')
const Roles = () => import('../components/power/Roles.vue')
const Goods = () => import('../components/good/Goods.vue')
const Params = () => import('../components/good/Params.vue')
const Categories = () => import('../components/good/Categories.vue')
const AddGoodsPage = () => import('../components/good/AddGoodsPage.vue')
const Orders = () => import('../components/orders/Orders.vue')
const Reports = () => import('../components/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [{ path: '/home/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Right },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports },
      { path: '/goods/add', component: AddGoodsPage }
    ] }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 导航守卫,to去哪个页面，from来自，next放行
router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断有没有登录状态
  if (!tokenStr) {
    return next('/login')
  }next()
})

export default router
