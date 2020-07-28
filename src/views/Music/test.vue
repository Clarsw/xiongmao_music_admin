<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-button size="small" @click="handleAdd()">添加</el-button>
    </el-col>
    <el-collapse style="margin-top:20px" accordion>
      <el-collapse-item v-for="(item,index) in cates" :key="index">
        <template slot="title">
          <div class="cates-box edit" @click.stop="handleEdit()">{{item.cates_name}}</div>
          <div class="cates-box__op">
            <!-- <el-button type="danger" size="small" @click="handleDel()" v-if="item.is_delete">恢复</el-button>
            <el-button type="danger" size="small" @click="handleDel()" v-else>停用</el-button>-->
          </div>
        </template>
        <el-table :data="item.cate" highlight-current-row style="width: 100%;">
          <el-table-column prop="cate_id" label="#" width="60"></el-table-column>
          <el-table-column prop="cate_name" label="姓名" width="120" sortable>
            <template slot-scope="scope">
              <p
                @click="handleEdit(scope.row.num,scope.row.id)"
                class="edit"
              >{{scope.row.cate_name}}</p>
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
          <!-- <el-table-column prop="addr" label="地址" min-width="180" sortable></el-table-column> -->
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-switch
                active-color="#13ce66"
                inactive-color="#ff4949"
                v-model="scope.row.status"
                @change="change(scope.$index,scope.row)"
              ></el-switch>
            </template>

            <!-- <template scope="scope"> -->
            <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row.uid)"
              v-if="scope.row.is_delete"
            >恢复</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row.uid)" v-else>停用</el-button>-->
            <!-- </template> -->
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
export default {
  data () {
    return {
      // activeName: '3',
      cates: [{ cates_id: '1', cates_name: '语种', is_delete: 0, cate: [{ cate_id: '1', cate_name: '语种', is_delete: 1 }, { cate_id: '2', cate_name: '情感', is_delete: 1 }] }, { cates_id: '2', cates_name: '情感', is_delete: 1, cate: [{ cate_id: '1', cate_name: '语种', is_delete: 0 }, { cate_id: '2', cate_name: '情感22', is_delete: 1 }] }],

    };
  },
  methods: {
    //状态转换
    formatState: function (row, column) {
      return row.is_delete == 1 ? '停用中' : row.is_delete == 0 ? '使用中' : '未知';
    },
    handleEdit: function (index, row) {
      // this.editFormVisible = true;
      // this.editForm = Object.assign({}, row);
      console.log('edit')
    },
    //change-switch
    change (index, row) {
      console.log(row.is_delete)
    },
    //删除
    handleDel: function (index) {
      this.$confirm('确认修改该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let param = { uid: index };
        changeUserState(param).then((res) => {
          this.listLoading = false;
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
            this.getUsers();
          }
        });
      }).catch(() => {

      });
    },
    //添加
    handleAdd () {

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