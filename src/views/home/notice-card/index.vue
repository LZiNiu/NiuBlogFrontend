<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mt-6"
  >
    <div
      class="flex items-center gap-2 mb-4 text-slate-800 dark:text-white font-bold border-l-4 border-indigo-500 pl-3"
    >
      <Icon
        icon="mdi:bullhorn-outline"
        class="text-xl text-indigo-500"
      />
      <span>Announcement</span>
    </div>
    <div
      class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg"
    >
      欢迎来到 CattleBlog！这里记录了 Vue3、TypeScript 和 Tailwind CSS
      的重构之路。
      <br />
      <br />
      🚀 项目持续更新中...
    </div>
  </div>
</template>
