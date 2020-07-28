<template>
  <section>
    <!-- 添加 -->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="类名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-form-item label="类名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 折叠板 -->
    <el-collapse style="margin-top:20px" accordion>
      <el-collapse-item v-for="(item,index) in cates" :key="index">
        <template slot="title">
          <div class="cates-box edit" @click.stop="handleEdit(item.cates_name)">{{item.cates_name}}</div>
          <div class="cates-box__op">
            <el-button size="small" @click.stop="handleAdd(item.cates_id)">添加</el-button>
            <template v-if="item.is_style!=1&&item.is_lang!=1">
              <el-button
                type="danger"
                size="small"
                @click.stop="handleDelCates(item.cates_id,false)"
                v-if="item.is_delete"
              >恢复</el-button>
              <el-button
                type="danger"
                size="small"
                @click.stop="handleDelCates(item.cates_id,false)"
                v-else
              >停用</el-button>
            </template>
          </div>
        </template>
        <el-table
          :data="item.cate"
          v-loading="listLoading"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column prop="cate_id" label="#" width="60"></el-table-column>
          <el-table-column prop="cate_name" label="类名" width="120" sortable>
            <template slot-scope="scope">
              <p @click="handleEdit(scope.row.cate_name)" class="edit">{{scope.row.cate_name}}</p>
              <p></p>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            min-width="120"
            :formatter="formatState"
            sortable
          ></el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleDelCates(scope.row.cate_id,true)"
                v-if="scope.row.is_delete"
              >恢复</el-button>
              <el-button
                type="primary"
                size="small"
                @click="handleDelCates(scope.row.cate_id,true)"
                v-else
              >停用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <!-- 工具条 -->
    <el-col :span="24" class="toolbar">
      <el-button size="small" @click="handleAdd()">添加主类</el-button>
    </el-col>
  </section>
</template>

<script>
import { addCates, requestAllCates, editCates, changeCatesState } from '../../api/api'
export default {
  data () {
    return {
      // activeName: '3',
      cates: [],

      listLoading: false,
      addFormVisible: false,//新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入类名', trigger: 'blur' }
        ]
      },
      //新增界面数据
      addForm: {
        cates_id: '',
        name: '',
      },

      editFormVisible: false,//新增界面是否显示
      editLoading: false,

      //新增界面数据
      editForm: {
        name: '',
        before_name: '',
      },

    };
  },
  created () {
    this.getCates()
  },
  methods: {
    //状态转换
    formatState: function (row, column) {
      return row.is_delete == 1 ? '停用中' : row.is_delete == 0 ? '使用中' : '未知';
    },
    // handleEdit: function (index, row) {
    //   // this.editFormVisible = true;
    //   // this.editForm = Object.assign({}, row);
    //   console.log('edit')
    // },
    //change-switch
    change (index, row) {
      console.log(row.is_delete)
    },
    //删除 cates
    handleDelCates: function (index, state) {
      this.$confirm('确认修改该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        // this.listLoading = true;
        //NProgress.start();
        let param
        if (!state) {
          param = { cates_id: index };
        } else {
          param = { cate_id: index };
        }
        // console.log(state, param)
        changeCatesState(param).then((res) => {
          // this.listLoading = false;
          //NProgress.done();
          let { code, msg } = res
          if (code != 200) {
            this.$message({
              message: msg,
              type: 'error'
            });
          } else {
            this.$message({
              message: msg,
              type: 'success'
            });
            this.getCates();
          }
        });
      }).catch(() => {

      });
    },
    //获取分类
    getCates () {
      this.listLoading = true;
      requestAllCates().then((res) => {
        this.cates = res.data.cates;
        this.listLoading = false;
      });
    },

    //新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let param = Object.assign({}, this.addForm);
            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            addCates(param).then((res) => {
              this.addLoading = false;
              let { msg, code } = res;
              //NProgress.done();
              if (code != 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                this.$message({
                  message: msg,
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getCates();
              }
            });
          });
        }
      });
    },

    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let param = Object.assign({}, this.editForm);
            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            editCates(param).then((res) => {
              this.editLoading = false;
              let { msg, code } = res;
              //NProgress.done();
              if (code != 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                this.$message({
                  message: msg,
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getCates();
              }
            });
          });
        }
      });
    },

    //显示新增界面
    handleAdd: function (id) {
      this.addFormVisible = true;
      this.addForm = {
        cates_id: id,
        name: ''
      };
    },
    //显示编辑界面
    handleEdit: function (name) {
      this.editFormVisible = true;
      this.editForm = {
        name: name,
        before_name: name
      };
    }
  }
}
</script>
<style scoped lang="scss">
.cates-box {
  float: left;
  margin-right: 10px;
  color: #66b7ff;
  &__op {
    float: right;
    margin-right: 20px;
  }
}
.edit {
  cursor: pointer;
  color: #66b7ff;
}
</style>