<script setup lang="ts">
import { fetchTimelineList } from '@/api/timeline'
import { scrollToTop } from '@/utils/tool'
import { Icon } from '@iconify/vue'
import { useDateFormat } from '@vueuse/core'

// --- 1. 类型定义 ---

// --- 2. 模拟数据 (Mock Data) ---
const timelineList: Ref<Api.Timeline[]> = ref([
  {
    id: 1,
    date: '2023-11-28',
    title: '博客重构完成 v2.0',
    content:
      '使用 Vue 3 + Vite + Tailwind CSS 全面重构博客，引入了暗黑模式和响应式布局，性能提升 50%。',
    event_type: 'milestone',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    date: '2023-10-15',
    title: '深入学习 Python Pybind11',
    content:
      '发布了关于 Python 调用 C++ 的系列教程，解决了 Windows 下的环境配置痛点。',
    event_type: 'blog',
    link: '/article/1'
  },
  {
    id: 3,
    date: '2023-08-20',
    title: '第一次海边旅行',
    content: '工作之余去了一趟青岛，感受海风，吃了海鲜，放松心情。',
    event_type: 'life',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 4,
    date: '2023-05-12',
    title: '开源项目 Star 破百',
    content: '在 GitHub 上开源的工具库获得了第一个 100 Star，感谢大家的支持！',
    event_type: 'coding',
    link: 'https://github.com'
  },
  {
    id: 5,
    date: '2022-12-01',
    title: 'Hello World',
    content: '建立了这个博客的第一个版本。开始记录学习之路。',
    event_type: 'milestone'
  }
])

// --- 3. 数据处理逻辑 ---

// 按年份分组
const groupedEvents = computed(() => {
  const groups: Record<string, Api.Timeline[]> = {}

  // 先按时间降序排序
  const sorted = [...timelineList.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  sorted.forEach((event) => {
    const year = new Date(event.date).getFullYear().toString()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(event)
  })

  return Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a)) // 年份降序: 2023 -> 2022
    .map((year) => ({
      year,
      events: groups[year]
    }))
})

// 统计数据
const totalEvents = computed(() => timelineList.value.length)
const startYear = computed(() =>
  new Date(timelineList.value[totalEvents.value - 1].date).getFullYear()
)
const runDays = computed(() =>
  Math.floor(
    (new Date().getTime() -
      new Date(timelineList.value[totalEvents.value - 1].date).getTime()) /
      (1000 * 3600 * 24)
  )
)
// 辅助函数：根据类型获取图标和颜色
const getTypeConfig = (type: Api.EventType) => {
  switch (type) {
    case 'coding':
      return {
        icon: 'mdi:code-tags',
        color: 'text-blue-500',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800'
      }
    case 'blog':
      return {
        icon: 'mdi:pencil-outline',
        color: 'text-emerald-500',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-800'
      }
    case 'life':
      return {
        icon: 'mdi:coffee-outline',
        color: 'text-amber-500',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800'
      }
    case 'milestone':
      return {
        icon: 'mdi:flag-variant-outline',
        color: 'text-red-500',
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800'
      }
    default:
      return {
        icon: 'mdi:circle-small',
        color: 'text-slate-500',
        bg: 'bg-slate-100',
        border: 'border-slate-200'
      }
  }
}

// 格式化日期 (月-日)
const formatDate = (dateStr: string) => useDateFormat(dateStr, 'MM-DD').value

