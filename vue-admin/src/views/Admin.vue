<template>
  <a-layout class="container">
    <Nav/>
    <a-layout>
      <Header/>
      <a-layout-content>
        <router-view :key="$router.path"></router-view>
      </a-layout-content>
      <Footer/>
    </a-layout>
  </a-layout>
</template>

<script>
import Nav from '@/components/admin/Nav.vue'
import Header from '@/components/admin/Header.vue'
import Footer from '@/components/admin/Footer.vue'
export default {
  components: { Nav,Header,Footer },
}
</script>

<style scoped>
.container{
  height: 100%;
}
</style>