import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'

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
        { path: '/rights', name: 'rights', component: Rights }
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
