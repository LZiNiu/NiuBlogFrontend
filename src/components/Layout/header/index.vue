<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  useBreakpoints,
  breakpointsTailwind,
  useWindowScroll
} from '@vueuse/core'
import { routes } from '@/router/routes'
import { Icon } from '@iconify/vue'
// 引入 VueUse 的暗黑模式工具
import { useDark, useToggle } from '@vueuse/core'
// Icons
import IconMenu from '~icons/mdi/menu'
import IconChevronDown from '~icons/mdi/chevron-down'
import IconClose from '~icons/mdi/close'

// 引入图标 (Sun 和 Moon)
import IconSunny from '~icons/mdi/white-balance-sunny'
import IconMoon from '~icons/mdi/weather-night'

const router = useRouter()
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual('md')
const drawerVisible = ref(false)
// 3. 初始化暗黑模式逻辑
// useDark 会自动监听系统偏好，并在 localStorage 中持久化 'vueuse-color-scheme'
// 它还会自动给 html 标签添加 'dark' class
const isDark = useDark()
const toggleDark = useToggle(isDark)

// --- 新增：滚动监听逻辑 ---
const { y } = useWindowScroll()

// 计算属性：判断 Header 是否应该处于“透明沉浸模式”
// 条件：当前是首页 (/) 且 滚动距离小于 50px
const isTransparent = computed(() => {
  return route.path === '/' && y.value < 50
})

// --- 菜单数据生成 (保持不变) ---
interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
  isExternal?: boolean
}

const generateMenu = (routeList: any[]): MenuItem[] => {
  const menu: MenuItem[] = []
  routeList.forEach((r) => {
    if (r.meta?.hidden) return
    if (!r.meta?.title) return
    const item: MenuItem = {
      path: r.path,
      title: r.meta.title as string,
      icon: r.meta.icon as string
    }
    if (r.children && r.children.length > 0) {
      item.children = generateMenu(r.children)
    }
    menu.push(item)
  })
  return menu
}

const menuList = computed(() => {
  const routesMenu = generateMenu(routes)
  routesMenu.push({
    path: 'https://github.com/your-repo',
    title: 'Github',
    icon: 'mdi:github',
    isExternal: true
  })
  return routesMenu
})

const handleNavigation = (item: MenuItem) => {
  if (item.isExternal) {
    window.open(item.path, '_blank')
  } else {
    router.push(item.path)
    drawerVisible.value = false
  }
}

const isActive = (path: string) =>
  route.path === path || (path !== '/' && route.path.startsWith(path))

// --- 动态样式辅助函数 ---
// 获取文字颜色类：透明模式下纯白，普通模式下深灰
const getTextColorClass = (path?: string) => {
  if (isTransparent.value) {
    // 透明模式：全部白色，Active状态可能加粗或带点光泽
    return 'text-white hover:text-indigo-200'
  } else {
    // 普通模式：Active状态为主题色，否则深灰
    return path && isActive(path)
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400'
  }
}

// 下划线颜色
const getUnderlineClass = (path: string) => {
  if (isTransparent.value) {
    return 'bg-white' // 透明模式下，下划线也是白色
  }
  return 'bg-indigo-600' // 普通模式下，下划线是主题色
}
</script>

