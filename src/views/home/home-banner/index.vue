<script setup lang="ts">
import bgimg from '@/assets/images/home_banner.jpg'
import { Icon } from '@iconify/vue'

// --- 打字机效果逻辑 (保持不变) ---
const typewriterText = ref('')
const phrases = [
  "Hello, I'm Cattle.",
  "Welcome to my technical blog.",
  "Exploring Vue, Vite, and Tailwind.",
  "Keep coding, keep learning."
]
let loopNum = 0
let isDeleting = false
let txt = ''
let timer: any = null

const tick = () => {
  const i = loopNum % phrases.length
  const fullTxt = phrases[i]
  
  if (isDeleting) {
    txt = fullTxt.substring(0, txt.length - 1)
  } else {
    txt = fullTxt.substring(0, txt.length + 1)
  }
  
  typewriterText.value = txt
  
  let typeSpeed = 150 - Math.random() * 100
  if (isDeleting) typeSpeed /= 2
  
  if (!isDeleting && txt === fullTxt) {
    typeSpeed = 2000
    isDeleting = true
  } else if (isDeleting && txt === '') {
    isDeleting = false
    loopNum++
    typeSpeed = 500
  }
  
  timer = setTimeout(tick, typeSpeed)
}

onMounted(() => {
  tick()
})

onUnmounted(() => {
  clearTimeout(timer)
})

// --- 向下滚动 ---
const scrollToContent = () => {
  const content = document.getElementById('content-start')
  if (content) {
    content.scrollIntoView({ behavior: 'smooth' })
  }
}

// --- 背景图片设置 ---
// 请在这里替换为你想要的图片URL
const bgImage = bgimg
</script>

<template>
  <div class="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-center items-center overflow-hidden text-white">
    
    <!-- 1. 背景图片层 -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105"
      :style="{ backgroundImage: `url(${bgImage})` }"
    ></div>

    <!-- 2. 黑色遮罩层 (用于提高文字对比度) -->
    <!-- bg-black/50 表示黑色 50% 透明度，你可以根据图片亮度调整这个数值，例如 bg-black/40 或 bg-black/60 -->
    <div class="absolute inset-0 bg-black/50 z-0"></div>

    <!-- 3. 内容区域 -->
    <div class="z-10 text-center space-y-6 px-4 mb-10">
      <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl animate-fade-in-up">
        Cattle Blog
      </h1>
      <div class="h-8 text-xl md:text-2xl font-mono text-gray-200 drop-shadow-md">
        {{ typewriterText }}<span class="animate-pulse ml-1">|</span>
      </div>
    </div>

    <!-- 向下滚动箭头 -->
    <div class="absolute bottom-24 z-10 animate-bounce cursor-pointer opacity-90 hover:opacity-100" @click="scrollToContent">
      <Icon icon="mdi:chevron-down" class="text-5xl drop-shadow-lg" />
    </div>

    <!-- 4. 动态波浪效果 -->
    <!-- 
      fill-slate-50: 必须与你的网页背景色(Layout背景)一致 
      dark:fill-slate-900: 暗黑模式下的背景色
    -->
    <div class="absolute bottom-0 left-0 w-full h-[15vh] min-h-[60px] z-20">
      <svg 
        class="waves w-full h-full" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 24 150 28" 
        preserveAspectRatio="none" 
        shape-rendering="auto"
      >
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <!-- 四层波浪，不同透明度、不同速度 -->
          <use xlink:href="#gentle-wave" x="48" y="0" class="fill-slate-50/70 dark:fill-slate-900/70 animate-wave-1" />
          <use xlink:href="#gentle-wave" x="48" y="3" class="fill-slate-50/50 dark:fill-slate-900/50 animate-wave-2" />
          <use xlink:href="#gentle-wave" x="48" y="5" class="fill-slate-50/30 dark:fill-slate-900/30 animate-wave-3" />
          <use xlink:href="#gentle-wave" x="48" y="7" class="fill-slate-50 dark:fill-slate-900 animate-wave-4" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* 文字进入动画 */
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- 动态波浪 CSS 动画 --- */
/* 
   核心原理：让 wave path 水平无限移动。
   通过给不同的 use 标签设置不同的 duration (时长) 和 delay (延迟)，
   制造出波浪起伏错落的视觉效果。
*/
.animate-wave-1 { animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite; }
.animate-wave-2 { animation: move-forever 20s cubic-bezier(.55,.5,.45,.5) infinite; }
.animate-wave-3 { animation: move-forever 13s cubic-bezier(.55,.5,.45,.5) infinite; }
.animate-wave-4 { animation: move-forever 10s cubic-bezier(.55,.5,.45,.5) infinite; }

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/* 移动端优化：减少波浪高度 */
@media (max-width: 768px) {
  .waves {
    height: 60px;
  }
}
</style>