<template>
  <a-layout-header class="headerBtn">
    <a-button type="danger" @click="logOut">退出</a-button>
  </a-layout-header>
</template>

<script>
export default {
  methods: {
    logOut(){
      window.sessionStorage.clear('token')
      this.$router.push('login')
    }
  }
}
</script>

<style scoped>
.headerBtn{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>