<template>
  <el-dialog
    :data="visible"
    :visible.sync="visible"
    :show-close="false"
    width="600px"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
  >
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form ref="form" :model="person" :rules="validate" label-width="120px">
          <el-form-item label="姓" prop="firstName">
            <el-input v-model="person.firstName"></el-input>
          </el-form-item>
          <el-form-item label="名" prop="lastName">
            <el-input v-model="person.lastName"></el-input>
          </el-form-item>
          
          <el-form-item label="账号" prop="accountCode">
            <el-input v-model="person.account.accountCode"></el-input>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="person.account.password"></el-input>
          </el-form-item>

          <el-form-item label="编码">
            <el-input v-model="person.personCode"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="person.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="person.email"></el-input>
          </el-form-item>
          <el-form-item label="组织">
            <el-input :value="organization.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="person.comment"></el-input>
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
    organization: { type: Object, default: {} }
  },
  data() {
    return {
      validate: {
        firstName: [{ required: true, message: "请输入姓", trigger: "blur" }],
        lastName: [{ required: true, message: "请输入名", trigger: "blur" }],
        accountCode:[{ required: true, message: "请输入账号", trigger: "blur" }],
        password:[{ required: true, message: "请输入密码", trigger: "blur" }],
      }
    };
  },
  methods: {
    onSave() {
      let that = this;
      if (that.modify) {
        that.update();
      } else {
        that.create();
      }
    },
    create() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        that.doCreate();
      });
    },
    doCreate() {
      let that = this;
      if (that.organization.organizationId) {
        that.person.organizationId = that.organization.organizationId;
      }
      that.person.fullName = that.person.firstName + that.person.lastName;
      // that.loading = true;
     that.$api.person.create(that.person)
        .then(Util.response)
        .then(that.onCreate)
        .catch(Util.error);
    },
    onCreate(result) {
      this.$emit("onCreatePerson", result.data);
      Util.message("新增成功！");
    },
    update() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        that.doUpdate();
      });
    },
    doUpdate() {
      let that = this;      
     that.$api.person.update(that.person)
        .then(Util.response)
        .then(that.onModify)
        .catch(Util.error);
    },
    onModify(result) {
      //通知parent，创建成功消息
      this.$emit("onModify", result.data);
      Util.message("更新成功！");
    },
    onClose() {
      // 关闭弹窗，触发父组件修改visible值
      this.$emit("update:visible", false);
    }
  }
};
</script>
