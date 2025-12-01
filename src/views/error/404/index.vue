<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 px-4">
    
    <!-- SVG 插画 -->
    <div class="w-full max-w-md animate-float">
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" /> <!-- indigo-500 -->
            <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" /> <!-- purple-500 -->
          </linearGradient>
        </defs>
        <!-- 简单的 404 抽象图形 -->
        <circle cx="200" cy="150" r="100" fill="url(#grad1)" opacity="0.1" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" font-weight="bold" fill="url(#grad1)" class="select-none">
          404
        </text>
        <path d="M140,220 Q200,260 260,220" fill="none" stroke="#64748b" stroke-width="5" stroke-linecap="round" class="dark:stroke-slate-400" />
        <circle cx="150" cy="130" r="10" class="fill-slate-600 dark:fill-slate-300 animate-blink" />
        <circle cx="250" cy="130" r="10" class="fill-slate-600 dark:fill-slate-300 animate-blink" />
      </svg>
    </div>

    <!-- 文字提示 -->
    <div class="text-center mt-8 space-y-4">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
        Oops! Page Not Found
      </h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
    </div>

    <!-- 按钮 -->
    <button 
      @click="router.push('/')"
      class="mt-10 px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300"
    >
      Go Back Home
    </button>
  </div>
</template>

<style scoped lang="scss">
/* 浮动动画 */
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 眨眼动画 */
.animate-blink {
  animation: blink 4s infinite;
}
@keyframes blink {
  0%, 96%, 100% { transform: scaleY(1); }
  98% { transform: scaleY(0.1); }
}
</style>