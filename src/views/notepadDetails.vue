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
          <Spin size="large" />
          <p>加载中...</p>
        </div>
        <div v-else-if="notepadData" class="blog-content-wrapper">
          <div class="blog-main-content">
            <article class="article-content" v-html="notepadData.fileContent"></article>
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
          <h3 class="sidebar-title">信息</h3>
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
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f5f6f7;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  max-width: 1520px; /* 1200px + 300px sidebar + 20px gap */
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
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 15px;
    color: white;
  }

  .title-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-size: 14px;
    opacity: 0.9;

    .info-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
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
}

.article-content {
  padding: 30px;
  line-height: 1.8;
  color: #333;
  font-size: 16px;

  // 标题样式
  h1, h2, h3, h4, h5, h6 {
    margin: 24px 0 16px;
    font-weight: 600;
    line-height: 1.5;
    color: #333;
  }

  h1 {
    font-size: 28px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  h2 {
    font-size: 24px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  }

  h3 {
    font-size: 20px;
  }

  h4 {
    font-size: 18px;
  }

  h5 {
    font-size: 16px;
  }

  h6 {
    font-size: 14px;
  }

  // 段落样式
  p {
    margin: 16px 0;
    line-height: 1.8;
    font-size: 16px;
  }

  // 链接样式
  a {
    color: #007fff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  // 列表样式
  ul, ol {
    padding-left: 30px;
    margin: 16px 0;

    li {
      margin: 8px 0;
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  // 引用样式
  blockquote {
    margin: 20px 0;
    padding: 15px 20px;
    border-left: 4px solid #007fff;
    background-color: #f8f9fa;
    color: #666;

    p {
      margin: 0;
    }
  }

  // 当内容中包含表格时的样式
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
    font-size: 14px;

    th, td {
      border: 1px solid #e4e6e8;
      padding: 12px;
      text-align: left;
    }

    th {
      background-color: #f2f3f5;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    tr:hover {
      background-color: #eff6ff;
    }
  }

  // 代码块样式 - 类似 Sublime Text 风格
  :deep(pre) {
    background-color: #2d333b;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    margin: 20px 0;
    line-height: 1.5;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 14px;

    code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 14px;
      color: #e1e4e8;
    }
  }

  // 行内代码样式
  :deep(code:not(pre code)) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 6px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 14px;
  }

  // 图片样式
  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 20px 0;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: block;
  }

  // 分割线
  :deep(hr) {
    border: none;
    height: 1px;
    background-color: #eee;
    margin: 30px 0;
  }
}

.article-footer {
  border-top: 1px solid #eee;
  padding: 20px 30px;

  .tags-section {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .tag {
      background: #f0f8ff;
      color: #007fff;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
    }
  }
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

  .article-content {
    padding: 20px 15px;
  }
}
</style>
