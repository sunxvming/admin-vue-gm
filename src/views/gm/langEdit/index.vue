<template>
  <div class="ele-body">
    <el-card shadow="never">
      <el-form ref="form"  label-width="80px">
        <el-button type="primary" @click="txt()" style="margin-bottom: 20px;">复制多语言文本</el-button>
        <el-button type="danger" @click="clear()" style="margin-left: 200px;">清除所有文本</el-button>
            <el-form-item v-for="lang in langs"  :key="lang.key" :label="lang.name">
              <el-input
                type="textarea"
                autosize
                placeholder=""
                v-model="lang.txt">
              </el-input>
            </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>


<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
        langs :[
        {'txt':'', 'key':'zh_CN', 'name':'中文-简体'},
          {'txt':'', 'key':'zh_TW', 'name':'中文-繁体'},
          {'txt':'', 'key':'en_US', 'name':'英文'},
          {'txt':'', 'key':'ja', 'name':'日文'},
          {'txt':'', 'key':'ru', 'name':'俄文'},
          {'txt':'', 'key':'de', 'name':'德文'},
          {'txt':'', 'key':'it', 'name':'意大利文'},
          {'txt':'', 'key':'fr', 'name':'法文'},
          {'txt':'', 'key':'pt_PT', 'name':'葡萄牙文'},
          {'txt':'', 'key':'es', 'name':'西班牙文'},
          {'txt':'', 'key':'ko', 'name':'韩文'},
          {'txt':'', 'key':'th', 'name':'泰文'},
          {'txt':'', 'key':'id', 'name':'印尼文'},
          {'txt':'', 'key':'ar', 'name':'阿拉伯文'},
        ],
        txt_str : "",   
    }
  },
  methods: {
      txt: function() {
        var t = "";
        for(var i=0; i<this.langs.length; i++) {
          var lang = this.langs[i];
          var txt = lang.txt
          if (txt == "" || txt == null || txt == undefined) {
            continue;
          }
          var row = "";
          row += "<lang-"+lang.key+">"
          row += "\n"
          row += txt
          row += "\n"
          row += "</lang-"+lang.key+">"
          row += "\n"
          t += row;
        }
        console.log(t)
  
        this.$copyText(t).then(() => {
          this.$message.success('复制成功');
        }, () => {
            this.$message.success('复制成功');
        })
        
        return  t;
      },
      clear : function(){
        for(var i=0; i<this.langs.length; i++) {
          this.langs[i].txt = "";
        }
      }
  }
}
</script>
