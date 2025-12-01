// src/router/routes.ts
import type { RouteRecordRaw } from "vue-router";
import { transformRoutes } from "./utils";

export const routes: RouteRecordRaw[] = transformRoutes([
  // 首页：同时支持 / 和 /home
  {
    path: "/",
    name: "Home",
    component: 'home',
    meta: {
      title: "首页",
      transition: "fade-slide", // 上浮淡入动画
      icon: "ri:home-2-line", // 使用 mdi 图标
    },
  },
  {
    path: "/home",
    redirect: "/", // 重定向到 /
  },

  // 分类页（未来可扩展子路由）
  {
    path: "/category",
    name: "Category",
    component: 'category',
    meta: {
      title: "分类",
      icon: "ri:layout-grid-fill",
    },
    // children: [] // 预留，未来可加子分类
  },

  // 时间轴
  {
    path: "/timeline",
    name: "Timeline",
    component: 'timeline',
    meta: {
      title: "时间轴",
      transition: "zoom-fade", // 时间轴使用：微缩放淡入
      icon: "mdi:clock-outline",
    },
  },

  // 文章详情页（隐藏，不显示在菜单）
  {
    path: "/article",
    name: "ArticleDetail",
    component: () => import("@/views/article/index.vue"),
    meta: { hidden: true,  }, // 关键：不在菜单中显示
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: 'error/404',
    meta: { hidden: true, layout: 'empty' },
  },
]);
