import { pathNameMap } from './pathNameMap'; // 引入路径与中文名称的映射表
// 定义黑白名单

const whiteList: string[] = []; // 白名单路径
const blackList = ['/error/404']; // 黑名单路径

// 动态加载 views 文件夹下的 .vue 文件
const modules = import.meta.glob('@/views/**/*.vue'); // Vite 环境下的动态导入

// 生成路由配置
export const generateRoutes = () => {
    const routes = [];
    for (const path in modules) {
        // 提取文件路径并转换为路由路径
        const routePath = path
            .replace(/^\.\//, "") // 移除开头的 './'
            .replace(/\/src\/views/, "") // 移除前缀
            .replace(/\/index\.vue$/, "") // 移除 /index.vue
            .replace(/\.vue$/, "") // 移除 .vue 后缀
            .toLowerCase(); // 转为小写
        // 检查黑白名单
        if (blackList.includes(routePath)) continue; // 如果在黑名单中，跳过
        if (whiteList.length > 0 && !whiteList.includes(routePath)) continue; // 如果白名单不为空且不在白名单中，跳过

        // 根据路径查找映射表中的中文名称
        const name = pathNameMap[routePath] || routePath.split('/').pop(); // 默认使用路径的最后一部分

        // 添加路由
        routes.push({
            path: routePath,
            name: name, // 使用路径的最后一部分作为名称
            component: modules[path], // 动态加载组件
        });
    }
    return routes;
};