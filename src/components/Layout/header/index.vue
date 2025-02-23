<template>
    <div ref="headerRef" :class="['header-container', headerClass]">
        <div class="left">
            <div class="header-avatar-wrapper">
                <span class="site-title">Cattle Blog</span>
            </div>
        </div>
        <div class="right">
            <el-menu :default-active="$route.path" mode="horizontal" :ellipsis="false" @select="handleSelect">
                <div v-for="menu in menuList" :key="menu.path">
                    <el-sub-menu v-if="menu.children.length > 0" :index="menu.path">
                        <i :class="['iconfont', menu.icon, 'mr-1']"></i>
                        <template #title>{{ menu.title }}</template>
                        <el-menu-item v-for="submenu in menu.children" :index="submenu.path">
                            <i :class="['iconfont', submenu.icon]"></i>
                            <span class="ml-1">{{ submenu.title }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="menu.path">
                        <i :class="['iconfont', menu.icon]"></i>
                        <span class="ml-1">{{ menu.title }}</span>
                    </el-menu-item>
                </div>
            </el-menu>

        </div>
    </div>

</template>

<script setup lang="ts">

import { debounce } from '@/utils/tool';

const router = useRouter();

const menuList = [
    {
        title: '首页',
        path: '/home',
        icon: 'icon-shouye',
        children: [],
    },
    {
        title: '关于',
        path: '/about',
        icon: 'icon-about', // 假设有一个名为 icon-about 的图标
        children: [],
    },
    {
        title: '时间轴',
        path: '/timeline',
        icon: 'icon-clock', // 假设有一个名为 icon-about 的图标
        children: [],
    },
    {
        title: '服务',
        path: '/services',
        icon: 'icon-services', // 假设有一个名为 icon-services 的图标
        children: [
            {
                title: '技术支持',
                path: '/services/tech-support',
                icon: 'icon-tech-support', // 假设有一个名为 icon-tech-support 的图标

            },
            {
                title: '咨询服务',
                path: '/services/consulting',
                icon: 'icon-consulting', // 假设有一个名为 icon-consulting 的图标

            },
        ],
    },
]

let lastScrollTop = 0; // 用于记录上一次的滚动位置
let SCROLL_THRESHOLD = 0; // 滚动阈值，单位：px
const headerRef = ref<HTMLElement | null>(null); // 用于获取 header-container 的 DOM 元素

// 使用 debounce 包装 handleScroll
const debouncedHandleScroll = debounce(handleScroll, 50);
onMounted(() => {

    // 获取 header 高度数值
    if (headerRef.value) {
        SCROLL_THRESHOLD = headerRef.value.clientHeight * 3;
    }
    console.log('Header height:', SCROLL_THRESHOLD);
    window.addEventListener('scroll', debouncedHandleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', debouncedHandleScroll);
});


let headerClass = ref('show-header');
function handleScroll() {

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    console.log('Scroll Top:', scrollTop);
    if (scrollTop === 0) {
        // 页面在顶部
        headerClass.value = 'show-header top';
    } else if (scrollTop < SCROLL_THRESHOLD) {
        // 顶部附近（小于滚动阈值）
        if (scrollTop <= lastScrollTop) {
            // 向上滚动
            headerClass.value = 'show-header top';
        }
        else {
            // 向下滚动
            headerClass.value = 'hide-header top'
        }
    } else {
        // 页面滚动后
        if (scrollTop > lastScrollTop) {
            // 向下滚动
            headerClass.value = 'hide-header scrolled';
        } else {
            // 向上滚动
            headerClass.value = 'show-header scrolled';
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

}

function handleSelect(path: string) {
    console.log(path);
    if (!path) return;
    router.push(path)
}
</script>

<style scoped lang="scss">
.iconfont {
    font-size: large;
}


.header-container {
    display: flex;
    justify-content: space-between;
    transition: all 0.5s ease; // 添加过渡效果

    .left {
        width: 20%;
        height: 100%;
        display: flex;
        align-items: center;

        .site-title {
            font-weight: bolder;
        }
    }

    .right {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end;
        transition: 1s all linear;
        height: 100%;

    }

}

.header-container.top {
    background-color: transparent;
    /* 透明背景 */
    box-shadow: none;

    /* 移除阴影 */
    .site-title {
        color: white;
    }
}

.header-container.scrolled {
    background-color: rgba(255, 255, 255, .7);

    .site-title {
        color: black;
        /* 字体黑色 */
    }
}


.hide-header {
    animation-name: hideHeader;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
}

.show-header {
    animation-name: showHeader;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
}

@keyframes showHeader {
    0% {
        transform: translateY(calc(-1 * var(--header-container-h)));
    }

    100% {
        transform: translateY(0px);

    }
}

@keyframes hideHeader {
    0% {
        transform: translateY(0px);
    }

    100% {
        transform: translateY(calc(-1 * var(--header-container-h)));
    }
}
</style>