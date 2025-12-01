<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore, type ArticleDetail } from '@/stores/article'
import { useDateFormat, useDark, useWindowScroll } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import '@/styles/markdown/md-preview.scss'
import { scrollToTop } from '@/utils/tool'

const route = useRoute()
const router = useRouter()
const store = useArticleStore()
const articleId = route.query.id as string
const article = ref<ArticleDetail | null>(null)
const loading = ref(true)

// 暗黑模式
const isDark = useDark()
const theme = computed(() => isDark.value ? 'dark' : 'light')

// 目录配置
const scrollElement = document.documentElement
const editorId = 'preview-only'

// 滚动监听 (用于回到顶部)
const { y } = useWindowScroll()
const showBackToTop = computed(() => y.value > 300)

// 获取数据
const fetchDetail = async () => {
  loading.value = true
  try {
    const data = await store.fetchArticleDetail(articleId)
    if (data) article.value = data
  } catch (error) {
    console.error('获取文章详情失败:', error)
    router.push('/404')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatDate = (date: string | Date) => useDateFormat(date, 'YYYY-MM-DD HH:mm').value

// 跳转分类
const handleCategoryClick = (categoryId: number) => {
  router.push({ path: '/category', query: { id: categoryId } })
}


onMounted(() => {
  fetchDetail()
  // 设置回到页面顶部
  scrollToTop()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 relative min-h-screen">
    
    <!-- 1. 顶部导航：美化后的回到首页按钮 -->
    <div class="mb-8">
      <button 
        @click="router.push('/')"
        class="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300"
      >
        <div class="p-1 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
           <Icon icon="mdi:arrow-left" class="text-slate-600 dark:text-slate-300 group-hover:text-indigo-600" />
        </div>
        <span class="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">回到首页</span>
      </button>
    </div>

    <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 2. 主体布局：增加 items-start 确保右侧 Sticky 生效 -->
    <div v-else-if="article" class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      <!-- 左侧：文章内容 -->
      <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden pb-10">
        
        <!-- 封面图 -->
        <div v-if="article.info.cover_url" class="w-full h-64 md:h-80 overflow-hidden relative group">
          <img :src="article.info.cover_url" alt="Cover" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-6 md:p-8 w-full">
             <h1 class="text-3xl md:text-4xl font-bold leading-tight text-white drop-shadow-md mb-4">
              {{ article.info.title }}
            </h1>
          </div>
        </div>

        <div class="px-6 md:px-10 pt-8">
          <!-- 无封面时的标题 -->
          <h1 v-if="!article.info.cover_url" class="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
            {{ article.info.title }}
          </h1>

          <!-- 3. 改进后的元信息区域：流式布局 + 点击跳转 -->
          <!-- flex-wrap 让内容过多时自动换行；items-center 垂直居中 -->
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
            
            <!-- 作者 -->
            <div class="flex items-center gap-1.5">
              <Icon icon="mdi:account-circle" class="text-lg text-indigo-500" />
              <span class="font-medium text-slate-700 dark:text-slate-200">{{ article.info.author_name }}</span>
            </div>

            <!-- 时间 -->
            <div class="flex items-center gap-1.5">
              <Icon icon="mdi:calendar-clock" class="text-lg" />
              <span>创建于 {{ formatDate(article.info.create_time) }}</span>
            </div>
            <div v-if="article.info.update_time" class="flex items-center gap-1.5" title="最后更新">
              <Icon icon="mdi:update" class="text-lg" />
              <span>更新于 {{ formatDate(article.info.update_time) }}</span>
            </div>

            <!-- 分类 (可点击) -->
            <!-- 使用 v-for 遍历分类 ID (这里假设 category_names 和 category_ids 是一一对应的，或者 info 里直接有对象数组) -->
            <!-- 假设 info.category_ids 和 info.category_names 是对应数组 -->
            <div class="flex items-center gap-3">
              <div 
                v-for="(name, index) in article.info.category_names" 
                :key="index"
                class="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                @click="handleCategoryClick(article.info.category_ids[index])"
              >
                <Icon icon="mdi:folder-open" class="text-indigo-400" />
                <span>{{ name }}</span>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="article.info.tag_names?.length" class="flex items-center gap-2">
              <Icon icon="mdi:tag-outline" />
              <div class="flex flex-wrap gap-2">
                <span v-for="(tag, index) in article.info.tag_names" :key="index" class="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- 阅读/点赞 (放在流中) -->
            <div class="flex items-center gap-4 ml-auto md:ml-0">
               <span class="flex items-center gap-1" title="阅读量"><Icon icon="mdi:eye-outline" /> {{ article.info.view_count }}</span>
               <span class="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors" title="点赞"><Icon icon="mdi:heart-outline" /> {{ article.info.like_count }}</span>
            </div>

          </div>

          <!-- 正文 -->
          <MdPreview :editorId="editorId" :modelValue="article.content" :theme="theme" class="article-preview-custom" />
        </div>
      </div>

      <!-- 右侧：目录 -->
      <!-- sticky top-24: 距离视口顶部 6rem (约 96px) 固定 -->
      <aside class="hidden lg:block lg:col-span-1 sticky top-24">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
          <div class="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Icon icon="mdi:format-list-bulleted-type" class="text-indigo-500 text-xl" />
            <span>Outline</span>
          </div>
          <!-- offsetTop: 标题距离顶部该像素时高亮当前目录项
              scrollElementOffsetTop: 滚动区域的固定顶部高度 -->
          <MdCatalog 
            :editorId="editorId" 
            :scrollElement="scrollElement" 
            :theme="theme"
            :offsetTop="80"
            :scrollElementOffsetTop="70"
            class="custom-catalog"
          />
        </div>
      </aside>

    </div>
    
    <el-empty v-else description="Article not found" />

    <!-- 4. 回到顶部按钮 -->
    <transition name="fade">
      <button 
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-10 right-10 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
        title="回到顶部"
      >
        <Icon icon="mdi:arrow-up" class="text-2xl" />
      </button>
    </transition>
  </div>
</template>

<style scoped>
/* MdPreview 样式微调 */
.article-preview-custom {
  --md-bk-color: transparent !important; 
  padding: 0 !important; /* 移除默认内边距，交由外层 div 控制 */
}

/* 目录样式深度定制 */
.custom-catalog {
  /* 增加行间距 */
  line-height: 2 !important; 
}

/* 目录项通用样式 */
:deep(.md-editor-catalog-link) {
  display: block;
  padding: 6px 0;
  color: #64748b; /* slate-500 */
  border-left: 2px solid transparent; /* 左侧指示条预留 */
  padding-left: 12px; /* 给文字留点空隙 */
  transition: all 0.2s ease;
  font-size: 0.9rem;
}


/* 缩进控制：不同级别的标题增加左缩进 */
/* md-editor 生成的 class 是 .md-editor-catalog-link-h1, -h2 等 */
:deep(.md-editor-catalog-link-h1) { margin-left: 0; font-weight: bold; }
:deep(.md-editor-catalog-link-h2) { margin-left: 10px; }
:deep(.md-editor-catalog-link-h3) { margin-left: 24px; font-size: 0.85rem; }
:deep(.md-editor-catalog-link-h4) { margin-left: 36px; font-size: 0.85rem; }

/* 滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
/* 回到顶部动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<style lang="scss">



</style>