<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- 操作按钮 -->
      <div class="ele-table-tool ele-table-tool-default">
        <el-button @click="setWhiteList()" type="primary" icon="el-icon-plus" class="ele-btn-icon" size="small" >设置白名单
        </el-button>

      </div>
      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 260px)" highlight-current-row>
        <template >
          <el-table-column prop="id"  label="游戏服id" width="90" align="center" fixed="left" show-overflow-tooltip/>
          <el-table-column prop="name" label="名字" align="center" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="locale" label="大区" align="center" show-overflow-tooltip min-width="100"/>

          <el-table-column prop="addr" label="地址" align="center" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="port" label="端口" align="center" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="userCount" label="在线人数" align="center" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="registeredNum" label="注册角色数" align="center" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="percentConversion" label="转化率" align="center" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="state" label="服务器状态" align="center" show-overflow-tooltip min-width="100">
            <template slot-scope="scope">
              {{ handleType(scope.row.state) }}
            </template>
          </el-table-column>
          <el-table-column prop="isRecommend" label="是否推荐服" align="center" show-overflow-tooltip min-width="120">
            <template slot-scope="{row}">
              <el-switch v-model="row.isRecommend"
                :active-value="1"
                active-text="是"
                :inactive-value="0"
                inactive-text="否"
                @change="recommendChange($event,row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isOpenServer" label="是否开服" align="center" show-overflow-tooltip min-width="100">
            <template slot-scope="{row}">
              {{ row.isOpenServer ? '开启' : '关闭' }}
            </template>
          </el-table-column>
          <el-table-column prop="openServerTime" label="开服时间" align="center" show-overflow-tooltip min-width="180">
            <template slot-scope="{row}">
              {{ row.openServerTime  | toDateByTimezone }}
            </template>
          </el-table-column>


          <el-table-column label="操作" width="500px" align="center" :resizable="true" fixed="right">
            <template slot-scope="{row}">
              <el-link @click="setState(row)" icon="el-icon-edit" type="primary" :underline="false" >设置服务器状态</el-link>
              <!-- <el-link @click="setRecommend(row)" icon="el-icon-edit" type="primary" :underline="false" >设置推荐服</el-link> -->
              <el-link @click="setOpenTime(row)" icon="el-icon-edit" type="primary" :underline="false" >设置开服时间</el-link>
              <el-link @click="editServerName(row)" icon="el-icon-edit" type="primary" :underline="false" >修改服务器名字</el-link>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>

    <el-dialog title="服务器状态" :visible.sync="stateShow" width="500px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
      <el-radio-group v-model="editForm.state">
        <el-radio :label="0" disabled>停服</el-radio>
        <el-radio :label="1">空闲</el-radio>
        <el-radio :label="2" disabled>繁忙</el-radio>
        <el-radio :label="3" disabled>爆满</el-radio>
        <el-radio :label="4">维护</el-radio>
      </el-radio-group>
      
<el-row :gutter="1">
  <el-col :md="6" style="margin-top:25px">
  维护操作方式：
  </el-col>
  <el-col :md="12" >
        <el-select
          v-model="editForm.type"
          placeholder="请选择"
          clearable
          style="margin-top: 20px;">
          <el-option label="踢到主界面" :value=0 />
          <el-option label="大退游戏" :value=1 />
        </el-select>



  </el-col>
