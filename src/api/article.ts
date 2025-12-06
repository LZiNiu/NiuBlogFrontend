import http from '@/utils/http'

/**
 * 获取首页文章卡片基本信息
 * @param page 要获取的页(默认没获取)
 * @param size 本次要获取条多少数据(默认每次获取一页5条数据)
 */
export const fetchArticleCardInfo = (page: number, size: number) => {
  return http.get<Api.Common.PaginatedData<Api.ArticleCardInfo>>(
    '/articles/pagination',
    {
      page,
      size
    }
  )
}

export const fetchArticleContent = (article_id: number | string) => {
  return http.get<string>(`/articles/${article_id}/body`)
}

export async function fetchArticleInfoById(id: number | string) {
  return http.get<Api.ArticleCardInfo>(`/articles/${id}/info`)
}

export async function fetchArticleListByCategoryId(
  id: number | string,
  page: number,
  size: number
) {
  return http.get<Api.Common.PaginatedData<Api.ArticleCardInfo[]>>(
    `/articles/category/${id}`,
    {
      page,
      size
    }
  )
}

