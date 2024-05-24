import { useAuthStore } from "@/stores/authStore";
import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Homepage",
      component: () => import("@/views/home/HomepageView.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/LoginView.vue"),
      props: true,
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/auth/RegisterView.vue"),
    },
    {
      path: "/forgotpassword",
      name: "ForgotPassword",
      component: () => import("@/views/auth/ForgotPasswordView.vue"),
    },
    {
      path: "/resetpassword/:token",
      name: "ResetPassword",
      component: () => import("@/views/auth/ResetPasswordView.vue"),
      props: true,
    },
    {
      path: "/category/:categoryName",
      name: "Category",
      component: () => import("@/views/category/CategoryView.vue"),
    },
    {
      path: "/product/:id",
      name: "Product",
      component: () => import("@/views/product/ProductView.vue"),
    },
    {
      path: "/cart",
      name: "Cart",
      component: () => import("@/views/cart/CartView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/account",
      name: "Account",
      component: () => import("@/views/AccountView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/dataTable",
      name: "DataTable",
      component: () => import("@/views/DataTable.vue"),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.user) {
    await authStore.fetchUser();
    if (!authStore.user) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
