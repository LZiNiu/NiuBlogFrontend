import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/components/Layout/index.vue";



import { generateRoutes } from './dynamicRoutes';

// 动态生成的子路由
const dynamicRoutes = generateRoutes();


// 最终路由配置
const routes = [
  {
    path: '/',
    component: Layout, // 使用 Layout 作为布局
    children: [
      ...dynamicRoutes, // 动态生成的子路由
      {
        path: '/', // 默认重定向到 /home
        redirect: '/home',
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*', // 匹配所有未定义的路径
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'), // 404 页面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;