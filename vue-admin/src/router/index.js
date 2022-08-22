import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Admin from '@/views/Admin'

import Index from '@/components/admin/Index'
import AddArticle from '@/components/article/AddArticle'
import ArticleList from '@/components/article/ArticleList'
import CategoryList from '@/components/category/CategoryList'
import UserList from '@/components/user/UserList'
import Profile from '@/components/user/Profile'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Admin',
    component: Admin,
    children:[
      { path: 'index', component: Index },
      { path: 'addarticle', component: AddArticle },
      { path: 'addarticle/:id', component: AddArticle, props:true },
      { path: 'articlelist', component: ArticleList },
      { path: 'categorylist', component: CategoryList },
      { path: 'userlist', component: UserList },
      { path: 'profile', component: Profile },
    ]
  }
]
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token')
  if (to.path === '/login') return next()
  if (!token) {
    next('/login')
  }else {
    next()
  }
})

export default router