<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="table.where" label-width="77px" class="ele-form-search"
               @keyup.enter.native="$refs.table.reload()" @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="4" :sm="12">
            <el-form-item label="用户账号:">
              <el-input v-model="table.where.username" placeholder="请输入用户账号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="用户姓名:">
              <el-input v-model="table.where.realname" placeholder="请输入用户姓名" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="4" :sm="12">
            <el-form-item label="性别:">
              <el-select v-model="table.where.gender" placeholder="请选择" clearable class="ele-fluid">
                <el-option label="男" value="1"/>
                <el-option label="女" value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12">
            <div class="ele-form-actions">
              <el-button type="primary" @click="$refs.table.reload()" icon="el-icon-search" class="ele-btn-icon">查询
              </el-button>
              <el-button @click="(table.where={})&&$refs.table.reload()">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 操作按钮 -->
      <div class="ele-table-tool ele-table-tool-default">
        <el-button @click="showEdit=true" type="primary" icon="el-icon-plus" class="ele-btn-icon" size="small" v-if="permission.includes('sys:user:add')">添加
        </el-button>
        <el-button @click="remove()" type="danger" icon="el-icon-delete" class="ele-btn-icon" size="small" v-if="permission.includes('sys:user:delete')">批量删除
        </el-button>
      </div>
      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 315px)" highlight-current-row>
        <template slot-scope="{index}">
          <el-table-column type="selection" width="45" align="center" fixed="left"/>
          <el-table-column type="index" :index="index" label="编号" width="60" align="center" fixed="left" show-overflow-tooltip/>
          <el-table-column prop="username" label="用户账号" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="realname" label="用户姓名" sortable="custom" show-overflow-tooltip min-width="110"/>
          <!-- <el-table-column label="头像" min-width="60" align="center">
            <template slot-scope="{row}">
              <el-avatar shape="square" :size="25" :src="row.avatar"/>
            </template>
          </el-table-column> -->
          <el-table-column prop="genderName" label="性别" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column prop="mobile" label="手机号" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column label="角色" show-overflow-tooltip min-width="200">
            <template slot-scope="{row}">
              <el-tag v-for="item in row.roleList" :key="item.id" type="primary" size="mini">{{
                  item.name
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="75px" sortable="custom" :resizable="false">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="2"/>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip min-width="160">
            <template slot-scope="{row}">{{ row.createdAt }}</template>
          </el-table-column>
          <el-table-column label="操作" width="220px" align="center" :resizable="false" fixed="right">
            <template slot-scope="{row}">
              <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false" v-if="permission.includes('sys:user:update')">修改</el-link>
              <el-popconfirm title="确定要删除此用户吗？" @confirm="remove(row)" class="ele-action">
                <el-link slot="reference" icon="el-icon-delete" type="danger" :underline="false" v-if="permission.includes('sys:user:delete')">删除</el-link>
              </el-popconfirm>
              <el-popconfirm title="确定要重置密码吗？" @confirm="resetPwd(row)" class="ele-action">
                <el-link slot="reference" icon="el-icon-copy-document" type="success" :underline="false" v-if="permission.includes('sys:user:resetPwd')">重置密码</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="editForm.id?'修改用户':'添加用户'" :visible.sync="showEdit" width="700px"
               @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false" custom-class="ele-dialog-form" :lock-scroll="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="100px">
        <!-- <el-form-item label="用户头像：">
          <uploadImage :limit="1" v-model="editForm.avatar"></uploadImage>
        </el-form-item> -->
        <el-row :gutter="15">
          <el-col :sm="12">
            <el-form-item label="用户账号：" prop="username">
              <el-input v-model="editForm.username" placeholder="请输入账号" clearable
                        :disabled="editForm.id?true:false"/>
            </el-form-item>
            <el-form-item label="用户姓名：" prop="realname">
              <el-input v-model="editForm.realname" placeholder="请输入用户姓名" clearable/>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
              <el-select v-model="editForm.gender" placeholder="请选择性别" class="ele-block" clearable>
                <el-option label="男" :value="1"/>
                <el-option label="女" :value="2"/>
              </el-select>
            </el-form-item>
            <el-form-item label="角色：" prop="role_ids">
              <el-select v-model="editForm.role_ids" placeholder="请选择角色" class="ele-block" clearable multiple>
                <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="手机号：">
              <el-input v-model="editForm.mobile" placeholder="请输入手机号" clearable/>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="editForm.email" placeholder="请输入邮箱" clearable/>
            </el-form-item>
            <el-form-item label="个人简介：">
              <el-input v-model="editForm.intro" placeholder="请输入个人简介" clearable/>
            </el-form-item>
            <el-form-item label="登录密码：" prop="password" v-if="!editForm.id">
              <el-input v-model="editForm.password" placeholder="请输入登录密码" show-password/>
            </el-form-item>
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
// import uploadImage from '@/components/uploadImage'

import { mapGetters } from "vuex";
export default {
  name: "SysUser",
  data() {
    return {
      table: {url: '/user/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {},  // 表单数据
      editRules: {  // 表单验证规则
        username: [
          {required: true, message: '请输入用户账号', trigger: 'blur'}
        ],
        realname: [
          {required: true, message: '请输入用户姓名', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      roleList: [],  // 角色列表
      levelList:[], // 职级列表
      positionList:[], // 岗位列表

    }
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  // components: {uploadImage},
  mounted() {
    this.queryRoles();  // 查询角色列表
  },
  methods: {
    /* 显示编辑 */
    edit(row) {
      // this.editForm = Object.assign({}, row, {
      //   role_ids: row.roleList.map(d => d.id)
      // });

      this.editForm =  {
        id: row.id,
        gender: row.gender,
        username: row.username,
        realname: row.realname,
        mobile: row.mobile,
        email: row.email,
        intro: row.intro,
        role_ids: row.roleList.map(d => d.id)
      };

      this.showEdit = true;
    },
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          console.log(this.editForm.id);
          var url = ''
          if(this.editForm.id){
            url = "/user/update"
          }else{
            url = "/user/add"
          }
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
    /* 删除 */
    remove(row) {
      console.log(row);
      if (!row) {  // 批量删除
        if (this.choose.length === 0) return this.$message.error('请至少选择一条数据');
        let ids = this.choose.map(d => d.id);
        this.$confirm('确定要删除选中的用户吗?', '提示', {type: 'warning'}).then(() => {
          const loading = this.$loading({lock: true});
          this.$http.delete('/user/delete/' + ids.toString()).then(res => {
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
        this.$http.delete('/user/delete/'+ row.id).then(res => {
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
    /**
     * 重置密码
     */
    resetPwd(row){
      const loading = this.$loading({lock: true});
        this.$http.post('/user/resetPwd', {id:row.id}).then(res => {
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
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = {"id":row.id, status:row.status};  // Object.assign({}, row);
      this.$http.put('/user/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.status = !row.status ? 2 : 1;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 查询角色列表 */
    queryRoles() {
      this.$http.get('/index/getRoleList').then(res => {
        if (res.data.code === 0) {
          this.roleList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
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