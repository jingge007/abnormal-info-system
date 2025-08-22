<template>
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
        <Button type="primary" @click="saveData">{{ isEditMode ? '保存编辑' : '上传资料' }}</Button>
        <Button @click="resetEditor">重置</Button>
      </div>
    </div>

    <!-- 编辑器容器 -->
    <div class="editor-container">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
        class="toolbar"
      />
      <Editor
        v-model="editorData"
        :defaultConfig="editorConfig"
        mode="default"
        class="editor"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
      />
    </div>
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

export default {
  name: 'uploadContentMaterials',
  components: {Editor, Toolbar},
  data() {
    return {
      editorRef: null,
      editorData: '',
      fileTitle: '',
      toolbarConfig: {},
      isEditMode: false,
      currentEditItem: null,
      editorConfig: {
        placeholder: '请输入内容...',
        height: 600,
        hoverbarKeys: {
          image: {
            menuKeys: [
              'imageWidth30',
              'imageWidth50',
              'imageWidth100',
              'divider',
              'editImage',
              'viewImageLink',
              'deleteImage'
            ]
          }
        },
        MENU_CONF: {
          uploadImage: {
            customUpload: (file, insertFn) => {
              const name = file.name
              const fileObj = new this.$leancloud.File(name, file)
              fileObj.save().then(res => {
                const url = res.url()
                // 使用编辑器API插入节点，确保样式正确应用
                if (this.editorRef) {
                  const imgNode = {
                    type: 'image',
                    src: url,
                    style: {
                      width: '200px',
                      height: 'auto',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    },
                    children: [{text: ''}]
                  }
                  this.editorRef.insertNode(imgNode)
                } else {
                  // 备用方案
                  insertFn(url, '', '', {width: '200px', height: 'auto'})
                }
              }).catch(err => {
                console.error(err)
                this.$Message.error({message: err.message, duration: 4})
              })
            }
          }
        }
      }
    }
  },
  created() {
    const itemId = this.$route.query.id
    if (itemId) {
      this.isEditMode = true
      this.loadEditData(itemId)
    }
  },
  beforeDestroy() {
    if (this.editorRef) {
      this.editorRef.destroy()
      this.editorRef = null
    }
  },
  methods: {
    async loadEditData(itemId) {
      try {
        const query = new this.$leancloud.Query('notepadData')
        const item = await query.get(itemId)
        const data = item.toJSON()
        this.currentEditItem = data
        this.fileTitle = data.fileTitle
        this.editorData = data.fileContent
      } catch (error) {
        this.$Message.error('加载数据失败: ' + error.message)
      }
    },
    handleCreated(editor) {
      this.editorRef = editor
    },
    handleChange(editor) {
      this.editorData = editor.getHtml()
    },
    handleDestroyed(editor) {
      this.editorRef = null
    },
    async saveData() {
      if (!this.fileTitle) {
        this.$Message.warning('标题不能为空')
        return
      }
      if (!this.editorData) {
        this.$Message.warning('内容不能为空')
        return
      }
      try {
        let notepadData
        const NotepadData = this.$leancloud.Object.extend('notepadData')
        if (this.isEditMode) {
          notepadData = new NotepadData()
          notepadData.id = this.currentEditItem.objectId
          notepadData.set('fileContent', this.editorData)
          notepadData.set('fileTitle', this.fileTitle)
          await notepadData.save()
        } else {
          notepadData = new NotepadData()
          const fileContentId = Date.now().toString()
          notepadData.set('fileContent', this.editorData)
          notepadData.set('fileContentId', fileContentId)
          notepadData.set('fileTitle', this.fileTitle)
          await notepadData.save()
        }
        const title = this.isEditMode ? '编辑成功' : '上传成功'
        const content = this.isEditMode ? '资料已成功编辑！' : '资料已成功上传！'
        this.$Modal.success({
          title,
          content,
          onOk: () => this.$router.push('/notepadList')
        })
      } catch (error) {
        this.$Modal.error({
          title: this.isEditMode ? '编辑失败' : '上传失败',
          content: error.message
        })
      }
    },
    resetEditor() {
      this.editorData = ''
      this.fileTitle = ''
      this.$Message.info('已重置')
    }
  }
}
</script>

<style scoped>
.notepad-container {
  padding-top: 20px;
}

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

.editor-container {
  padding: 20px;
  background-color: #fff;
}

.toolbar {
  border: 1px solid #ccc;
}

.editor {
  border: 1px solid #ccc;
  border-top: none;
  height: 600px;
}
</style>

<style>
/* 全局限制图片宽度并解决选中时的偏移问题 */
.editor-container img {
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  margin: 10px auto !important;
}

/* 解决选中图片时的偏移问题 */
.editor-container .w-e-selected-image_and_video {
  margin: 10px auto !important;
  display: block !important;
  position: static !important;
}

.editor-container .w-e-selected-image_and_video::selection {
  background: transparent !important;
}
</style>
