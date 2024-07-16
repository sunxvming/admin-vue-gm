<template>
  <div class="wangEdit">

  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.editor = new E('.wangEdit')
    // 或者 const editor = new E( document.getElementById('div1') )
    this.editor.config.menus = [
      // 'head',
      'bold',
      // 'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      // 'indent',
      // 'lineHeight',
      'foreColor',
      // 'backColor',
      'link',
      // 'list',
      // 'todo',
      'justify',
      // 'quote',
      // 'emoticon',
      'image',
      // 'video',
      'table',
      // 'code',
      // 'splitLine',
      'undo',
      'redo'
    ]
    // this.editor.config.uploadImgServer = '/upload-img' // 开启本地上传图片模式
    // this.editor.config.uploadFileName = 'file[]'
    this.editor.config.customUploadImg = this.uploadeImg
    this.editor.config.showFullScreen = false // 是否显示全屏
    this.editor.config.uploadImgMaxLength = 5 // 一次最多上传 1 个图片
    this.editor.create()
    this.editor.txt.html(this.content)
  },
  data() {
    return {
      editor: ''
    }
  },
  methods: {
    toParent() {
      this.$emit('fromChild', this.editor.txt.html())
    },

    // 富文本域上传图片
    uploadeImg(resultFiles, insertImgFn) {
      const formData = new FormData() // 构造一个 FormData，把后台需要发送的参数添加
      resultFiles.forEach(item => {
        formData.append('file', item)
      })
      this.$http.post('/index/uploadFile',formData).then(res => {
          const { code, data, msg } = res.data
          if (+code == 0) {      
              insertImgFn(data)
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error(err.msg);
        })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style>
</style>
