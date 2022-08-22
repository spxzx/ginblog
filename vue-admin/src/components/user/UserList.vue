<template>
  <div>
    <!-- <h3>用户列表页面</h3> -->
    <a-card>
      <a-row :gutter="20">
        <a-col :span="6">
          <a-input-search 
            placeholder="输入用户名查找" 
            v-model="queryParam.username"
            enter-button
            allowClear
            @search="getUserList"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="addUserVisible = true">新增</a-button>
        </a-col>
      </a-row>

      <a-table 
        rowKey="ID" 
        :columns="columns" 
        :pagination="pagination" 
        :dataSource="userlist"
        bordered
        @change="handleTableChange"
      >
        <span slot="role" slot-scope="role">{{role == 1 ? '管理员':'订阅者'}}</span>
        <template slot="action" slot-scope="data">
          <div class="actionSlot">
            <a-button
              type="primary"
              icon="edit"
              style="margin-right:15px" 
              @click="editUser(data.ID)"
            >编辑</a-button>
            <a-button
              type="danger" 
              icon="delete"
              style="margin-right:15px"
              @click="deleteUser(data.ID)"
            >删除</a-button>
            <a-button
              type="info" 
              icon="info"
              @click="ChangePassword(data.ID)"
            >修改密码</a-button>
          </div>
        </template>
      </a-table>
    </a-card>
    <!-- 新增用户区域 -->
    <a-modal
      closable
      title="新增用户"
      :visible="addUserVisible"
      @ok="addUserOk"
      @cancel="addUserCancel"
    >
      <a-form-model :model="newUser" :rules="addUserRules" ref="addUserRef">
        <a-form-model-item has-feedback label="用户名" prop="username">
          <a-input v-model="newUser.username"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="密码" prop="password">
          <a-input-password v-model="newUser.password"></a-input-password>
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认密码" prop="checkPassword">
          <a-input-password v-model="newUser.checkPassword"></a-input-password>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 编辑用户 -->
    <a-modal
      closable
      title="编辑用户"
      :visible="editUserVisible"
      @ok="editUserOk"
      @cancel="editUserCancel"
    >
      <a-form-model :model="userInfo" :rules="userRules" ref="editUserRef">
        <a-form-model-item has-feedback label="用户名" prop="username">
          <a-input v-model="userInfo.username"></a-input>
        </a-form-model-item>
        <a-form-model-item label="是否为管理员" pror="role ">
          <a-switch
            :checked="IsAdmin"
            checked-children="是"
            un-checked-children="否"
            @change="adminChange"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 修改密码 -->
    <a-modal
      closable
      title="修改密码"
      :visible="changePasswordVisible"
      @ok="changePasswordOk"
      @cancel="changePasswordCancel"
    >
      <a-form-model :model="changePassword" :rules="changePasswordRules" ref="changePasswordRef">
        <a-form-model-item has-feedback label="密码" prop="password">
          <a-input-password v-model="changePassword.password"></a-input-password>
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认密码" prop="checkPassword">
          <a-input-password v-model="changePassword.checkPassword"></a-input-password>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: 'ID',
    dataIndex: 'ID',
    width: '10%',
    key:'id',
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: '20%',
    key:'username',
    align: 'center',
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: '20%',
    key:'role',
    align: 'center',
    scopedSlots:{customRender: 'role'}
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
      userlist: [],
      columns,
      queryParam: {
        pagesize: 5,
        pagenum: 1,
        username:'',
      },
      newUser: {
        id: 0,
        useranme: '',
        password: '',
        checkPassword: '',
        role: 2,
      },
      userInfo: {
        id: 0,
        useranme: '',
        role: 2,
      },
      changePassword: {
        id: 0,
        password: '',
        checkPassword: '',
      },
      addUserRules: {
        username: [{required:true, message:'请输入用户名',trigger: 'blur'},
          {min:4,max:12,message:'用户名应当在4到12个字符之间',trigger: 'blur'}
        ],
        password: [{validator: (rule, value, callback) => {
          if (this.newUser.password === "") {
            callback(new Error('请输入密码'))
          }
          if ([...this.newUser.password].length < 6 || [...this.newUser.password].length > 20){
            callback(new Error('密码长度应在6到20位之间'))
          }else{
            callback()
          }
        }, trigger: 'blur'}],
        checkPassword: [{validator: (rule, value, callback) => {
          if (this.newUser.password === "") {
            callback(new Error('请再次输入密码'))
          }
          if (this.newUser.password != this.newUser.checkPassword){
            callback(new Error('密码不一致，请重新输入'))
          }else{
            callback()
          }
        }, trigger: 'blur'}],
      },
      userRules:{
        username: [{required:true, message:'请输入用户名',trigger: 'blur'},
          {min:4,max:12,message:'用户名应当在4到12个字符之间',trigger: 'blur'}
        ],
      },
      changePasswordRules: {
        password: [{validator: (rule, value, callback) => {
          if (this.changePassword.password == '') {
            callback(new Error('请输入新密码'))
          }
          if ([...this.changePassword.password].length < 6 || [...this.changePassword.password].length > 20){
            callback(new Error('密码长度应在6到20位之间'))
          }else{
            callback()
          }
        }, trigger: 'blur'}],
        checkPassword: [{validator: (rule, value, callback) => {
          if (this.changePassword.checkPassword === "") {
            callback(new Error('请确认新密码'))
          }
          if (this.changePassword.password !== this.changePassword.checkPassword){
            callback(new Error('密码不一致，请重新输入'))
          }else{
            callback()
          }
        }, trigger: 'blur'}],
      },
      visible: false,
      addUserVisible: false,
      editUserVisible: false,
      changePasswordVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  computed: {
    IsAdmin: function() {
      if (this.userInfo.role === 1) {
        return true
      }else{
        return false
      }
    }
  },
  methods: {
    async getUserList(){
      const { data: res } = await this.$http.get('users',{
        params: {
          pagesize: this.queryParam.pagesize,
          pagenum: this.queryParam.pagenum,
          username: this.queryParam.username,
        },
      })
      if (res.status != 200) return this.$message.error(res.messaeg)
      this.userlist = res.data
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
      this.getUserList()
    },

    deleteUser(id) {
      this.$confirm({
        title:'提示：请再次确认',
        content: '确定要删除用户吗？一旦删除，无法恢复！',
        onOk: async ()=>{
          const res = await this.$http.delete(`user/${id}`)
          if (res.status != 200) return this.$message.error(res.messaeg)
          this.$message.success('删除成功')
          this.getUserList()
        },
        onCancel: ()=> {
          this.$message.info('已取消删除')
        },
      })
    },

    addUserOk(){
      this.$refs.addUserRef.validate(async (valid)=>{
        if(!valid) return this.$message.error('参数不符合要求，请重新输入')
        const {data:res} = await this.$http.post('user/add', {
            username:this.newUser.username,
            password:this.newUser.password,
            role:this.newUser.role
          })
        if(res.status != 200) return this.$message.error(res.message)
        this.$refs.addUserRef.resetFields()
        this.addUserVisible = false
        this.$message.success('用户添加成功')
        this.getUserList()
      })
    },

    addUserCancel(){
      this.$refs.addUserRef.resetFields() 
      this.addUserVisible = false
    },

    adminChange(checked){
      if (checked){
        this.userInfo.role = 1
      }else{
        this.userInfo.role = 2
      }
    },

    async editUser(id){
      this.editUserVisible = true
      const { data:res } = await this.$http.get(`user/${id}`)
      this.userInfo = res.data
      this.userInfo.id = id
    },

    editUserOk(){
      this.$refs.editUserRef.validate(async (valid)=>{
        if(!valid) return this.$message.error('参数不符合要求，请重新输入')
        const {data:res} = await this.$http.put(`user/${this.userInfo.id}`, {
            username:this.userInfo.username,
            role:this.userInfo.role
          }
        )
        if(res.status != 200) return this.$message.error(res.message)
        this.editUserVisible = false
        this.$message.success('更新用户信息成功')
        this.getUserList()
      })
    },

    editUserCancel(){
      this.$refs.editUserRef.resetFields() 
      this.editUserVisible = false
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
        this.getUserList()
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