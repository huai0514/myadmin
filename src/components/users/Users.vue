<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showmodel">添加用户</el-button>

    <!-- 表格 -->
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="scope">
          <el-button
            @click="showEditDialog(scope.row)"
            type="primary"
            plain
            size="small"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            type="danger"
            plain
            size="small"
            icon="el-icon-delete"
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <el-button
            @click="showAssignDialog(scope.row)"
            type="success"
            plain
            size="small"
            icon="el-icon-check"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加模态框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="closedialog">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改模态框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser(editForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配模态框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="50%"
      @close="closeAssignDialog"
    >
      <el-form ref="assignForm" :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignUser(assignForm)">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created: function () {
    this.getUsersList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      data: [],
      pagesizes: [2, 4, 6, 8],
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 12,
            message: '用户名长度在 4 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 4,
            max: 12,
            message: '用户名长度在 4 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      options: [],
      value: ''
    }
  },
  methods: {
    // 获取userlist
    async getUsersList () {
      const res = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(res)
      const { data } = res.data
      this.data = data.users
      this.total = data.total
    },
    // 删除用户
    async deleteUser (id) {
      try {
        await this.$confirm('你确定要删除吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        })
        const res = await this.$axios.delete(`users/${id}`)
        if (res.status === 200) {
          this.$message.success('删除成功！')
          if (this.data.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUsersList()
        } else {
          this.$message.error('删除失败！')
        }
      } catch {
        this.$message('已取消')
      }
    },
    // 每页条数改变
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUsersList()
    },
    // 页码改变
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUsersList()
    },
    // 搜索
    search () {
      this.pagenum = 1
      this.getUsersList()
      this.query = ''
    },
    // 修改状态
    async changeState (row) {
      const res = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      const { meta } = res.data
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示添加模态框
    showmodel () {
      this.dialogVisible = true
    },
    // 添加用户
    async addUser () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('users', this.form)
        const { meta } = res.data
        if (meta.status === 201) {
          this.$message.success('添加成功！')
          this.dialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUsersList()
        } else {
          this.$message(meta.msg)
        }
      } catch (e) {}
    },
    // 关闭模态框时重置表单
    closedialog () {
      this.$refs.form.resetFields()
    },
    // 显示编辑模态框
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 编辑用户
    async editUser (editForm) {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = editForm
        const res = await this.$axios.put(`users/${id}`, { email, mobile })
        const { meta } = res.data
        if (meta.status === 200) {
          this.editDialogVisible = false
          this.$message.success(meta.msg)
          this.getUsersList()
        }
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭编辑模态框
    closeEditDialog () {
      this.$refs.editForm.resetFields()
    },
    // 显示分配模态框
    async showAssignDialog (row) {
      this.assignDialogVisible = true
      // 当前角色的数据回显
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      // 根据当前用户id得到当前用户的所属角色id
      const resUser = await this.$axios.get(`users/${row.id}`)
      console.log(resUser)
      if (resUser.data.meta.status === 200) {
        const rid = resUser.data.data.rid
        this.assignForm.rid = rid !== -1 ? rid : ''
      }
      console.log(this.assignForm.rid)

      // 得到所有角色数据，赋值给下拉框
      const res = await this.$axios.get('roles')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error('数据获取失败')
      }
    },
    // 分配角色
    async assignUser (assignForm) {
      const { id, rid } = this.assignForm
      if (rid === '') {
        this.$message.error('请选择角色')
        return
      }
      const res = await this.$axios.put(`users/${id}/role`, { rid })
      console.log(res)
      const { meta } = res.data
      if (meta.status === 200) {
        console.log(111)
        this.assignDialogVisible = false
        this.$message.success(meta.msg)
        this.getUsersList()
      } else {
        this.$message.success(meta.msg)
      }
    },
    // 关闭分配模态框
    closeAssignDialog () {
      this.$refs.assignForm.resetFields()
    }
  }
}
</script>

<style lang = 'scss' scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>
