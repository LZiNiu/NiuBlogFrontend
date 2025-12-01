import type { RouteRecordRaw, RouteRecordRedirectOption } from 'vue-router';

// 定义路由配置项，支持简写component
export interface RouteConfig {
  path: string;
  name?: string;
  component?: string | (() => Promise<any>);
  redirect?: RouteRecordRedirectOption;
  meta?: RouteRecordRaw['meta'];
  children?: RouteConfig[];
}

// 转换路由配置，自动处理组件导入
export function transformRoutes(routes: RouteConfig[]): RouteRecordRaw[] {
  return routes.map(route => {
    // 如果是重定向路由
    if (route.redirect) {
      return {
        path: route.path,
        redirect: route.redirect,
        meta: route.meta
      } as RouteRecordRaw;
    }

    // 普通路由
    let component;
    if (route.component) {
      if (typeof route.component === 'string') {
        const componentPath = route.component;
        component = () => import(`@/views/${componentPath}/index.vue`);
      } else {
        component = route.component;
      }
    }

    const transformedRoute = {
      path: route.path,
      name: route.name,
      component,
      meta: route.meta,
      children: route.children ? transformRoutes(route.children) : undefined
    } as RouteRecordRaw;

    return transformedRoute;
  });
}

// 类型守卫：检查是否为有效的路由配置
export function isRouteConfig(route: any): route is RouteConfig {
  return typeof route === 'object' && route !== null && 'path' in route;
}
