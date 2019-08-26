<template>
  <div class="categoried">
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAddDialog" class="mb">添加分类</el-button>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="categoryList" row-key="cat_id">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效" prop="cat_deleted">
        <template v-slot:default="{row}">{{row.cat_deleted?'否':'是'}}</template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button plain type="primary" size="small" icon="el-icon-edit"></el-button>
          <el-button plain type="danger" size="small" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>

    <!-- 添加模态框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%" @close="closedialog">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader :options="options" v-model="form.cat_pid" :props="props" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created () {
    this.getCategoryList()
  },
  data () {
    return {
      categoryList: [],
      pagesize: 5,
      pagenum: 1,
      total: 0,
      dialogVisible: false,
      form: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      rules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: ['blur', 'change']
          }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      loading: false
    }
  },
  methods: {
    // 获取分类列表
    async getCategoryList () {
      this.loading = true
      const res = await this.$axios.get('categories', {
        params: {
          pagesize: this.pagesize,
          pagenum: this.pagenum,
          type: 3
        }
      })
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      this.loading = false
    },
    // 处理每页条数
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getCategoryList()
    },
    // 处理当前页码
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    // 展示添加模态框
    async showAddDialog () {
      this.dialogVisible = true
      const res = await this.$axios.get('categories?type=2')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.options = data
        console.log(data)
      }
    },
    // 添加分类
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1],
          cat_level: this.form.cat_pid.length
        })
        const { meta } = res.data
        if (meta.status === 201) {
          this.dialogVisible = false
          this.getCategoryList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭添加模态框
    closedialog () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang = "scss" scoped>
.mb {
  margin-bottom: 10px;
}
</style>
