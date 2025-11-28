<template>
  <div
    class="min-h-screen flex flex-col bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"
  >
    <BlogHeader />
    <!-- 主体内容 -->
    <main class="grow container mx-auto mt-16 relative">
      <!-- 路由视图 + 过渡动画 -->
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade-slide'" mode="out-in">
          <!-- 这里的 key 确保切换路由时组件重新渲染触发动画 -->
          <div :key="route.path">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <BlogFooter />
  </div>
</template>

<script setup>
import BlogHeader from "./header/index.vue";
import BlogFooter from "./footer/index.vue";
// 获取当前路由对象，用于判断动画类型
const route = useRoute();
</script>

<style scoped lang="scss">
/* --- 动画 1: Fade Slide (上浮淡入) --- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* --- 动画 2: Pure Fade (纯淡入淡出) --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- 动画 3: Zoom Fade (微缩放) --- */
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); /* 略带回弹 */
}
.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
