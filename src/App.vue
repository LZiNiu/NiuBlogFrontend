<script setup lang="ts">
import Layout from '@/components/Layout/index.vue'
const route = useRoute()
</script>

<template>
  <Layout v-if="route.meta.layout !== 'empty'"/>
  <RouterView v-else/>
</template>

<style scoped>

</style>
