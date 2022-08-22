<template>
  <div>
    <a-card>
      <h3>{{id ? '编辑文章' : '新增文章'}}</h3>
      <a-form-model :model="articleInfo" ref="articleInfoRef" :rules="articleInfoRules" :hideRequiredMark="true">
        <a-form-model-item label="文章标题" prop="title">
          <a-input style="width:300px" v-model="articleInfo.title"></a-input>
        </a-form-model-item>
        <a-form-model-item label="文章分类" prop="cid">
          <a-select 
           placeholder="请选择分类" 
           style="width:200px" 
           v-model="articleInfo.cid"
           @change="categoryChange"
           >
            <a-select-option v-for="item in categorylist" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="文章描述" prop="desc">
          <a-input type="textarea"  v-model="articleInfo.desc"></a-input>
        </a-form-model-item>
        <a-form-model-item label="文章缩略图" prop="img">
          <a-upload listType="picture" name="file" 
            :action="upUrl" :headers="headers"
            @change="upChange">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
            <br/>
            <template v-if="id">
              <img :src="articleInfo.img" style="width: 120px;" />
            </template>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="文章内容" prop="content" v-model="articleInfo.content">
          <Editor v-model="articleInfo.content" ></Editor>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="danger" style="margin-right:15px" @click="articleOk(articleInfo.id)">{{articleInfo.id?'更新':'提交'}}</a-button>
          <a-button type="primary" @click="addCancel">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { Url } from '../../plugin/http'
import Editor from '../editor/index.vue'
export default {
  components: { Editor },
  props: ['id'],
  data() {
    return {
      articleInfo:{
        id: 0,
        title: '',
        cid: undefined,
        desc: '',
        content: '',
        img: '',
      },
      categorylist: [],
      upUrl: Url+'upload',
      headers:{},
      fileList: [],
      articleInfoRules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'change' }],
        cid: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        desc: [
          { required: true, message: '请输入文章描述', trigger: 'change' },
          { max: 120, message: '描述最多可写120个字符', trigger: 'change' },
        ],
        // img: [{ required: true, message: '请选择文章缩略图', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'change' }],
      },
    }
  },
  created(){
    this.getCategoryList()
    this.headers = {Authorization: `Bearer ${window.sessionStorage.getItem('token')}`}
    if (this.id) {
      this.getArticleInfo(this.id)
    }
  },
  methods: {
    async getArticleInfo(id){
      const { data: res } = await this.$http.get(`article/info/${id}`)
      if (res.status !== 200) {
        if (res.status === 1009 || 1010 || 1011 || 1012 || 1013) {
          window.sessionStorage.clear()
          this.$message.error(res.message)
          this.$router.push('/login')
          return
        }
        this.$message.error(res.message)
        return
      }
      this.articleInfo = res.data
      this.articleInfo.id = res.data.ID
    },
    async getCategoryList(){
      const { data: res } = await this.$http.get('categories')
      if (res.status != 200) return this.$message.error(res.messaeg)
      this.categorylist = res.data
    },
    categoryChange(value){
      this.articleInfo.cid = value
    },
    upChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        this.$message.success(`图片上传成功`)
        this.articleInfo.img = info.file.response.url
      } else if (info.file.status === 'error') {
        this.$message.error(`图片上传失败`)
      }
    },
    articleOk(id) {
      this.$refs.articleInfoRef.validate(async (valid) => {
        if (!valid) return this.$message.error('参数验证未通过，请按要求录入文章内容')
        if (id === 0) {
          const { data: res } = await this.$http.post('article/add', this.articleInfo)
          if (res.status !== 200) return this.$message.error(res.message)
          this.$router.push('/articlelist')
          this.$message.success('添加文章成功')
        } else {
          const { data: res } = await this.$http.put(`article/${id}`, this.articleInfo)
          if (res.status !== 200) return this.$message.error(res.message)
          this.$router.push('/articlelist')
          this.$message.success('更新文章成功')
        }
      })
    },
    addCancel() {
      this.$refs.articleInfoRef.resetFields()
    },
  }
}
</script>

<style scoped>

</style>