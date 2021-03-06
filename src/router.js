import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/users/Users.vue'
import Roles from './components/rights/Roles.vue'
import Rights from './components/rights/Rights.vue'
import Categories from './components/products/Categories.vue'
import Goods from './components/products/Goods.vue'
import GoodsAdd from './components/products/GoodsAdd.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: { name: 'index' } },
    { path: '/login', name: 'login', component: Login },
    { path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/categories', name: 'categories', component: Categories },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/goods-add', name: 'goods-add', component: GoodsAdd }
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
