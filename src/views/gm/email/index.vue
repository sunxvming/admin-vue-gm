<template>
  <div class="ele-body">
    <el-card shadow="never">

      <!-- 操作按钮 -->
      <div class="ele-table-tool ele-table-tool-default">
        <el-button @click="showEdit=true" type="primary" icon="el-icon-plus" class="ele-btn-icon" size="small" >添加邮件
        </el-button>

      </div>
      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 315px)" highlight-current-row>
        <template >
          <!-- <el-table-column type="selection" width="45" align="center" fixed="left"/> -->
          <el-table-column prop="id"  label="ID" width="60" align="center" fixed="left" show-overflow-tooltip/>
          <el-table-column prop="gameName" label="游戏" sortable="custom" show-overflow-tooltip min-width="50"/>
          <el-table-column prop="serverids" label="游戏服id" sortable="custom" show-overflow-tooltip min-width="50"/>
          <el-table-column prop="uid" label="账号id" sortable="custom" show-overflow-tooltip min-width="50"/>
          <el-table-column prop="title" label="标题" sortable="custom" show-overflow-tooltip min-width="80"/>
          <!-- <el-table-column  prop="txt" label="内容" sortable="custom" show-overflow-tooltip min-width="80"/> -->

        <el-table-column
          prop="txt"
          label="内容"
          align="center"
          min-width="180"
        >
          <template slot-scope="{row}">

          <el-popover trigger="hover" placement="top"  width="350">
              <p><pre>{{ row.txt }}</pre></p>
              <div slot="reference" >
                {{ row.txt }}
              </div>
            </el-popover>
          </template>
        </el-table-column>    

          <el-table-column prop="picture" label="邮件图片" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="voices" label="邮件声音" sortable="custom" show-overflow-tooltip min-width="80"/>
          <!-- <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.createdAt}}</template>
          </el-table-column> -->
          <el-table-column prop="sendTime" label="发送时间" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="{row}">{{ row.sendTime | toDateByTimezone }}</template>
          </el-table-column>
          <el-table-column label="生效时间" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="{row}">{{ row.enterTime | toDateByTimezone }}</template>
          </el-table-column>
          <el-table-column label="结束时间" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="{row}">{{ row.endTime | toDateByTimezone }}</template>
          </el-table-column>             
          <el-table-column prop="status" label="状态" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">
              {{ handleStatus(scope.row.status) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="type" label="邮件类型" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">
              {{ handleType(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="sendParam" label="发送参数" sortable="custom" show-overflow-tooltip min-width="150"/>
          <el-table-column prop="sendResult" label="返回结果" sortable="custom" show-overflow-tooltip min-width="150"/>

          <el-table-column label="操作" width="230px" align="center" :resizable="false"  fixed="right">
            <template slot-scope="{row}" >
            
              <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false"   v-show="row.status==3||row.status==2" >修改</el-link>
              
              <el-popconfirm title="确定要发送此邮件吗？" @confirm="send(row)" class="ele-action">
                <el-link slot="reference"  type="danger" :underline="false" v-show="row.status==3||row.status==2">发送邮件</el-link>
              </el-popconfirm>
            
            
            </template>
            
          </el-table-column>

        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog  :title="editForm.id?'修改邮件':'添加邮件'" :visible.sync="showEdit" width="1200px"
               @closed="editForm={ItemData:[]}" :destroy-on-close="true" :close-on-click-modal="false" custom-class="ele-dialog-form" :lock-scroll="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="150px">

        <el-row >
          <el-col :sm="10">
            <el-form-item label="服务器：" prop="ServerIds">
              <el-select v-model="editForm.ServerIds" placeholder="" class="ele-block" clearable multiple>
                <el-option
                  v-for="item in serverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="账号id(可选)：" prop="uid">
              <el-input v-model.trim="editForm.uid" placeholder="" clearable
                        />
            </el-form-item>
            <el-form-item label="生效时间："  prop="enterTime">
              <el-date-picker
                v-model="editForm.enterTime"
                type="datetime"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间："  prop="endTime">
              <el-date-picker
                v-model="editForm.endTime"
                type="datetime"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="邮件图片url:"  prop="picture" :rows="4" type="textarea">
              <el-input v-model="editForm.picture" :rows="4" type="textarea" />
            </el-form-item>
            <el-form-item label="邮件声音url:"  prop="voices" :rows="4" type="textarea">
              <el-input v-model="editForm.voices" :rows="4" type="textarea" />
            </el-form-item>        
            <el-form-item label="">
              <el-button @click.prevent="addItem" type="primary">新增道具</el-button>
            </el-form-item>
          </el-col>
          <el-col :sm="10">
            <el-form-item label="邮件标题：" prop="title">
              <el-input v-model="editForm.title" placeholder="" clearable :rows="5" type="textarea" />
            </el-form-item>
            <el-form-item label="邮件内容："  prop="txt">
              <el-input
                type="textarea"
                :rows="18"
                v-model="editForm.txt"
              ></el-input>
            </el-form-item>

          </el-col>

        </el-row>
        <el-row v-for="(item,index) in editForm.ItemData" :key="index">
          <el-col :sm="10">
            <!-- <el-form-item label="道具id：" prop="itemid" type="number">
              <el-input v-model.number="item.itemid" placeholder="" clearable type="number"/>
            </el-form-item> -->

            <el-form-item label="道具id:" prop="itemid">
              <el-select v-model="item.itemid" placeholder="" class="ele-fluid" filterable clearable >
                <el-option
                  v-for="i in items_list"
                  :key="i.id"
                  :label="i.id + i.name"
                  :value="parseInt(i.id)"
                ></el-option>
              </el-select>
            </el-form-item>


          </el-col>
          <el-col :sm="10">
            <el-form-item label="道具数量：" prop="itemNum" type="number">
              <el-input v-model.number="item.itemNum" placeholder="" clearable type="number"/>
            </el-form-item>
          </el-col>
          <el-col :sm="1" v-if="editForm.ItemData.length>1">
            <el-button @click.prevent="removeItem(index)" size="mini" style="marginLeft:10px">x</el-button>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="showEdit=false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import uploadImage from '@/components/uploadImage'
import { mapGetters } from "vuex";
import gm from '@/utils/gm'  

export default {
  name: "SysUser",
  data() {
    return {
      table: {url: '/emails/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {ItemData:[]},  // 表单数据
      editRules: {  // 表单验证规则
        // username: [
        //   {required: true, message: '请输入用户账号', trigger: 'blur'}
        // ],
        // realname: [
        //   {required: true, message: '请输入用户姓名', trigger: 'blur'}
        // ],
        // gender: [
        //   {required: true, message: '请选择性别', trigger: 'blur'}
        // ],
        // password: [
        //   {required: true, message: '请输入密码', trigger: 'blur'}
        // ]
      },
      serverList:[{"id":0, "name": "全服"}]
    }
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  // components: {uploadImage},
  mounted() {
    this.getServerList()
    gm.getGMTable("items").then(res => {
      this.items_list = res;
    });
  },
  methods: {
    /* 显示编辑 */
    edit(row) {
      this.editForm = Object.assign({}, row);
      // this.editForm.txt = row.txt;
      // this.editForm.title = row.title
      // this.editForm.picture = row.picture
      // this.editForm.voices = row.voices
      // this.editForm.uid = row.uid
      // this.editForm.title = row.title
      this.editForm.enterTime = this.$gm.timeToUTC8(this.editForm.enterTime)
      this.editForm.endTime = this.$gm.timeToUTC8(this.editForm.endTime)
      this.editForm.ServerIds = JSON.parse(row.serverids)
      this.$set(this.editForm, "ItemData", [].concat(JSON.parse(row.items)))
      // this.editForm.ItemData = [].concat(JSON.parse(row.items));
      console.log(this.editForm)
      this.showEdit = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {

          var url = ''
          if(this.editForm.id){
            url = "/emails/update?email_id=" + this.editForm.id
          }else{
            url = "/emails/add"
          }

          var param = {
            "Id" :  Date.now() + '',
            "title": this.editForm.title,
            "txt": this.editForm.txt,
            "picture": this.editForm.picture,
            "voices": this.editForm.voices,
            "uid": this.editForm.uid,
            "enterTime": this.$gm.timeByZone(this.editForm.enterTime),
            "endTime": this.$gm.timeByZone(this.editForm.endTime),
            "serverids": this.editForm.ServerIds,
            "ItemData": this.editForm.ItemData
          }
                    
          const loading = this.$loading({lock: true});
          this.$http.post(url, param).then(res => {
            loading.close();
            if (res.data.code === 0) {
              this.showEdit = false;
              this.$message({type: 'success', message: res.data.msg});
              this.$refs.table.reload();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            loading.close();
            this.$message.error(e.message);
          });
        } else {
          return false;
        }
      });
    },
    addItem(){
      console.log("aaaaaaaaaaaaaaaaa")
      this.editForm.ItemData.push({itemid:0,itemNum:0})
      console.log(this.editForm.ItemData)
    },
    removeItem(index){
      this.editForm.ItemData.splice(index, 1)
    },
    getServerList() {
      this.$http
        .get('/gm/serverlist')
        .then(res => {
          const { data, code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            this.serverList = this.serverList.concat(data);
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => this.$message.error(err.message));
    },
    handleType(type) {
      switch (String(type)) {
        case '1':
          return '普通邮件';
        case '2':
          return '定时邮件';
        default:
          return '-';
      }
    },
    handleStatus(type) {
      switch (String(type)) {
        case '1':
          return '发送成功';
        case '2':
          return '发送失败';
        case '3':
          return '未发送';
        default:
          return '-';
      }
    },


    send(row) {
        const loading = this.$loading({lock: true});
        this.$http.get('/emails/send?id=' + row.id ).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.$refs.table.reload();
          } else {
            this.$message.error(res.data.msg);
            this.$refs.table.reload();

          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }   

  }
}
</script>
