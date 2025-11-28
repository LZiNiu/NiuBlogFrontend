<script setup lang="ts">
import HomeBanner from './home-banner/index.vue'
import ProfileCard from './profile-card/index.vue'
import NoticeCard from './notice-card/index.vue'
import { useArticleStore } from '@/stores/article'

defineOptions({ name: 'Home' })
const currentPage = ref(1)
const pageSize = 5

const articleStore = useArticleStore()

const articleCardList: Ref<Api.ArticleCardInfoList> = ref([])
const total_count = ref(0)
const loading = ref(true)
const fetchArticleCardInfo = async () => {
  loading.value = true
  try {
    // 获取当前页文章基础信息列表
    const data = await articleStore.fetchArticleList(
      currentPage.value,
      pageSize
    ) // 更新文章列表
    if (data) {
      total_count.value = data.total // 更新总条数
      articleCardList.value = data.records ? data.records : [] // 更新文章列表
    } else {
      console.log('未获取到文章数据')
    }
  } catch (error) {
    console.error('获取文章数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchArticleCardInfo()
}

onMounted(() => {
  fetchArticleCardInfo()
})
</script>

<template>
  <div class="home-container -mt-16">
    <!-- -mt-16 用于抵消 Layout 中 container 的 mt-16, 让 Banner 能够顶到页面最上方 -->
    <!-- 或者修改 Layout 的结构，这里假设我们需要Banner全屏 -->

    <!-- 1. Banner 区域 -->
    <HomeBanner />

    <!-- 2. 内容展示区 -->
    <div
      id="content-start"
      class="container mx-auto px-4 py-12"
    >
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧：个人信息 & 侧边栏 -->
        <aside class="lg:col-span-1 space-y-6">
          <!-- 个人卡片 -->
          <div class="sticky top-20 transition-all duration-300">
            <ProfileCard />
            <NoticeCard />
          </div>
        </aside>

        <!-- 右侧：文章列表 -->
        <div class="lg:col-span-3">
          <!-- 文章列表标题 (可选) -->
          <div
            class="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-slate-700"
          >
            <h2
              class="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
            >
              <span class="w-2 h-8 bg-indigo-600 rounded-full"></span>
              文章列表
            </h2>
          </div>

          <!-- 加载骨架屏 (Skeleton) -->
          <div
            v-if="loading"
            class="space-y-4"
          >
            <el-skeleton
              :rows="5"
              animated
            />
            <el-skeleton
              :rows="5"
              animated
            />
          </div>

          <!-- 列表循环 -->
          <div
            v-else
            class="space-y-6"
          >
            <!-- 这里使用你封装好的 ArticleCard -->
            <!-- 如果没有引入，请确保你的全局组件已注册 -->
            <ArticleCard
              v-for="article in articleCardList"
              :key="article.id"
              :card-info="article"
            />

            <!-- 空状态 -->
            <el-empty
              v-if="articleCardList.length === 0"
              description="暂无文章"
            />
          </div>

          <!-- 分页 -->
          <div class="mt-10 flex justify-center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total_count"
              :page-size="pageSize"
              v-model:current-page="currentPage"
              @current-change="handleCurrentChange"
              class="custom-pagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 针对 Element Plus Pagination 的样式覆盖，使其符合主题 */
:deep(.custom-pagination .el-pager li) {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 500;
}
:deep(.custom-pagination .el-pager li.is-active) {
  background-color: #4f46e5; /* indigo-600 */
  border-color: #4f46e5;
  color: white;
}
:deep(.custom-pagination .btn-prev),
:deep(.custom-pagination .btn-next) {
  background-color: transparent;
  border: 1px solid #e2e8f0;
}

/* 暗黑模式适配 */
.dark :deep(.custom-pagination .el-pager li) {
  border-color: #334155;
  color: #94a3b8;
}
.dark :deep(.custom-pagination .btn-prev),
.dark :deep(.custom-pagination .btn-next) {
  background-color: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}
</style>