<template>
  <!-- 
    Header 容器样式动态切换：
    1. isTransparent (首页顶部): bg-transparent, 无边框, 无阴影, 无 blur
    2. !isTransparent (滚动后): 白色半透明, 毛玻璃, 边框, 阴影
  -->
  <header
    class="fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300 ease-in-out"
    :class="[
      isTransparent
        ? 'bg-transparent border-b border-transparent shadow-none backdrop-blur-none'
        : 'bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-md'
    ]"
  >
    <div
      class="container mx-auto px-4 h-full flex items-center justify-between relative"
    >
      <!-- Mobile Toggle -->
      <div
        v-if="!isDesktop"
        class="flex-none"
      >
        <button
          class="p-2 transition-colors"
          :class="
            isTransparent ? 'text-white' : 'text-slate-600 dark:text-slate-200'
          "
          @click="drawerVisible = true"
        >
          <IconMenu class="text-2xl" />
        </button>
      </div>

      <!-- Logo -->
      <div
        class="font-extrabold text-2xl tracking-wider cursor-pointer select-none transition-transform hover:scale-105"
        :class="[
          isDesktop
            ? ''
            : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        ]"
        @click="router.push('/')"
      >
        <!-- Logo 文字颜色处理：
             在 Banner 上如果为了极致清晰，可以强制纯白；
             或者保留渐变但加个白色文字阴影。这里我选择透明模式下纯白，显得更干净。
        -->
        <span
          class="bg-clip-text text-transparent bg-linear-to-r transition-all duration-300"
          :class="[
            isTransparent
              ? 'from-white to-white text-white drop-shadow-md'
              : 'from-indigo-600 to-purple-600'
          ]"
        >
          CattleBlog
        </span>
      </div>

      <!-- Desktop Nav -->
      <nav
        v-if="isDesktop"
        class="flex items-center gap-6"
      >
        <template
          v-for="item in menuList"
          :key="item.path"
        >
          <!-- Dropdown -->
          <el-dropdown
            v-if="item.children && item.children.length > 0"
            trigger="hover"
            popper-class="custom-dropdown"
          >
            <div
              class="relative group px-1 py-4 cursor-pointer flex items-center gap-1.5 transition-colors font-medium"
              :class="getTextColorClass(item.path)"
            >
              <Icon
                v-if="item.icon"
                :icon="item.icon"
                class="text-lg"
              />
              <span>{{ item.title }}</span>
              <IconChevronDown
                class="text-xs transition-transform group-hover:rotate-180 opacity-70"
              />

              <!-- Underline -->
              <span
                class="absolute bottom-3 left-1/2 h-0.5 rounded-full transition-all duration-300 -translate-x-1/2"
                :class="[
                  isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full',
                  getUnderlineClass(item.path)
                ]"
              ></span>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="sub in item.children"
                  :key="sub.path"
                  @click="handleNavigation(sub)"
                >
                  <div class="flex items-center gap-2">
                    <Icon
                      v-if="sub.icon"
                      :icon="sub.icon"
                    />
                    <span>{{ sub.title }}</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- Standard Link -->
          <div
            v-else
            class="relative group px-1 py-4 cursor-pointer flex items-center gap-1.5 transition-colors font-medium"
            :class="getTextColorClass(item.path)"
            @click="handleNavigation(item)"
          >
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              class="text-lg"
            />

            <span>{{ item.title }}</span>

            <span
              class="absolute bottom-3 left-1/2 h-0.5 rounded-full transition-all duration-300 -translate-x-1/2"
              :class="[
                isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full',
                getUnderlineClass(item.path)
              ]"
            ></span>
          </div>
        </template>
        <!-- === 新增：暗黑模式切换开关 === -->
        <!-- 容器：根据 isTransparent 调整边框颜色以适应 Banner -->
        <button
          class="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none border"
          :class="[
            isDark
              ? 'bg-slate-700 border-slate-600'
              : 'bg-slate-200 border-slate-300',
            isTransparent ? 'border-white/40 bg-black/20 backdrop-blur-sm' : ''
          ]"
          @click="toggleDark()"
        >
          <!-- 图标容器：绝对定位在轨道两侧 -->
          <div
            class="absolute inset-0 flex items-center justify-between px-1.5"
          >
            <!-- 太阳图标 (左) -->
            <IconSunny
              class="text-xs transition-colors duration-300"
              :class="isDark ? 'text-slate-500' : 'text-yellow-500'"
            />
            <!-- 月亮图标 (右) -->
            <IconMoon
              class="text-xs transition-colors duration-300"
              :class="isDark ? 'text-indigo-300' : 'text-slate-400'"
            />
          </div>

          <!-- 滑动圆球 -->
          <div
            class="absolute top-0.5 left-0.5 w-5.5 h-5.5 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center z-10"
            :class="isDark ? 'translate-x-7' : 'translate-x-0'"
          >
            <!-- 可选：在圆球里也可以显示一个小图标，或者留白 -->
          </div>
        </button>
      </nav>

      <div
        v-if="!isDesktop"
        class="w-8"
      ></div>
    </div>
  </header>

  <!-- Mobile Drawer (样式保持不变，因为抽屉弹出来是白底的) -->
  <el-drawer
    v-model="drawerVisible"
    direction="ltr"
    size="45%"
    :with-header="false"
    class="mobile-aside"
  >
    <div
      class="flex flex-col h-full p-6 space-y-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm"
    >
      <div class="flex items-center justify-between">
        <span
          class="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600"
        >
          CattleBlog
        </span>
        <button @click="drawerVisible = false">
          <IconClose class="text-2xl text-slate-500" />
        </button>
      </div>

      <div class="flex flex-col space-y-4">
        <template
          v-for="item in menuList"
          :key="item.path"
        >
          <div
            v-if="item.children"
            class="space-y-2"
          >
            <div
              class="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider"
            >
              <Icon
                v-if="item.icon"
                :icon="item.icon"
              />
              {{ item.title }}
            </div>
            <div
              class="pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-3 pt-1"
            >
              <div
                v-for="sub in item.children"
                class="flex items-center gap-2 text-slate-600 dark:text-slate-300"
                @click="handleNavigation(sub)"
              >
                <Icon
                  v-if="sub.icon"
                  :icon="sub.icon"
                />
                {{ sub.title }}
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex items-center gap-3 py-2 text-lg font-medium border-b border-slate-100 dark:border-slate-800 pb-3"
            :class="[
              isActive(item.path)
                ? 'text-indigo-600'
                : 'text-slate-600 dark:text-slate-300'
            ]"
            @click="handleNavigation(item)"
          >
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              class="text-xl"
            />
            {{ item.title }}
          </div>
        </template>
        <!-- === 新增：移动端暗黑模式切换 === -->
        <div
          class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
        >
          <span class="text-slate-600 dark:text-slate-300 font-medium">
            Appearance
          </span>
          <button
            class="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none border border-slate-300 dark:border-slate-600"
            @click="toggleDark()"
          >
            <div
              class="absolute inset-0 flex items-center justify-between px-1.5"
            >
              <IconSunny class="text-xs text-yellow-500 dark:text-slate-500" />
              <IconMoon class="text-xs text-slate-400 dark:text-indigo-300" />
            </div>
            <div
              class="absolute top-0.5 left-0.5 w-5.5 h-5.5 bg-white rounded-full shadow-sm transition-transform duration-300"
              :class="isDark ? 'translate-x-7' : 'translate-x-0'"
            ></div>
          </button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.mobile-aside :deep(.el-drawer__body) {
  padding: 0;
}
</style>