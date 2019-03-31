<template>
  <el-dialog 
    :data="visible"
    :visible.sync="visible"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose()">
     <!-- <slot name="title">{{title}}</slot> -->
     <div slot="title">
      <i class="el-icon-edit-outline"></i> {{title}}
     </div>
      <el-form :model="host" :rules="validator" ref="form" label-width="100px"  style="text-align:left;">
          <el-form-item label="ID" prop="hostId" v-if="false">
          <el-input v-model="host.hostId" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="主机名" prop="name">
            <el-input v-model="host.name"></el-input>
          </el-form-item>
          <el-form-item label="主机变量名" prop="variable">
            <el-input v-model="host.variable"></el-input>
          </el-form-item>
          <el-form-item label="主机地址" prop="url">
            <el-input v-model="host.url"></el-input>
          </el-form-item>
          <el-form-item label="备注 " prop="comment">
            <el-input v-model="host.comment" ></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-close-outline"  @click="onClose()">取消</el-button>
        <el-button icon="el-icon-circle-check-outline"  type="primary" @click="onSave()">保存</el-button>
      </span>
    </el-dialog>
</template>
<script>
import Util from "../../common/util.js";
export default {
  components:{
  },
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: "hi" },
    modify: { type: Boolean, default: false },
    host:{type:Object}
  },
  data() {
    return {
      validator: {
        name: [{ required: true, message: '请输入主机名', trigger: 'blur' }],
        variable: [{ required: true, message: '请输入主机变量名', trigger: 'blur' }],
        url: [{ required: true, message: '请输入主机地址', trigger: 'blur' }]
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
    buildParam(){
      let { hostId,name,variable,url,comment} = this.host;
      let params = {hostId,name,variable,url,comment};
      return params;
    },
    doCreate() {
      let params = this.buildParam();
      Util.clean(params);
      this.$api.host.create(params).then(this.onCreate).catch(Util.error);
    },
    onCreate(result) {
      this.$emit("onCreate", result.data);
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
      let params = this.buildParam();
      Util.clean(params);
      this.$api.host.update(params).then(this.onModify).catch(Util.error);
    },
    onModify(result) {
      //通知parent，创建成功消息
      this.$emit("onModify", result.data);
      Util.message("更新成功！");
    },
    onClose() {
      // 关闭弹窗，触发父组件修改visible值
      this.$emit("update:visible", false);
    },
  },
  mounted(){
    
  }
};
</script>
