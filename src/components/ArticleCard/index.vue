<template>
  <!-- 
    添加 mb-4 作为卡片自身的垂直间距（避免父组件干预）
    其余交互和样式逻辑保持一致
  -->
  <div
    class="article-card group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden cursor-pointer mb-4"
    @click="handleCardClick"
  >
    <div class="p-6">
      <!-- 上方区域：标题 + 分类 -->
      <div class="flex justify-between items-start mb-3">
        <h2
          class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
        >
          {{ cardInfo.title }}
        </h2>
        <span
          v-for="(category_name, index) in cardInfo.category_names"
          :key="category_name"
          @click.stop="handleCategoryClick(cardInfo.category_ids[index])"
          class="shrink-0 ml-4 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors duration-300"
        >
          {{ category_name }}
        </span>
      </div>

      <!-- 第二行：作者、创建时间、更新时间、标签 -->
      <div
        class="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400"
      >
        <!-- 作者 -->
        <div class="flex items-center">
          <IconUser class="w-4 h-4 mr-1" />
          <span>{{ cardInfo.author_name }}</span>
        </div>

        <span>&middot;</span>

        <!-- 创建时间 -->
        <div class="flex items-center">
          <IcOutlineCalendarMonth class="w-4 h-4 mr-1" />
          <time :datetime="createTimeFormatted">{{ createTimeFormatted }}</time>
        </div>

        <span>&middot;</span>

        <!-- 更新时间 -->
        <div class="flex items-center">
          <IcBaselineEditCalendar class="w-4 h-4 mr-1" />
          <time :datetime="updateTimeFormatted">{{ updateTimeFormatted }}</time>
        </div>

        <!-- 标签（带条件渲染，包括前面的分隔符） -->
        <template v-if="hasTags">
          <span>&middot;</span>
          <div class="flex items-center flex-wrap gap-1">
            <IconTag class="w-4 h-4 mr-1" />
            <div class="flex flex-wrap gap-1">
              <span
                v-for="tag in cardInfo.tag_names"
                :key="tag"
                class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- 摘要 -->
      <p class="text-gray-600 dark:text-gray-400 text-base line-clamp-3 mb-4">
        {{ displaySummary }}
      </p>

      <!-- 底部：浏览 & 点赞 -->
      <div
        class="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"
      >
        <div></div>
        <!-- 左侧留空 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <IconEye class="w-5 h-5 mr-1" />
            <span>{{ cardInfo.view_count }}</span>
          </div>
          <div class="flex items-center">
            <IconLike class="w-5 h-5 mr-1" />
            <span>{{ cardInfo.like_count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { dayjs } from "element-plus";

// 图标：使用 iconify，按需引入
import IconUser from "~icons/heroicons/user-20-solid";
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

const displaySummary = computed(() => {
  return (
    props.cardInfo.summary ||
    "这篇文章没有摘要，但内容一定很精彩！快点进去看看吧~"
  );
});

const hasTags = computed(() => {
  return (
    Array.isArray(props.cardInfo.tag_names) &&
    props.cardInfo.tag_names.length > 0
  );
});

// 日期格式：YYYY-MM-DD HH:mm:ss
const formatDate = (date: string | Date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const createTimeFormatted = computed(() => {
  return formatDate(props.cardInfo.create_time);
});

const updateTimeFormatted = computed(() => {
  // 若未提供 update_time，则 fallback 到 create_time
  const updateTime = props.cardInfo.update_time ?? props.cardInfo.create_time;
  return formatDate(updateTime);
});

const handleCardClick = () => {
  router.push({
    path: "/article",
    query: {
      id: props.cardInfo.id,
    },
  });
};

const handleCategoryClick = (id: number | string) => {
  router.push({ path: "/category", query: { id: id } });
};
</script>

<style scoped lang="scss"></style>
