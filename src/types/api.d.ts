// 定义文章元数据类型
declare namespace Api {
  namespace Common {
    // 定义分页响应结构
    interface PaginatedData<T> {
      records: T[];
      total: number;
      current: number;
      size: number;
    }

    interface Result<T> {
      code: number;
      msg: string;
      data: T;
    }
  }

  interface ArticleDetail {
    id: number | string;
    title: string;
    create_time: Date | string;
    update_time?: Date | string;
    view_count: number;
    like_count: number;
    author_name: string;
    category_ids: number[];
    category_names: string[];
    tag_ids: number[];
    tag_names: string[];
    content: string;
  }

  interface ArticleCardInfo {
    id: number | string;
    title: string;
    summary?: string;
    create_time: Date | string;
    update_time?: Date | string;
    view_count: number;
    like_count: number;
    author_name: string;
    category_ids: number[];
    tag_ids?: number[];
    category_names: string[];
    tag_names: string[];
    cover_url?: string;
  }

  type ArticleCardInfoList = ArticleCardInfo[];

  interface Category {
    id: number | string;
    name: string;
    description?: string;
    create_time?: Date | string;
    update_time?: Date | string;
  }

  interface CategoryCard extends Category {
    article_count: number;
  }

  type EventType = 'coding' | 'blog' | 'life' | 'milestone'

  interface Timeline {
    id: number
    date: string // YYYY-MM-DD
    title: string
    content: string
    images?: string[] // 支持多图
    event_type: EventType
    link?: string // 可选的外链
  }
}
