<template>
  <v-card class="mx-auto" max-width="300">
    <v-img :src="profileInfo.img">
      <v-card-title>
        <v-col align="center">
          <v-avatar size="130" color="gery">
            <img :src="profileInfo.avatar" alt="spxzx"/>
          </v-avatar>
          <div class="ma-4 white--text">Spxzx</div>
        </v-col>
      </v-card-title>
    </v-img>
    <v-col>
      <div class="ma-3">About Me:</div>
      <div class="ma-3">{{profileInfo.desc}}</div>
    </v-col>
    <v-divider color="indigo"></v-divider>
    <v-list nav dense>
      <v-list-item>
        <v-list-item-icon class="ma-3">
          <v-icon color="blue">{{'mdi-qqchat'}}</v-icon>
          </v-list-item-icon>
        <v-list-item-content class="grey-text">{{profileInfo.qqchat}}</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon class="ma-3">
          <v-icon color="green">{{'mdi-wechat'}}</v-icon>
          </v-list-item-icon>
        <v-list-item-content class="grey-text">{{profileInfo.wechat}}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data(){
    return{
      profileInfo:{
        id:1,
      }
    }
  },
  created(){
    this.getProfileInfo()
  },
  methods:{
    async getProfileInfo(){
      const {data:res} = await this.$http.get(`profile/${this.profileInfo.id}`)
      this.profileInfo = res.data
    },
  }
}
</script>

<style>

</style>