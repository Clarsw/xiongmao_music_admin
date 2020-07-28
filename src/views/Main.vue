<template>
  <div class="c-user">
    <div class="user-modal">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="ID" prop="uid">
          <el-input v-model="editForm.uid" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">修改资料</el-button>
        <el-button type="danger" @click.native="editPasswordVisible = true">修改密码</el-button>
      </div>
    </div>
    <el-dialog title="修改密码" v-model="editPasswordVisible" :close-on-click-modal="false">
      <el-form :model="editPassword" label-width="80px" :rules="editFormRules" ref="editPassword">
        <el-form-item label="当前密码" prop="password">
          <el-input type="password" v-model="editPassword.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新的密码" prop="newpassword">
          <el-input type="password" v-model="editPassword.newpassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="ensurepassword">
          <el-input type="password" v-model="editPassword.ensurepassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editPasswordVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="changePasswordEdit"
          :loading="editPasswordLoading"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { addUser, changePassword, logout } from '../api/api';
export default {
  data () {
    return {
      editLoading: false,
      // editPassword: false,
      editPasswordLoading: false,
      editPasswordVisible: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '请输入新的密码', trigger: 'blur' }
        ],
        ensurepassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' }
        ],
      },
      editPassword: {
        password: '',
        newpassword: '',
        ensurepassword: '',
      }
    }
  },
  computed: {
    ...mapState(['user']),
    editForm () {
      return this.user
    }
  },
  methods: {
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editPasswordLoading = true;
            //NProgress.start();
            let param = Object.assign({}, this.editForm);
            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            addUser(param).then((res) => {
              this.editPasswordLoading = false;
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

              }
            });
          });
        }
      });
    },
    changePasswordEdit: function () {
      const _this = this
      this.$refs.editPassword.validate((valid) => {
        if (this.editPassword.newpassword != this.editPassword.ensurepassword) {
          this.$message({
            message: '新密码和确认密码不一致',
            type: 'error'
          });
        } else {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let param = {
                password: this.editPassword.password,
                newpassword: this.editPassword.newpassword
              }
              // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              changePassword(param).then((res) => {
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
                  logout().then(res => {
                    let { code, data, msg } = res
                    if (code != 200) {
                      this.$message({
                        message: msg,
                        type: 'error'
                      });
                    } else {
                      sessionStorage.removeItem('user');
                      _this.$router.push('/login');
                    }
                  })
                  // this.$refs['editForm'].resetFields();
                  // this.editFormVisible = false;
                  // this.getUsers();
                }
              });
            });
          }
        }
      });
    }
  }
}


</script>

<style scoped lang="scss">
.c-user {
  width: 400px;
  margin: 50px;
  .footer {
    float: right;
    margin-top: 20px;
    // margin-right: 20px;
  }
}
</style>