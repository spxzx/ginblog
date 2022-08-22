<template>
  <v-container>
    <div v-if="total == 0 && isLoad" class="d-flex justify-center align-center">
      <div>
        <v-alert class="ma-5" dense outlined type="error"
          >抱歉，暂无数据！</v-alert
        >
      </div>
    </div>
    <v-col>
      <v-card class="ma-3 d-flex flex-no-wrap justify-space-between align-center"
        v-for="item in articlelist" 
        :key="item.id" 
        link
        @click="$router.push(`article/detail/${item.ID}`)"
      >
        <v-row no-gutters class="d-flex align-center">
            <v-avatar class="ma-3 hidden-sm-and-down" size="125" tile>
              <v-img :src="item.img"></v-img>
            </v-avatar>
            <v-col>
              <v-card-title>
                <v-chip color="pink" outlined label class="mr-3 white--text">{{
                  item.Category.name
                }}</v-chip>
                <div>{{ item.title }}</div>
              </v-card-title>
              <v-card-subtitle class="mt-1" v-text="item.desc"></v-card-subtitle>
              <v-divider class="mx-4"></v-divider>
              <v-card-text class="d-flex align-center">
                <div class="d-flex align-center">
                  <v-icon class="mr-1" small>{{ 'mdi-calendar-month' }}</v-icon>
                  <span>{{
                    item.CreatedAt | dateformat('YYYY-MM-DD')
                  }}</span>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
      </v-card>
      <div class="text-center">
        <v-pagination
          total-visible="7"
          v-model="queryParam.pageNum"
          :length="Math.ceil(total / queryParam.pageSize)"
          @input="getArticleList()"
        ></v-pagination>
      </div>
    </v-col>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      articlelist:[],
      queryParam:{
        pageSize:5,
        pageNum:1,
      },
      total:0,
      isLoad: false,
    }
  },
  created(){
    this.getArticleList()
  },
  methods:{
    async getArticleList(){
      const { data: res } = await this.$http.get('articles',{
        params: {
          pageSize: this.queryParam.pageSize,
          pageNum: this.queryParam.pageNum,
        },
      })
      this.articlelist = res.data
      this.total = res.total
      this.isLoad = true
    },
  }
}
</script>

<style>

</style>