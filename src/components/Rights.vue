<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data = "rightList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template v-slot:default = "{row}">
          <span v-if = "row.level === '0'">一级</span>
          <span v-if = "row.level === '1'">二级</span>
          <span v-if = "row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightList()
  },
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      const res = await this.$axios('rights/list')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rightList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style>
</style>
