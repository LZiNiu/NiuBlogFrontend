<template>
    <div class="main-container">
        <!-- Page Header -->
        <transition name="header-fade" mode="out-in" appear>
            <div :key="$route.path">
                <page-header></page-header>
            </div>
        </transition>
        
        <!-- Main Content -->
        <div class="main-content-wrapper">
            <router-view v-slot="{ Component }">
                <transition name="content-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>

    </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader/index.vue';

// const isAnimate = ref(true);
// const route = useRoute();
// watch(()=>route.path, ()=>{
//     isAnimate.value = false;
//     console.log("isAnimate:", isAnimate.value);
//     nextTick(()=> {
//         isAnimate.value = true;
//         console.log("isAnimate:", isAnimate.value);
//     })
//     console.log("isAnimate11:", isAnimate.value);
// })

</script>

<style scoped lang="scss">

.main-content-wrapper {
    width: 100%;
    height: 100%;
    // background-image: url('@/assets/images/home_bg.jpg');
    // background-position: center;
}

/* #region添加路由切换进入动画 */

.header-fade-enter-active {
    transition: transform 0.5s ease;
    // animation: header_fade 0.5s;
}
.header-fade-enter-from  {
    transform: translateY(-20px);
}
.header-fade-enter-to {
    transform: translateY(0px);
}

// @keyframes header_fade {
//     0% {
//         transform: translateY(-20px);
//     }
//     100% {
//         transform: translateY(0px);
//     }
// }

.content-fade-enter-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}
.content-fade-enter-from  {
    opacity: 0;
    transform: translateY(20px);
}
.content-fade-enter-to {
    opacity: 1;
    transform: translateY(0px);
}
/* #endregion */
</style>