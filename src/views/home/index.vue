<template>
    <div id="home-center-box" class="home-center-box mx-auto">
        <el-row :gutter="20" class="h-[100%]">
            <el-col :span="16" class="article-list el-col-full">
                <Transition name="fade" mode="out-in">
                    <!-- 利用key attribute 来使过渡触发 -->
                    <div :key="currentPage">
                        <el-card class="h-[11.25rem]" v-for="article in paginatedArticles"
                            :key="article.id">
                            <RouterLink 
                            :to="{path:'/article', query: {articleId: article.title}}"
                            class="article-list-item flex">
                                <el-image class="article-image h-[100%] max-w-[35%]" :src="home_banner"
                                    fit="cover" :lazy="true"></el-image>
                                <div class="article-info ml-[1.5625rem]">
                                    <h3 class="article-title text-2xl">
                                        <router-link :to="{ path:'/article', query: {articleId: article.title}}">{{ article.title }}</router-link>
                                    </h3>
                                    <ul class="article-meta text-sm flex flex-wrap">
                                        
                                        <IcOutlineCalendarMonth class="text-base" />
                                        <li>{{ article.issuedate }}</li>

                                        <IcTwotoneFolderOpen class="text-base" />
                                        <li>
                                            <RouterLink :to="{path:'/category', query: {category: article.category}}">{{ article.category }}
                                            </RouterLink>
                                        </li>

                                        <QlementineIconsTag16 class="text-sm" />
                                        <li class="article-tag" v-for="tag in article.tags" :key="tag">{{ tag
                                        }}</li>

                                    </ul>
                                    <div class="article-desc text-ellipsis">
                                        {{ article.desc }}
                                    </div>
                                </div>
                            </RouterLink>
                        </el-card>
                    </div>
                </Transition>
                <div class="flex justify-center mt-8">
                    <el-pagination class="mb-10" 
                    background layout="prev, pager, next" 
                    :hide-on-single-page="true"
                    v-model:page-size="pageSize"
                    v-model:current-page="currentPage" 
                    :default-current-page="1" 
                    :total="testArticleList.length" />
                </div>
            </el-col>
            <el-col :span="7" class="el-col-0">
                <aside class="side-bar">
                    <div class="user-info-card min-h-[400px]">
                        <div class="user-avatar text-center bg-[url(src/assets/images/test1.jpg)] bg-center bg-cover bg-clip-border">
                            <el-avatar 
                            :src="user_avatar" 
                            fit="cover" 
                            :size="140"></el-avatar>
                        </div>
                        <div class="user-info text-center">
                            <h3 class="user-name text-2xl">Cattle</h3>
                            <p class="user-desc">这个人很懒,什么也没有留下</p>
                            <div class="user-data">
                                <span>
                                    <div class="data-name">
                                        文章
                                    </div>
                                    <div class="data-value">
                                        {{ testArticleList.length }}
                                    </div>
                                </span>
                                <span>
                                    <div class="data-name">
                                        浏览量
                                    </div>
                                    <div class="data-value">
                                        {{ testArticleList.length }}
                                    </div>
                                </span>
                                <span>
                                    <div class="data-name">
                                        分类
                                    </div>
                                    <div class="data-value">
                                        {{ testArticleList.length }}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div class="related-link min-h-[5rem] text-center">
                            <a href="#" class="card-info-btn inline-block text-center w-[60%] 
                            mt-3 rounded-lg bg-[#49b1f5]">
                                <i class="iconfont icon-GitHub mr-1.5"></i>GitHub
                            </a>
                        </div>
                    </div>
                </aside>
            </el-col>
        </el-row>


    </div>
</template>

<script setup lang="ts">
import home_banner from '@/assets/images/home_banner.jpg';
import IcTwotoneFolderOpen from '~icons/ic/twotone-folder-open';
import IcOutlineCalendarMonth from '~icons/ic/outline-calendar-month';
import QlementineIconsTag16 from '~icons/qlementine-icons/tag-16';
import user_avatar from '@/assets/images/user_avatar.jpg';

const testArticleList = [
    {
        id: 1,
        title: 'Butterfly 文档(一) 快速开始',
        issuedate: '2020-05-28',
        category: '博客部署',
        tags: ['Vue', 'React', 'Flutter'],
        desc: '新功能 js 加载完才显示聊天按钮 移除 Pangu 添加结构化数据支持 添加 avif 到支持的图片格式列表 更新'
    }
];

testArticleList.push(testArticleList[0]);
testArticleList.push(testArticleList[0]);
testArticleList.push(testArticleList[0]);
testArticleList.push(testArticleList[0]);
testArticleList.push(testArticleList[0]);
testArticleList.push(testArticleList[0]);

let currentPage = ref(1);
const pageSize = 5;
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return testArticleList.slice(start, start + pageSize);
});


