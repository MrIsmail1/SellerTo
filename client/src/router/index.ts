import { useAuthStore } from "@/stores/authStore";
import { defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Homepage",
      component: () => import("@/views/front/home/HomepageView.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/front/auth/LoginView.vue"),
      props: true,
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/front/auth/RegisterView.vue"),
    },
    {
      path: "/forgotpassword",
      name: "ForgotPassword",
      component: () => import("@/views/front/auth/ForgotPasswordView.vue"),
    },
    {
      path: "/resetpassword/:token",
      name: "ResetPassword",
      component: () => import("@/views/front/auth/ResetPasswordView.vue"),
      props: true,
    },
    {
      path: "/category/:categoryName",
      name: "Category",
      component: () => import("@/views/front/category/CategoryView.vue"),
    },
    {
      path: "/product/:id",
      name: "Product",
      component: () => import("@/views/front/product/ProductView.vue"),
    },
    {
      path: "/cart",
      name: "Cart",
      component: () => import("@/views/front/cart/CartView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/account",
      name: "Account",
      component: () => import("@/views/front/user/AccountView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/success",
      name: "Success",
      component: () => import("@/views/front/notif/SuccessView.vue"),
    },
    {
      path: "/cancel",
      name: "Cancel",
      component: () => import("@/views/front/notif/CancelView.vue"),
    },
    {
      path: "/search",
      name: "Search",
      component: () => import("@/views/front/product/SearchProductsView.vue"),
      props: true,
    },
    {
      path: "/admin/login",
      name: "AdminLogin",
      component: () => import("@/views/back/AdminLoginView.vue"),
    },
    {
      path: "/admin/dashboard",
      name: "AdminDashboard",
      component: () => import("@/views/back/DashboardView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    /* {
      path: "/admin/products",
      name: "AdminProducts",
      component: () => import("@/views/admin/ProductsView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/orders",
      name: "AdminOrders",
      component: () => import("@/views/admin/OrdersView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    }, */
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth) {
    await authStore.fetchUser();
    if (!authStore.user) {
      next({ name: "Login" });
    } else if (to.meta.requiresAdmin && authStore.user.role != "admin") {
      next({ name: "Homepage" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
