<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.key" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getAccounts">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="accounts"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="index" lable="#" width="60"></el-table-column>
      <el-table-column prop="cid" label="#" width="60" v-if="false"></el-table-column>
      <el-table-column prop="name" label="用户名" width="120" sortable></el-table-column>
      <el-table-column prop="phone" label="联系方式" width="240" sortable></el-table-column>
      <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>

      <el-table-column prop="state" label="状态" min-width="120" :formatter="formatState" sortable></el-table-column>
      <!-- <el-table-column prop="addr" label="地址" min-width="180" sortable></el-table-column> -->
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <template>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row.cid,scope.row.is_delete)"
              v-if="scope.row.is_delete"
            >解封</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row.cid,scope.row.is_delete)"
              v-else
            >封禁</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="20"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { requestAllAccount, changeAccountState } from '../../api/api';

export default {
  data () {
    return {
      filters: {
        key: ''
      },
      users: [],
      accounts: [],
      total: 0,
      page: 1,
      listLoading: false,
    }

  },
  mounted () {
    // this.getUsers()
    this.getAccounts()
  },
  methods: {
    //性别显示转换
    formatSex: function (row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '团体';
    },
    //状态转换
    formatState: function (row, column) {
      if (row.is_delete) {
        return '不通过'
      } else {
        return '通过'
      }

      // return row.is_delete == 1 ? '封禁中' : row.is_delete == 0 ? '使用中' : '未知';
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getAccounts();
    },

    //获取歌手列表
    getAccounts () {
      let param = {
        page: this.page,
        key: this.filters.key
      };
      this.listLoading = true;
      //NProgress.start();
      requestAllAccount(param).then((res) => {
        console.log(res)
        this.total = res.total;
        this.accounts = res.data.accounts;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function (index, state) {
      this.$confirm('确认修改该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let param = { cid: index, is_delete: state };
        changeAccountState(param).then((res) => {
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
            this.getAccounts();
          }
        });
      }).catch(() => {
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
  }

}

</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>