import Vue from 'vue'
import VueRouter from 'vue-router'
import ArticleList from '../components/ArticleList.vue'
import Details from '../components/Details.vue'
import CategoryList from '../components/CategoryList.vue'
const Search = () =>
  import(/* webpackChunkName: "group-search" */ '../components/Search.vue')

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', component: ArticleList, meta: { title: '欢迎来到GinBlog' } },
  {
    path: '/article/detail/:id',
    component: Details,
    meta: { title: window.sessionStorage.getItem('title') },
    props: true
  },
  {
    path: '/category/:cid',
    component: CategoryList,
    meta: { title: '分类信息' },
    props: true
  },
  {
    path: '/search/:title',
    component: Search,
    meta: { title: '搜索结果'},
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title ? to.meta.title : '加载中'
  }
  next()
})

export default router
