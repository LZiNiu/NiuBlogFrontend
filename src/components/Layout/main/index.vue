<template>
    <div class="main-container">
        <!-- Page Header -->
        <page-header></page-header>
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

</script>

<style scoped lang="scss">

.main-content-wrapper {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/home_bg.jpg');
    background-position: center;
}

/* #region添加路由切换进入动画 */
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