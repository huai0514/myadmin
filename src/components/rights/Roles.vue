<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain class="addrole" @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <!-- 根据roleList渲染列表 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <el-row v-for="item1 in row.children" :key="item1.id" class="row1">
            <el-col :span="4" class="mt-10">
              <el-tag closable @close="removeright(row,item1.id)">{{item1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id" class="row2">
                <el-col :span="4">
                  <el-tag
                    closable
                    @close="removeright(row,item2.id)"
                    type="success"
                  >{{item2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeright(row,item3.id)"
                    type="warning"
                    class="col3"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button
            type="primary"
            plain
            size="small"
            icon="el-icon-edit"
            @click="showChangeDialog(row)"
          ></el-button>
          <el-button
            @click="Delroles(row.id,$event)"
            type="danger"
            plain
            size="small"
            icon="el-icon-delete"
          ></el-button>
          <el-button
            type="success"
            plain
            size="small"
            icon="el-icon-check"
            @click="showRightDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配模态框 -->
    <el-dialog title="分配权限" :visible.sync="rightdialogVisible" width="40%">
      <el-tree
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        ref="tree"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editright">分 配</el-button>
      </span>
    </el-dialog>

    <!-- 添加修改模态框 -->
    <el-dialog :title="title" :visible.sync="editdialogVisible" width="40%" @close="closeDialog">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible= false">取 消</el-button>
        <el-button type="primary" @click = saveRoles>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getRoleList()
  },
  data () {
    return {
      roleList: [],
      dialogVisible: false,
      rightdialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      editdialogVisible: false,
      title: '',
      form: {
        id: '',
        roleDesc: '',
        roleName: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['blur', 'change']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    // 发送请求，得到角色列表数据，赋给 roleList
    async getRoleList () {
      const res = await this.$axios.get('roles')
      // console.log(res)
      const { data, meta } = res.data
      console.log(data)
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    // 显示表的序号
    indexMethod (index) {
      return index + 1
    },
    // 移出角色的权限
    async removeright (row, rightId) {
      const res = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      const { meta, data } = res.data
      if (meta.status === 200) {
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示分配模态框，数据回显
    async showRightDialog (row) {
      this.rightdialogVisible = true
      this.roleId = row.id
      const res = await this.$axios.get('rights/tree')
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        console.log(ids)
        this.$refs.tree.setCheckedKeys(ids)
      }
    },
    // 分配权限
    async editright () {
      const selectedId = this.$refs.tree.getCheckedKeys()
      const halfSelectedId = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...selectedId, ...halfSelectedId].join(',')
      console.log(this.roleId)
      console.log(rids)
      const res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      console.log(res)
      const { meta } = res.data
      if (meta.status === 200) {
        // 提示分配成功
        this.$message.success(meta.msg)
        // 关闭对话框
        this.rightdialogVisible = false
        // 重新渲染
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色
    async Delroles (id, e) {
      try {
        await this.$confirm('亲, 你确定要删除么?', '温馨提示', {
          type: 'warning'
        })
        const res = await this.$axios.delete(`roles/${id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRoleList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        e.target.parentNode.blur()
      }
    },
    // 展示编辑模态框(添加)
    showAddDialog () {
      this.editdialogVisible = true
      this.title = '添加角色'
    },
    // 展示编辑模态框(修改)
    showChangeDialog (row) {
      this.editdialogVisible = true
      this.title = '修改角色'
      console.log(row)
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    // 重置为 dialog初始状态
    closeDialog () {
      this.$refs.form.resetFields()
    },
    // 添加角色
    async saveRoles () {
      const isAdd = this.title === '添加角色'
      const method = isAdd ? 'post' : 'put'
      const url = isAdd ? 'roles' : `roles/${this.form.id}`
      const res = await this.$axios[method](url, this.form)
      console.log(res)
      const { meta } = res.data
      if (meta.status === 201 || meta.status === 200) {
        this.editdialogVisible = false
        this.$message.success('操作成功')
        this.getRoleList()
      } else {
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style lang = "scss" scoped>
.roles {
  .addrole {
    margin-bottom: 10px;
  }
  .row1 {
    padding: 10px 0px;
    border-bottom: 1px dotted #ccc;
  }
  .row2 {
    padding: 10px 0;
  }
  .col3 {
    margin-right: 5px;
  }
  .mt-10 {
    margin-top: 10px;
  }
}
</style>
