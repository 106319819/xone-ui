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
      <el-form :model="dictionaryType" :rules="validator" ref="form" label-width="100px"  style="text-align:left;">
          <el-form-item label="ID" prop="typeId" v-if="false">
          <el-input v-model="dictionaryType.typeId" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="typeCode">
            <el-input v-model="dictionaryType.typeCode"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="typeName">
            <el-input v-model="dictionaryType.typeName"></el-input>
          </el-form-item>
          <el-form-item label="备注 " prop="comment">
            <el-input v-model="dictionaryType.comment" ></el-input>
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
    title: { type: String, default: "dialog" },
    modify: { type: Boolean, default: false },
    dictionaryType:{type:Object}
  },
  data() {
    return {
      validator: {
        typeCode: [{ required: true, message: '请输入字典类型编码', trigger: 'blur' }],
				typeName: [{ required: true, message: '请输入字典类型名称', trigger: 'blur' }]
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
      return this.dictionaryType;
    },
    doCreate() {
      let params = this.buildParam();
      Util.clean(params);
      this.$api.dictionaryType.create(params).then(this.onCreate).catch(Util.error);
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
      this.$api.dictionaryType.update(params).then(this.onModify).catch(Util.error);
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
