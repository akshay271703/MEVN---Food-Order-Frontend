import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import SellerDashboard from '../views/SellerDashboard.vue'
import Cart from '../views/Cart.vue'

import { checkUser } from '../composables/jwt'

const requireAuth = async(req,res,next)=>{
  if(checkUser()){
    next()
  }else{
    router.push({ name : 'Login'})
  }
}
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/sellerDashboard',
    name: 'SellerDashboard',
    component: SellerDashboard
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    beforeEnter : requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
