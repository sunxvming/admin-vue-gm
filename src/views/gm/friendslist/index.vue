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
              <el-input v-model="table.where.name"  clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="账号ID:">
              <el-input v-model="table.where.acc"  clearable/>
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
            prop="pid"
            label="好友pid"
            width="200"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />          
          <el-table-column
            prop="name"
            label="好友名字"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />        
        </template>
      </ele-data-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'gm',
  data() {
    return {
      table: {
        url: '/gm/doRequest?method=QueryFriends',
        method: 'post',
        where: {serverId: 1 }
      }, // 表格配置
      serverList: []
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
  }
};
</script>
