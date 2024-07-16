<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="table.where" label-width="77px" class="ele-form-search"
               @keyup.enter.native="$refs.table.reload()" @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="4" :sm="12">
            <el-form-item label="资源名称:">
              <el-input v-model="table.where.name" placeholder="请输入资源名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="9" :sm="12">
            <div class="ele-form-actions">
              <el-button type="primary" @click="$refs.table.reload()" icon="el-icon-search" class="ele-btn-icon">查询
              </el-button>
              <el-button @click="showEdit=true" type="primary" icon="el-icon-plus" class="ele-btn-icon" >添加</el-button>
              <el-button @click="remove()" type="danger" icon="el-icon-delete" class="ele-btn-icon" >批量删除</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-data-table ref="table" :config="table" :choose.sync="choose" height="calc(100vh - 260px)" highlight-current-row>
        <template >
          <el-table-column type="selection" width="45" align="center" fixed="left"/>
          <el-table-column prop="id" label="资源id" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="name" label="资源名称" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="desc" label="资源描述" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column sortable label="资源" align="center">
              <template slot-scope="{row}">
                <img :src="row.url" alt="#" style="max-width:100%">
              </template>
          </el-table-column>

          <el-table-column prop="url" label="资源url地址" sortable="custom" show-overflow-tooltip min-width="180"/>


          <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip min-width="100">
            <template slot-scope="{row}">{{ row.createdAt }}</template>
          </el-table-column>
          <el-table-column label="修改时间" sortable="custom" show-overflow-tooltip min-width="100">
            <template slot-scope="{row}">{{ row.updatedAt }}</template>
          </el-table-column>          
          <el-table-column label="操作" width="100px" align="center" :resizable="false"  fixed="right">
            <template slot-scope="{row}">
              <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false" >修改</el-link>
              <el-popconfirm title="确定要删除此资源吗？" @confirm="remove(row)" class="ele-action">
                <el-link slot="reference" icon="el-icon-delete" type="danger" :underline="false" >删除</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="editForm.id?'修改资源':'添加资源'" :visible.sync="showEdit" width="400px"
               @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false" :lock-scroll="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="82px">
        <el-form-item label="资源名称:" prop="name">
          <el-input v-model="editForm.name"  clearable/>
        </el-form-item>
        <el-form-item label="资源描述:" prop="desc">
          <el-input v-model="editForm.desc"  clearable/>
        </el-form-item>
        <el-form-item label="资源上传" prop="url">
          <el-upload
            class="upload-demo"
            action
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="uploadFile"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button
              v-if="(typeof fileList[0])=='undefined'"
              size="small"
              type="primary"
            >点击上传</el-button>
          </el-upload>
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
      table: {url: '/resources/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {},  // 表单数据
      editRules: {  // 表单验证规则
        name: [
          {required: true, message: '请输入资源名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入资源编码', trigger: 'blur'}
        ]
      },
      fileList: []

    }
  },
  methods: {
    /* 显示编辑 */
    edit(row) {
      this.editForm = Object.assign({}, row);
      this.showEdit = true;
      this.fileList = [{url:row.url}]

    },
    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({lock: true});
          var url = ''
          if(this.editForm.id){
            url = "/resources/update"
          }else{
            url = "/resources/add"
          }
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

        this.$confirm('确定要删除选中的资源吗?', '提示', {type: 'warning'}).then(() => {
          const loading = this.$loading({lock: true});
          let ids = this.choose.map(d => d.id);

          this.$http.delete('/resources/delete/' + ids.toString()).then(res => {
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
        this.$http.delete('/resources/delete/' + row.id ).then(res => {
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


    handleRemove() {
      this.fileList = []
      this.editForm.url = ''
    },
    handlePreview() {
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除${file.name || '该资源吗'}？`)
    },
    uploadFile(file, fileList) {
      this.submitFlag = true

      const isLt1M = file.size / 1024 / 1024 < 10

      if (!isLt1M) {
        this.$message.error('上传资源大小不能超过 10MB!')
        this.$refs.upload.clearFiles()
        this.files = null
        this.submitFlag = false
        return
      }
      this.files = file.raw
      // FormData 对象
      var formData = new FormData()
      // 文件对象
      formData.append('file', this.files)

      this.$http.post('/index/uploadFile',formData).then(res => {
        if (res.data.code === 200 || res.data.code === 0) {
            fileList[0]['url'] = res.data.data
            this.editForm.url = res.data.data
            this.fileList = fileList
            this.submitFlag = false
            this.$message({type: 'success', message: "上传成功"});

        } else {
          this.submitFlag = false
          this.$message.error(res.data.message);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }

  }
}
</script>

<style scoped>

</style>