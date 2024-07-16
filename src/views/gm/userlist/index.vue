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

          <el-col :md="4" :sm="12">
            <el-form-item label="玩家名字:">
              <el-input v-model="table.where.name" placeholder="" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="账号ID:">
              <el-input v-model="table.where.acc" placeholder="" clearable/>
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
            prop="serverid"
            label="游戏服id"
            width="90"
            align="center"
            fixed="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="account"
            label="玩家账号"
            width="200"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="pid"
            label="玩家id"
            width="200"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />          
          <el-table-column
            prop="role"
            label="玩家角色"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="name"
            label="名字"
            align="center"
            show-overflow-tooltip
            min-width="120"
          />
          <el-table-column
            prop="gender"
            label="性别"
            align="center"
            show-overflow-tooltip
            min-width="50"
          />
          <el-table-column
            prop="firstlogintime"
            label="首次登录游戏时间"
            align="center"
            show-overflow-tooltip
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.firstlogintime| toDateByTimezone }}
            </template>
          </el-table-column>

          <el-table-column
            prop="lastlogintime"
            label="最后登录时间"
            align="center"
            show-overflow-tooltip
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.lastlogintime| toDateByTimezone }}
            </template>
          </el-table-column>

          <el-table-column
            prop="registerip"
            label="注册ip"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="loginip"
            label="登录ip"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="viplv"
            label="vip等级"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="lv"
            label="等级"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="curexp"
            label="当前经验值"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="coin"
            label="金币"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="gold"
            label="元宝"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="guild"
            label="所在公会"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="guildjob"
            label="公会职称"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <!-- <el-table-column
            prop="attr"
            label="角色属性"
            align="center"
            show-overflow-tooltip
            min-width="100"
          /> -->
          <!-- <el-table-column
            prop="hero"
            label="英雄信息"
            align="center"
            show-overflow-tooltip
            min-width="100"
          /> -->
          <!-- <el-table-column
            prop="equip"
            label="玩家装备信息"
            align="center"
            show-overflow-tooltip
            min-width="100"
          /> -->
          <el-table-column
            prop="suspend"
            label="玩家是否封停"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="suspendtime"
            label="玩家封停时间"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            prop="power"
            label="玩家战力"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />


          <el-table-column
            label="其他信息"
            width="220px"
            align="center"
            :resizable="true"
          >
            <template slot-scope="{row}">
              <el-link @click="showDetail(row)" icon="el-icon-edit" type="primary" :underline="false" >查看英雄详情</el-link>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="220px"
            align="center"
            :resizable="true"
          >
            <template slot-scope="{row}">
              <el-link @click="editName(row)" icon="el-icon-edit" type="primary" :underline="false" >改名</el-link>
              <el-link @click="editItem(row)" icon="el-icon-edit" type="primary" :underline="false" >删道具</el-link>
              <el-link @click="editCurrency(row)" icon="el-icon-edit" type="primary" :underline="false" >修改道具</el-link>
              <el-link @click="SetFrozen(row)" icon="el-icon-edit" type="primary" :underline="false" >封号</el-link>
              <el-link @click="EditUser(row,'SetRelieveFrozen')" icon="el-icon-edit" type="primary" :underline="false" >解封</el-link>
              <el-link @click="EditUser(row,'KickClient')" icon="el-icon-edit" type="primary" :underline="false" >踢下线</el-link>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>


    <el-dialog title="修改玩家名称" :visible.sync="editNameShow" width="400px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
      <el-input v-model="editForm.ChangeName"></el-input>
      <div slot="footer">
        <el-button @click="editNameShow=false">取消</el-button>
        <el-button type="primary" @click="saveName">保存</el-button>
      </div>
    </el-dialog> 

    <el-dialog title="道具删除" :visible.sync="editItemShow" width="400px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
      <el-input v-model.number="editForm.Itemid"  placeholder="输入删除的道具id"></el-input>
      <div slot="footer">
        <el-button @click="editItemShow=false">取消</el-button>
        <el-button type="primary" @click="saveItem">保存</el-button>
      </div>
    </el-dialog> 




    <el-dialog title="修改道具" :visible.sync="editCurrencyShow" width="600px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false"  custom-class="ele-dialog-form">

      <el-form :model="editForm" ref="editForm" label-width="100px">
        <el-row >
          <el-col :sm="20">
            <el-form-item label="道具id：">
              <el-input v-model.number="editForm.Itemid" placeholder="" clearable/>
            </el-form-item>
            <el-form-item label="道具数量：">
              <el-input v-model.number="editForm.Num" placeholder="" clearable/>
            </el-form-item>            
          </el-col>

        </el-row>
      </el-form>

      <div slot="footer">
        <el-button @click="editCurrencyShow=false">取消</el-button>
        <el-button type="primary" @click="saveCurrency">保存</el-button>
      </div>
    </el-dialog>


    <el-dialog title="封号" :visible.sync="SetFrozenShow" width="600px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false"  custom-class="ele-dialog-form">

      <el-form :model="editForm" ref="editForm" label-width="150px">
        <el-row >
          <el-col :sm="20">
            <el-form-item label="封号到的时间：">
    
            <el-date-picker
              v-model="editForm.time"
              type="datetime"
              value-format="timestamp">
            </el-date-picker>

            </el-form-item>           
          </el-col>

        </el-row>
      </el-form>

      <div slot="footer">
        <el-button @click="editCurrencyShow=false">取消</el-button>
        <el-button type="primary" @click="saveSetFrozen">保存</el-button>
      </div>
    </el-dialog>


    <el-dialog title="英雄信息" :visible.sync="detailShow" width="1500px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
    <template>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="cfgid"
          label="配置id 对应cfg_hero_info"
          width="180">
        </el-table-column>
        <el-table-column
          prop="advid"
          label="进阶id 对应cfg_hero_advance_info"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="等级">
        </el-table-column>
        <el-table-column
          prop="exp"
          label="经验">
        </el-table-column>   
        <el-table-column
          prop="bookid"
          label="图鉴id">
        </el-table-column>  


        <el-table-column
          prop="equiplist"
          label="玩家装备信息"
          align="center"
          show-overflow-tooltip
          min-width="180"
        >
          <template slot-scope="{row}">
            {{ row.equiplist }}
          </template>
        </el-table-column>
    
        <el-table-column
          prop="attrlist"
          label="玩家属性信息"
          align="center"
          min-width="180"
        >
          <template slot-scope="{row}">

          <el-popover trigger="hover" placement="top"  width="350">
              <p><pre>{{ JSON.stringify(row.attrlist, null, "\t") }}</pre></p>
              <div slot="reference" >
                {{ row.attrlist }}
              </div>
            </el-popover>
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
        url: '/gm/doRequest?method=playerList',
        method: 'post',
        where: { serverId: 1 }
      }, // 表格配置
      serverList: [],
      editNameShow:false,
      editItemShow:false,
      editCurrencyShow:false,
      SetFrozenShow:false,
      editForm:{},
      detailShow:false,
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
        ServerId:row.serverid,
        Acc :row.account ,
        ChangeName:row.name
      })
      this.editNameShow = true
    },
    editItem(row){
      this.editForm = Object.assign({},{
        ServerId:row.serverid,
        Acc :row.account ,
        Itemid:row.Itemid
      })
      this.editItemShow = true
    },

    SetFrozen(row){

      this.editForm = Object.assign({},{
        ServerId:row.serverid,
        Acc :row.account ,
      })      
      this.SetFrozenShow = true
    },


    editCurrency(row){
      this.editForm = Object.assign({},{
        ServerId:row.serverid,
        Acc :row.account ,
        Itemid:row.Itemid,
        Num:row.Num
      })
      this.editCurrencyShow = true
    },


    EditUser(row, method){

        var op = {"SetFrozen":"封号", "SetRelieveFrozen":"解封号", "KickClient":"踢下线"}
        this.$confirm('确定要执行'+ op[method] +'操作吗?', '提示', {type: 'warning'}).then(() => {
          const loading = this.$loading({lock: true});
          this.$http
            .post('/gm/doRequest?method='+ method,{
                ServerId:row.serverid,
                Acc :row.account 
              })
            .then(res => {
              loading.close();
              const { code, msg } = res.data;
              // console.log(data,code,message)
              if (+code === 200) {
                // this.serverList = data;
                this.$message.success('操作成功！')
                this.$refs.table.reload();
                this.editNameShow = false
              } else {
                this.$message.error(msg);
              }
            }).catch(err => {
              loading.close();
              this.$message.error(err.message)});
        }).catch(() => 0);
    },
  


    saveName(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=ChangePlayerName',this.editForm)
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

    saveItem(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=delitem',this.editForm)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('操作成功！')
            this.editItemShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },

    saveCurrency(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=changecurrency',this.editForm)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('操作成功！')
            this.editItemShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },
    saveSetFrozen(){
      const loading = this.$loading({lock: true});
      this.editForm.time
      const params =  Object.assign({}, this.editForm);
      params.time = params.time/1000
      this.$http
        .post('/gm/doRequest?method=SetFrozen',params)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('操作成功！')
            this.SetFrozenShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },



    showDetail(row){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=playerList',{'serverId':this.table.where.serverId, 'acc':row.account})
        .then(res => {
          var { data, code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            data = data[0] || {};
            this.tableData = data.hero || [];
          } else {
            this.$message.error(msg);
          }
          loading.close();
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});

      this.detailShow = true
    },   



  }
};
</script>
