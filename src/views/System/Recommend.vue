<template>
  <div>
    <h1>推荐测试</h1>
    <el-button v-loading="refreshLoading" @click="refresh">开始新一轮推荐</el-button>
  </div>
</template>

<script>
import { refreshRecommend } from '../../api/api'
export default {
  data () {
    return {
      refreshLoading: false
    }
  },
  methods: {
    async refresh () {
      this.$confirm('确认刷新推荐功能吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.refreshLoading = true;
        refreshRecommend().then((res) => {
          this.refreshLoading = false;
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
          }
        });
      }).catch(() => {

      });
    }

  }
}
</script>

