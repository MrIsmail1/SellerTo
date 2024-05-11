import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/auth/LoginView.vue'
import Register from '@/views/auth/RegisterView.vue'
import ForgotPassword from '@/views/auth/ForgotPasswordView.vue'
import ResetPassword from '@/views/auth/ResetPasswordView.vue'
import Homepage from '@/views/home/HomepageView.vue'
import Category from '@/views/category/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: true
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/forgotpassword',
      name: 'ForgotPassword',
      component: ForgotPassword,
    },
    {
      path: '/resetpassword/:token',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true
    },
    {
      path: '/category/:categoryName',
      name: 'Category',
      component: Category,
    }
  ]
})

export default router
