<template>
    <!-- <transition name="header-fade" mode="out-in" appear> -->
        <div id="page-header" class="page-header" :style="{ backgroundImage: `url(${page_bg})` }">
            <div id="home-banner" class="home-banner" v-if="$route.path == '/home'">
                
                <div class="banner-content">
                    <span class="banner-title text-3xl">
                        Cattle Blog
                    </span>
                    <span class="banner-saying text-xl">
                        {{ currentText }}
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
    <!-- </transition> -->
    
</template>

<script setup lang="ts">
import CiChevronDown from '~icons/ci/chevron-down';

const route = useRoute();
// 背景图路径
const page_bg = ref(`'src/assets/images/${route.path}_banner.jpg'`);

// 过渡转移到layout main中实现
// const shouldAnimate = ref(true);

watch(() => route.path, (newPath) => {

    // 更新背景图
    page_bg.value = `'src/assets/images/${route.path}_banner.jpg'`;
    if (newPath === '/home') {
        // 如果路由为 /home，启动打字机效果
        if (!typingInterval) {
            typingInterval = setInterval(typeWriter, 200);
        }
    } else {
        // 如果路由不是 /home，清理打字机效果
        if (typingInterval) {
            clearInterval(typingInterval); // 调用清理函数
            typingInterval = null;
        }
        currentText.value = ''; // 清空文本
    }
    // 方案一: v-show同时触发过渡效果和文字动画,同时避免v-if重新渲染
    // 隐藏组件以触发动画
    // shouldAnimate.value = false;
    // // 延迟后显示组件,同时触发文字动画以及pageheader过渡
    // setTimeout(() => {
    //     shouldAnimate.value = true;
    // }, 1000);
    
    // 方案二: 当使用v-if时才生效,若使用v-show可能会由于rAF执行时间过短造成动画无效,本身pageheader组件不复杂,重新渲染开销可以接受
    // 方案一在频繁切换时仅display的值迅速发生变化,但是可能由于DOM元素来不及重新渲染,动画可能无效,出现闪屏现象,故最终采用方案二
    // shouldAnimate.value = false;
    // // 使用 rAF 确保动画与 DOM 更新同步
    // requestAnimationFrame(() => {
    //     requestAnimationFrame(() => {
    //         shouldAnimate.value = true; // 显示组件
    //     });
    // });
});


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

const sayings = ['Hello World!!!', 'Welcome to Cattle Blog']; // 循环显示的文本
const currentText = ref(''); // 当前显示的文本
let currentIndex = 0; // 当前显示的文本索引
const isDeleting = ref(false); // 是否处于删除状态
let typingInterval: any = null; // 定时器引用
const typingSpeed = 200;
const deleteSpeed = 80;

// 打字机效果逻辑
const typeWriter = () => {
    // console.log("正在执行打字机效果!!!");
    const fullText = sayings[currentIndex]; // 获取当前完整文本
    const textLength = isDeleting.value ? currentText.value.length - 1 : currentText.value.length + 1;
    
    // 更新当前文本
    currentText.value = isDeleting.value
        ? fullText.substring(0, textLength)
        : fullText.substring(0, textLength);
    // 判断是否完成打字或删除
    if (!isDeleting.value && currentText.value === fullText) {
        setTimeout(() => {
            isDeleting.value = true; // 开始删除
        }, 1000); // 停留 1 秒后开始删除
    } else if (isDeleting.value && currentText.value === '') {
        isDeleting.value = false; // 停止删除
        currentIndex = (currentIndex + 1) % sayings.length; // 切换到下一个文本
    }
};

watch(isDeleting, () => {
    if (isDeleting.value) {
        clearInterval(typingInterval)
        typingInterval = setInterval(typeWriter, deleteSpeed);
        console.log("加快了删除速度");
    }
    else {
        clearInterval(typingInterval)
        typingInterval = setInterval(typeWriter, typingSpeed);
        
    }
})

onMounted(() => {
    if (route.path === '/home')
        if (!typingInterval) {
            setTimeout(() =>{
                typingInterval = setInterval(typeWriter, 200);
            }, 1500); // 等标题动画1s结束后再开始打字
            
        }
});


onUnmounted(()=>{
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
        console.log("打字机已被清理!!!");
    }
})
</script>

<style lang="scss" scoped>

// .header-fade-enter-active {
//     transition: transform 0.5s ease;
// }
// .header-fade-enter-from  {
//     transform: translateY(-20px);
// }
// .header-fade-enter-to {
//     transform: translateY(0px);
// }

.page-header {
    width: 100%;
    overflow: hidden;
    position: relative;
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


/* #region页面头部图片中的文字样式 */
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
        animation: text_scale 1s;
    }
    .banner-saying {
        display: block;
        text-align: center;
        overflow: hidden;

        &::after {
            content: '';
            margin-left: 2px;
            border-left: 3px solid white;
            animation: blink_caret 0.75s infinite;
        }
    }
}

/* 光标闪烁动画 */
@keyframes blink_caret {
    from, to {
    border-color: transparent; /* 光标隐藏 */
    }
    50% {
    border-color: white; /* 光标显示 */
    }
}

@keyframes text_scale {
    0% {
        opacity: 0;
        transform: scale(0.7);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
/*#endregion */

.article-banner,
.other {
    width: 100%;
    height: 25rem;
    position: relative;
    overflow: hidden;
}

</style>