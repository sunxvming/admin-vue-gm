<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="where" label-width="77px" class="ele-form-search" @keyup.enter.native="query"
               @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :md="4" :sm="12">
            <el-form-item label="菜单名称:">
              <el-input v-model="where.title" placeholder="请输入菜单名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :md="9" :sm="12">
            <div class="ele-form-actions">
              <el-button type="primary" @click="query" icon="el-icon-search" class="ele-btn-icon">查询</el-button>
              <el-button @click="add()" type="primary" icon="el-icon-plus" class="ele-btn-icon" v-if="permission.includes('sys:menu:add')">添加</el-button>
              <el-button @click="expendAll()" type="success" icon="el-icon-_fold" class="ele-btn-icon" >展开全部</el-button>
              <el-button @click="foldAll()" type="warning" icon="el-icon-_unfold" class="ele-btn-icon" >折叠全部</el-button>
              <el-button class="export-it" type="primary" @click="exportFile()">Export it !</el-button>

            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <el-table ref="table" :data="data" v-loading="loading" row-key="id" default-expand-all border
                height="calc(100vh - 215px)" highlight-current-row  lazy
    :load="load"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="编号" type="index" width="60" align="center" fixed="left"/>
        <el-table-column label="菜单名称" show-overflow-tooltip min-width="200" fixed="left">
          <template slot-scope="{row}"><i :class="row.icon"/> {{ row.title }}</template>
        </el-table-column>
        <el-table-column label="类型" width="60px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="['primary','success'][row.type]" size="mini">{{ ['菜单', '按钮'][row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" show-overflow-tooltip min-width="150"/>
        <el-table-column prop="permission" label="权限标识" show-overflow-tooltip min-width="150"/>
        <!-- <el-table-column prop="status" label="状态" sortable min-width="100">
          <template slot-scope="{row}">
            <ele-dot :type="['danger', 'success'][row.status]" :ripple="row.status===0"
                      :text="['禁用','正常'][row.status]"/>
          </template>
        </el-table-column> -->

        <el-table-column prop="status" label="状态" width="75px" sortable="custom" :resizable="false">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" @change="editStatus(row)" :active-value="1" :inactive-value="2"/>
            </template>
          </el-table-column>
        
        <el-table-column prop="sort" label="排序" width="60px" align="center"/>
        <el-table-column label="创建时间" show-overflow-tooltip min-width="160" align="center">
          <template slot-scope="{row}">{{ row.createdAt }}</template>
        </el-table-column>
        <el-table-column label="操作" width="190px" align="center" :resizable="false"  fixed="right">
          <template slot-scope="{row}">
            <el-link @click="add(row)" icon="el-icon-plus" type="primary" :underline="false" v-if="permission.includes('sys:menu:add')">添加</el-link>
            <el-link @click="edit(row)" icon="el-icon-edit" type="primary" :underline="false" v-if="permission.includes('sys:menu:update')">修改</el-link>
            <el-popconfirm title="确定要删除此菜单吗？" @confirm="remove(row)" class="ele-action">
              <el-link slot="reference" icon="el-icon-delete" type="danger" :underline="false" v-if="permission.includes('sys:menu:delete')">删除</el-link>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog :title="form.id?'修改菜单':'添加菜单'" :visible.sync="showEdit" width="800px"
               @closed="form={}" :destroy-on-close="true" :close-on-click-modal="false" custom-class="ele-dialog-form" :lock-scroll="false">
      <el-form :model="form" ref="editForm" :rules="rules" label-width="82px" @keyup.enter.native="save"
               @submit.native.prevent>
        <el-row :gutter="15">
            <el-form-item label="菜单类型:">
              <el-radio-group v-model="form.type">
                <el-radio :label="0">菜单</el-radio>
                <el-radio :label="1">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          <el-col :sm="12">
            <el-form-item label="菜单名称:" prop="title">
              <el-input v-model="form.title" placeholder="请输入菜单名称" clearable/>
            </el-form-item>
            <el-form-item label="路由地址:" v-if="form.type==0">
              <el-input v-model="form.path" placeholder="/xxx/xxx" clearable/>
            </el-form-item>
            <el-form-item label="权限标识:" v-if="form.type==1">
              <el-input v-model="form.permission" placeholder="sys:controller:action" clearable/>
            </el-form-item>
            <el-form-item label="打开方式:" v-if="form.type==0">
              <el-radio-group v-model="form.target">
                <el-radio :label="'_self'">内部打开</el-radio>
                <el-radio :label="'_blank'">外部打开</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="菜单图标:" v-if="form.type==0">
              <ele-icon-picker v-model="form.icon" placeholder="请选择菜单图标"/>
            </el-form-item>
            <el-form-item label="上级菜单:">
              <treeselect v-model="form.parentId" :options="data" placeholder="请选择上级菜单" :defaultExpandLevel="3"
                          :normalizer="(d)=>{return { id: d.id, label: d.title,children:d.children||undefined }}"/>
            </el-form-item>
            <el-form-item label="排序号:" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"
                               placeholder="请输入排序号" class="ele-fluid ele-text-left"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注:">
          <el-input v-model="form.note" placeholder="请输入备注" :rows="3" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showEdit=false">取消</el-button>&nbsp;
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'  // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import elTableExport from "el-table-export";

