<script setup lang="ts">
import { Icon } from '@iconify/vue'
import CategoryBanner from './category-banner/index.vue'
import CategoryCard from './category-card/index.vue'
import ArticleCard from '@/components/ArticleCard/index.vue'
import { getCategoryList } from '@/api/category'
import { fetchArticleListByCategoryId } from '@/api/article'

const route = useRoute()
const router = useRouter()

// --- 状态 ---
const isArticleView = ref(false)
const currentCategory = ref<Api.CategoryCard | any>(null)
const loading = ref(false)

// 模拟数据
const categoryList: Ref<Api.CategoryCard[]> = ref([])

const articleList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 5
const total = ref(0)

// --- 辅助功能 ---
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// --- 交互逻辑 ---
const handleCategoryClick = async (category: any) => {
  currentCategory.value = category
  isArticleView.value = true
  currentPage.value = 1
  
  // 1. 更新 URL
  router.replace({ query: { ...route.query, id: category.id } })
  
  // 2. 滚动到顶部
  scrollToTop()

  await fetchArticles()
}

const handleBackToCategories = () => {
  isArticleView.value = false
  currentCategory.value = null
  router.replace({ query: {} })
  scrollToTop()
}

// --- API ---
const fetchArticles = async () => {
  if (!currentCategory.value) return
  loading.value = true
  
  try {
    // await new Promise(resolve => setTimeout(resolve, 600))
    // Mock Data
    // articleList.value = Array.from({ length: 5 }).map((_, i) => ({
    //   id: i,
    //   title: `Understanding ${currentCategory.value.name}: A Comprehensive Guide (Part ${i + 1})`,
    //   summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
    //   cover: i % 2 === 0 ? 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' : '',
    //   create_time: new Date().toISOString(),
    //   author_name: 'Cattle',
    //   category_names: [currentCategory.value.name, 'Tech'],
    //   category_ids: [currentCategory.value.id, 99],
    //   tag_names: ['Vue', 'Refactor'],
    //   view_count: 120 + i,
    //   like_count: 45 + i
    // }))
    // total.value = 20
    const result = await fetchArticleListByCategoryId(currentCategory.value.id, currentPage.value, pageSize)
    articleList.value = result.records
    total.value = result.total
  } finally {
    loading.value = false
  }
}

const fetchCaetgoryList = async () => {
  categoryList.value = await getCategoryList()
}

// --- 初始化 ---
onMounted(() => {
  fetchCaetgoryList()
  scrollToTop() // 挂载时滚动到顶部
  
  const queryId = route.query.id
  if (queryId) {
    const target = categoryList.value.find(c => String(c.id) === String(queryId))
    if (target) {
      handleCategoryClick(target)
    }
  }
})
</script>

<template>
  <!-- pb-20 确保底部有足够空间，分页器不贴底 -->
  <div class="min-h-screen pb-20 px-10">
    
    <!-- 动态 Banner -->
    <transition name="fade" mode="out-in">
      <CategoryBanner 
        :key="isArticleView ? 'detail' : 'list'"
        :title="isArticleView ? currentCategory?.name : 'Explore Categories'"
        :description="isArticleView ? currentCategory?.description : 'Browse articles by topic. Find what interests you the most.'"
        :is-detail="isArticleView"
        :icon="isArticleView ? 'carbon:folder-open' : 'carbon:categories'"
      />
    </transition>

    <!-- 列表内容区 -->
    <div class="container mx-auto px-4">
      <transition name="fade-slide" mode="out-in">
        
        <!-- 视图 1: 分类卡片列表 -->
        <div v-if="!isArticleView" key="category-list">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CategoryCard 
              v-for="cat in categoryList" 
              :key="cat.id" 
              :data="cat"
              @click="handleCategoryClick(cat)"
            />
          </div>
        </div>

        <!-- 视图 2: 文章列表 -->
        <div v-else key="article-list" class="max-w-4xl mx-auto">
          
          <!-- 返回按钮栏 -->
          <div class="mb-6 flex items-center justify-between">
            <button 
              @click="handleBackToCategories"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <Icon icon="mdi:arrow-left" /> Back to Categories
            </button>
            <span class="text-sm text-slate-400">{{ total }} articles found</span>
          </div>

          <!-- 骨架屏 -->
          <div v-if="loading" class="space-y-6">
            <el-skeleton :rows="3" animated class="bg-white dark:bg-slate-800 p-4 rounded-xl" />
            <el-skeleton :rows="3" animated class="bg-white dark:bg-slate-800 p-4 rounded-xl" />
          </div>

          <!-- 文章列表 -->
          <div v-else class="space-y-2"> <!-- 调整间距，因为卡片自带了 mb-6 -->
            <ArticleCard 
              v-for="article in articleList" 
              :key="article.id" 
              :card-info="article" 
            />
            
            <el-empty v-if="articleList.length === 0" description="No articles in this category." />
          </div>

          <!-- 分页 -->
          <div v-if="articleList.length > 0" class="flex justify-center mt-8 mb-4">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              v-model:current-page="currentPage"
              @current-change="fetchArticles"
              class="custom-pagination"
            />
          </div>
        </div>

      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>