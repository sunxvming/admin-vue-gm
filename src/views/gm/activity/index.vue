<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="table.where" label-width="77px" class="ele-form-search"
               @keyup.enter.native="$refs.table.reload()" @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="4" :sm="12">
            <el-form-item label="活动名称:">
              <el-input v-model="table.where.name" placeholder="请输入活动名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="9" :sm="12">
            <div class="ele-form-actions">
              <!-- <el-button type="primary" @click="$refs.table.reload()" icon="el-icon-search" class="ele-btn-icon">查询
              </el-button> -->
              <el-button @click="showEdit=true" type="primary" icon="el-icon-plus" class="ele-btn-icon" >添加</el-button>
              <el-button @click="exportdata()" type="primary" class="ele-btn-icon" >导出文件</el-button>

              <el-upload
                style="display: inline-block;margin-left: 10px;margin-right: 10px;"
                ref="upload"
                :action="action"
                :before-upload="BeforeUpload"
                :on-success="SuccessUpload"
                accept=".xls,.xlsx"
                :headers="getHeader"
                :show-file-list="false"
                multiple
                :limit="1"
                :file-list="fileList"
              >
                <el-button type="primary" icon="el-icon-plus" class="ele-btn-icon"  >导入文件
                </el-button>
                    <!-- <div
                      slot="tip"
                      class="el-upload__tip"
                    >只能上传xls/xlsx文件</div> -->
              </el-upload>
              <el-popconfirm title="确定要发布活动活动吗？" @confirm="pub_activity()" class="ele-action">
                <el-button slot="reference"  type="danger" :underline="false" >发布活动</el-button>
              </el-popconfirm>

            </div>
          </el-col>
        </el-row>
      </el-form>
      <div style="    margin-left: 20px;
    margin-bottom: 10px;">
        活动配置地址：
        <div>测试服: <a :href="test_activity_url">{{this.test_activity_url}}</a></div>
        <div>正式服: <a :href="activity_url">{{this.activity_url}}</a></div>
      </div>

      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 260px)" highlight-current-row>
        <template >
          <el-table-column type="selection" width="45" align="center" fixed="left"/>

          <el-table-column prop="id" label="活动编号" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="serverIds" label="游戏服" sortable="custom" show-overflow-tooltip min-width="110"/>
          <!-- <el-table-column prop="groupId" label="活动组id" sortable="custom" show-overflow-tooltip min-width="110">
            <template slot-scope="{row}">
                {{ activity_type_map[row.groupId] }}
            </template>
          </el-table-column>   -->
          <el-table-column prop="data1" label="活动子id" sortable="custom" show-overflow-tooltip min-width="110"/>
          <!-- <el-table-column prop="timeType" label="活动类型" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
                {{ act_type_list[row.activityType-1] ? act_type_list[row.activityType-1].name : '-'}}
            </template>
          </el-table-column> -->
          <el-table-column prop="openLevel" label="开启等级(可不填)" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="timeType" label="开启时间类型" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
                {{ time_type_list[row.timeType-1] ? time_type_list[row.timeType-1].name : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="openTime" label="开启时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
                {{ row.openTime }}
              </template>
          </el-table-column>
          <el-table-column prop="closeTime" label="结束时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
              {{ row.closeTime  }}
            </template>
          </el-table-column>
          <el-table-column prop="stopTime" label="截止时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
              {{ row.stopTime  }}
            </template>
          </el-table-column>          
          <el-table-column prop="wDay" label="开启星期日期" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="closeDay" label="开启后持续多少天后关闭" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="stopDay" label="截止开启后持续多少天后关闭" sortable="custom" show-overflow-tooltip min-width="80"/>

          <el-table-column prop="showPlace" label="弹窗位置" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
              {{ show_Place_list[row.showPlace-1] ? show_Place_list[row.showPlace-1].name : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="iscycleShow" label="是否循环弹窗" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
              {{row.activityType != 2 ? '-':(iscycle_show_list[row.iscycleShow] ? iscycle_show_list[row.iscycleShow].name : '-')}}
            
            </template>
          </el-table-column>

          <el-table-column prop="sort" label="同类型排序" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="updateType" label="刷新频率" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">
                {{ update_type_list[row.updateType-1] ? update_type_list[row.updateType-1].name: '-'}} 
            </template>
          </el-table-column>
          <!-- <el-table-column prop="group" label="group(目前未用到，可不填)" sortable="custom" show-overflow-tooltip min-width="80"/> -->
          

          <!-- <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.createdAt }}</template>
          </el-table-column>
          <el-table-column label="修改时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.updatedAt }}</template>
          </el-table-column>        -->
          
      

          <el-table-column label="操作" width="230px" align="center" :resizable="false"  fixed="right">
            <template slot-scope="{row}">
              <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false" >修改</el-link>
              <el-popconfirm title="确定要删除此活动吗？" @confirm="remove(row)" class="ele-action">
                <el-link slot="reference" icon="el-icon-delete" type="danger" :underline="false" >删除</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="editForm.id?'修改活动':'添加活动'" :visible.sync="showEdit" width="1000px"
               @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false"  :lock-scroll="false" >
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="230px">
        
        <el-row :gutter="15">
          <el-col :sm="15">        
            <el-form-item label="服务器：" prop=[1,2,3]>
              <el-select v-model="editForm.serverIds" placeholder="" class="ele-block" clearable multiple>
                <el-option
                  v-for="item in serverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
<!-- 
            <el-form-item label="活动组id:" prop="groupId">
              <el-select v-model="editForm.groupId" placeholder="" class="ele-fluid" clearable>
                <el-option
                  v-for="item in activity_type_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="活动类型:" prop="activityType">
              <el-select v-model="editForm.activityType" placeholder="" class="ele-fluid" clearable>
                <el-option
                  v-for="item in act_type_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="活动编号:" prop="subId">
              <el-input v-model="editForm.subId"  clearable/>
            </el-form-item> -->

            <!-- <el-form-item label="活动子id:" prop="data1">
              <el-input v-model="editForm.data1"  clearable/>
            </el-form-item> -->

            <el-form-item label="活动子id:" prop="data1">
              <el-select v-model="editForm.data1" placeholder="" class="ele-fluid" filterable clearable>
                <el-option
                  v-for="item in activity_list"
                  :key="item.id"
                  :label="item.id + item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                  
                ></el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="开启等级:" prop="openLevel">
              <el-input v-model.number="editForm.openLevel" type="number"  clearable/>
            </el-form-item>
            
            <el-form-item label="刷新频率:" prop="updateType">
              <el-select v-model="editForm.updateType" placeholder="" class="ele-fluid" value=5 clearable>
                <el-option
                  v-for="item in update_type_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="开启时间类型:" prop="timeType">
              <el-select v-model="editForm.timeType" placeholder="" class="ele-fluid" clearable>
                <el-option
                  v-for="item in time_type_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"

                ></el-option>
              </el-select>
            </el-form-item>



            
            <el-form-item label="开启时间:"  prop="openTime" v-show="editForm.timeType==1">
              <el-date-picker
              v-model="editForm.openTime"
              type="datetime"
                format="yyyy|M|d|H|m|s"
                value-format="yyyy|M|d|H|m|s">
              </el-date-picker>
            </el-form-item>   
            <el-form-item label="开启时间:"  prop="openTime" v-show="editForm.timeType==4||editForm.timeType==5">
              <el-input v-model="editForm.openTime"  placeholder="天|时|分|秒" clearable/>
            </el-form-item>       
            
            
            <el-form-item label="结束时间:"  prop="closeTime" v-show="editForm.timeType==1">
              <el-date-picker
              v-model="editForm.closeTime"
                type="datetime"
                format="yyyy|M|d|H|m|s"
                value-format="yyyy|M|d|H|m|s">
              </el-date-picker>
            </el-form-item>   

            <el-form-item label="截止时间:"  prop="stopTime" v-show="editForm.timeType==1">
              <el-date-picker
              v-model="editForm.stopTime"
                type="datetime"
                format="yyyy|M|d|H|m|s"
                value-format="yyyy|M|d|H|m|s">
              </el-date-picker>
            </el-form-item>  

            <el-form-item label="开启星期日期:" prop="wDay" v-show="false">
              <el-input v-model="editForm.wDay"  clearable/>
            </el-form-item>       
            <el-form-item label="开启后持续多少天后关闭:" prop="closeDay" v-show="editForm.timeType==4||editForm.timeType==5">
              <el-input v-model="editForm.closeDay"  clearable/>
            </el-form-item>   
            <el-form-item label="截止开启后持续多少天后关闭:" prop="stopDay" v-show="editForm.timeType==4||editForm.timeType==5">
              <el-input v-model="editForm.stopDay"  clearable/>
            </el-form-item>              
            
            <!-- <el-form-item label="弹窗位置:" prop="showPlace"  v-show="editForm.activityType==2"> -->
              <el-form-item label="弹窗位置:" prop="showPlace"  >
                <el-select v-model="editForm.showPlace" placeholder="" class="ele-fluid" clearable>
                  <el-option
                  v-for="item in show_Place_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否循环弹窗:" prop="iscycleShow"  >
            <!-- <el-form-item label="是否循环弹窗:" prop="iscycleShow"  v-show="editForm.activityType==2"> -->
              <el-select v-model="editForm.iscycleShow" placeholder="" class="ele-fluid" clearable>
                <el-option
                  v-for="item in iscycle_show_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="同类型排序:" prop="sort" v-show="editForm.activityType==2||editForm.activityType==3"> -->
            <el-form-item label="同类型排序:" prop="sort" >
              <el-input v-model.number="editForm.sort" type="number"  clearable/>
            </el-form-item>

            <!-- <el-form-item label="group(目前未用到，可不填):" prop="group">
              <el-input v-model="editForm.group"  clearable/>
            </el-form-item>                -->
 

          </el-col>
        </el-row>

    
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
import gm from '@/utils/gm'  


export default {
  name: "SysRole",

  data() {
    return {
      table: {url: '/activity/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {updateType:5},  // 表单数据
      editRules: {  // 表单验证规则
      },
      game_id: 0,
      test_activity_url: '',
      activity_url: '',
      
      fileList: [],
      serverList: [],
      activity_type_list :[
        {id:'continuityreward',name:'continuityreward	七日登录'},
        {id:'sevendaytask',name:'sevendaytask	七日任务'},
        {id:'getmount',name:'getmount	坐骑天下'},
        {id:'activitystage',name:'activitystage	活动关卡'},
        {id:'activeactivity',name:'activeactivity	活跃活动'},
        {id:'progift',name:'progift	进度礼包'},
        {id:'poolup1',name:'poolup1	up卡池'},
        {id:'gift',name:'gift	直购礼包'},
        {id:'battlepass1',name:'battlepass1'},
        {id:'chufashigift',name:'chufashigift 触发式礼包'},

      ],

      activity_type_map :{
        'continuityreward':'continuityreward	七日登录',
        'sevendaytask':'sevendaytask	七日任务',
        'getmount':'getmount	坐骑天下',
        'activitystage':'activitystage	活动关卡',
        'activeactivity':'activeactivity	活跃活动',
        'progift':'progift	进度礼包',
        'poolup1':'poolup1	up卡池',
        'gift':'gift	直购礼包',
        'battlepass1' : 'battlepass1',
        'chufashigift' : 'chufashigift 触发式礼包',
      },
      


      act_type_list: [
        {id: 1, name: '1.功能类型'},
        {id: 2, name: '2.礼包'},
        {id: 3, name: '3.商城商品'},
      ],

      show_Place_list : [
        {id: 1, name: '1.主界面'},
        {id: 2, name: '2.战斗结束'},
        {id: 3, name: '3.升级后'},  
      ],

      iscycle_show_list :[
        {id: 0, name: '0.开启弹一次'},
        {id: 1, name: '1.上线弹'},
        {id: 2, name: '2.跨天弹'}, 
        {id: 3, name: '3.不弹窗'}, 
      ],

      time_type_list: [
        {id: 1, name: '1.精确到日期开启关闭'},
        {id: 2, name: '2.每周几开启', disabled: true},
        {id: 3, name: '3.每月几号开启', disabled: true},
        {id: 4, name: '4.开服后持续多久开启'},
        {id: 5, name: '5.创角后持续多久开启'},
      ],
      update_type_list :[
        {id: 1, name: '1.分钟刷新'},
        {id: 2, name: '2.10分钟刷新'},
        {id: 3, name: '3.30分钟刷新'},
        {id: 4, name: '4.小时刷新'},
        {id: 5, name: '5.天刷新'},
      ],
      showFileList:false,
      activity_list :[],
    }
  },
  computed: {
    getHeader() {
      return {
        // Authorization: 'Bearer ' + localStorage.getItem('token')
        Authorization: localStorage.getItem('access_token')
      }
    },
    action() {
      let baseURL = process.env.VUE_APP_BASE_URL
      if(window.location.href.indexOf('//test') !== -1){
        baseURL = 'http://127.0.0.1:8199'
      }
      return baseURL + '/activity/import'
    }
  },
  methods: {
    /* 显示编辑 */
    edit(row) {
      this.editForm = Object.assign({}, row);
      var ids = row.serverIds.split(',');
      

      // if(this.editForm.timeType == 1){
      //   this.editForm.closeTime = this.editForm.closeTime
      //   this.editForm.openTime = this.editForm.openTime
      // }


      this.editForm.serverIds = [];
      ids.forEach(id => {
        this.editForm.serverIds.push(parseInt(id));
      });

      this.showEdit = true;
    },

    toUtcSub8(s, tz){
      if (s == '' || s == null || s == undefined) {
        return ''
      }
      let ms = s.split('|')
      ms[1]=parseInt(ms[1])-1
      let t = new Date(...ms.map(parseFloat))
      let t2 = new Date()
      t2.setTime((t.getTime()/ 1000 - tz*3600)*1000)
      t = t2
      return `${t.getFullYear()}|${t.getMonth()+1}|${t.getDate()}|${t.getHours()}|${t.getMinutes()}|${t.getSeconds()}`
    },

    fromUtcSub8(s, tz){
      if (s == '' || s == null || s == undefined) {
        return ''
      }      
      let ms = s.split('|')
      ms[1]=parseInt(ms[1])-1
      let t = new Date(...ms.map(parseFloat))
      let t2 = new Date()
      t2.setTime((t.getTime()/ 1000  + tz*3600)*1000)
      t = t2
      return `${t.getFullYear()}|${t.getMonth()+1}|${t.getDate()}|${t.getHours()}|${t.getMinutes()}|${t.getSeconds()}`
    },

    /* 保存编辑 */
    save() {
      // let r = await this.$http.get(`/games/list?id=1&page=1&limit=1`)
      // let tz = r.data.data[0].timezone
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({lock: true});
          var url = ''
          if(this.editForm.id){
            url = "/activity/update"
          }else{
            url = "/activity/add"
          }


          // if(this.editForm.timeType == 1){
          //     this.editForm.closeTime = this.editForm.closeTime
          //     this.editForm.openTime = this.editForm.openTime
          // }

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
    /* 删除 */
    remove(row) {
      if (!row) {  // 批量删除
        if (this.choose.length === 0) return this.$message.error('请至少选择一条数据');

        this.$confirm('确定要删除选中的活动吗?', '提示', {type: 'warning'}).then(() => {
          const loading = this.$loading({lock: true});
          let ids = this.choose.map(d => d.id);

          this.$http.delete('/activity/delete/' + ids.toString()).then(res => {
            loading.close();
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg});
              this.$refs.table.reload();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            loading.close();
            this.$message.error(e.message);
          });
        }).catch(() => 0);
      } else {  // 单个删除
        const loading = this.$loading({lock: true});
        this.$http.delete('/activity/delete/' + row.id ).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.$refs.table.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }
    },


    exportdata() {
      if (this.choose.length === 0) return this.$message.error('请至少选择一条数据');

      this.$confirm('确定导出所选数据吗?', '提示', {type: 'warning'}).then(() => {
        const loading = this.$loading({lock: true});
        let ids = this.choose.map(d => d.id);

        this.$http.get('/activity/export?ids=' + ids.toString(),{params: {}, responseType: 'blob'}).then(res => {
          loading.close();

          // new Blob([data])用来创建URL的file对象或者blob对象
          let url = window.URL.createObjectURL(new Blob([res.data])); 
          // 生成一个a标签
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
    
          link.download = "activity.xlsx";   
          document.body.appendChild(link);
          link.click();
          link.remove();

        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => 0);
      
    },

    importdata() {
        const loading = this.$loading({lock: true});
        this.$http.post('/activity/import', this.importForm).then(res => {
          loading.close();
          console.log("bbbbbbbbbbbbbbbb")

          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            // this.$refs.table.reload();
            window.location.reload()
            console.log("aaaaaaaaaaa")
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
  
    
    },
    BeforeUpload(file) {
      //  console.log(file.type);
      if (
        file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type == 'application/vnd.ms-excel'
      ) {
        this.showFileList = true
      } else {
        this.$message({
          message: '只能导入xls/xlsx文件',
          type: 'warning'
        })
        this.$refs.upload.clearFiles()
        this.$refs.upload.abort(file)
      }
    },
    SuccessUpload(response, file, fileList) {
      console.log(response, file, fileList)
      this.$message({
        message: '导入成功',
        type: 'success'
      })
      // window.location.reload()
      this.$refs.table.reload()
      setTimeout(() => {
        this.$refs.upload.clearFiles()
      }, 1000)
    },
    pub_activity(){
      this.$http.get('/activity/pub_activity').then(res => {
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
          this.$refs.table.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },

  },

  mounted() {
    gm.getServerList(this);
    gm.getGMTable("activity").then(res => {
      this.activity_list = res;
    });

    gm.getCurrentGameId("activity").then(res => {
      let gameId = res
      let test_url = `https://gamecenter-img.s3.us-west-1.amazonaws.com/gm/conf/test_activity_${gameId}.json`
      this.test_activity_url  = test_url

      let url = `https://gamecenter-img.s3.us-west-1.amazonaws.com/gm/conf/activity_${gameId}.json`
      this.activity_url = url
    });

  }, 
}
</script>

<style scoped>

</style>