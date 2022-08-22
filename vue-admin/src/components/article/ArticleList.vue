<template>
  <div>
    <!-- <h3>文章列表页面</h3> -->
    <a-card>
      <a-row :gutter="20">
        <a-col :span="6">
          <a-input-search 
            placeholder="输入文章名查找" 
            v-model="queryParam.title"
            enter-button
            allowClear
            @search="getArticleList"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="$router.push(`/addarticle`)">新增</a-button>
        </a-col>
        <a-col :span="6" :offset="4">
          <a-select defaultValue="请选择分类" style="width:200px" @change="CategoryChange">
            <a-select-option
             v-for="item in categorylist"
             :key="item.id" 
             :value="item.id"
             >{{item.name}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-table 
        rowKey="ID" 
        :columns="columns" 
        :pagination="pagination" 
        :dataSource="articlelist"
        bordered
        @change="handleTableChange"
      >
      <span class="ArtImg" slot="img" slot-scope="img">
        <img :src="img" />
      </span>
        <template slot="action" slot-scope="data">
          <div class="actionSlot">
            <a-button
              type="primary"
              icon="edit"
              style="margin-right:15px" 
              @click="$router.push(`/addarticle/${data.ID}`)"
            >编辑</a-button>
            <a-button
              type="danger" 
              icon="delete"
              style="margin-right:15px"
              @click="deleteArticle(data.ID)"
            >删除</a-button>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    width: '5%',
    key:'id',
    align: 'center',
  },
  {
    title: '分类',
    dataIndex: 'Category.name',
    width: '5%',
    key:'name',
    align: 'center',
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    width: '15%',
    key:'title',
    align: 'center',
  },
  {
    title: '文章描述',
    dataIndex: 'desc',
    width: '20%',
    key:'desc',
    align: 'center',
  },
  {
    title: '缩略图',
    dataIndex: 'img',
    width: '20%',
    key:'img',
    align: 'center',
    scopedSlots:{customRender: 'img'}
  },
  {
    title: '操作',
    width: '10%',
    key:'action',
    align: 'center',
    scopedSlots:{customRender: 'action'}
  },
]
export default {
  data() {
    return {
      pagination: {
        pageSizeOptions: ['5', '10', '20'],
        pageSize: 5,
        total: 0,
        showSizeChanger:true,
        showTotal: (total)=>`共${total}条`,
      },
      articlelist: [],
      categorylist: [],
      columns,
      queryParam: {
        pagesize: 5,
        pagenum: 1,
        title:'',
      },
      visible: false,
    }
  },
  created() {
    this.getArticleList()
    this.getCategoryList()
  },
  methods: {
    async getArticleList(){
      const { data: res } = await this.$http.get('articles',{
        params: {
          pagesize: this.queryParam.pagesize,
          pagenum: this.queryParam.pagenum,
          title: this.queryParam.title,
        },
      })
      if (res.status != 200) return this.$message.error(res.messaeg)
      this.articlelist = res.data
      this.pagination.total = res.total
    },

    async getCategoryList(){
      const { data: res } = await this.$http.get('categories')
      if (res.status != 200) return this.$message.error(res.messaeg)
      this.categorylist = res.data
    },

    handleTableChange(pagination, filters, sorter){
      var pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.queryParam.pagesize = pagination.pageSize
      this.queryParam.pagenum = pagination.current
      if(pagination.pageSize != this.pagination.pageSize){
        this.queryParam.pagenum = 1
        pager.current = 1
      }
      this.pagination = pager
      this.getArticleList()
    },

    deleteArticle(id) {
      this.$confirm({
        title:'提示：请再次确认',
        content: '确定要删除该文章吗？一旦删除，无法恢复！',
        onOk: async ()=>{
          const res = await this.$http.delete(`article/${id}`)
          if (res.status != 200) return this.$message.error(res.messaeg)
          this.$message.success('删除成功')
          this.getArticleList()
        },
        onCancel: ()=> {
          this.$message.info('已取消删除')
        },
      })
    },

    CategoryChange(value) {
      this.getCategoryArt(value)
    },

    async getCategoryArt(id) {
      const {data:res} = await this.$http.get(`article/cateList/${id}`)
      if (res.status != 200) return this.$message.error(res.messaeg)
      console.log(res)
      this.articlelist = res.data
      this.pagination.total = res.total
    }

  }
}
</script>

<style scoped>
.actionSlot {
  display: flex;
  justify-content: center;
}
.ArtImg{
  width: 100%;
  height: 100%;
}
.ArtImg img{
  width: 150px;
}
</style>