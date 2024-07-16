import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import {HomeView, CreateBlog, LoginView, RegisterView, SingleBlog, Error404, AccountInfo} from '@/views';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
      { path: '/', component: HomeView, name:"Home" },
      { path: '/article/new', component: CreateBlog, name:"CreateBlog" },
      {
        path: '/article/edit/:id',
        component: CreateBlog,
        name:"editBlog",
        props: true
      },
      {
        path: '/article/:id',
        component: SingleBlog,
        name:"singleBlog",
        props: true
      },
      { path: '/account', component: AccountInfo, name:"account"},
      { path: '/login', component: LoginView, name:"login" },
      { path: '/register', component: RegisterView, name:"register" }, // 404 page
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: Error404
      }

    ]
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login','/register'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (!authRequired && auth.token) {
        return auth.returnUrl
    }
    if (authRequired && !auth.token) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});
