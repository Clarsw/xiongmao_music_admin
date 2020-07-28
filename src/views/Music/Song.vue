<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.key" placeholder="歌名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getSongs">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="songs"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="专辑ID">
              <span>{{ props.row.aid }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.create_time|formatDate }}</span>
            </el-form-item>
            <el-form-item label="时长">
              <span>{{ props.row.dt|formatDuring }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <!-- <el-table-column type="index" lable="#" width="60"></el-table-column> -->
      <el-table-column prop="song_id" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="歌名" width="240" sortable></el-table-column>
      <el-table-column prop="ar" label="歌手" width="120" sortable></el-table-column>
      <el-table-column prop="a_name" label="专辑" width="240" sortable></el-table-column>

      <el-table-column label="状态" min-width="120" :formatter="formatState" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <template v-if="!scope.row.is_delete">
            <template v-if="scope.row.is_new">
              <el-button type="primary" size="small" @click="handleDel(scope.row.song_id,1)">通过</el-button>
              <el-button type="primary" size="small" @click="handleDel(scope.row.song_id,0)">不通过</el-button>
            </template>
            <template v-else>
              <el-button
                type="danger"
                size="small"
                @click="handleDel(scope.row.song_id,scope.row.is_block)"
                v-if="scope.row.is_block"
              >解封</el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDel(scope.row.song_id,scope.row.is_block)"
                v-else
              >封禁</el-button>
            </template>
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
import { requestAllSong, changeSongState } from '../../api/api';

export default {
  data () {
    return {
      filters: {
        key: ''
      },
      users: [],
      songs: [],
      total: 0,
      page: 1,
      listLoading: false,
    }

  },
  mounted () {
    // this.getUsers()
    this.getSongs()
  },
  methods: {

    //状态转换
    formatState: function (row, column) {
      if (row.is_delete) {
        return '已删除'
      } else {
        if (row.is_new) {
          return '待审核'
        } else {
          if (row.is_block) {
            return '不通过'
          } else {
            return '通过'
          }
        }
      }
      // return row.is_delete == 1 ? '封禁中' : row.is_delete == 0 ? '使用中' : '未知';
    },
    handleCurrentChange (val) {
      this.page = val;
      this.getSongs();
    },

    //获取歌曲列表
    getSongs () {
      let param = {
        page: this.page,
        key: this.filters.key
      };
      this.listLoading = true;
      //NProgress.start();
      requestAllSong(param).then((res) => {
        console.log(res)
        this.total = res.total;
        this.songs = res.data.songs;
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
        let param = { song_id: index, is_block: state };
        changeSongState(param).then((res) => {
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
            this.getSongs();
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