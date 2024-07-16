<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="table.where"
        label-width="77px"
        class="ele-form-search"
        @keyup.enter.native="query"
        @submit.native.prevent
      >
        <el-row :gutter="15">

          <el-col :md="4" :sm="12" >
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
            <el-form-item label="系统:">
              <el-select
                v-model="table.where.os"
                placeholder="请选择"
                clearable
                class="ele-fluid"
              >
                <el-option label="安卓" value="android" />
                <el-option label="IOS" value="ios" />
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


          <el-col :md="4" :sm="12"  v-show="show_list(['resource_change','order','level_up'])">
            <el-form-item label="玩家名字:">
              <el-input v-model="table.where.roleName" placeholder="" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12" v-show="show_list(['resource_change','order','level_up'])">
            <el-form-item label="账号ID:">
              <el-input v-model="table.where.uid" placeholder="" clearable/>
            </el-form-item>
          </el-col>

          <el-col :md="4" :sm="12" v-show="show_list(['resource_change','order','level_up'])">
            <el-form-item label="sdk_id:">
              <el-input v-model="table.where.sdkId" placeholder="" clearable/>
            </el-form-item>
          </el-col>      
          <el-col :md="4" :sm="12" v-show="show_list(['resource_change','order','level_up'])">
            <el-form-item label="pid:">
              <el-input v-model="table.where.pid" placeholder="" clearable/>
            </el-form-item>
          </el-col>  


          <el-col :md="4" :sm="12" v-show="show_list(['order'])">
            <el-form-item label="平台方订单号:">
              <el-input v-model="table.where.OrderSn" placeholder="" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12" v-show="show_list(['order'])">
            <el-form-item label="cp订单号:">
              <el-input v-model="table.where.CpOrderSn" placeholder="" clearable/>
            </el-form-item>
          </el-col>   


          <el-col :md="4" :sm="12" v-show="show_list(['resource_change'])">
            <el-form-item label="道具id:">
              <el-input v-model="table.where.ItemId" placeholder="" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12" v-show="show_list(['resource_change'])">
            <el-form-item label="道具名字:">
              <el-input v-model="table.where.ItemName" placeholder="" clearable/>
            </el-form-item>
          </el-col>   


          <el-col :md="4" :sm="12">
            <div class="ele-form-actions">
              <el-button
                type="primary"
                @click="select_menu()"
                icon="el-icon-search"
                class="ele-btn-icon"
              >
                查询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <ele-data-table
        ref="table"
        :config="table"
        height="calc(100vh - 260px)"
        highlight-current-row
      >
        <template>
          <el-table-column v-for="item in fieldList" :key="item.field" :prop="item.field" :label="item.label" :width="item.width" :align="item.align" :show-overflow-tooltip="item.showOverflowTooltip" :min-width="item.minWidth"/>          
        </template>
      </ele-data-table>

    </el-card>
  </div>
</template>

<script>

import gm from '@/utils/gm'  


