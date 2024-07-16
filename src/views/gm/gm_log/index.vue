<template>
  <div class="ele-body">
    <el-card shadow="never">


      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 315px)" highlight-current-row>
        <template slot-scope="{index}">
          <!-- <el-table-column type="selection" width="45" align="center" fixed="left"/> -->
          <el-table-column type="index" :index="index" label="ID" width="60" align="center" fixed="left" show-overflow-tooltip/>
          <el-table-column prop="game_name" label="游戏" sortable="custom" show-overflow-tooltip min-width="50"/>
          <el-table-column prop="user" label="发送人" sortable="custom" show-overflow-tooltip min-width="40"/>
          <el-table-column label="请求时间" sortable="custom" show-overflow-tooltip min-width="60">
            <template slot-scope="{row}">{{ row.createdAt }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" sortable="custom" show-overflow-tooltip min-width="30">
            <template slot-scope="scope">
              {{ handleStatus(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="api" label="查询接口" sortable="custom" show-overflow-tooltip min-width="50"/>
          <el-table-column prop="param" label="发送参数" sortable="custom" show-overflow-tooltip min-width="200"/>
          <el-table-column prop="result" label="返回结果" sortable="custom" show-overflow-tooltip min-width="300"/>

        </template>
      </ele-data-table>
    </el-card>

  </div>
</template>

<script>
// import uploadImage from '@/components/uploadImage'
import { mapGetters } from "vuex";
export default {
  name: "SysUser",
  data() {
    return {
      table: {url: '/gm_log/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {Items:[{itemid:'',itemNum:''}]},  // 表单数据
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
      serverList:[]
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
    handleStatus(type) {
      switch (String(type)) {
        case '1':
          return '成功';
        case '2':
          return '失败';
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