</script>

<style scoped lang="scss">
.home-center-box {
    width: 100%;

    .el-card {
        transition: all 0.2s;
        border-radius: 14px;
        margin: 0 auto;
        margin-bottom: var(--home-card-spacing-pc);
    }
    .el-card:hover {
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
    }
}


/* #region切换分页时的过渡动画样式 */
.fade-enter-active {
    animation: slide-fade-in 0.5s ease-out; // 进入动画
}

.fade-leave-active {
    animation: slide-fade-out 0.5s ease-in; // 离开动画
}

/* 进入动画的关键帧 */
@keyframes slide-fade-in {
    0% {
        opacity: 0;
        transform: translateY(3.125rem);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 离开动画的关键帧 */
@keyframes slide-fade-out {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(3.125rem);
    }
}
/* #endregion切换分页时的过渡动画样式 */ 

/* #region主页面左侧样式 */
.article-list {
    margin-top: 3.125rem;

    .article-list-item {
        width: 100%;
        height: 100%;
        cursor: default;

        .article-info {
            height: 100%;
            flex: 1;

            .article-title {
                margin-top: .75rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1; /* 最多显示1行 */
                line-clamp: 1; //去除警告
                
            }
            .article-title > a {
                transition: all 0.2s;
            }
            .article-title a:hover {
                color: #49b1f5;
            }
            .article-meta {
                margin-top: 15px;
                margin-bottom: 10px;
            }
            .article-meta > li {
                margin-left: .25rem; // 控制与图标的距离
                
                a {
                    transition: all 0.2s;
                }
                a:hover {
                    color: #49b1f5;
                    text-decoration: underline solid #49b1f5;
                }

                // 分隔符
                &:not(:last-child):not(.article-tag) {
                    &::after {
                        content: '';
                        border-left: 2px solid gray;
                        margin-left: .25rem;
                        margin-right: .375rem;
                    }
                }

                // 标签文字顿号
                &.article-tag {
                    // 选择第一个list-item外的list-item
                    &~ li.article-tag {
                        margin: 0;
                    }
                    // 选择最后一个list-item外的list-item
                    &:not(:last-child) {
                        &::after {
                            content: '、';
                        }
                    }
                    
                }
            }
            

            .article-desc {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2; /* 最多显示两行 */
                line-clamp: 2; //去除警告
            }
        }
    }
    
}
/* #endregion */

/* #region主页面右侧样式 */

@media screen and (max-width: 768px) {
    .el-col-0 {
        display: none;
        flex: 0 0 0%;
        max-width: 0;
    }
    .article-list.el-col-full {
        
        flex: 0 0 100%;
        max-width: 100%;
        .el-card {
            max-width: 90%;
            margin-bottom: var(--home-card-spacing-mobile);
        }
    }
}
@media screen and (min-width: 768px) {
    .home-center-box {
        max-width: 1280px;
    }
}
.side-bar {
    width: 100%;
    height: 100%;
    margin-left: .9375rem;
}
.user-info-card {
    width: 90%;
    margin-top: 3.125rem;
    padding: 10px;
    background-color: var(--el-fill-color-blank);
    border-radius: 14px;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    
    .el-avatar {
        margin-top: 1.875rem;
        margin-bottom: 2.5rem;
    }

    .user-info {
        
        .user-data {
            margin-top: 10px;
            display: flex;
            justify-content: space-evenly;
            & > span {
                display: block;
            }
        }
    }
    
    .related-link {
        
        .card-info-btn {
            font-size: 17px;
            transition: background-color 0.3s;
            cursor: pointer;
        }
        .card-info-btn:hover {
            background-color: #ff7242;
        }

        .iconfont {
            font-size: 20px;
        }
    }
}
/* #endregion */

</style>