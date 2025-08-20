<template>
  <div class="container_box">
    <div class="header">
      <h2>记事本详情</h2>
      <Button v-if="isDevelopment" type="primary" @click="goBack">返回列表</Button>
    </div>

    <div v-if="loading" class="loading">
      <Spin size="large" />
      <p>加载中...</p>
    </div>

    <div v-else-if="notepadData" class="content">
      <div class="info">
        <p><strong>标题:</strong> {{ notepadData.fileTitle }}</p>
        <p><strong>ID:</strong> {{ notepadData.fileContentId }}</p>
        <p><strong>创建时间:</strong> {{ formatDateTime(notepadData.createdAt) }}</p>
        <p><strong>更新时间:</strong> {{ formatDateTime(notepadData.updatedAt) }}</p>
      </div>
      <div class="content-detail" v-html="notepadData.fileContent"></div>
    </div>

    <div v-else class="no-data">
      <p>未找到相关数据</p>
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
.container_box {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 50px 0;
}

.no-data {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

.info {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;

  p {
    margin: 5px 0;
  }
}

.content-detail {
  border: 1px solid #ddd;
  padding: 15px;
  min-height: 500px;

  // 当内容中包含表格时的样式
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;

    th, td {
      border: 1px solid #dcdee2;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    tr:hover {
      background-color: #eef0f2;
    }
  }
}
</style>
