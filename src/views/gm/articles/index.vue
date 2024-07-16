<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="table.where" label-width="77px" class="ele-form-search"
               @keyup.enter.native="$refs.table.reload()" @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="4" :sm="12">
            <el-form-item label="文章名称:">
              <el-input v-model="table.where.name" placeholder="请输入文章名称" clearable/>
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
          <el-table-column prop="id" label="文章id" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="name" label="文章名称" sortable="custom" show-overflow-tooltip min-width="110"/>
          <el-table-column prop="desc" label="文章描述" sortable="custom" show-overflow-tooltip min-width="80"/>
          <el-table-column label="链接地址" sortable="custom" show-overflow-tooltip min-width="150">
                <template slot-scope="{row}"><a :href="row.url" target="_blank">{{row.url}}</a></template>
          </el-table-column>

          <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.createdAt }}</template>
          </el-table-column>
          <el-table-column label="修改时间" sortable="custom" show-overflow-tooltip min-width="80">
            <template slot-scope="{row}">{{ row.updatedAt }}</template>
          </el-table-column>          
          <el-table-column label="操作" width="230px" align="center" :resizable="false"  fixed="right">
            <template slot-scope="{row}">
              <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false" >修改</el-link>
              <el-popconfirm title="确定要删除此文章吗？" @confirm="remove(row)" class="ele-action">
                <el-link slot="reference" icon="el-icon-delete" type="danger" :underline="false" >删除</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
      </ele-data-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="editForm.id?'修改文章':'添加文章'" :visible.sync="showEdit" width="900px"
               @closed="editForm={}" :destroy-on-close="true" :close-on-click-modal="false" :lock-scroll="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="120px">
        <el-row :gutter="15">
          <el-col :sm="15">        
            <el-form-item label="文章名称:" prop="name">
              <el-input v-model="editForm.name"  clearable/>
            </el-form-item>
            <el-form-item label="文章描述:" prop="desc">
              <el-input v-model="editForm.desc"  clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="15" style="margin-top:30px">
          <el-col :sm="20">
            <el-form-item label="正文：" prop="content">
              <Wang
                v-if="showEdit"
                :content="editForm.content"
                ref="wangEdit"
                @fromChild="fromChild"
              ></Wang>
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
// import { mapGetters } from "vuex";

import Wang from '@/components/Wang'


export default {
  name: "SysRole",
  components:{Wang},

  data() {
    return {
      table: {url: '/articles/list', where: {}},  // 表格配置
      choose: [],  // 表格选中数据
      showEdit: false,  // 是否显示表单弹窗
      editForm: {},  // 表单数据
      editRules: {  // 表单验证规则
        name: [
          {required: true, message: '请输入文章名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入文章编码', trigger: 'blur'}
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

    },
    /* 保存编辑 */
    save() {
      this.$refs.wangEdit.toParent()

      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({lock: true});
          var url = ''
          if(this.editForm.id){
            url = "/articles/update"
          }else{
            url = "/articles/add"
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

        this.$confirm('确定要删除选中的文章吗?', '提示', {type: 'warning'}).then(() => {
          const loading = this.$loading({lock: true});
          let ids = this.choose.map(d => d.id);

          this.$http.delete('/articles/delete/' + ids.toString()).then(res => {
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
        this.$http.delete('/articles/delete/' + row.id ).then(res => {
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

    fromChild(content) {
        console.log("aaaaaaaaaaaaaaaaaaaa");
        this.editForm.content = content
    },

  }
}
</script>

<style scoped>

</style>