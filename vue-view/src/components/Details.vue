<template>
  <div>
    <div class="d-flex justify-center pa-3 ma-1 text-h4 font-weight-bold">{{ articleInfo.title }}</div>
    <div class="d-flex justify-center align-center">
      <div class="d-flex mx-10 justify-center">
        <v-icon class="mr-1" color="indigo" small>
          {{ 'mdi-calendar-month' }}
        </v-icon>
        <span>{{ articleInfo.CreatedAt | dateformat('YYYY-MM-DD') }}</span>
      </div>
    </div>

    <v-divider class="pa-3 ma-3"></v-divider>

    <v-alert
      class="ma-4"
      elevation="1"
      color="indigo"
      dark
      border="left"
      outlined
    >{{ articleInfo.desc }}</v-alert>
    <div v-html="articleInfo.content" class="content ma-5 pa-3 text-justify"></div>

    <v-divider class="ma-5"></v-divider>

    
  </div>
</template>

<script>
export default {
  props:['id'],
  data() {
    return {
      articleInfo:{},
    }
  },
  created(){
    this.getArticleInfo()
  },
  methods:{
    async getArticleInfo(id){
      const {data:res} = await this.$http.get(`article/info/${this.id}`)
      this.articleInfo = res.data
    }
  }
}
</script>

<style>
.content >>> div, img, span {
  width: auto;
  max-width: 100%;
}
.content >>> pre, code {
  margin: 10px;
  padding: 14px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: rgba(27, 31, 35, 0.05);
  border-left-width: 0.5rem;
  border-left-style: solid;
  border-color: #303f9f;
}
</style>