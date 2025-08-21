<template>
  <div class="container_box">
    <div class="flex justify-between">
      <div class="search-box">
        <Input
          v-model="searchTitle"
          placeholder="请输入标题搜索..."
          style="width: 300px;"
          @on-enter="handleSearch"
        />
        <Button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</Button>
        <Button @click="resetSearch" style="margin-left: 10px;">重置</Button>
      </div>
      <div class="actions">
        <Button type="primary" @click="goToUploadPage">上传资料</Button>
        <Button type="error" @click="batchDelete" :disabled="selectedRows.length === 0">批量删除</Button>
      </div>
    </div>
    <Table
      :columns="columns"
      :data="notepadList"
      @on-selection-change="handleSelectionChange"
      border
      ref="table"
    >
      <template #content="{ row }">
        <span class="view-content-link" @click="viewItem(row)">查看内容</span>
      </template>
      <template #action="{ row }">
        <Button size="small" @click="viewDetailsInNewWindow(row)">查看详情</Button>
        <Button size="small" @click="editItem(row)" style="margin-left: 5px;">编辑</Button>
        <Button size="small" @click="copyAddress(row)" style="margin-left: 5px;">复制详情地址</Button>
        <Button size="small" type="error" @click="deleteItem(row)" style="margin-left: 5px;">删除</Button>
      </template>
    </Table>

    <Page
      :total="total"
      :page-size="pageSize"
      :current="currentPage"
      @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange"
      show-sizer
      show-elevator
      show-total
      style="margin-top: 20px; text-align: right;"
    />

    <!-- 查看弹窗 -->
    <Modal
      v-model="showViewModal"
      title="查看内容"
      width="1000"
      :styles="{top: '30px'}"
      @on-cancel="cancelView"
    >
      <div v-if="currentViewItem" class="view-header">
        <h3>{{ currentViewItem.fileTitle }}</h3>
      </div>
      <div v-if="currentViewItem" v-html="currentViewItem.fileContent" class="view-content"></div>
      <div slot="footer">
        <Button @click="closeViewModal">关闭</Button>
      </div>
    </Modal>

    <!-- 编辑弹窗 -->
    <Modal
      v-model="showEditModal"
      title="编辑内容"
      width="1000"
      :styles="{top: '30px'}"
      @on-ok="saveEdit"
      @on-cancel="cancelEdit"
    >
      <div class="edit-header">
        <Input v-model="editTitle" placeholder="请输入资料标题（最多50个字）" :maxlength="50" show-word-limit/>
      </div>
      <div ref="editEditor" class="edit-editor"></div>
    </Modal>
  </div>
</template>

<script>
import WangEditor from 'wangeditor'
import Browser from '@/utils/tools.js'

export default {
  name: 'notepadList',
  data() {
    return {
      notepadList: [], // 记事本列表数据
      selectedRows: [], // 选中的行
      showEditModal: false, // 是否显示编辑弹窗
      showViewModal: false, // 是否显示查看弹窗
      editEditor: null, // 编辑器实例
      currentEditItem: null, // 当前编辑的项目
      currentViewItem: null, // 当前查看的项目
      editTitle: '', // 编辑时的标题
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
  beforeDestroy() {
    if (this.editEditor) {
      this.editEditor.destroy()
      this.editEditor = null
    }
  },
  methods: {
    // 获取记事本列表数据
    async fetchNotepadList() {
      try {
        const query = new this.$leancloud.Query('notepadData')
        query.descending('createdAt') // 按创建时间倒序排列

        // 如果有搜索关键词，则添加标题匹配条件
        if (this.searchTitle) {
          query.contains('fileTitle', this.searchTitle)
        }

        // 设置分页
        query.limit(this.pageSize)
        query.skip((this.currentPage - 1) * this.pageSize)

        const results = await query.find()

        // 获取总数
        const countQuery = new this.$leancloud.Query('notepadData')
        if (this.searchTitle) {
          countQuery.contains('fileTitle', this.searchTitle)
        }
        this.total = await countQuery.count()

        this.notepadList = results.map(item => {
          const data = item.toJSON()
          return {
            ...data,
            createdAt: Browser.formatDate(new Date(data.createdAt)),
            updatedAt: Browser.formatDate(new Date(data.updatedAt))
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
        query: { id: row.objectId }
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
        query: {id: row.objectId}
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
      this.currentEditItem = row
      this.editTitle = row.fileTitle
      this.showEditModal = true
      this.$nextTick(() => {
        this.initEditEditor()
      })
    },

    // 初始化编辑器
    initEditEditor() {
      if (this.editEditor) {
        this.editEditor.destroy()
      }

      this.editEditor = new WangEditor(this.$refs.editEditor)
      this.editEditor.config.height = 600

      this.editEditor.create()
      this.editEditor.txt.html(this.currentEditItem.fileContent)
    },

    // 保存编辑
    async saveEdit() {
      // 检查标题是否为空
      if (!this.editTitle) {
        this.$Message.warning('标题不能为空')
        return
      }

      try {
        const NotepadData = this.$leancloud.Object.extend('notepadData')
        const notepadData = new NotepadData()
        notepadData.id = this.currentEditItem.objectId

        const content = this.editEditor.txt.html()
        notepadData.set('fileContent', content)
        notepadData.set('fileTitle', this.editTitle)

        await notepadData.save()
        this.$Message.success('更新成功')
        this.showEditModal = false
        if (this.editEditor) {
          this.editEditor.destroy()
          this.editEditor = null
        }
        this.fetchNotepadList() // 重新获取列表数据
      } catch (error) {
        this.$Message.error('更新失败: ' + error.message)
      }
    },

    // 取消编辑
    cancelEdit() {
      this.showEditModal = false
      if (this.editEditor) {
        this.editEditor.destroy()
        this.editEditor = null
      }
    },

    // 删除单个项目
    deleteItem(row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        onOk: async () => {
          try {
            const NotepadData = this.$leancloud.Object.extend('notepadData')
            const notepadData = new NotepadData()
            notepadData.id = row.objectId

            await notepadData.destroy()
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
            const objectsToDelete = this.selectedRows.map(row => {
              const NotepadData = this.$leancloud.Object.extend('notepadData')
              const notepadData = new NotepadData()
              notepadData.id = row.objectId
              return notepadData
            })

            await this.$leancloud.Object.destroyAll(objectsToDelete)
            this.$Message.success('批量删除成功')
            this.fetchNotepadList() // 重新获取列表数据
          } catch (error) {
            this.$Message.error('批量删除失败: ' + error.message)
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
    }
  },
  computed: {},
  created() {

  },
  watch: {},
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

.actions {
  display: flex;
  gap: 10px;
}

.search-box {
  margin-bottom: 20px;
}

.edit-editor {
  min-height: 600px;
}

.view-content {
  min-height: 600px;
  border: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
  max-height: 60vh;

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

  // 代码块样式 - 类似 Sublime Text 风格
  :deep(pre) {
    background-color: #2d333b;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    margin: 10px 0;
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
  :deep(code) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 6px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 14px;
  }
}

.edit-header,
.view-header {
  margin-bottom: 15px;
}

.view-header h3 {
  margin: 0;
  font-weight: bold;
}

.view-content-link {
  color: #2D8CF0;
  cursor: pointer;

  &:hover {
    color: #57a3f3;
  }
}
</style>
