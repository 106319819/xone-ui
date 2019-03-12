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
        <el-form ref="form" :model="subSystem" :rules="validator" label-width="120px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="subSystem.name" ></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="subSystem.code" ></el-input>
          </el-form-item>
          <el-form-item label="组织">
            <el-input :value="organization.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="subSystem.comment"></el-input>
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
    subSystem: { type: Object},
    modify: { type: Boolean, default: false },
    organization: { type: Object, default: {} }
  },
  data() {
    return {
      validator: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }]
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
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        that.doCreate();
      });
    },
    doCreate() {
      let that = this;
      if (that.organization.organizationId) {
        that.subSystem.organizationId = that.organization.organizationId;
      }
      // that.loading = true;
      that.$api.subSystem.create(that.subSystem)
        .then(Util.response)
        .then(that.onCreate)
        .catch(Util.error);
    },
    onCreate(result) {
      this.$emit("onCreateSubSystem", result.data);
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
      that.$api.subSystem.update(that.subSystem)
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
