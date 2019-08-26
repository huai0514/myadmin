<template>
  <div class="good">
    <!-- 添加按钮 -->
    <el-button type="success" plain class="mb" @click = "addGoods">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodsList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default="{row}">{{row.add_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" size="small" icon="el-icon-edit" plain></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const res = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      }
      // console.log(data)
    },
    // 每页条数改变
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getGoodsList()
    },
    // 当前页码改变
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    // 表的序号
    indexMethod (value) {
      return value + 1 + (this.pagenum - 1) * this.pagesize
    },
    // 跳转添加商品
    addGoods () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang = "scss" scoped>
.mb {
  margin-bottom: 10px;
}
</style>
