<script setup lang="ts">
import http from "@/utils/http";
import { Icon } from "@iconify/vue";

interface ProfileInfo {
  post_count: number
  tag_count: number
  category_count: number
}
const profile = ref({
  avatar_url:
    "https://ui-avatars.com/api/?name=Cattle+Blog&background=6366f1&color=fff&size=128",
  name: "Cattle",
  bio: "什么都会一点的developer",
  posts: 0,
  tags: 0,
  categories: 0,
  socials: [
    { icon: "mdi:github", url: "https://github.com" },
    { icon: "mdi:email", url: "mailto:test@test.com" },
  ],
});

const fetchProfileInfo = async () => {
  const res = await http.get<ProfileInfo>("/profile");
  profile.value.posts = res.post_count;
  profile.value.tags = res.tag_count;
  profile.value.categories = res.category_count;
};

onMounted(async ()=> {
  await fetchProfileInfo();
})
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md"
  >
    <!-- 头像与名称 -->
    <div class="flex flex-col items-center">
      <div class="relative w-24 h-24 mb-4 group cursor-pointer">
        <img
          :src="profile.avatar_url"
          alt="avatar"
          class="rounded-full w-full h-full object-cover ring-4 ring-indigo-50 dark:ring-slate-700 transition-transform group-hover:rotate-360 duration-700"
        />
        <div
          class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"
          title="Online"
        ></div>
      </div>
      <h2 class="text-xl font-bold text-slate-800 dark:text-white">
        {{ profile.name }}
      </h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
        {{ profile.bio }}
      </p>
    </div>

    <!-- 统计数据 -->
    <div
      class="flex justify-around mt-6 py-4 border-t border-slate-100 dark:border-slate-700"
    >
      <div class="text-center">
        <div class="text-lg font-bold text-slate-800 dark:text-slate-200">
          {{ profile.posts }}
        </div>
        <div class="text-xs text-slate-400 uppercase tracking-wider">文章</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-slate-800 dark:text-slate-200">
          {{ profile.tags }}
        </div>
        <div class="text-xs text-slate-400 uppercase tracking-wider">标签</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-slate-800 dark:text-slate-200">
          {{ profile.categories }}
        </div>
        <div class="text-xs text-slate-400 uppercase tracking-wider">分类</div>
      </div>
    </div>

    <!-- 社交链接 -->
    <div class="flex justify-center gap-4 mt-2">
      <a
        v-for="social in profile.socials"
        :key="social.icon"
        :href="social.url"
        target="_blank"
        class="p-2 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-500 hover:text-white transition-colors"
      >
        <Icon :icon="social.icon" class="text-xl" />
      </a>
    </div>

    <!-- 按钮 -->
    <button
      class="w-full mt-6 py-2 bg-linear-to-r from-indigo-500 to-violet-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95"
    >
      Follow Me
    </button>
  </div>
</template>
