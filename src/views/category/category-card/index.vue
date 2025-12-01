<!-- src/views/category/components/CategoryCard.vue -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface CategoryInfo {
  id: number | string
  name: string
  description?: string
  article_count?: number
}

interface Props {
  data: CategoryInfo
}

defineProps<Props>()
</script>

<template>
  <div 
    class="group relative h-full min-h-40 p-6 flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
    bg-linear-to-br from-white to-slate-50 border border-slate-200
    hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200
    dark:from-slate-800 dark:to-slate-800/50 dark:border-slate-700 dark:hover:border-indigo-500/30"
  >
    <!-- 
      背景装饰：右上角水印图标 
      - absolute -top-2 -right-2: 定位到右上角，微调偏移
      - text-7xl: 尺寸调整为 7xl (约 4.5rem/72px)，比之前小了很多
      - rotate-12: 保持一点旋转角度
      - opacity: 保持极低透明度，确保不干扰文字
    -->
    <Icon 
      icon="carbon:hashtag" 
      class="absolute -top-2 -right-2 text-7xl text-slate-900 dark:text-white opacity-[0.04] group-hover:opacity-[0.08] dark:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-all duration-500 rotate-12 group-hover:rotate-6 group-hover:scale-110 pointer-events-none"
    />

    <!-- 内容区 -->
    <div class="relative z-10 pr-8"> <!-- pr-8 避免文字和右上角图标视觉冲突(虽然图标很淡) -->
      <!-- 头部：图标+名称 -->
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-500/30">
          <Icon icon="carbon:folder" class="text-xl" />
        </div>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ data.name }}
        </h3>
      </div>

      <!-- 描述 -->
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
        {{ data.description || 'Explore articles in this category.' }}
      </p>
    </div>

    <!-- 底部：文章计数与箭头 -->
    <div class="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-indigo-100 dark:group-hover:border-slate-600/50 transition-colors">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-500/80 transition-colors">
        {{ data.article_count || 0 }} ARTICLES
      </span>
      <div class="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <span>View</span>
        <Icon icon="mdi:arrow-right" class="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
</template>