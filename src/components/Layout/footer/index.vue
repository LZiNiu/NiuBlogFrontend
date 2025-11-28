<!-- src/layout/footer/index.vue -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()

// 站点配置
const siteConfig = {
  author: 'Cattle',
  icp: 'ICP备xxxxx号',
  icpLink: 'https://beian.miit.gov.cn/',
  socials: [
    { icon: 'mdi:github', url: 'https://github.com/your-github' },
    { icon: 'mdi:email-outline', url: 'mailto:your-email@example.com' },
  ]
}

// 技术栈配置 (带链接和特定图标)
const techStack = [
  { name: 'Vue.js', icon: 'logos:vue', url: 'https://vuejs.org/' },
  { name: 'Vite', icon: 'devicon:vitejs', url: 'https://vitejs.dev/' },
  { name: 'Element Plus', icon: 'logos:element', url: 'https://element-plus.org/' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon', url: 'https://tailwindcss.com/' },
  { name: 'Pinia', icon: 'logos:pinia', url: 'https://pinia.vuejs.org/' },
]
</script>

<template>
  <footer class="w-full mt-auto relative z-10">
    <div class="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-colors duration-300">
      
      <div class="container mx-auto px-4 pt-10 pb-8">
        <!-- 上部分：三列布局 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <!-- Col 1: 品牌与简介 -->
          <div class="space-y-4 text-center md:text-left">
            <h2 class="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
              CattleBlog
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              记录技术折腾之路，分享前端开发经验。<br>
              Keep coding, keep learning.
            </p>
            <div class="flex justify-center md:justify-start gap-4">
              <a 
                v-for="item in siteConfig.socials" 
                :key="item.icon" 
                :href="item.url" 
                target="_blank"
                class="text-slate-400 hover:text-indigo-500 transition-colors text-xl"
              >
                <Icon :icon="item.icon" />
              </a>
            </div>
          </div>

          <!-- Col 2: 快速导航 -->
          <div class="flex flex-col items-center md:items-start space-y-3">
            <h3 class="font-bold text-slate-700 dark:text-slate-200">发现</h3>
            <router-link to="/" class="text-sm text-slate-500 hover:text-indigo-500 transition-colors">首页</router-link>
            <router-link to="/category" class="text-sm text-slate-500 hover:text-indigo-500 transition-colors">分类</router-link>
            <router-link to="/timeline" class="text-sm text-slate-500 hover:text-indigo-500 transition-colors">时间线</router-link>
          </div>

          <!-- Col 3: 技术栈 (已修改为可点击图标) -->
          <div class="flex flex-col items-center md:items-end space-y-3">
            <h3 class="font-bold text-slate-700 dark:text-slate-200">Powered By</h3>
            <div class="flex gap-4 text-2xl text-slate-400 items-center">
              <a 
                v-for="tech in techStack" 
                :key="tech.name"
                :href="tech.url"
                target="_blank"
                :title="tech.name"
                class="hover:scale-110 transition-transform opacity-80 hover:opacity-100 duration-300"
              >
                <Icon :icon="tech.icon" />
              </a>
            </div>
            <p class="text-xs text-slate-400 mt-2">
              Designed & Built with ❤️
            </p>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="border-t border-slate-200/50 dark:border-slate-700/50 my-6"></div>

        <!-- 下部分：Copyright & ICP (已修改为居中) -->
        <!-- justify-center: 整体居中 -->
        <!-- md:flex-row: 桌面端横向排列 -->
        <!-- gap-2 md:gap-6: 调整间距 -->
        <div class="flex flex-col md:flex-row justify-center items-center text-xs text-slate-500 dark:text-slate-400 gap-2 md:gap-6">
          
          <!-- Copyright -->
          <div class="text-center">
            &copy; {{ currentYear }} <span class="font-medium text-slate-700 dark:text-slate-300">{{ siteConfig.author }}</span>. All Rights Reserved.
          </div>

          <!-- ICP 备案号 -->
          <div class="flex items-center gap-1.5 group">
            <Icon icon="mdi:shield-check-outline" class="group-hover:text-indigo-500" />
            <a 
              :href="siteConfig.icpLink" 
              target="_blank" 
              class="hover:text-indigo-500 hover:underline transition-colors"
            >
              {{ siteConfig.icp }}
            </a>
          </div>

        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 
  添加了 grayscale (灰度) -> hover:grayscale-0 的效果
  这样未悬浮时图标不会太花哨，悬浮时恢复原色，视觉体验更好
*/
</style>