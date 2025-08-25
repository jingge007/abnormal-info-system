<template>
  <div class="page-wrapper">
    <div class="content-wrapper">
      <div class="blog-container">
        <div class="blog-header">
          <div class="header-content">
            <div class="title-section">
              <h1 class="blog-title" v-if="notepadData">{{ notepadData.fileTitle }}</h1>
            </div>
            <Button v-if="isDevelopment" type="primary" @click="goBack" class="back-button">返回列表</Button>
          </div>
        </div>
        <div v-if="loading" class="loading">
          <Spin size="large"/>
          <p>加载中...</p>
        </div>
        <div v-else-if="notepadData" class="blog-content-wrapper" v-viewer>
          <div class="blog-main-content">
            <article class="richtext-content" v-html="notepadData.fileContent" ref="articleContent"></article>
          </div>
        </div>
        <div v-else class="no-data">
          <div class="no-data-content">
            <h3>未找到相关数据</h3>
            <p>抱歉，您访问的文章不存在或已被删除。</p>
            <Button type="primary" @click="goBack">返回列表</Button>
          </div>
        </div>
      </div>
      <div class="blog-sidebar-outer" v-if="notepadData">
        <div class="sidebar-card">
          <h3 class="sidebar-title">文章信息</h3>
          <div class="info-item">
            <span class="info-label">发布时间:</span>
            <span class="info-value">{{ formatDateTime(notepadData.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最后更新:</span>
            <span class="info-value">{{ formatDateTime(notepadData.updatedAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">文章ID:</span>
            <span class="info-value">{{ notepadData.fileContentId }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Browser from '@/utils/tools.js'
import {highlightCode} from '@/utils/prismConfig.js'

export default {
  name: 'notepadDetails',
  data() {
    return {
      notepadData: null,
      loading: true
    }
  },
  computed: {
    // 判断是否为开发环境
    isDevelopment() {
      return process.env.NODE_ENV === 'development';
    }
  },
  created() {
    this.fetchNotepadData();
  },
  mounted() {
    // 在组件挂载后高亮代码
    this.$nextTick(() => {
      this.highlightCode();
    });
  },
  methods: {
    // 获取记事本数据
    async fetchNotepadData() {
      const objectId = this.$route.query.id;
      if (!objectId) {
        this.loading = false;
        return;
      }

      try {
        const query = new this.$leancloud.Query('notepadData');
        const result = await query.get(objectId);
        const data = result.toJSON();

        this.notepadData = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        };
      } catch (error) {
        this.$Message.error('获取数据失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },

    // 格式化日期时间
    formatDateTime(date) {
      return Browser.formatDate(date);
    },

    // 返回列表页
    goBack() {
      this.$router.push('/notepadList');
    },

    // 高亮代码
    highlightCode() {
      highlightCode(this.$refs.articleContent);
    }
  },
  watch: {
    '$route'(to, from) {
      // 当路由变化时重新获取数据
      if (to.query.id !== from.query.id) {
        this.notepadData = null;
        this.loading = true;
        this.fetchNotepadData();
      }
    },
    notepadData: {
      handler() {
        // 数据更新后重新高亮代码
        this.$nextTick(() => {
          this.highlightCode();
        });
      },
      deep: true
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
@import '@/styles/richtext-content.css';

.page-wrapper {
  min-height: 100vh;
  background-color: #f5f6f7;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  max-width: 1520px;
  margin: 0 auto;
  gap: 20px;
}

.blog-container {
  flex: 1;
  max-width: 1200px;
}

.blog-sidebar-outer {
  width: 300px;
  position: sticky;
  top: 20px;
  height: fit-content;
  align-self: flex-start;
}

.blog-header {
  background: linear-gradient(90deg, #007fff, #00bbff);
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  color: white;

  .title-section {
    flex: 1;
  }

  .blog-title {
    font-size: 21px;
    font-weight: 600;
    margin-bottom: 15px;
    color: white;
  }

  .back-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.loading {
  text-align: center;
  padding: 100px 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.blog-content-wrapper {
  display: flex;
  gap: 20px;
}

.blog-main-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 0 20px;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;

  .sidebar-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .info-item {
    display: flex;
    margin-bottom: 12px;
    font-size: 14px;

    .info-label {
      width: 80px;
      color: #999;
    }

    .info-value {
      flex: 1;
      color: #333;
    }
  }
}

.no-data {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 100px 30px;
  text-align: center;

  .no-data-content {
    h3 {
      font-size: 24px;
      margin-bottom: 15px;
      color: #333;
    }

    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
  }
}

// 响应式设计
@media (max-width: 1520px) {
  .content-wrapper {
    flex-direction: column;
  }

  .blog-sidebar-outer {
    width: 100%;
    max-width: 1200px;
    position: static;
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 10px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .blog-title {
    font-size: 24px !important;
  }
}
</style>
