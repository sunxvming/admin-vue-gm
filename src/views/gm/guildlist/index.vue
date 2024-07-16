<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="table.where"
        label-width="77px"
        class="ele-form-search"
        @keyup.enter.native="$refs.table.reload()"
        @submit.native.prevent
      >
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
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-data-table
        ref="table"
        :config="table"
        height="calc(100vh - 260px)"
        highlight-current-row
      >
        <template>
          <el-table-column
            prop="armyid"
            label="公会id"
            width="200"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />           
          <el-table-column
            prop="pid"
            label="公会会长id"
            width="200"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />          
          <el-table-column
            prop="level"
            label="等级"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="exp"
            label="经验"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />          
          <el-table-column
            prop="devote"
            label="军团贡献"
            align="center"
            show-overflow-tooltip
            min-width="120"
          />
          <el-table-column
            prop="name"
            label="名字"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="flagicon"
            label="军团标志图标"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="flagborder"
            label="军团标志边框"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="levellimit"
            label="等级限制"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="membernum"
            label="人数"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="force"
            label="战力"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />                    
          <el-table-column prop="createtime" label="创建时间" align="center" show-overflow-tooltip min-width="180">
            <template slot-scope="{row}">
              {{ row.createtime  | toDateByTimezone }}
            </template>
          </el-table-column>

          <el-table-column
            prop="notice"
            label="内部通知"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="recruit"
            label="招募公告"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="daycontribution"
            label="当天总泰坦石进度"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="contributionindex"
            label="第几轮"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="bronzestage"
            label="军团铜像阶段"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="bronzeexp"
            label="军团铜像阶段exp"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            label="操作"
            width="220px"
            align="center"
            :resizable="true"
          >
            <template slot-scope="{row}">
              <el-link @click="editName(row)" icon="el-icon-edit" type="primary" :underline="false" >修改冒险团名字</el-link>
              <el-link @click="showUserList(row)" icon="el-icon-edit" type="primary" :underline="false" >查看成员</el-link>

            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>


    <el-dialog title="修改名称" :visible.sync="editNameShow" width="400px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
      <el-input v-model="editForm.NewName"></el-input>
      <div slot="footer">
        <el-button @click="editNameShow=false">取消</el-button>
        <el-button type="primary" @click="saveName">保存</el-button>
      </div>
    </el-dialog> 


    <el-dialog title="成员列表" :visible.sync="userListShow" width="1500px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
    <template>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="uid"
          label="成员uid"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="成员Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="成员等级">
        </el-table-column>


          <el-table-column prop="jointime" label="成员加入时间" align="center" show-overflow-tooltip min-width="180">
            <template slot-scope="{row}">
              {{ row.jointime  | toDateByTimezone }}
            </template>
          </el-table-column>
        

      </el-table>
    </template>
    </el-dialog> 


  </div>
</template>

<script>
export default {
  name: 'gm',
  data() {
    return {
      table: {
        url: '/gm/doRequest?method=QueryGuildAll',
        method: 'post',
        where: { serverId: 1 }
      }, // 表格配置
      serverList: [],
      editNameShow:false,
      userListShow:false,
      editForm:{},
      tableData: [],
    };
  },
  mounted() {
    this.getServerList();
  },
  methods: {
    getServerList() {
      this.$http
        .get('/gm/serverlist')
        .then(res => {
          const { data, code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            this.serverList = data;
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => this.$message.error(err.message));
    },
    editName(row){
      this.editForm = Object.assign({},{
        ServerId:this.table.where.serverId,
        Armyid :row.armyid ,
        NewName:row.name
      })
      this.editNameShow = true
    },    


    showUserList(row){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=QueryGuildMember',{'serverId':this.table.where.serverId, 'name':row.name})
        .then(res => {
          const { data, code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            this.tableData = data.memberinfo;
          } else {
            this.$message.error(msg);
          }
          loading.close();
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});

      this.userListShow = true
    },   


    saveName(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=ChangeArmyName',this.editForm)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('设置成功！')
            this.$refs.table.reload();
            this.editNameShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },

  }
};
</script>
