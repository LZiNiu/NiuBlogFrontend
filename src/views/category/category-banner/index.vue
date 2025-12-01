<script setup lang="ts">
import { Icon } from '@iconify/vue'
import backgroundImage from '@/assets/images/category_banner.jpg'

interface Props {
  title: string
  description?: string
  icon?: string // 支持传入图标
  isDetail?: boolean // 是否为详情模式（改变背景色调）
}

withDefaults(defineProps<Props>(), {
  title: 'Categories',
  description: 'Explore different topics and thoughts.',
  icon: 'carbon:categories',
  isDetail: false
})

// 这里使用了类似您提供的蓝色波浪水彩图片
// 您可以将此链接替换为您本地的图片路径，如: new URL('@/assets/banner-wave.jpg', import.meta.url).href
const bgImage = backgroundImage
</script>

<template>
  <div
    class="relative w-full mt-3 mx-auto py-12 md:py-16 px-10 rounded-3xl overflow-hidden mb-10 transition-all duration-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 shadow-sm"
  >
    <!-- 背景装饰图案 (SVG Pattern) -->
    <div class="absolute inset-0 pointer-events-none">
      <svg
        class="w-full h-full block dark:hidden"
        viewBox="0 0 1400 300"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="lightGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style="stop-color: #dbeafe; stop-opacity: 1"
            />
            <stop
              offset="100%"
              style="stop-color: #60a5fa; stop-opacity: 1"
            />
          </linearGradient>
        </defs>
        <rect
          width="1400"
          height="300"
          fill="url(#lightGradient)"
        />
        <path
          d="M0,250 C400,200 800,280 1200,210 L1400,240 L1400,300 L0,300 Z"
          fill="#ffffff"
          opacity="0.3"
        />
        <path
          d="M0,270 C350,240 700,290 1050,250 C1300,220 1400,260 1400,260 L1400,300 L0,300 Z"
          fill="#ffffff"
          opacity="0.5"
        />
      </svg>

      <svg
        class="w-full h-full hidden dark:block"
        viewBox="0 0 1400 300"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="darkBgGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style="stop-color: #0f172a; stop-opacity: 1"
            />
            <stop
              offset="100%"
              style="stop-color: #1e3a8a; stop-opacity: 1"
            />
          </linearGradient>
        </defs>
        <rect
          width="1400"
          height="300"
          fill="url(#darkBgGradient)"
        />
        <path
          d="M0,220 C300,280 600,180 900,240 C1200,300 1400,220 1400,220 L1400,300 L0,300 Z"
          fill="#0e7490"
          opacity="0.4"
        />
        <path
          d="M0,250 C400,200 800,280 1200,210 L1400,240 L1400,300 L0,300 Z"
          fill="#06b6d4"
          opacity="0.3"
        />
        <path
          d="M0,270 C350,240 700,290 1050,250 C1300,220 1400,260 1400,260 L1400,300 L0,300 Z"
          fill="#67e8f9"
          opacity="0.2"
        />
      </svg>
    </div>

    <!-- 浮动光晕装饰 -->
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
    ></div>

    <!-- 内容区域 -->
    <div class="relative z-10 flex flex-col items-start gap-4 max-w-3xl">
      <div
        class="flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-md shadow-inner bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400"
      >
        <Icon
          :icon="icon"
          class="text-2xl"
        />
      </div>

      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          {{ title }}
        </h1>
        <p
          v-if="description && description.length > 0"
          class="text-lg md:text-xl font-medium opacity-80 max-w-2xl leading-relaxed text-slate-500 dark:text-slate-400"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
