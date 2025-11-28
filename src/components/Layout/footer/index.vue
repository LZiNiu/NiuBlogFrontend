<template>
  <footer class="footer-container">
    <div class="content-wrapper">
      <!-- 技术栈列表 -->
      <div class="tech-stack-list">
        <a
          v-for="tech in techStack"
          :key="tech.name"
          :href="tech.url"
          target="_blank"
          rel="noopener noreferrer"
          class="tech-item group"
        >
          <component
            :is="tech.icon.value"
            class="tech-icon"
            :class="tech.customClass"
          />
          <span class="tech-name">{{ tech.name }}</span>
        </a>
      </div>

      <!-- 版权信息 -->
      <div class="copyright-info">
        &copy; {{ new Date().getFullYear() }} Cattle Blog. All Rights Reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";

import DeviconVuejs from "~icons/devicon/vuejs";
import DeviconVitejs from "~icons/devicon/vitejs";
import LogosTailwindcssIcon from "~icons/logos/tailwindcss-icon";
import LogosPinia from "~icons/logos/pinia";

// 使用函数式组件兼容 iconfont
const IconElementPlus = () => h("i", { class: "iconfont icon-element-plus" });

const techStack = [
  {
    name: "Vue.js",
    icon: shallowRef(DeviconVuejs),
    url: "https://vuejs.org/",
    customClass: "text-[#4FC08D]",
  },
  {
    name: "Vite",
    icon: shallowRef(DeviconVitejs),
    url: "https://vitejs.dev/",
    customClass: "text-[#646CFF]",
  },
  {
    name: "Element Plus",
    icon: shallowRef(IconElementPlus),
    url: "https://element-plus.org/",
    customClass: "text-[#2F92F6]",
  },
  {
    name: "Tailwind CSS",
    icon: shallowRef(LogosTailwindcssIcon),
    url: "https://tailwindcss.com/",
  },
  {
    name: "Pinia",
    icon: shallowRef(LogosPinia),
    url: "https://pinia.vuejs.org/",
  },
];
</script>

<style scoped lang="scss">
.footer-container {
  padding: 1.5rem 1rem;
  /* 减少上下内边距 */
  text-align: center;
  color: theme("colors.gray.600");
}

.content-wrapper {
  max-width: 80%;
  margin: 0 auto;
}

.tech-stack-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  /* 缩小间距 */
  margin-bottom: 1rem;
  /* 减少与版权信息的间距 */
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: theme("colors.gray.500");
  transition: all 0.25s ease;

  &:hover {
    color: theme("colors.gray.900");
    transform: translateY(-3px);
    /* 微调动效 */
  }
}

.tech-icon {
  font-size: 2rem;
  /* 默认图标大小 */
  margin-bottom: 0.4rem;
  width: 2rem;
  height: 2rem;
}

.tech-name {
  font-size: 0.8125rem;
  /* ~13px */
  font-weight: 500;
}

.copyright-info {
  font-size: 0.8125rem;
  color: theme("colors.gray.500");
}

/* 响应式：中等屏幕（平板） */
@media (max-width: 768px) {
  .tech-icon {
    font-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .tech-name {
    font-size: 0.75rem;
    /* 12px */
  }

  .tech-stack-list {
    gap: 1rem;
  }
}

/* 响应式：小屏（手机） */
@media (max-width: 480px) {
  .footer-container {
    padding: 1.25rem 0.75rem;
  }

  .content-wrapper {
    max-width: 90%;
  }

  .tech-icon {
    font-size: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
  }

  .tech-name {
    font-size: 0.7rem;
  }

  .tech-stack-list {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .copyright-info {
    font-size: 0.75rem;
  }
}
</style>
