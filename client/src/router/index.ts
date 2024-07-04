import { useAuthStore } from "@/stores/authStore";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/FrontOfficeLayout.vue"),
    children: [
      {
        path: "",
        name: "Homepage",
        component: () => import("@/views/front/home/HomepageView.vue"),
      },
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/front/auth/LoginView.vue"),
        props: true,
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/front/auth/RegisterView.vue"),
      },
      {
        path: "forgotpassword",
        name: "ForgotPassword",
        component: () => import("@/views/front/auth/ForgotPasswordView.vue"),
      },
      {
        path: "resetpassword/:token",
        name: "ResetPassword",
        component: () => import("@/views/front/auth/ResetPasswordView.vue"),
        props: true,
      },
      {
        path: "category/:categoryName",
        name: "Category",
        component: () => import("@/views/front/category/CategoryView.vue"),
      },
      {
        path: "product/:id",
        name: "Product",
        component: () => import("@/views/front/product/ProductView.vue"),
      },
      {
        path: "cart",
        name: "Cart",
        component: () => import("@/views/front/cart/CartView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "account",
        name: "Account",
        component: () => import("@/views/front/user/AccountView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: '/account/delete',
        name: 'Delete',
        component: () => import('@/views/front/user/DeleteView.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: "success",
        name: "Success",
        component: () => import("@/views/front/notif/SuccessView.vue"),
      },
      {
        path: "cancel",
        name: "Cancel",
        component: () => import("@/views/front/notif/CancelView.vue"),
      },
      {
        path: "search",
        name: "Search",
        component: () => import("@/views/front/product/SearchProductsView.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/BackOfficeLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/back/DashboardView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "products",
        name: "AdminProducts",
        component: () => import("@/views/back/ProductsView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      /*       {
        path: "orders",
        name: "AdminOrders",
        component: () => import("@/views/back/OrdersView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      }, */
    ],
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/views/back/AdminLoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  await authStore.fetchUser();

  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      next({ name: "Login" });
    } else if (to.meta.requiresAdmin && authStore.user.role !== "admin") {
      next({ name: "Homepage" });
    } else {
      next();
    }
  } else {
    if (
      to.name === "AdminLogin" &&
      authStore.user &&
      authStore.user.role === "admin"
    ) {
      next({ name: "AdminDashboard" });
    } else {
      next();
    }
  }
});

export default router;
