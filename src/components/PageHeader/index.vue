<template>
    <div id="page-header" class="page-header">
        <div id="home-banner" class="home-banner" v-if="$route.path == '/home'">
            
            <div class="banner-content">
                <span class="banner-title text-3xl">
                    Cattle Blog
                </span>
                <span class="banner-saying text-xl">
                    Hello World!!!
                </span>
            </div>
            <div class="scroll-down" @click="scrollToHomeContent">
                <CiChevronDown class="scroll-arrow-icon"></CiChevronDown>
            </div>
        </div>
        <div class="article-banner z-[2]" v-else-if="$route.path == '/article'">
            <div class="banner-content">
                <span class="banner-title">
                    {{ $route.query.articleId }}
                </span>
            </div>
        </div>

        <div class="other z-[2]" v-else>
            <div class="banner-content">
                <span class="banner-title">
                    {{ $route.name }}
                </span>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import CiChevronDown from '~icons/ci/chevron-down';


// let showScrollDown = ref(true);
function scrollToHomeContent() {
    // 获取 page-header 元素
    const PageHeader = document.getElementById('page-header');
    if (!PageHeader) return;

    // 获取 page-header 的高度
    const headerHeight = PageHeader.clientHeight;

    // 滚动到 headerHeight 的位置，使 page-header 完全消失于视口
    window.scrollTo({
        top: headerHeight,
        behavior: 'smooth', // 平滑滚动
    });
}

</script>

<style lang="scss" scoped>

.page-header {
    width: 100%;
    overflow: hidden;
    position: relative;
    background-image: url('@/assets/images/home_banner.jpg');
    // background-attachment: fixed;
    background-size: cover;
    background-position: center;
    
}
/* 选中 #page-header 下的所有子 div，但排除 .home-banner */
#page-header > div:not(.home-banner) .banner-title {
    letter-spacing: 1.25rem; /* 调整文字间距 */
    font-size: 2.1875rem;
}

/* 伪元素添加遮罩层 */
.page-header::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: var(--mask-color);
    z-index: 1;
}


.home-banner {
    width: 100%;
    height: 90vh;
    position: relative;
    z-index: 2;


    .scroll-down {
        position: absolute;
        bottom: 20px;
        left: 50%;
        color: white;
        font-size: larger;
        transform: translateX(-50%);
        cursor: pointer;
        .scroll-arrow-icon {
            font-size: 1.75rem;
            animation-name: scroll_arrow;
            animation-duration: 1.5s;
            animation-iteration-count: infinite;
        }
    }
}

@keyframes scroll_arrow {
    0%,
    100% {
        transform: translateY(0);
        opacity: 1;
    }
    50% {
        transform: translateY(16px);
        opacity: 0.5;
    }
}

.banner-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    .banner-title {
        font-weight: bold;
        display: block;
        text-align: center;
    }
    .banner-saying {
        display: block;
        text-align: center;
        
    }
}


.article-banner,
.other {
    width: 100%;
    height: 25rem;
    position: relative;
    overflow: hidden;
}

</style>