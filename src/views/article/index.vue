<template>
    <div class="article-container mx-auto max-w-[90vw]">
        <el-row :gutter="15">
            <el-col :span="18">
                <el-card class="my-[2.25rem] mx-auto">
                    <article class="content-area box-content px-[0.8rem]">
                        <MdPreview :id="id" :modelValue="md_state.article_text" :preview-theme="md_state.preview_theme"/>
                    </article>
                </el-card>
            </el-col>
            <el-col :span="5">
                <el-affix :offset="30">
                    <el-card class="my-[2.25rem]">
                        <nav class="article-outline my-[.9375rem]">
                            <MdCatalog :editorId="id" :scrollElement="scrollElement" />
                        </nav>
                    </el-card>
                </el-affix>
                
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { getArticle } from '@/api/article';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
const id = 'preview-only';
const md_state = reactive({
    article_text: "# 测试标题\n通常我们的项目里都会封装axios 而比较重要的则是如何拦截axios的返回值 对返回值进行过滤后 再返回给我们的请求方法 这样的好处是可以对返回值进行一次预处理 或者是全局处理等\n\n而最近我在使用项目里二次封装的axios时 遇到了一个问题 代码如下\n```js\n// 添加响应拦截器\nhttp.interceptors.response.use(\n  function (response) {\n    return response.data;\n  },\n  function (error) {\n    return Promise.reject(error);\n  }\n);\n```\n\n上面是简化过的代码 就是在进行响应拦截时 我们遇到正常的请求 是直接返回 response.data 从而我们可以在 .then 回调里拿到返回的数据 但是当后端报错了 走 error 回调的时候 我们返回的是 一个Premise.rejcet(error) 我们无法通过.then获取到返回的数据\n有这样一个场景 如果我们是点击保存的时候 给按钮增加了一个loading效果 那我们怎么知道后端报错了 然后关闭loading呢 我去 MDN官方文档上看了Promise的使用方法 [Promise.reject](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) 原来使用 .catch方法就可以捕获到reject返回的错误 一直没有处理过类似的问题 所以一直不知道这个使用方式 说起来挺尴尬的 公司里大部分人都不知道可以这样 \n\n其实后端报错不应该返回 status = 500 因为那种保存报错不是 服务器/后端代码 的错误 而是后端在校验数据时抛出的错误 后端图方便 直接抛的是全局异常 并没有定义规范的 code 和错误信息去抛出 而是直接暴力抛出全局异常 这样的异常http状态是 500 对前端非常不友好 因为 我们需要去 .catch 才能捕获到异常 \n而如果接口返回 http状态是 200 且定义了 错误 code 和错误信息 我们只需要在 .then 方法里去判断code即可 \n\n实际上 http 状态是 500 这种错误应该是服务端代码写的有问题 正常的错误提示不应该用 500 的状态 应该使用错误code 和提示信息 不过能学习到 promise.catch方法还是挺开心的\n",
    preview_theme: 'vuepress'
});
const scrollElement = document.body;

const route = useRoute();
const articleId = +(route.query.articleId || -1);
let article_meta_info = {};
onMounted(() => {
    console.log(articleId);
    fetchArticle();
});
// 获取文章数据
const fetchArticle = async () => {
    try {
        if (articleId === -1) {
            console.log('文章id类型有误');
            return;
        }
        const response = await getArticle(articleId);
        md_state.article_text = response.data.content;
        const{content, ...restfield} = response.data;
        article_meta_info = {...restfield};
        console.log(article_meta_info);
    } catch (error) {
        console.error("获取文章数据失败:", error);
    }
};

</script>

<style lang="scss">

.article-container .el-card {
    border-radius: 10px;
}

</style>

<style scoped lang="scss">


</style>