</el-row>
        
    


      <div slot="footer">
        <el-button @click="stateShow=false">取消</el-button>
        <el-button type="primary" @click="saveState">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置开服时间" :visible.sync="timeShow" width="400px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
      <el-date-picker
        v-model="editForm.time"
        type="datetime"
        value-format="timestamp">
      </el-date-picker>
      <div slot="footer">
        <el-button @click="timeShow=false">取消</el-button>
        <el-button type="primary" @click="saveTime">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改服务器名" :visible.sync="nameShow" width="400px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false">
      <el-input v-model="editForm.serverName"></el-input>
      <div slot="footer">
        <el-button @click="nameShow=false">取消</el-button>
        <el-button type="primary" @click="saveName">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置白名单" :visible.sync="whiteShow" width="700px" @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"
               :lock-scroll="false"  custom-class="ele-dialog-form">
      <!-- <el-input v-model="editForm.serverName"></el-input> -->
      <!-- {{editForm.whitelist}} -->
      <el-form :model="editForm" ref="editForm" label-width="100px">
        <el-row>
          <el-form-item>
            <el-button @click.prevent="addItem" type="primary">新增</el-button>
          </el-form-item>
        </el-row>
        <el-row v-for="(item,index) in editForm.whitelist" :key="index">
          <el-col :sm="10">
            <el-form-item label="地址：" prop="whitelist">
              <el-input v-model="editForm.whitelist[index]" placeholder="" clearable/>
            </el-form-item>
            <!-- {{item}} -->
          </el-col>
          <el-col :sm="1" v-if="editForm.whitelist.length>=1">
            <el-button @click.prevent="removeItem(index)" size="mini" style="marginLeft:10px">x</el-button>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button @click="whiteShow=false">取消</el-button>
        <el-button type="primary" @click="saveWhiteList">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import gm from '@/utils/gm'  

export default {
  name: "gm",
  data() {
    return {
      table: {url: '/gm/doRequest', where: {method:"serverlist"}},  // 表格配置
      choose:[],
      editForm:{},
      stateShow:false,
      recommendShow:false,
      timeShow:false,
      nameShow:false,
      whiteShow:false,
    }
  },
  methods: {
    handleType(type) {
      switch (String(type)) {
        case '1':
          return '空闲';
        case '2':
          return '繁忙';
        case '3':
          return '爆满';
        case '4':
          return '维护';
        case '0':
          return '停服';
        default:
          return '-';
      }
    },
    setState(row){
      this.editForm = Object.assign({},{
        serverId:row.id,
        state:row.state
      })
      this.stateShow = true
    },
    saveState(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=setServerState',this.editForm)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('状态设置成功！')
            this.$refs.table.reload();
            this.stateShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },
    setOpenTime(row){
      console.log(row)
      const time = gm.timeToUTC8(row.openServerTime)
      this.editForm = Object.assign({},{
        time:time.valueOf(),
        serverId:row.id,
      })
      this.timeShow = true
    },
    saveTime(){
      const loading = this.$loading({lock: true});

      const params =  Object.assign({}, this.editForm);
      params.time = this.$gm.timeByZone(this.editForm.time)

      this.$http
        .post('/gm/doRequest?method=setOpenServerTime',params)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('时间设置成功！')
            this.$refs.table.reload();
            this.timeShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },
    editServerName(row){
      this.editForm = Object.assign({},{
        serverId:row.id,
        serverName:row.name
      })
      this.nameShow = true
    },
    saveName(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=changeServerName',this.editForm)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('名称设置成功！')
            this.$refs.table.reload();
            this.nameShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },
    setWhiteList(){
      const param = {}
      this.$http.post('/gm/doRequest?method=getwhitelist',param).then(res=>{
        const {code,data,msg} = res.data
        if(+code===200){
          this.editForm = Object.assign({},param,{ whitelist:data, "Reset":true })
          console.log(this,this.editForm)
          this.whiteShow = true
        }else{
          this.$message.error(msg);
        }
      }).catch(err => {
        this.$message.error(err.message)});
    },
    addItem(){
      this.editForm.whitelist.push('')
    },
    removeItem(index){
      this.editForm.whitelist.splice(index, 1)
    },
    saveWhiteList(){
      const loading = this.$loading({lock: true});
      this.$http
        .post('/gm/doRequest?method=setwhitelist',this.editForm)
        .then(res => {
          loading.close();
          const { code, msg } = res.data;
          if (+code === 200) {
            this.$message.success('设置成功！')
            this.$refs.table.reload();
            this.nameShow = false
          } else {
            this.$message.error(msg);
          }
        }).catch(err => {
          loading.close();
          this.$message.error(err.message)});
    },
    recommendChange(val,row){
      this.$http
        .post('/gm/doRequest?method=setRecommend',{serverId:row.id,IsRec:val})
        .then(res => {
          const { code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 200) {
            // this.serverList = data;
            this.$message.success('推荐状态切换成功！')
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => this.$message.error(err.message));
    },
  }
}
</script>

