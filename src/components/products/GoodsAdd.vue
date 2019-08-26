<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" @tab-click="handleClick" v-model="activeTab">
      <el-tab-pane label="基本信息" name="0">
        <!-- 表单 -->
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              v-model="form.goods_cat"
              :props="props"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <!-- 图片上传 -->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          name="file"
          :headers="headers"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 下一步按钮 -->
        <el-button type="primary" @click="next">下一步</el-button>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <!-- 富文本编辑框 -->
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <!-- 提交按钮 -->
        <el-button type="primary" @click="submitform">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  async created () {
    const res = await this.$axios.get('categories?type=3')
    const { data, meta } = res.data
    if (meta.status === 200) {
      this.options = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  data () {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: []
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      options: [],
      activeTab: '',
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (res, file, fileList) {
      const { data, meta } = res
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      }
    },
    async submitform () {
      const res = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      const { meta } = res.data
      if (meta.status === 201) {
        this.$message.success('添加成功')
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang = "scss" scoped>
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor{
    min-height: 300px;
  }
}
</style>
