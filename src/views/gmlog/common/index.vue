<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="110px"
        class="ele-form-search"
        @keyup.enter.native="query"
        @submit.native.prevent
      >
        <el-row :gutter="15">

          <el-col :md="4" :sm="12" v-show="not_show_list(['game_startup'])">
            <el-form-item label="选择区服:">
              <el-select
                v-model="where.serverId"
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

          <el-col :md="4" :sm="12" v-show="not_show_list(['game_startup'])">
            <el-form-item label="系统:">
              <el-select
                v-model="where.os"
                placeholder="请选择"
                clearable
                class="ele-fluid"
              >
                <el-option label="安卓" value="android" />
                <el-option label="IOS" value="ios" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="4" :sm="12" v-show="show_list(['game_startup'])">
            <el-form-item label="系统:">
              <el-select
                v-model="where.os_type"
                placeholder="请选择"
                clearable
                class="ele-fluid"
              >
                <el-option label="安卓" value="1" />
                <el-option label="IOS" value="2" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="4" :sm="12" v-show="show_list(['game_startup'])">
            <el-form-item label="版本:">
              <el-select
                v-model="where.version"
                placeholder="请选择"
                clearable
                class="ele-fluid"
              >
                <el-option v-for="(i,idx) in version" :key="idx" :label="i" :value="i"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">        
            <el-form-item label="开始时间:"  >
              <el-date-picker
                v-model="where.startTime"
                type="datetime"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>        
          </el-col>
          <el-col :md="4" :sm="12">        
            <el-form-item label="结束时间:" >
              <el-date-picker
                v-model="where.endTime"
                type="datetime"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>        
          </el-col>

          <el-col :md="4" :sm="12" >
            <el-form-item label="选择国家:">
              <el-select
                v-model="where.country"
                placeholder="请选择"
                clearable
                filterable 
                multiple 
                class="ele-fluid"
              >
                <el-option
                  v-for="item in countryList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

  


          <el-col :md="4" :sm="12" v-show="show_list(['PlayingPartIn'])">
            <el-form-item label="玩法类型:"  >
              <el-select v-model="where.playing_type" placeholder="" class="ele-fluid" clearable>
                <el-option
                  v-for="item in playing_type_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :md="4" :sm="12" v-show="show_list(['PlayingPass'])">
            <el-form-item label="玩法类型:"  >
              <el-select v-model="where.playing_type" placeholder="" class="ele-fluid" clearable>
                <el-option
                  v-for="item in playing_type_list_pass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :md="4" :sm="12" v-show="show_list(['AbnormalDevice'])">
            <el-form-item label="创建数量:"  >
              <el-input v-model.number="where.create_num" type="number"  clearable/>
            </el-form-item>
          </el-col>


          <!-- <el-col :md="4" :sm="12" v-show="show_list(['OrderLog','FirstPayLog'])">
            <el-form-item label="是否沙盒:">
              <el-select
                v-model.number="where.is_sandbox"
                placeholder="请选择"
                clearable
                class="ele-fluid"
              >
                <el-option label="是" value=1 />
                <el-option label="否" value=0 />
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :md="4" :sm="12">
            <div class="ele-form-actions">
              <el-button
                type="primary"
                @click="query"
                icon="el-icon-search"
                class="ele-btn-icon"
              >
                查询
              </el-button>
              <el-button class="ele-btn-icon" type="primary" @click="exportFile()">导出数据</el-button>

            </div>
          </el-col>

    
          <!-- <el-col :md="4" :sm="12" v-show="show_list(['DrawCardLog'])">
            <el-form-item label="账号ID:">
              <el-input v-model="where.uid" placeholder="" clearable/>
            </el-form-item>
          </el-col> -->

          <el-col :md="4" :sm="12" v-show="show_list(['DrawCardLog'])">
            <el-form-item label="sdk_id:">
              <el-input v-model="where.sdkId" placeholder="" clearable/>
            </el-form-item>
          </el-col>      
          <el-col :md="4" :sm="12" v-show="show_list(['DrawCardLog'])">
            <el-form-item label="pid:">
              <el-input v-model="where.pid" placeholder="" clearable/>
            </el-form-item>
          </el-col>  


        </el-row>
      </el-form>
      <!-- 数据表格 -->


      <el-table
        ref="table"
        :data="data"
        v-loading="loading"
        row-key="id"
        default-expand-all
        border
        height="calc(100vh - 215px)"
        highlight-current-row
        lazy
      >
        <el-table-column v-for="item in fieldList" :key="item.field" :prop="item.field" :label="item.label" :width="item.width" :align="item.align" :show-overflow-tooltip="item.showOverflowTooltip" :min-width="item.minWidth">   
          <el-table-column v-for="sub in item.sub" :key="sub.field" :prop="sub.field" :label="sub.label" :width="sub.width" :align="sub.align" :show-overflow-tooltip="sub.showOverflowTooltip" :min-width="sub.minWidth"/>   
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

