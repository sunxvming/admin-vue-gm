<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="table.where" label-width="77px" class="ele-form-search"
               @keyup.enter.native="$refs.table.reload()" @submit.native.prevent>
        <el-row :gutter="15">

          <el-col :md="4" :sm="12">
            <el-form-item label="选择区服:">
              <el-select
                v-model="table.where.serverId"
                placeholder="请选择"
                clearable
                class="ele-fluid"
              >
                <el-option
                  v-for="item in serverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="9" :sm="12">
            <div class="ele-form-actions">
              <el-button
                type="primary"
                @click="$refs.table.reload()"
                icon="el-icon-search"
                class="ele-btn-icon"
              >
                查询
              </el-button>
            </div>
          </el-col>

          
          <el-col :md="9" :sm="12">
            <div class="ele-form-actions">
              <el-button @click="showEdit=true" type="primary" icon="el-icon-plus" class="ele-btn-icon" >发送公告</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 260px)" highlight-current-row>
        <template slot-scope="{index}">
          <el-table-column type="selection" width="45" align="center" fixed="left"/>
          <el-table-column type="index" :index="index" label="ID" width="60" align="center" fixed="left" show-overflow-tooltip/>
          <!-- <el-table-column prop="ServerId" label="服务器id" sortable="custom" show-overflow-tooltip min-width="110"/> -->
          <el-table-column prop="ServerId" label="游戏服id" sortable="custom" show-overflow-tooltip min-width="110">
              <template slot-scope="{row}">{{ row.ServerIds && row.ServerIds.join(',') }}</template>
          </el-table-column>
          <el-table-column prop="Id" label="公告唯一ID" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="Title" label="Title" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="Url" label="公告Url" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="Sort" label="排序号(越小越靠前)" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="Popup" label="是否自动弹出" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column label="操作" width="230px" align="center" :resizable="false"  fixed="right">
            <template slot-scope="{row}">
              <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false" >修改</el-link>
              <el-popconfirm title="确定要删除此游戏吗？" @confirm="remove(row)" class="ele-action">
                <el-link slot="reference" icon="el-icon-delete" type="danger" :underline="false" >删除</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="editForm.id?'修改公告':'发送公告'" :visible.sync="showEdit" width="700px"
               @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false" :lock-scroll="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="150px">
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
        <el-form-item label="Title:" prop="Title" >
          <el-input v-model="editForm.Title"   :rows="4" type="textarea"/>
        </el-form-item>                         
        <el-form-item label="公告Url:"  prop="Url" :rows="4" type="textarea">
          <el-input v-model="editForm.Url" :rows="4" type="textarea" />
        </el-form-item>
        <el-form-item label="排序号(越小越靠前):"  prop="Sort" >
          <el-input v-model.number="editForm.Sort"  type="number"/>
        </el-form-item>   
        
          <el-form-item label="是否自动弹出:">
            <el-select
              v-model="editForm.Popup"
              placeholder="请选择"
              clearable
              class="ele-fluid"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>       

      </el-form>
      <div slot="footer">
        <el-button @click="showEdit=false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  name: "SysRole",
  data() {
    return {
      table: {
        url: '/gm/doRequest?method=QueryAnnouncement', 
        where: {serverId: 1},
        method: 'post',
      },  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {},  // 表单数据
      editRules: {  // 表单验证规则
        name: [
          {required: true, message: '请输入游戏名称', trigger: 'blur'}
        ],
        Sort: [
          {required: true, message: '请输入排序号，', trigger: 'blur'}
        ]
      },
      serverList:[{"id":0, "name": "全服"}]

    }
  },
  mounted() {
    this.getServerList()
  },  
  methods: {
    /* 显示编辑 */
    edit(row) {
      this.editForm = Object.assign({}, row);
      this.showEdit = true;
    }, 
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({lock: true});
          var url = ''
          if(this.editForm.Id){
            url = "/gm/doRequest?method=ChangeAnnouncement"
          }else{
            url = "/gm/doRequest?method=SendAnnouncement"
            this.editForm.Id = Date.now() + ''
          }
          this.$http.post(url, this.editForm).then(res => {
            loading.close();
            console.log(res.data.code);
            if (typeof(res.data.code) == "undefined"){
              this.$message.error("query服接口返回格式有误：格式为：{code:xx,msg:xx}");
              return;
            }
            if (res.data.code === 200) {
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
    /* 删除 */
    remove(row) {
        var url = "/gm/doRequest?method=DelAnnouncement"
        const loading = this.$loading({lock: true});
        this.$http.post(url, {"Id":row.Id} ).then(res => {
          loading.close();
          if (res.data.code === 200) {
            this.$message({type: 'success', message: res.data.msg});
            this.$refs.table.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
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

  }
}
</script>

<style scoped>

</style>