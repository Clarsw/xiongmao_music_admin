<template>
  <section>
    <!--列表-->
    <el-table
      :data="bars"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column prop="bid" label="#" width="60"></el-table-column>
      <el-table-column prop="aid" label="专辑ID" width="240">
        <template slot-scope="scope">
          <el-input v-model="scope.row.aid" auto-complete="off"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="aid" label="封面" min-width="60">
        <template slot-scope="scope">
          <div class="cover-box">
            <el-upload
              class="cover-uploader"
              action="/api/upload/image"
              :on-success="handleSuccess"
              :before-upload="handleBeforeUpload"
              :show-file-list="false"
            >
              <img
                v-if="scope.row.cover_url"
                :src="scope.row.cover_url"
                class="cover"
                @click="handleCurrent(scope.$index)"
              />
              <i
                v-else
                class="el-icon-plus cover-uploader-icon"
                @click="handleCurrent(scope.$index)"
              ></i>
              <!-- <div slot="tip" class="el-upload__tip">
                请上传专辑封面
                <span class="upload-tip">{{uploadTip}}</span>
              </div>-->
            </el-upload>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 工具条 -->
    <el-col :span="24" class="toolbar">
      <el-button size="small" @click="handleSave()" :loading="saveLoading">保存</el-button>
    </el-col>
  </section>
</template>
<script>
import { requestBar, updateBar } from '../../api/api';
export default {
  data () {
    return {
      current: 0,
      listLoading: false,
      bars: [],
      saveLoading: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleCurrent (index) {
      console.log(index)
      this.current = index
    },
    handleSave () {

    },
    async getData () {
      requestBar().then((res) => {
        this.listLoading = true
        this.bars = res.data.bars;
        this.listLoading = false;
      });

    },
    handleSuccess (response, file, filelist) {
      if (response.filename) {
        this.bars[this.current].cover_url = response.filename
      }
    },
    handleBeforeUpload (file, index) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG /PNG 格式!')
      } else {
        // this.uploadLoading = true
      }
      return isJPG || isPNG
    },
    selsChange (sels) {
      this.sels = sels;
    },
    handleSave () {
      this.$confirm('确认提交吗?', '警告', {
        // type: 'warning'
      }).then(() => {
        this.submit()
      }).catch(() => {

      })
    },
    async submit () {
      this.saveLoading = true
      let param = Object.assign(this.bars)
      updateBar({ bars: param }).then((res) => {
        if (res.code !== 200) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          this.saveLoading = false
        } else {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.saveLoading = false
          this.getData()
        }
      });
    }
  }

}
</script>
 <style  lang="scss">
.cover-box {
  margin: 16px;
  .cover-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 475px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .cover {
    width: 475px;
    height: 200px;
    display: block;
  }
}
section {
  margin-top: 10px;
}
</style>