import gm from '@/utils/gm'  
import elTableExport from "el-table-export";


export default {
  name: 'test',
  components: {},
  data() {
    return {
      loading: true, // 加载状态
      data: [], // 列表数据
      where: {create_num:10}, // 搜索条件
      datePicker: [],
      fieldList: [], // 字段列表
      serverList: [],

      method_name : '',
      countryList: gm.countryList,
      version:[],

      playing_type_list: [
        {id: 'custom', name: '主线关卡'},
        {id: 'maze', name: '地牢冒险'},
        {id: 'climbingtower', name: '爬塔'},
        {id: 'rebel', name: '讨伐巨兽'},
        {id: 'arena', name: '竞技场'},
        {id: 'mystery', name: '游戏公园(小游戏)'},
        {id: 'territory ', name: '秘密花园(花偶)'},

      ],


      playing_type_list_pass: [
        {id: 'custom', name: '主线关卡'},
        {id: 'maze', name: '地牢冒险'},
        {id: 'mystery', name: '游戏公园(小游戏)'},
      ],


    };
  },
  watch: {
    $route: {
      handler() {
        this.query();
      },
      deep: true,
    },
  },
  mounted() {
    gm.getServerList(this);
    this.query();
    this.getVersion();

  },
  methods: {

    show_list(method_list){
      for(let i=0;i<method_list.length;i++){
        if(method_list[i]==this.method_name){
          return true;
        }
      }
      return false;
    },
    
    not_show_list(method_list){
      for(let i=0;i<method_list.length;i++){
        if(method_list[i]==this.method_name){
          return false;
        }
      }
      return true;
    },

    query() {

      var url = window.location.href
      this.method_name = url.substring(url.lastIndexOf('/') + 1)
      
      this.loading = true;
      const params =  Object.assign({}, this.where);

      // console.log(params)
      // if(params.startTime == undefined ||params.endTime == undefined || params.startTime == 0 || params.endTime == 0){
      //   this.$message.error("请先选择开始和结束时间!");
      //   this.loading = false;
      //   return;
      // }

      params.startTime = gm.timeByZone(params.startTime);
      params.endTime = gm.timeByZone(params.endTime);

    
      this.$http
        .get('/game_log/' + this.method_name, { params: params })
        .then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.data = res.data.data;
            this.fieldList = res.data.fields;
          } else {
            this.$message.error(res.data.msg || '获取数据失败');
          }
        })
        .catch(e => {
          this.loading = false;
          this.$message.error(e.message);
        });
    }, 

    exportFile() {
            elTableExport(this.$refs.table, {
                fileName: this.method_name,
                type: "csv",
                withBOM: true,
                useFormatter: true,
            })
                .then(() => {
                    console.info("ok");
                })
                .catch((err) => {
                    console.info(err);
                });
        },


    getVersion() {
      this.$http
        .get('/gamestart/version')
        .then(res => {
          const { data, code, msg } = res.data;
          // console.log(data,code,message)
          if (+code === 0) {
            this.version = data;
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => this.$message.error(err.message));
    }        
  }

};

</script>
