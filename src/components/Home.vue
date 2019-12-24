<template>
  <el-container class="home">
<!--    头部-->
    <el-header>
      <div class="header-left">
        <img src="../../public/logo.jpg">
        <p>后台管理系统</p>
      </div>
      <el-button type="info" plain @click="signOut">退出登录</el-button>
    </el-header>
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isFlag ? '62px' : '200px'">
        <div class="collapse" @click="collapseList"><span></span></div>
        <el-menu unique-opened :router="true"
                 :collapse="isFlag"
                 :default-active="isActive">
<!--          一级菜单-->
          <el-submenu :index="item.order + ''" :key="item.order" v-for="item in menuList">
            <template slot="title">
              <i :class="iconList[item.order-1]"></i>{{ item.authName }}
            </template>
             <template slot="title"></template>
<!--            二级菜单-->
             <el-menu-item
                     :index="'/'+ subItem.path"
                     :key='subItem.order'
                     v-for="subItem in item.children" @click="activeSave(subItem.path)">{{subItem.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
<!--    <el-footer>Footer</el-footer>-->
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isFlag: false,
      isActive: '',
      menuList: [],
      iconList: ['iconfont icon-user', 'iconfont icon-tijikongjian', 'iconfont icon-shangpin', 'iconfont icon-danju', 'iconfont icon-baobiao']
    }
  },
  created() {
    this.getMenuList()
    this.isActive = window.sessionStorage.getItem('active')
  },
  methods: {
    // 退出登录
    signOut() {
      //  就是清空session里面的储存数据
      window.sessionStorage.clear()
      // 然后push到你想要去的页面
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    getMenuList() {
      this.$http.get('menus').then((result) => { this.menuList = result.data.data })
    },
    // 点击展开收缩菜单列表时间
    collapseList() {
      this.isFlag = !this.isFlag
      let span = document.querySelector('.collapse span')
      if (this.isFlag) {
        span.style.transform = 'rotateZ(45deg)'
      } else {
        span.style.transform = 'rotateZ(225deg)'
      }
    },
    activeSave(path) {
      window.sessionStorage.setItem('active', '/' + path)
      this.isActive = path
    }
  }
}
</script>

<style scoped>
  .home{
    height: 100%;
    background-color: whitesmoke;
  }
  .el-header {
    background-color: lightcoral;
    color: whitesmoke;
    line-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-header .header-left{
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  .el-header img{
    width: 50px;
    border-radius: 50%;
    margin:0 30px 0 30px;
  }
  .el-aside {
    background-color: white;
    overflow: hidden;
  }
  .collapse{
    width:100%;
    height: 40px;
    padding-top: 10px;
    box-sizing: border-box;
    background-color: lightskyblue;
    cursor: pointer;
  }
  .collapse span{
    display:block;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-left: 0;
    border-bottom: 0;
    transform: rotateZ(225deg);
    font-weight: bold;
    margin:0 auto;
    transition: all .5s;
  }
  .iconfont{
    margin-right: 30px;
  }
</style>
