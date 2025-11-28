import { defineStore } from "pinia";
import { ref } from "vue";

// 假设的 API 请求函数
import {
  fetchArticleCardInfo,
  fetchArticleContent,
  fetchArticleInfoById,
} from "@/api/article";
import { dayjs } from "element-plus";

// --- 类型定义 ---

export interface ArticleDetail {
  info: Api.ArticleCardInfo;
  content: string; // Markdown content
}

// --- Mock Data Helpers ---
// const mockWait = (ms: number) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

export const useArticleStore = defineStore("article", () => {
  // --- State ---

  // 1. 实体库：存放所有文章的基础信息 (Single Source of Truth)
  const articlesMap = ref<Map<string | number, Api.ArticleCardInfo>>(new Map());

  // 2. 列表缓存：映射 PageKey -> IDs
  // Key 格式: `${page}-${pageSize}` (例如 "1-10", "2-10")
  const pagesMap = ref<Map<string, (string | number)[]>>(new Map());

  // 3. 正文缓存：存放文章 Markdown 内容
  const contentCache = ref<Map<string | number, string>>(new Map());

  // 4. 正文 LRU 队列
  const contentLruQueue = ref<(string | number)[]>([]);
  const MAX_CONTENT_CACHE_SIZE = 10;

  // 5. 总文章数
  const totalArticleCount = ref(0);

  // --- Actions ---

  /**
   * 获取文章列表 (带缓存)
   * 用于主页/分类页
   */
  async function fetchArticleList(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Api.Common.PaginatedData<Api.ArticleCardInfo>> {
    const cacheKey = `${page}-${pageSize}`;

    // 1. 检查页面缓存
    const cachedIds = pagesMap.value.get(cacheKey);

    if (cachedIds && cachedIds.length > 0) {
      // 尝试从实体库组装数据
      const cachedList: Api.ArticleCardInfo[] = [];
      let allFound = true;

      for (const id of cachedIds) {
        const item = articlesMap.value.get(id);
        if (item) {
          cachedList.push(item);
        } else {
          // 如果实体库里缺了某个 ID 的数据 (极少见，除非被手动清除了)，则视为缓存失效
          allFound = false;
          break;
        }
      }

      if (allFound) {
        console.log(`[Cache] Hit list for key: ${cacheKey}`);
        return {
          records: cachedList,
          total: totalArticleCount.value,
          current: page,
          size: pageSize,
        };
      }
    }

    // 2. 缓存未命中，请求 API
    try {
      const res = await fetchArticleCardInfo(page, pageSize);
      console.log("response: ", res);
      const articleInfoList = res.records;

      // 3. 更新缓存
      const newIds: (string | number)[] = [];
      articleInfoList.forEach((item) => {
        articlesMap.value.set(item.id, item); // 更新实体库
        newIds.push(item.id);
      });
      pagesMap.value.set(cacheKey, newIds); // 更新页码映射

      return res;
    } catch (error) {
      console.error("Fetch list failed", error);
      throw error;
    }
  }

  /**
   * 获取文章详情 (LRU Content + Basic Info)
   * 用于 PostDetail 页
   */
  async function fetchArticleDetail(
    id: string | number,
  ): Promise<ArticleDetail | null> {
    let info = articlesMap.value.get(id);

    // [关键逻辑] 处理新标签页打开/直接访问 URL 的情况
    // 如果 Store 里完全没有这个 Info，则请求 Info
    if (!info) {
      console.log("[Cache] Info miss (New Tab/Direct Link), fetching info...");
      info = await fetchArticleInfoById(id);

      // 存入实体库，以便后续使用
      articlesMap.value.set(id, info);
    }

    // 获取 Content
    let content = contentCache.value.get(id);

    if (!content) {
      const res = await fetchArticleContent(id);
      content = res;

      // 存入缓存
      contentCache.value.set(id, content);
      contentLruQueue.value.push(id);

      // LRU 清理
      if (contentLruQueue.value.length > MAX_CONTENT_CACHE_SIZE) {
        const oldId = contentLruQueue.value.shift();
        if (oldId) {
          contentCache.value.delete(oldId);
          console.log(`[Cache] Evicted content for article ${oldId}`);
        }
      }
    } else {
      // 刷新 LRU 位置 (移到队尾)
      const index = contentLruQueue.value.indexOf(id);
      if (index > -1) {
        contentLruQueue.value.splice(index, 1);
        contentLruQueue.value.push(id);
      }
    }
    console.log("content: ", content);
    return {
      info,
      content,
    };
  }

  return {
    articlesMap,
    pagesMap,
    fetchArticleList,
    fetchArticleDetail,
  };
});
