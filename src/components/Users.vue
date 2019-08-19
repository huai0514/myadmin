<template>
  <div class="user">
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column prop="mobile" label="用户状态">
        <template v-slot:default = "scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="操作">
        <template v-slot:default = "scope">
          <el-button type="primary" plain size="small" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="small" icon="el-icon-delete"></el-button>
          <el-button type="success" plain size="small" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  created: function () {
    this.getUsersList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      data: {}
    }
  },
  methods: {
    getUsersList () {
      Axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        const { data } = res.data
        console.log(data.users)
        this.data = data.users
      })
    }
  }
}
</script>

<style>
</style>
