<template>
  <el-dialog
    :data="visible"
    :visible.sync="visible"
    :show-close="false"
    width="50%"
    :modal= false
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
  >
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form ref="form" :model="account" :rules="validate" label-width="120px">
          <el-form-item label="姓名" >
            <el-input  :value="person.fullName"></el-input>
          </el-form-item>          
          <el-form-item label="原密码" prop="password">
            <el-input v-model="account.password"></el-input>
          </el-form-item>
          
          <el-form-item label="新密码：" prop="password1">
            <el-input v-model="account.password1"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码：" prop="password2">
            <el-input v-model="account.password2"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="default" @click="onSave">保存</el-button>
      <el-button type="default" @click="onClose">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Util from "../../common/util.js";

export default {
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: "hi" },
    person: { type: Object, default: {} },
    modify: { type: Boolean, default: false },
  },
  data() {
    return {
      account:{
        password:'',
        password1:'',
        password2:''
      },
      validate: {
        password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        password1: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        password2: [{ required: true, message: "请输入新密码", trigger: "blur" }],
      }
    };
  },
  methods: {
    onSave() {
      if(this.account.password1 != this.account.password2){
        Util.message('新密码不一致！');
        return;
      }

      let accountId = this.person.account.accountId;
      let srcpwd = this.account.password;
      let password = this.account.password1;     
      this.$api.person.updateAccountPassword(accountId,srcpwd,password).then(this.onModify).catch(Util.error);
    },
    onModify(result) {
      //通知parent，创建成功消息
      // this.$emit("onModify", result.data);
      Util.message("更新成功！");
    },
    onClose() {
      // 关闭弹窗，触发父组件修改visible值
      this.$emit("update:visible", false);
    }
  }
};
</script>
