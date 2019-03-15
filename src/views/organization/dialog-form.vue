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
        <el-form ref="form" :model="organization" :rules="validate" label-width="120px">
          <el-form-item label="组织名称" prop="organizationName">
            <el-input v-model="organization.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="英文名称">
            <el-input v-model="organization.organizationNameEn"></el-input>
          </el-form-item>
          <el-form-item label="组织编码">
            <el-input v-model="organization.organizationCode"></el-input>
          </el-form-item>
          <el-form-item label="排序索引">
            <el-input v-model="organization.sortNo"></el-input>
          </el-form-item>
          <el-form-item label="上级组织">
            <el-input :value="parent.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="organization.comment"></el-input>
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
    parent: { type: Object, default: {} },
    modify: { type: Boolean, default: false },
    organization: { type: Object, default: {} }
  },
  data() {
    return {
      validate: {
        organizationName: [
          { required: true, message: "请输入组织名称", trigger: "blur" }
        ],
        organizationCode: [
          { required: true, message: "请输入组织编码", trigger: "blur" }
        ]
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
      if (that.parent.organizationId) {
        that.organization.parentId = that.parent.organizationId;
      }
      // that.loading = true;
      this.$api.organization.create(that.organization)
        
        .then(that.onCreate)
        .catch(Util.error);
    },
    onCreate(result) {
      this.$emit("onCreateChild", result.data);
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
      let param = Object.assign({}, that.organization);
      if (that.organization.isLeaf) {
        param.isLeaf = "1";
      } else {
        param.isLeaf = "0";
      }
      this.$api.organization.update(param)
        
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
