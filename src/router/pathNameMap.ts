// 定义路径与中文名称的映射表类型
type PathNameMap = {
  [key: string]: string; // key 是路径 (string)，value 是对应的中文名称 (string)
};

// 路径与中文名称的映射表
export const pathNameMap: PathNameMap = {
  '/home': '首页',
  '/about': '关于',
  '/timeline': '时间轴',
  '/user/profile': '用户资料',
};