import { mapGetters } from "vuex";
export default {
  name: "SysMenu",
  components: {Treeselect},
  data() {
    return {
      loading: true,  // 加载状态
      data: [],  // 列表数据
      where: {},  // 搜索条件
      showEdit: false,  // 是否显示表单弹窗
      form: {},  // 表单数据
      rules: {  // 表单验证规则
        title: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ]
      },
      
    }
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 查询 */
    query() {
      this.loading = true;
      this.$http.get('/menu/list', {params: this.where}).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.data = this.$util.toTreeData(res.data.data, 'id', 'parentId');
        } else {
          this.$message.error(res.data.msg || '获取数据失败');
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /**
     * 异步加载数据
     */
    load(tree, treeNode, resolve) {
      this.where['parentId'] = tree.id;
      this.$http.get('/menu/list', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 显示添加 */
    add(row) {
      this.form = {type: 0, status: 1, parentId: row ? row.id : null,target:'_self'};
      this.showEdit = true;
    },
    /* 显示编辑 */
    edit(row) {
      this.$http.get('/menu/detail?id=' + row.id).then(res => {
        if (res.data.code === 0) {
          this.form = res.data.data;
          this.showEdit = true;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = {"id":row.id, status:row.status};  // Object.assign({}, row);
      this.$http.put('/menu/status', params).then(res => {
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

    /* 保存编辑 */
    save() {
      this.$refs['editForm'].validate((valid) => {
          console.log(this.form.id);

        if (valid) {
          var url = ''
          if(this.form.id){
            url = "/menu/update"
          }else{
            url = "/menu/add"
          }

          const loading = this.$loading({lock: true});
          this.$http.post(url,
              Object.assign({}, this.form, {parentId: this.form.parentId || 0})
          ).then(res => {
            loading.close();
            if (res.data.code === 0) {
              this.showEdit = false;
              this.$message({type: 'success', message: res.data.msg});
              if (this.form.id) {
                // 更新数据
                this.$util.eachTreeData(this.data, item => {
                  if (item.id === this.form.id) {
                    Object.assign(item, this.form);
                    return false;
                  }
                });
              } else {
                this.query();
              }
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
      if (row.children && row.children.length > 0) return this.$message.error('请先删除子节点');
      const loading = this.$loading({lock: true});
      this.$http.delete('/menu/delete/' + row.id).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
          // 删除数据

          // this.$router.go(0);

          this.$util.eachTreeData(this.data, item => {
            if (item.id === row.parentId) {
              item.children.splice(item.children.findIndex(d => d.id === row.id), 1);
              return false;
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /**
     * 展开全部
     */
    expendAll(){
      this.data.forEach(d => {
        this.$refs.table.toggleRowExpansion(d, true);
      });
    },
    /**
     * 折叠全部
     */
    foldAll(){
      this.data.forEach(d => {
        this.$refs.table.toggleRowExpansion(d, false);
      });
    },
    exportFile() {
            elTableExport(this.$refs.table, {
                fileName: "aaa",
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

  }
}
</script>

<style scoped>

</style>