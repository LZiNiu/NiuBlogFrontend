import { dayjs } from "element-plus";

export const default_info = {
  id: "-1",
  title: "努力获取中...",
  author_name: "Loading...",
  create_time: "Loading...",
  update_time: "Loading...",
  category_id: -1,
  category_name: "",
  tag_names: [],
  summary: "",
  view_count: -1,
  like_count: -1,
};

export const test_info = {
  article_id: "-1",
  title: "欢迎来到测试页面, 你是怎么找到的?",
  author_name: "new new",
  create_time: dayjs().format("YYYY-MM-DD"),
  update_time: dayjs().format("YYYY-MM-DD"),
  category_id: -1,
  category_name: "",
  tag_names: [],
  summary: "",
  view_count: -1,
  like_count: -1,
};

export const generateTestArticles = (
  categoryId: number,
  categoryName: string,
): {records: Api.ArticleCardInfo[], total: number} => {
  const articlesData = { records: [] as Api.ArticleCardInfo[], total: 0 };
  const titles = [
    "Vue3 Composition API 最佳实践",
    "React Hooks 深入理解",
    "TypeScript 高级类型详解",
    "Webpack 性能优化实战",
    "Node.js 微服务架构设计",
    "Docker 容器化部署指南",
    "Kubernetes 集群管理",
    "微前端架构方案对比",
    "Serverless 函数计算应用",
    "GraphQL API 设计指南",
    "RESTful API 设计规范",
    "JWT 认证机制详解",
    "Redis 缓存策略优化",
    "MySQL 性能调优",
    "MongoDB 文档数据库应用",
    "Elasticsearch 全文检索",
    "CI/CD 自动化部署",
    "DevOps 实践经验分享",
    "敏捷开发方法论",
    "代码重构技巧",
    "设计模式在前端中的应用",
    "响应式编程 RxJS 入门",
    "WebAssembly 性能提升",
    "PWA 渐进式 Web 应用",
    "小程序开发经验总结",
  ];

  const summaries = [
    "本文详细介绍了现代前端开发中的核心技术要点和最佳实践...",
    "通过实际案例分析，帮助开发者深入理解相关技术概念...",
    "从基础到进阶，全面解析该技术的核心原理和应用场景...",
    "结合项目实践经验，分享实用的技术解决方案和优化技巧...",
    "针对常见问题提供详细的解决方案和代码示例...",
    "本篇文章将带你深入了解该技术的底层实现原理...",
    "通过对比分析不同方案的优缺点，为项目选型提供参考...",
    "从理论到实践，手把手教你掌握相关技术的使用方法...",
  ];

  const authors = ["张三", "李四", "王五", "赵六", "钱七"];
  const tags = [
    ["Vue", "前端"],
    ["React", "JavaScript"],
    ["TypeScript", "编程语言"],
    ["Webpack", "构建工具"],
    ["Node.js", "后端"],
    ["Docker", "容器化"],
    ["Kubernetes", "运维"],
    ["微前端", "架构"],
    ["Serverless", "云计算"],
    ["GraphQL", "API"],
    ["RESTful", "API"],
    ["安全", "认证"],
    ["Redis", "缓存"],
    ["MySQL", "数据库"],
    ["MongoDB", "NoSQL"],
    ["Elasticsearch", "搜索"],
    ["CI/CD", "DevOps"],
    ["敏捷", "项目管理"],
    ["重构", "代码质量"],
    ["设计模式", "架构"],
  ];

  const count = Math.floor(Math.random() * 30) + 10; // 随机生成10-40篇文章
  for (let i = 0; i < count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomSummary =
      summaries[Math.floor(Math.random() * summaries.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const randomTags = tags[Math.floor(Math.random() * tags.length)];

    articlesData.records.push({
      id: `art_${categoryId}_${i + 1}`,
      title: `${randomTitle} - 第${i + 1}篇`,
      summary: randomSummary,
      create_time: new Date(
        Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
      ),
      update_time: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ),
      view_count: Math.floor(Math.random() * 1000),
      like_count: Math.floor(Math.random() * 100),
      author_name: randomAuthor,
      category_ids: [categoryId],
      category_names: [categoryName],
      tag_names: randomTags,
    });
  }
  articlesData.total = count;
  return articlesData;
};
