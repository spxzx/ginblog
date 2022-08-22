<template>
  <a-layout-sider breakpoint="lg" v-model="collapsed">
    <div class="logo">
      <span>{{collapsed?"Blog":"Spxzx's Blog"}}</span>
    </div>
    <a-menu 
      theme="dark"
      mode="inline"
      @click="goToPage"
    >
      <a-menu-item key="index">
        <a-icon type="dashboard"></a-icon>
        <span>流量数据</span>
      </a-menu-item>
      <a-sub-menu>
        <span slot="title"><a-icon type="file"></a-icon><span>文章管理</span></span>
        <a-menu-item key="addarticle">
          <a-icon type="form"></a-icon>
          <span>写文章</span>
        </a-menu-item>
        <a-menu-item key="articlelist">
          <a-icon type="snippets"></a-icon>
          <span>文章列表</span>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="categorylist">
          <a-icon type="book"></a-icon>
          <span>分类列表</span>
      </a-menu-item>
      <a-menu-item key="userlist">
        <a-icon type="user"></a-icon>
        <span>用户列表</span>
      </a-menu-item>
      <a-menu-item key="profile">
        <a-icon type="setting"></a-icon>
        <span>信息</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  data(){
    return {
      collapsed:false,
    }
  },
  methods: {
    goToPage(item) {
      this.$router.push('/'+item.key).catch(err => err)
    }
  }
}
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
}
</style>