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
        path: "/account/delete",
        name: "Delete",
        component: () => import("@/views/front/user/DeleteView.vue"),
        meta: { requiresAuth: true },
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
        path: "products",
        name: "Search",
        component: () => import("@/views/front/product/SearchProductsView.vue"),
        props: true,
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("@/views/front/order/OrdersView.vue"),
        props: true,
      },
      {
        path: "/legal-mentions",
        name: "legal-mentions",
        component: () =>
          import("@/views/front/legalcontent/LegalContentView.vue"),
        meta: { contentType: "legal-mentions" },
      },
      {
        path: "/cookies",
        name: "cookies",
        component: () =>
          import("@/views/front/legalcontent/LegalContentView.vue"),
        meta: { contentType: "cookies" },
      },
      {
        path: "/terms-of-use",
        name: "terms-of-use",
        component: () =>
          import("@/views/front/legalcontent/LegalContentView.vue"),
        meta: { contentType: "terms-of-use" },
      },
      {
        path: "/terms-of-sales",
        name: "terms-of-sales",
        component: () =>
          import("@/views/front/legalcontent/LegalContentView.vue"),
        meta: { contentType: "terms-of-sales" },
      },
      {
        path: "/data-protection",
        name: "data-protection",
        component: () =>
          import("@/views/front/legalcontent/LegalContentView.vue"),
        meta: { contentType: "data-protection" },
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
        component: () => import("@/views/back/product/ProductsView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "products/view/:id",
        name: "AdminViewProduct",
        component: () => import("@/views/back/product/SingleProductView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "products/new",
        name: "AdminAddProduct",
        component: () => import("@/views/back/product/AddProductView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "products/edit/:id",
        name: "AdminEditProduct",
        component: () => import("@/views/back/product/EditProductView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "products/delete/:id",
        name: "AdminDeleteProduct",
        component: () => import("@/views/back/product/DeleteProduct.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("@/views/back/user/UsersView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "users/view/:id",
        name: "AdminViewUser",
        component: () => import("@/views/back/user/SingleUserView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "users/new",
        name: "AdminAddUser",
        component: () => import("@/views/back/user/AddUserView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "users/edit/:id",
        name: "AdminEditUsers",
        component: () => import("@/views/back/user/EditUserView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },

      {
        path: "orders",
        name: "AdminOrders",
        component: () => import("@/views/back/order/OrdersView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "stocks",
        name: "AdminStocks",
        component: () => import("@/views/back/stock/StocksView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "stocks/new",
        name: "AdminAddStock",
        component: () => import("@/views/back/stock/AddStockView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "stocks/edit/:id",
        name: "AdminEditStock",
        component: () => import("@/views/back/stock/EditStockView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "stocks/delete/:id",
        name: "AdminDeleteStock",
        component: () => import("@/views/back/stock/DeleteStockView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },

      {
        path: "promocodes",
        name: "AdminPromoCodes",
        component: () => import("@/views/back/promo-code/PromoCodesView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "promocodes/new",
        name: "AdminAddPromoCode",
        component: () => import("@/views/back/promo-code/AddPromoCodeView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "promocodes/edit/:id",
        name: "AdminEditPromoCode",
        component: () =>
          import("@/views/back/promo-code/EditPromoCodeView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "promocodes/delete/:id",
        name: "AdminDeletePromoCode",
        component: () =>
          import("@/views/back/promo-code/DeletePromoCodeView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "newsletter",
        name: "AddNewsletterView",
        component: () => import("@/views/back/newsletter/AddNewsletterView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: "/403_forbidden",
    name: "403-forbidden",
    component: () => import("@/views/common/ForbiddenView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      next({ name: "Login" });
    } else if (
      to.meta.requiresAdmin &&
      !["Admin", "SuperAdmin"].includes(authStore.user.role)
    ) {
      next({ name: "Homepage" });
    } else {
      next();
    }
  } else {
    if (
      to.name === "AdminLogin" &&
      authStore.user &&
      ["Admin", "SuperAdmin"].includes(authStore.user.role)
    ) {
      next({ name: "AdminDashboard" });
    } else {
      next();
    }
  }
});

export default router;
