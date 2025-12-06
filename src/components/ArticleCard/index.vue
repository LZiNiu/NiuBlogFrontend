<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { dayjs } from "element-plus";
import { Icon } from '@iconify/vue'

// 图标引入
import RiUser3Fill from '~icons/ri/user-3-fill';
import IcOutlineCalendarMonth from "~icons/ic/outline-calendar-month";
import IcBaselineEditCalendar from "~icons/ic/baseline-edit-calendar";
import IconTag from "~icons/heroicons/tag-20-solid";
import IconEye from "~icons/heroicons/eye-20-solid";
import IconLike from "~icons/heroicons/hand-thumb-up-20-solid";


interface Props {
  cardInfo: Api.ArticleCardInfo;
}

const props = defineProps<Props>();
const router = useRouter();

// 摘要默认值
const displaySummary = computed(() => {
  return props.cardInfo.summary || "这篇文章没有摘要，但内容一定很精彩！快点进去看看吧~";
});

// 是否有标签
const hasTags = computed(() => {
  return Array.isArray(props.cardInfo.tag_names) && props.cardInfo.tag_names.length > 0;
});

// 是否有封面
const hasCover = computed(() => !!props.cardInfo.cover_url && props.cardInfo.cover_url.length > 0);

// 格式化时间
const formatDate = (date: string | Date) => dayjs(date).format("YYYY-MM-DD");
const createTimeFormatted = computed(() => formatDate(props.cardInfo.create_time));
const updateTimeFormatted = computed(() => {
  const updateTime = props.cardInfo.update_time ?? props.cardInfo.create_time;
  return formatDate(updateTime);
});

// 跳转逻辑
const handleCardClick = () => {
  router.push({ path: "/article", query: { id: props.cardInfo.id } });
};
const handleCategoryClick = (id: number | string) => {
  router.push({ path: "/category", query: { id: id } });
};
</script>

<template>
  <!-- 
     外层容器：
     1. mb-6: 卡片间距
     2. hover:-translate-y-1: 悬浮上浮
  -->
  <div
    class="group relative flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden cursor-pointer mb-6"
    @click="handleCardClick"
  >
    <!-- 1. 封面图区域 (如果有) -->
    <div v-if="hasCover" class="relative h-48 sm:h-64 w-full overflow-hidden">
      <img 
        :src="cardInfo.cover_url" 
        alt="cover" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <!-- 遮罩：让图片在亮色模式下不至于太刺眼，暗色模式下压暗一点 -->
      <div class="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors"></div>
    </div>

    <!-- 内容区域 -->
    <div class="p-6 flex flex-col grow">
      
      <!-- 2. 标题 (第一位) -->
      <h2
        class="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 mb-3 line-clamp-2"
      >
        {{ cardInfo.title }}
      </h2>

      <!-- 3. 分类列表 (紧凑布局) -->
      <!-- 使用 flex-wrap + gap-2 解决宽屏间距过大问题 -->
      <div v-if="cardInfo.category_names && cardInfo.category_names.length" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(category_name, index) in cardInfo.category_names"
          :key="category_name"
          @click.stop="handleCategoryClick(cardInfo.category_ids?.[index] || '')"
          class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
        >
          <Icon icon="carbon:folder" class="mr-1 text-[10px]" />
          {{ category_name }}
        </span>
      </div>

      <!-- 4. Meta 信息 (作者、时间、标签) -->
      <div class="flex flex-wrap items-center gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <!-- 作者 -->
        <div class="flex items-center mr-3">
          <RiUser3Fill class="w-4 h-4 mr-1" />
          <span>{{ cardInfo.author_name }}</span>
        </div>

        <!-- 创建时间 -->
        <div class="flex items-center mr-3">
          <IcOutlineCalendarMonth class="w-4 h-4 mr-1" />
          <time :datetime="createTimeFormatted">{{ createTimeFormatted }}</time>
        </div>

        <!-- 更新时间 (可选展示，这里保留) -->
        <div class="flex items-center mr-3 sm:flex">
          <IcBaselineEditCalendar class="w-4 h-4 mr-1" />
          <time :datetime="updateTimeFormatted">{{ updateTimeFormatted }}</time>
        </div>

        <!-- 标签 -->
        <div v-if="hasTags" class="flex items-center flex-wrap gap-1">
          <IconTag class="w-4 h-4 mr-1 text-slate-400" />
          <span
            v-for="tag in cardInfo.tag_names"
            :key="tag"
            class="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 5. 摘要 -->
      <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed line-clamp-3 mb-4">
        {{ displaySummary }}
      </p>

      <!-- 6. 底部数据 (占位 spacers 确保对齐) -->
      <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-sm text-slate-400 dark:text-slate-500">
        <!-- 左侧留空或放“阅读更多” -->
        <span class="text-xs group-hover:text-indigo-500 transition-colors font-medium flex items-center gap-1">
          Read more <Icon icon="mdi:arrow-right" class="text-xs" />
        </span>

        <!-- 右侧统计 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <IconEye class="w-5 h-5 mr-1" />
            <span>{{ cardInfo.view_count || 0 }}</span>
          </div>
          <div class="flex items-center">
            <IconLike class="w-5 h-5 mr-1" />
            <span>{{ cardInfo.like_count || 0 }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>