export default {
  name: 'test',
  components: {},
  data() {
    return {
      data: [], // 列表数据

      table: {
        url: '',
        method: 'get',
        where: { serverId: 1 }
      },
      serverList: [],
      fieldList: [],
      method_name : '',
      where:{}
    };
  },
  watch: {
    $route: {
      handler() {
        this.select_menu();

      },
      deep: true,
    },
  },
  mounted() {
    this.select_menu();
    gm.getServerList(this);

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
    
    select_menu(){


      var level_up = [
        {
          field: 'serverId',
          label: '服务器id',
        },
        {
          field: 'os',
          label: 'os',
        },
        {
          field: 'channel',
          label: '渠道',
        },     
        {
          field: 'country',
          label: '国家',
        }, 
        {
          field: 'gameVersions',
          label: '游戏版本',
        }, 
        {
          field: 'sdkId',
          label: 'sdk_id',
        },                   
        {
          field: 'uid',
          label: 'uid',
        },
        {
          field: 'pid',
          label: 'pid',
        },        
        {
          field: 'roleId',
          label: 'roleId',
        },
        {
          field: 'roleName',
          label: '角色名',
        },     
        {
          field: 'time',
          label: '时间',
        },            
        {
          field: 'levelBefore',
          label: '升级前等级',
        },
        {
          field: 'levelAfter',
          label: '升级后等级',
        },
        {
          field: 'award',
          label: '升级奖励',
        }                                                                                         
      ]

      var order =  [
        {
          field: 'serverId',
          label: '服务器id',
        },
        {
          field: 'os',
          label: 'os',
        },
        {
          field: 'channel',
          label: '渠道',
        },     
        {
          field: 'country',
          label: '国家',
        }, 
        {
          field: 'gameVersions',
          label: '游戏版本',
        }, 
        {
          field: 'sdkId',
          label: 'sdk_id',
        },                   
        {
          field: 'uid',
          label: 'uid',
        },
        {
          field: 'pid',
          label: 'pid',
        },        
        {
          field: 'roleId',
          label: 'roleId',
        },
        {
          field: 'roleName',
          label: '角色名',
        },     
        {
          field: 'time',
          label: '时间',
        },            
        {
          field: 'cpOrderSn',
          label: '游戏方订单编号',
        },   
        {
          field: 'orderSn',
          label: '平台方订单号',
        },
        {
          field: 'money',
          label: '充值金额',
        },
        {
          field: 'goodsId',
          label: '商品ID',
        },
        {
          field: 'goodsName',
          label: '商品名称',
        },    
        {
          field: 'rechargeId',
          label: '档位id',
        },   
        {
          field: 'rechargeName',
          label: '档位名字',
        },                                                                                                                                     
        {
          field: 'payType',
          label: '支付方式',
        },      
        {
          field: 'isSandbox',
          label: '是否沙盒订单',
        }, 
        {
          field: 'isSubscription',
          label: '是否为订阅商品',
        }, 
        {
          field: 'subscriptionEvent',
          label: '订阅事件的类型',
        },        
      
      ]

      var resource_change =  [
        {
          field: 'serverId',
          label: '服务器id',
        },
        {
          field: 'os',
          label: 'os',
        },
        {
          field: 'channel',
          label: '渠道',
        },     
        {
          field: 'country',
          label: '国家',
        }, 
        {
          field: 'gameVersions',
          label: '游戏版本',
        }, 
        {
          field: 'sdkId',
          label: 'sdk_id',
        },                   
        {
          field: 'uid',
          label: 'uid',
        },
        {
          field: 'pid',
          label: 'pid',
        },        
        {
          field: 'roleId',
          label: 'roleId',
        },
        {
          field: 'roleName',
          label: '角色名',
        },     
        {
          field: 'time',
          label: '时间',
        },            
        {
          field: 'itemId',
          label: '道具id',
        },
        {
          field: 'itemName',
          label: '道具名',
        },    
        {
          field: 'source',
          label: '来源',
        }, 
        {
          field: 'obtainNum',
          label: '获得数量',
        }, 
        {
          field: 'consumeType',
          label: '消耗类型',
        },  
        {
          field: 'consume',
          label: '消耗数量',
        },                                                                                        
      ]

      var vip_up =  [
        {
          field: 'serverId',
          label: '服务器id',
        },
        {
          field: 'os',
          label: 'os',
        },
        {
          field: 'channel',
          label: '渠道',
        },     
        {
          field: 'country',
          label: '国家',
        }, 
        {
          field: 'gameVersions',
          label: '游戏版本',
        }, 
        {
          field: 'sdkId',
          label: 'sdk_id',
        },                   
        {
          field: 'uid',
          label: 'uid',
        },
        {
          field: 'pid',
          label: 'pid',
        },        
        {
          field: 'roleId',
          label: 'roleId',
        },
        {
          field: 'roleName',
          label: '角色名',
        },     
        {
          field: 'time',
          label: '时间',
        },            
        {
          field: 'vipLevel',
          label: 'VIP等级',
        }                                                                                         
      ]
      
      var private_chat =  [
        {
          field: 'serverId',
          label: '服务器id',
        },
        {
          field: 'os',
          label: 'os',
        },
        {
          field: 'channel',
          label: '渠道',
        },     
        {
          field: 'country',
          label: '国家',
        }, 
        {
          field: 'gameVersions',
          label: '游戏版本',
        }, 
        {
          field: 'sdkId',
          label: 'sdk_id',
        },                   
        {
          field: 'uid',
          label: 'uid',
        },
        {
          field: 'pid',
          label: 'pid',
        },        
        {
          field: 'roleId',
          label: 'roleId',
        },
        {
          field: 'roleName',
          label: '角色名',
        },     
        {
          field: 'time',
          label: '时间',
        },            
        {
          field: 'chatPid',
          label: '对方pid',
        },            
        {
          field: 'chatUid',
          label: '对方账号id',
        } ,            
        {
          field: 'chatSdkId',
          label: '对方sdk_id',
        } ,            
        {
          field: 'chatRolename',
          label: '对方名字',
        } ,            
        {
          field: 'content',
          label: '聊天内容',
        }

      ]
      
      var public_chat =  [
        {
          field: 'serverId',
          label: '服务器id',
        },
        {
          field: 'os',
          label: 'os',
        },
        {
          field: 'channel',
          label: '渠道',
        },     
        {
          field: 'country',
          label: '国家',
        }, 
        {
          field: 'gameVersions',
          label: '游戏版本',
        }, 
        {
          field: 'sdkId',
          label: 'sdk_id',
        },                   
        {
          field: 'uid',
          label: 'uid',
        },
        {
          field: 'pid',
          label: 'pid',
        },        
        {
          field: 'roleId',
          label: 'roleId',
        },
        {
          field: 'roleName',
          label: '角色名',
        },     
        {
          field: 'time',
          label: '时间',
        },            
        {
          field: 'content',
          label: '聊天内容',
        },{
          field: 'chatChannel',
          label: '聊天频道',
        }

      ]



      var menu_list = {
        'level_up': level_up,
        'order': order,
        'resource_change':resource_change,
        'vip_up':vip_up,
        'private_chat':private_chat,
        'public_chat':public_chat,
      }

      var url = window.location.href
      this.method_name = url.substring(url.lastIndexOf('/') + 1)
      
      this.table.url = '/game_log/'+this.method_name;

      this.fieldList = menu_list[this.method_name];

      // this.table.where.startTime = gm.timeByZone(this.where.startTime);
      // this.table.where.endTime = gm.timeByZone(this.where.endTime);

      this.table.where.startTime = this.where.startTime/1000;
      this.table.where.endTime = this.where.endTime/1000;

      console.log(this.table.where)
      this.$refs.table.reload()
    }

  }
};

</script>
