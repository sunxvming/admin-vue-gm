<template>
  <div class="ele-body">
    <el-card shadow="never">

      <!-- 操作按钮 -->
      <div class="ele-table-tool ele-table-tool-default">
        <el-button @click="showEdit=true" type="primary" icon="el-icon-plus" class="ele-btn-icon" size="small" >发送跑马灯
        </el-button>

      </div>
      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 315px)" highlight-current-row>
        <template >
          <!-- <el-table-column type="selection" width="45" align="center" fixed="left"/> -->
          <el-table-column prop="id" label="ID" width="60" align="center" fixed="left" show-overflow-tooltip/>
          <!-- <el-table-column prop="gameName" label="游戏" sortable="custom" show-overflow-tooltip min-width="50"/> -->
          <el-table-column prop="serverids" label="游戏服id" sortable="custom" show-overflow-tooltip min-width="50"/>
          <el-table-column prop="content" label="内容" sortable="custom" show-overflow-tooltip min-width="50"/>
        
          <!-- <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.createdAt }}</template>
          </el-table-column> -->
          <el-table-column prop="sendTime" label="发送时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.sendTime | toDateByTimezone }}</template>
          </el-table-column>
          <el-table-column label="生效时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.enterTime | toDateByTimezone }}</template>
          </el-table-column>
          <el-table-column label="结束时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.endTime  | toDateByTimezone }}</template>
          </el-table-column>                    
          <el-table-column prop="status" label="状态" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">
              {{ handleStatus(scope.row.status) }}
            </template>
          </el-table-column>
          
          <!-- <el-table-column prop="type" label="邮件类型" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">
              {{ handleType(scope.row.type) }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="sendParam" label="发送参数" sortable="custom" show-overflow-tooltip min-width="150"/>
          <el-table-column prop="sendResult" label="返回结果" sortable="custom" show-overflow-tooltip min-width="150"/> -->

        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="'发送跑马灯'" :visible.sync="showEdit" width="800px"
               @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false" custom-class="ele-dialog-form" :lock-scroll="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="100px">

        <el-row >
          <el-col :sm="15">
            <el-form-item label="服务器：" prop="ServerId">
              <el-select v-model="editForm.ServerIds" placeholder="" class="ele-block" clearable multiple>
                <el-option
                  v-for="item in serverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容："  prop="Content">
              <el-input
                type="textarea"
                :rows="10"
                v-model="editForm.Content"
              ></el-input>
            </el-form-item>
            <el-form-item label="生效时间："  prop="EnterTime">
              <el-date-picker
                v-model="editForm.EnterTime"
                type="datetime"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间："  prop="EndTime">
              <el-date-picker
                v-model="editForm.EndTime"
                type="datetime"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>


          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="showEdit=false">取消</el-button>
        <el-button type="primary" @click="save">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import uploadImage from '@/components/uploadImage'
import { mapGetters } from "vuex";
export default {
  name: "SysUser",
  data() {
    return {
      table: {url: '/scrollNotice/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {},  // 表单数据
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
      roleList: [],  // 角色列表
      levelList:[], // 职级列表
      positionList:[], // 岗位列表
      serverList:[{"id":0, "name": "全服"}]
    }
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  // components: {uploadImage},
  mounted() {
    // this.queryRoles();  // 查询角色列表
    this.getServerList()
  },
  methods: {
    /* 显示编辑 */
    edit(row) {
      // this.editForm = Object.assign({}, row, {
      //   role_ids: row.roleList.map(d => d.id)
      // });

      this.editForm =  {
        id: row.id,
        game_id: row.game_id,
        serverids: row.serverids,
        uids: row.uids,
        title: row.title,
        txt: row.txt,
        items: row.items,
        createdAt: row.createdAt,
      };

      this.showEdit = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          console.log(this.editForm.id);
          var url = ''
          url = "/scrollNotice/add"
          this.editForm.EnterTime  =  this.$gm.timeByZone(this.editForm.EnterTime)
          this.editForm.EndTime   =  this.$gm.timeByZone(this.editForm.EndTime)
          
          const loading = this.$loading({lock: true});
          this.$http.post(url, this.editForm).then(res => {
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

    getServerList() {
      this.$http
        .get('/gm/serverlist')
        .then(res => {
          const { data, code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 0) {
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

  }
}
</script>

<style scoped>
.ele-block >>> .el-upload, .ele-block >>> .el-upload-dragger {
  width: 100%;
}
/* 用户资料卡片 */
.user-info-card {
  padding-top: 8px;
  text-align: center;
}

.user-info-card .user-info-avatar-group {
  position: relative;
  cursor: pointer;
  margin: 0 auto;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
}

.user-info-card .user-info-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-card .user-info-avatar-group > i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FFF;
  font-size: 30px;
  display: none;
  z-index: 2;
}

.user-info-card .user-info-avatar-group:hover > i {
  display: block;
}

.user-info-card .user-info-avatar-group:hover:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
}
</style>