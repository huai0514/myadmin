<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后端管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="menu.path" v-for = "menu in menuList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item :index="list.path" v-for = "list in menu.children" :key = 'list.id'>
              <i class="el-icon-menu"></i>
              <span slot="title">{{list.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  async created () {
    const res = await this.$axios.get('menus')
    const { meta, data } = res.data
    if (meta.status === 200) {
      this.menuList = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logout () {
      console.log(111)
      this.$confirm('你确定要退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功退出'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1).split('-')[0]
    }
  }
}
</script>

<style lang = "scss" scoped>
.index {
  height: 100%;
  .el-header {
    height: 60px;
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #545c64;
      }
    }
    .logout {
      width: 180px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-weight: 700;
      a {
        color: orange;
      }
    }
  }
  .el-container {
    .el-aside {
      height: 100%;
      background-color: #545c64;
    }
    .el-main {
      background-color: #ecf0f1;
    }
  }
}
</style>
