<template>
  <div>
    <v-app-bar mobileBreakpoint="sm" dark flat app color="primary">
      <v-toolbar-title>
        <v-app-bar-nav-icon class="mx-15 hidden-md-and-down">
          <v-avatar size="40" color="grey">
            <img :src="profileInfo.avatar" alt />
          </v-avatar>
        </v-app-bar-nav-icon>
      </v-toolbar-title>
      <v-tabs dark center-active centered class="hidden-sm-and-down">
        <v-tab @click="$router.push('/')">首页</v-tab>
        <v-tab
          v-for="item in categorylist"
          :key="item.id"
          text
          @click="gotoCategory(item.id)"
        >{{ item.name }}</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-responsive class="hidden-sm-and-down" color="white">
        <v-text-field
          dense
          flat
          hide-details
          solo-inverted
          rounded
          placeholder="请输入文章标题查找"
          dark
          append-icon="mdi-text-search"
          v-model="searchName"
          @change="searchTitle(searchName)"
        ></v-text-field>
      </v-responsive>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data(){
    return {
      categorylist:[],
      profileInfo:{
        id: 1,
      },
      searchName: "",
    }
  },
  created(){
    this.getCategoryList()
    this.getProfileInfo()
  },
  methods:{
    async getCategoryList(){
      const {data:res} = await this.$http.get('categories')
      this.categorylist = res.data
    },
    async getProfileInfo(){
      const {data:res} = await this.$http.get(`profile/${this.profileInfo.id}`)
      this.profileInfo = res.data
    },
    gotoCategory(cid) {
      this.$router.push(`/category/${cid}`).catch((err) => err)
    },
    searchTitle(title) {
      if (title.length == 0){
        this.$router.push(`/`)
        return this.$message.error('你还没填入搜索内容哦')
      } 
      this.$router.push(`/search/${title}`)
    },
  }
}
</script>

<style>

</style>