onMounted(async () => {
  scrollToTop()
  timelineList.value = await fetchTimelineList()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
    <!-- 1. 顶部统计概览卡片 -->
    <div class="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
      >
        <div
          class="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
        >
          <Icon
            icon="mdi:calendar-clock"
            class="text-2xl"
          />
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            上线 {{ runDays }} 天
          </div>
          <div class="text-sm text-slate-500">Since {{ startYear }}</div>
        </div>
      </div>

      <div
        class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
      >
        <div
          class="p-3 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400"
        >
          <Icon
            icon="mdi:timeline-text-outline"
            class="text-2xl"
          />
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {{ totalEvents }} 条动态
          </div>
          <div class="text-sm text-slate-500">动态记录</div>
        </div>
      </div>

      <div
        class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
      >
        <div
          class="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
        >
          <Icon
            icon="mdi:update"
            class="text-2xl"
          />
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            最近活跃
          </div>
          <div class="text-sm text-slate-500">{{ timelineList[0].date }}</div>
        </div>
      </div>
    </div>

    <!-- 2. 时间轴主体 -->
    <div class="relative pl-8 md:pl-0">
      <!-- 中央/左侧 贯穿线 -->
      <div
        class="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-500 via-purple-500 to-transparent opacity-30 transform -translate-x-1/2"
      ></div>

      <!-- 遍历年份 -->
      <div
        v-for="group in groupedEvents"
        :key="group.year"
        class="mb-12 relative"
      >
        <!-- 年份标签 (Sticky) -->
        <div class="sticky top-20 z-20 flex justify-center mb-8">
          <span
            class="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-2xl font-bold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            {{ group.year }}
          </span>
        </div>

        <!-- 遍历事件 -->
        <div
          v-for="(event, index) in group.events"
          :key="event.id"
          class="relative mb-12 group"
        >
          <!-- Flex 容器：处理左右布局 -->
          <!-- md:flex-row-reverse: 偶数项反转，实现左右交替布局 -->
          <div
            class="flex flex-col md:flex-row items-center justify-between w-full"
            :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
          >
            <!-- 2.1 空白占位 (用于桌面端保持居中) -->
            <div class="hidden md:block w-5/12"></div>

            <!-- 2.2 中轴点 -->
            <div
              class="absolute left-0 md:left-1/2 w-8 h-8 -ml-4 md:-ml-4 flex items-center justify-center z-10"
            >
              <!-- 外圈光晕 -->
              <div
                class="absolute inset-0 rounded-full opacity-50 blur-sm transition-colors duration-300"
                :class="getTypeConfig(event.event_type).bg"
              ></div>
              <!-- 图标圆点 -->
              <div
                class="relative w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-300"
                :class="[
                  getTypeConfig(event.event_type).border,
                  getTypeConfig(event.event_type).color
                ]"
              >
                <Icon
                  :icon="getTypeConfig(event.event_type).icon"
                  class="text-sm"
                />
              </div>
            </div>

            <!-- 2.3 内容卡片 -->
            <div class="w-full md:w-5/12 pl-12 md:pl-0">
              <div
                class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
              >
                <!-- 装饰：小箭头 (仅桌面端显示) -->
                <div
                  class="hidden md:block absolute top-6 w-3 h-3 bg-white dark:bg-slate-800 border-t border-l border-slate-100 dark:border-slate-700 transform rotate-45"
                  :class="index % 2 !== 0 ? '-right-1.5' : '-left-1.5'"
                ></div>

                <!-- 头部：日期与标题 -->
                <div class="flex items-center gap-3 mb-2">
                  <span
                    class="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    {{ formatDate(event.date) }}
                  </span>
                  <h3
                    class="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1"
                  >
                    {{ event.title }}
                  </h3>
                </div>

                <!-- 内容 -->
                <p
                  class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3"
                >
                  {{ event.content }}
                </p>

                <!-- 图片展示 (如果有) -->
                <div
                  v-if="event.images && event.images.length"
                  class="grid grid-cols-2 gap-2 mt-3"
                >
                  <div
                    v-for="(img, idx) in event.images"
                    :key="idx"
                    class="relative group/img overflow-hidden rounded-lg aspect-video cursor-zoom-in"
                  >
                    <img
                      :src="img"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      alt="Event Image"
                    />
                  </div>
                </div>

                <!-- 链接 (如果有) -->
                <a
                  v-if="event.link"
                  :href="event.link"
                  target="_blank"
                  class="inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 mt-2"
                >
                  <span>Read More</span>
                  <Icon icon="mdi:arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部终点 -->
      <div
        class="absolute left-8 md:left-1/2 bottom-0 w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full -ml-1.5 md:-ml-1.5"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* 
  响应式布局说明：
  1. Mobile: 线条在左侧 (left-8)，内容全部在右侧 (pl-12)。
  2. Desktop (md): 线条在中间 (left-1/2)，内容左右交替 (flex-row / flex-row-reverse)。
  
  Sticky Header:
  年份标签使用了 sticky top-20，这样滚动时年份会吸附在顶部，体验很好。
*/
</style>
