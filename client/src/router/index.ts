import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/authStore';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Homepage',
            component: () => import('@/views/front/home/HomepageView.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/front/auth/LoginView.vue'),
            props: true
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('@/views/front/auth/RegisterView.vue'),
        },
        {
            path: '/forgotpassword',
            name: 'ForgotPassword',
            component: () => import('@/views/front/auth/ForgotPasswordView.vue'),
        },
        {
            path: '/resetpassword/:token',
            name: 'ResetPassword',
            component: () => import('@/views/front/auth/ResetPasswordView.vue'),
            props: true
        },
        {
            path: '/category/:categoryName',
            name: 'Category',
            component: () => import('@/views/front/category/CategoryView.vue'),
        },
        {
            path: '/product/:id',
            name: 'Product',
            component: () => import('@/views/front/product/ProductView.vue'),
        },
        {
            path: '/cart',
            name: 'Cart',
            component: () => import('@/views/front/cart/CartView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/account',
            name: 'Account',
            component: () => import('@/views/front/user/AccountView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/account/delete',
            name: 'Delete',
            component: () => import('@/views/front/user/DeleteView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: '/success',
            name: 'Success',
            component: () => import('@/views/front/notif/SuccessView.vue'),
        },
        {
            path: '/cancel',
            name: 'Cancel',
            component: () => import('@/views/front/notif/CancelView.vue'),
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('@/views/front/product/SearchProductsView.vue'),
            props: true
        },
    ]
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.user) {
        await authStore.fetchUser();
        if (!authStore.user) {
            next({name: 'Login'});
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
