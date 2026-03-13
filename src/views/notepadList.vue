<template>
  <div class="container_box">
    <div class="flex justify-between">
      <div class="search-box">
        <Input v-model="searchTitle" placeholder="请输入标题搜索..." style="width: 300px;" @on-enter="handleSearch" />
        <Button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</Button>
        <Button @click="resetSearch" style="margin-left: 10px;">重置</Button>
      </div>
      <div class="actions">
        <Button type="primary" @click="goToUploadPage">上传资料</Button>
        <Button type="error" @click="batchDelete" :disabled="selectedRows.length === 0">批量删除</Button>
      </div>
    </div>
    <Table :columns="columns" :max-height="650" :data="notepadList" @on-selection-change="handleSelectionChange" border ref="table">
      <template #content="{ row }">
        <span class="view-content-link" @click="viewItem(row)">查看内容</span>
      </template>
      <template #action="{ row }">
        <Button size="small" @click="viewDetailsInNewWindow(row)">查看详情</Button>
        <Button size="small" @click="editItem(row)" style="margin-left: 5px;">编辑</Button>
        <Button size="small" @click="copyAddress(row)" style="margin-left: 5px;">复制链接</Button>
        <Button size="small" type="error" @click="deleteItem(row)" style="margin-left: 5px;">删除</Button>
      </template>
    </Table>

    <Page :total="total" :page-size="pageSize" :current="currentPage" @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total
      style="margin-top: 20px; text-align: right;" />

    <!-- 查看弹窗 -->
    <Modal v-model="showViewModal" title="查看内容" width="1200" :styles="{ top: '30px' }" @on-cancel="cancelView"
      @on-visible-change="onModalVisibleChange">
      <div v-if="currentViewItem" class="view-header">
        <h3>{{ currentViewItem.fileTitle }}</h3>
      </div>
      <div v-if="currentViewItem" v-viewer v-html="currentViewItem.fileContent" class="richtext-content view-content"
        ref="viewContent"></div>
      <div slot="footer">
        <Button @click="closeViewModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Browser from '@/utils/tools.js'
import { highlightCode } from '@/utils/prismConfig.js'
import { contentManageAPI } from '@/utils/api'

export default {
  name: 'notepadList',
  data() {
    return {
      notepadList: [], // 记事本列表数据
      selectedRows: [], // 选中的行
      showViewModal: false, // 是否显示查看弹窗
      currentViewItem: null, // 当前查看的项目
      searchTitle: '', // 搜索标题
      total: 0, // 总数
      pageSize: 20, // 每页条数
      currentPage: 1, // 当前页码
      // 表格列配置
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'fileContentId',
          minWidth: 130
        },
        {
          title: '标题',
          key: 'fileTitle',
          minWidth: 500
        },
        {
          title: '内容信息',
          key: 'content',
          minWidth: 100,
          slot: 'content',
        },
        {
          title: '创建时间',
          key: 'createdAt',
          minWidth: 140
        },
        {
          title: '更新时间',
          key: 'updatedAt',
          minWidth: 140
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 300,
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.fetchNotepadList()
  },
  methods: {
    // 获取记事本列表数据
    async fetchNotepadList() {
      try {
        const response = await contentManageAPI.getList({
          page: this.currentPage,
          pageSize: this.pageSize,
          fileTitle: this.searchTitle
        })

        this.total = response.data.total
        this.notepadList = response.data.list.map(item => {
          return {
            ...item,
            createdAt: Browser.formatDate(new Date(item.createdAt)),
            updatedAt: Browser.formatDate(new Date(item.updatedAt))
          }
        })
      } catch (error) {
        this.$Message.error('获取数据失败: ' + error.message)
      }
    },

    // 处理表格选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },

    // 跳转到上传资料页面
    goToUploadPage() {
      this.$router.push('/uploadContentMaterials')
    },

    // 查看项目详情（在当前窗口中打开模态框）
    viewItem(row) {
      this.currentViewItem = row
      this.showViewModal = true
    },

    // 在新窗口中查看详情
    viewDetailsInNewWindow(row) {
      const routeData = this.$router.resolve({
        name: 'notepadDetails',
        query: { id: row.fileContentId }
      });
      window.open(routeData.href, '_blank');
    },

    // 关闭查看模态框
    closeViewModal() {
      this.showViewModal = false
    },

    // 取消查看
    cancelView() {
      this.showViewModal = false
    },

    // 复制访问地址
    async copyAddress(row) {
      const url = window.location.origin + this.$router.resolve({
        name: 'notepadDetails',
        query: { id: row.fileContentId }
      }).href;

      try {
        await Browser.copyText(url);
        this.$Message.success('地址已复制到剪贴板');
      } catch (error) {
        this.$Message.error('复制失败: ' + error.message);
      }
    },

    // 编辑项目
    editItem(row) {
      // 跳转到上传页面进行编辑，传递要编辑的项目ID
      this.$router.push({
        name: 'uploadContentMaterials',
        query: { id: row.fileContentId }
      });
    },

    // 从内容中提取图片URL
    extractImageUrls(content) {
      const urls = [];
      if (!content) return urls;

      // 创建一个临时的div元素来解析HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      // 查找所有img标签
      const images = tempDiv.querySelectorAll('img');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          urls.push(src);
        }
      });

      return urls;
    },

    // 删除单个项目
    deleteItem(row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        onOk: async () => {
          try {
            await contentManageAPI.deleteNotepad(row.fileContentId)
            this.$Message.success('删除成功')
            this.fetchNotepadList() // 重新获取列表数据
          } catch (error) {
            this.$Message.error('删除失败: ' + error.message)
          }
        }
      })
    },

    // 批量删除
    batchDelete() {
      this.$Modal.confirm({
        title: '确认删除',
        content: `确定要删除选中的${this.selectedRows.length}条记录吗？`,
        onOk: async () => {
          try {
            // 批量删除记录
            const fileContentIds = this.selectedRows.map(row => row.fileContentId);
            await contentManageAPI.batchDeleteNotepad(fileContentIds);
            this.$Message.success('批量删除成功');
            this.fetchNotepadList(); // 重新获取列表数据
          } catch (error) {
            this.$Message.error('批量删除失败: ' + error.message);
          }
        }
      })
    },

    // 处理页码变化
    handlePageChange(page) {
      this.currentPage = page
      this.fetchNotepadList()
    },

    // 处理页面大小变化
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.fetchNotepadList()
    },

    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchNotepadList()
    },

    // 重置搜索
    resetSearch() {
      this.searchTitle = ''
      this.currentPage = 1
      this.fetchNotepadList()
    },

    // 模态框显示状态变化时的处理
    onModalVisibleChange(visible) {
      if (visible) {
        // 延迟执行，确保DOM已经渲染完成
        this.$nextTick(() => {
          this.highlightCode();
        });
      }
    },

    // 高亮代码
    highlightCode() {
      highlightCode(this.$refs.viewContent);
    }
  },
  computed: {},
  created() {

  },
  watch: {
    currentViewItem: {
      handler() {
        // 当查看的项目变化时，重新高亮代码
        if (this.showViewModal && this.currentViewItem) {
          this.$nextTick(() => {
            this.highlightCode();
          });
        }
      },
      deep: true
    }
  },
};
</script>

<style lang="less" scoped>
@import '@/styles/richtext-content.css';

.container_box {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.search-box {
  margin-bottom: 20px;
}

.view-content {
  min-height: 600px;
  border: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
  max-height: 60vh;
}

.view-header h3 {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 12px;
}

.view-content-link {
  color: #2D8CF0;
  cursor: pointer;

  &:hover {
    color: #57a3f3;
  }
}
</style>
