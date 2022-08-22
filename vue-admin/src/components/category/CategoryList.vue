<template>
  <div>
    <!-- <h3>分类列表页面</h3> -->
    <a-card>
      <a-row :gutter="20">
        <a-col :span="4">
          <a-button type="primary" @click="addCategoryVisible = true">新增分类</a-button>
        </a-col>
      </a-row>

      <a-table 
        rowKey="id" 
        :columns="columns" 
        :pagination="pagination" 
        :dataSource="categorylist"
        bordered
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="data">
          <div class="actionSlot">
            <a-button
              type="primary"
              icon="edit"
              style="margin-right:15px" 
              @click="editCategory(data.id)"
            >编辑</a-button>
            <a-button
              type="danger" 
              icon="delete"
              style="margin-right:15px"
              @click="deleteCategory(data.id)"
            >删除</a-button>
          </div>
        </template>
      </a-table>
    </a-card>
    <!-- 新增分类区域 -->
    <a-modal
      closable
      title="新增分类"
      :visible="addCategoryVisible"
      @ok="addCategoryOk"
      @cancel="addCategoryCancel"
    >
      <a-form-model :model="newCategory" :rules="addCategoryRules" ref="addCategoryRef">
        <a-form-model-item has-feedback label="分类名" prop="name">
          <a-input v-model="newCategory.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 编辑分类 -->
    <a-modal
      closable
      title="编辑分类"
      :visible="editCategoryVisible"
      @ok="editCategoryOk"
      @cancel="editCategoryCancel"
    >
      <a-form-model :model="categoryInfo" :rules="categoryRules" ref="editCategoryRef">
        <a-form-model-item has-feedback label="分类名" prop="name">
          <a-input v-model="categoryInfo.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

  </div>
</template>

<script>
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
    key:'id',
    align: 'center',
  },
  {
    title: '分类名',
    dataIndex: 'name',
    width: '20%',
    key:'categoryname',
    align: 'center',
  },
  {
    title: '操作',
    width: '30%',
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
      categorylist: [],
      columns,
      queryParam: {
        pagesize: 5,
        pagenum: 1,
      },
      newCategory: {
        name: '',
      },
      categoryInfo: {
        id: 0,
        name: ''
      },
      addCategoryRules: {
        name: [{required:true, message:'请输入分类名',trigger: 'blur'},
          {min:2,max:12,message:'分类名应当在2到12个字符之间',trigger: 'blur'}
        ],
      },
      categoryRules:{
        categoryname: [{required:true, message:'请输入分类名',trigger: 'blur'},
          {min:2,max:12,message:'分类名应当在2到12个字符之间',trigger: 'blur'}
        ],
      },
      visible: false,
      addCategoryVisible: false,
      editCategoryVisible: false,
      changePasswordVisible: false
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList(){
      const { data: res } = await this.$http.get('categories',{
        params: {
          pagesize: this.queryParam.pagesize,
          pagenum: this.queryParam.pagenum,
        },
      })
      if (res.status != 200) return this.$message.error(res.messaeg)
      this.categorylist = res.data
      this.pagination.total = res.total
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
      this.getCategoryList()
    },

    deleteCategory(id) {
      this.$confirm({
        title:'提示：请再次确认',
        content: '确定要删除分类吗？一旦删除，无法恢复！',
        onOk: async ()=>{
          const res = await this.$http.delete(`category/${id}`)
          if (res.status != 200) return this.$message.error(res.messaeg)
          this.$message.success('删除成功')
          this.getCategoryList()
        },
        onCancel: ()=> {
          this.$message.info('已取消删除')
        },
      })
    },

    addCategoryOk(){
      this.$refs.addCategoryRef.validate(async (valid)=>{
        if(!valid) return this.$message.error('参数不符合要求，请重新输入')
        const {data:res} = await this.$http.post('category/add', {
            name:this.newCategory.name,
          })
        if(res.status != 200) return this.$message.error(res.message)
        this.$refs.addCategoryRef.resetFields()
        this.addCategoryVisible = false
        this.$message.success('分类添加成功')
        this.getCategoryList()
      })
    },

    addCategoryCancel(){
      this.$refs.addCategoryRef.resetFields() 
      this.addCategoryVisible = false
    },

    adminChange(checked){
      if (checked){
        this.categoryInfo.role = 1
      }else{
        this.categoryInfo.role = 2
      }
    },

    async editCategory(id){
      this.editCategoryVisible = true
      const { data:res } = await this.$http.get(`category/${id}`)
      this.categoryInfo = res.data
      this.categoryInfo.id = id
    },

    editCategoryOk(){
      this.$refs.editCategoryRef.validate(async (valid)=>{
        if(!valid) return this.$message.error('参数不符合要求，请重新输入')
        const {data:res} = await this.$http.put(`category/${this.categoryInfo.id}`, {
            name:this.categoryInfo.name,
          }
        )
        if(res.status != 200) return this.$message.error(res.message)
        this.editCategoryVisible = false
        this.$message.success('更新用户信息成功')
        this.getCategoryList()
      })
    },

    editCategoryCancel(){
      this.$refs.editCategoryRef.resetFields() 
      this.editCategoryVisible = false
      this.$message.info('取消编辑')
    },

    async ChangePassword(id) {
      this.changePasswordVisible  = true
      this.changePassword.id = id
    },

    changePasswordOk() {
      this.$refs.changePasswordRef.validate(async (valid)=>{
        if(!valid) return this.$message.error('参数不符合要求，请重新输入')
        const {data:res} = await this.$http.put(`admin/changepw/${this.changePassword.id}`, {
            password:this.changePassword.password,
          }
        )
        if(res.status != 200) return this.$message.error(res.message)
        this.changePasswordVisible  = false
        this.$message.success('修改用户密码成功')
        this.getCategoryList()
      })
    },

    changePasswordCancel() {
      this.$refs.changePasswordRef.resetFields()
      this.changePasswordVisible = false
      this.$message.info('取消修改密码')
    }

  }
}
</script>

<style scoped>
.actionSlot {
  display: flex;
  justify-content: center;
}
</style>