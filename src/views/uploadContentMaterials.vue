<template>
  <!-- 笔记本容器 -->
  <div class="notepad-container">
    <!-- 标题输入框和按钮 -->
    <div class="title-container">
      <label class="title-label required-label">内容标题：</label>
      <Input
        v-model="fileTitle"
        placeholder="请输入资料标题（最多50个字）"
        :maxlength="50"
        show-word-limit
        class="title-input"
      />
      <div class="button-group">
        <Button type="primary" @click="uploadData">上传资料</Button>
        <Button @click="resetEditor">重置</Button>
      </div>
    </div>
    <!-- 编辑器容器 -->
    <div class="editor-container">
      <!-- 富文本编辑器 -->
      <div ref="editor" class="editor"></div>
    </div>
  </div>
</template>

<script>
// 导入富文本编辑器wangEditor
import WangEditor from 'wangeditor'

export default {
  // 组件名称
  name: 'uploadContentMaterials',
  // 组件数据
  data() {
    return {
      editor: null,           // 富文本编辑器实例
      editorData: '',         // 编辑器内容
      fileTitle: ''          // 资料标题
    }
  },
  // 生命周期钩子：组件挂载完成后初始化编辑器
  mounted() {
    this.initEditor()
  },
  // 生命周期钩子：组件销毁前销毁编辑器实例
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },
  // 组件方法
  methods: {
    // 初始化富文本编辑器
    initEditor() {
      // 创建wangEditor实例
      this.editor = new WangEditor(this.$refs.editor)
      // 配置编辑器高度为600px
      this.editor.config.height = 600;
      this.editor.config.zIndex = 100;
      // 配置编辑器内容变化时的回调函数
      this.editor.config.onchange = (newHtml) => {
        this.editorData = newHtml
      }
      // 创建编辑器
      this.editor.create()
    },
    /**
     * 上传数据到LeanCloud
     * @async
     * @returns {Promise<void>}
     */
    async uploadData() {
      // 检查标题是否为空
      if (!this.fileTitle) {
        this.$Message.warning('标题不能为空')
        return
      }

      // 检查编辑器内容是否为空
      if (!this.editorData) {
        this.$Message.warning('内容不能为空')
        return
      }

      try {
        // 创建LeanCloud数据对象
        const NotepadData = this.$leancloud.Object.extend('notepadData')
        const notepadData = new NotepadData()

        // 生成基于时间戳的唯一ID
        const fileContentId = Date.now().toString()

        // 设置对象属性（注意：不要手动设置createdAt和updatedAt，因为它们是系统保留字段）
        notepadData.set('fileContent', this.editorData)  // 将content改为fileContent
        notepadData.set('fileContentId', fileContentId)  // 添加fileContentId字段
        notepadData.set('fileTitle', this.fileTitle)    // 添加fileTitle字段

        // 保存到云端（LeanCloud会自动创建createdAt和updatedAt字段）
        await notepadData.save()

        // 使用$Modal显示成功提示弹窗
        this.$Modal.success({
          title: '上传成功',
          content: '资料已成功上传！',
          onOk: () => {
            // 点击确定按钮后重置编辑器
            this.resetEditor()
          }
        })
      } catch (error) {
        this.$Message.error('上传失败: ' + error.message)
      }
    },
    // 重置编辑器内容
    resetEditor() {
      if (this.editor) {
        this.editor.txt.clear()
        this.editorData = ''
        this.fileTitle = ''
        this.$Message.info('已重置')
      }
    }
  }
}
</script>

<style scoped>
/* 笔记本容器样式 */
.notepad-container {
  padding-top: 20px;
}

/* 标题容器样式 */
.title-container {
  padding: 5px 20px;
  display: flex;
  align-items: center;
}

.title-label {
  white-space: nowrap;
  margin-right: 10px;
  font-weight: bold;
}

.required-label::before {
  content: "* ";
  color: #ed4014;
}

.title-input {
  width: 500px;
  margin-right: 20px;
}

.button-group button {
  margin-right: 10px;
}

/* 编辑器容器样式 */
.editor-container {
  padding: 20px;
  background-color: #fff;
}

/* 编辑器样式 - 设置最小高度为600px */
.editor {
  min-height: 600px;
}
</style>
