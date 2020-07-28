<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.key" placeholder="艺名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getSingers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="singers"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <template v-if="props.row.user_info">
              <el-form-item label="用户名">
                <span>{{ props.row.user_info.name }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.user_info.phone }}</span>
              </el-form-item>
              <el-form-item label="歌手介绍">
                <span>{{ props.row.singer_info.desc }}</span>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="提示">
                <span>系统自动创建用户，暂无相关用户信息</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column type="index" lable="#" width="60"></el-table-column>
      <el-table-column prop="singer_info.uid" label="#" width="60" v-if="false"></el-table-column>
      <el-table-column prop="singer_info.name" label="艺名" width="120" sortable></el-table-column>
      <el-table-column
        prop="singer_info.sex"
        label="性别"
        width="100"
        :formatter="formatSex"
        sortable
      ></el-table-column>
      <el-table-column prop="singer_info.lang" label="语种" width="200" sortable></el-table-column>
      <el-table-column prop="singer_info.style" label="风格" width="200" sortable></el-table-column>
      <el-table-column
        prop="singer_info"
        label="状态"
        min-width="120"
        :formatter="formatState"
        sortable
      ></el-table-column>
      <!-- <el-table-column prop="addr" label="地址" min-width="180" sortable></el-table-column> -->
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
          <template v-if="scope.row.singer_info.is_new">
            <el-button
              type="primary"
              size="small"
              @click="handleDel(scope.row.singer_info.sid,0)"
            >通过</el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleDel(scope.row.singer_info.sid,1)"
            >不通过</el-button>
          </template>
          <template v-else>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row.singer_info.sid,scope.row.singer_info.is_delete)"
              v-if="scope.row.singer_info.is_delete"
            >解封</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row.singer_info.sid,scope.row.singer_info.is_delete)"
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
import { requestAllSinger, changeSingerState } from '../../api/api';

export default {
  data () {
    return {
      filters: {
        key: ''
      },
      users: [],
      singers: [],
      total: 0,
      page: 1,
      listLoading: false,
    }

  },
  mounted () {
    // this.getUsers()
    this.getSingers()
  },
  methods: {
    //性别显示转换
    formatSex: function (row, column) {
      return row.singer_info.sex == 1 ? '男' : row.singer_info.sex == 0 ? '女' : '团体';
    },
    //状态转换
    formatState: function (row, column) {
      if (row.singer_info.is_new) {
        return '待审核'
      } else {
        if (row.singer_info.is_delete) {
          return '不通过'
        } else {
          return '通过'
        }
      }
      // return row.is_delete == 1 ? '封禁中' : row.is_delete == 0 ? '使用中' : '未知';
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getSingers();
    },

    //获取歌手列表
    getSingers () {
      let param = {
        page: this.page,
        key: this.filters.key
      };
      this.listLoading = true;
      //NProgress.start();
      requestAllSinger(param).then((res) => {
        console.log(res)
        this.total = res.total;
        this.singers = res.data.singers;
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
        let param = { sid: index, is_delete: state };
        changeSingerState(param).then((res) => {
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
            this.getSingers();
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