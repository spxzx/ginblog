<template>
  <div>
    <a-card>
      <h3>个人设置</h3>
      <a-form-model>
        <a-form-model-item label="作者名称">
          <a-input v-model="profileInfo.name" style="width:300px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="头像图">
          <a-upload listType="picture" name="file" 
            :action="upUrl" :headers="headers"
            @change="avatarChange">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
            <br/>
            <template v-if="profileInfo.avatar">
              <img :src="profileInfo.avatar" style="width: 120px;" />
            </template>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="背景图">
          <a-upload listType="picture" name="file" 
            :action="upUrl" :headers="headers"
            @change="imgChange">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
            <br/>
            <template v-if="profileInfo.img">
              <img :src="profileInfo.img" style="width: 120px;" />
            </template>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="个人描述">
          <a-input v-model="profileInfo.desc" type="textarea" style="width:300px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="QQ">
          <a-input v-model="profileInfo.qqchat" style="width:300px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="微信">
          <a-input v-model="profileInfo.wechat" style="width:300px"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="danger" style="margin-right:15px" @click="updateProfile(profileInfo.id)">更新</a-button>
          <!-- <a-button type="primary">取消</a-button> -->
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { Url } from '../../plugin/http'
export default {
  data(){
    return {
      profileInfo:{
        id:1,
        name:'',
        avatar:'',
        img:'',
        desc:'',
        qqchat:'',
        wechat:'',
      },
      upUrl: Url+'upload',
      headers:{},
      fileList: [],
    }
  },
  created(){
    this.getProfileInfo()
    this.headers = {Authorization: `Bearer ${window.sessionStorage.getItem('token')}`}
  },
  methods:{
    async getProfileInfo(){
      const {data:res} = await this.$http.get(`profile/${this.profileInfo.id}`)
      if(res.status != 200) return this.$message.error(res.message)
      this.profileInfo = res.data
    },
    avatarChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        this.$message.success(`图片上传成功`)
        this.profileInfo.avatar = info.file.response.url
      } else if (info.file.status === 'error') {
        this.$message.error(`图片上传失败`)
      }
    },
    imgChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        this.$message.success(`图片上传成功`)
        this.profileInfo.img = info.file.response.url
        console.log(info.file.response)
      } else if (info.file.status === 'error') {
        this.$message.error(`图片上传失败`)
      }
    },
    async updateProfile(id){
      const {data:res} = await this.$http.put(`profile/${this.profileInfo.id}`, this.profileInfo)
      if(res.status != 200) return this.$message.error(res.message)
      this.$message.success(`个人信息更新成功`)
      this.$router.push(`/index`)
    }
  }
}
</script>

<style>

</style>