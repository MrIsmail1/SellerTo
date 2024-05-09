import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import ForgotPassword from '../views/ForgotPasswordView.vue'
import ResetPassword from '../views/ResetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
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
    }
  ]
})

export default router
