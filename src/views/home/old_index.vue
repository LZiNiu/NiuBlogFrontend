<template>
  <PageHeader />
  <div id="home-center-box" class="home-center-box mx-auto">
    <el-row :gutter="20" class="w-full">
      <el-col :span="16" class="article-list-container el-col-full mb-8">
        <ArticleCard
          v-for="(article, index) in articleCardList"
          :key="article.id"
          :card-info="article"
        />

        <div v-if="total_count > 0" class="flex justify-center mt-8">
          <el-pagination
            class="mb-10"
            background
            layout="prev, pager, next"
            :hide-on-single-page="true"
            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            :default-current-page="1"
            :total="total_count"
          />
        </div>
      </el-col>
      <el-col :span="8" class="el-col-hidden mb-8">
        <!-- <aside class="side-bar">
          <div class="user-info-card min-h-[400px]">
            <div
              class="user-avatar text-center bg-[url(src/assets/images/test1.jpg)] bg-center bg-cover bg-clip-border"
            >
              <el-avatar :src="user_avatar" fit="cover" :size="140"></el-avatar>
            </div>
            <div class="user-info text-center">
              <h3 class="user-name text-2xl">Cattle</h3>
              <p class="user-desc">这个人很懒,什么也没有留下</p>
              <div class="user-data">
                <span>
                  <div class="data-name">文章</div>
                  <div class="data-value">
                    {{ total_count }}
                  </div>
                </span>
                <span>
                  <div class="data-name">浏览量</div>
                  <div class="data-value">
                    1234
                  </div>
                </span>
              </div>
            </div>
            <div class="related-link min-h-20 text-center">
              <a
                href="#"
                class="card-info-btn inline-block text-center w-[60%] mt-3 rounded-lg bg-[#49b1f5]"
              >
                <i class="iconfont icon-GitHub mr-1.5"></i>GitHub
              </a>
            </div>
          </div>
        </aside> -->
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import user_avatar from "@/assets/images/user_avatar.jpg";
import PageHeader from "@/components/PageHeader/index.vue";
import { useArticleStore } from "@/stores/article";

// defineOptions({ name: "Home" });
const currentPage = ref(1);
const pageSize = 5;

const articleStore = useArticleStore();

const articleCardList: Ref<Api.ArticleCardInfoList> = ref([]);
const total_count = ref(0);
const fetchArticleCardInfo = async () => {
  try {
    // 获取当前页文章基础信息列表
    const data = await articleStore.fetchArticleList(
      currentPage.value,
      pageSize,
    ); // 更新文章列表
    if (data) {
      total_count.value = data.total; // 更新总条数
      articleCardList.value = data.records ? data.records : []; // 更新文章列表
    } else {
      console.log("未获取到文章数据");
    }
  } catch (error) {
    console.error("获取文章数据失败:", error);
  }
};

watch(currentPage, () => {
  // 检测页码变化, 重新获取文章列表
  fetchArticleCardInfo();
});

onMounted(() => {
  fetchArticleCardInfo();
});
</script>

<style scoped lang="scss">
.home-center-box {
  width: 100%;

  .el-card {
    transition: all 0.2s;
    border-radius: 14px;
    margin: 0 auto;
    margin-left: 0.9375rem;
    margin-bottom: var(--home-card-spacing-pc);
  }

  .el-card:hover {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
}

/* #endregion切换分页时的过渡动画样式 */

/* #region主页面左侧样式 */
.article-list-container {
  margin-top: 3.125rem;
}

/* #endregion */

/* #region主页面右侧样式 */

@media screen and (max-width: 768px) {
  .el-col-hidden {
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
  margin-left: 0.9375rem;
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
