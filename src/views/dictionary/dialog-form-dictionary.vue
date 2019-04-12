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
      <el-form :model="dictionary" :rules="validator" ref="form" label-width="100px"  style="text-align:left;">
          <el-form-item label="ID" prop="typeId" v-if="false">
          <el-input v-model="dictionary.typeId" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="编码(key)" prop="code">
            <el-input v-model="dictionary.code"></el-input>
          </el-form-item>

          <el-form-item label="值(value)" prop="value">
            <el-input v-model="dictionary.value"></el-input>
          </el-form-item>
          <el-form-item label="序号" prop="sortNo">
            <el-input v-model="dictionary.sortNo"></el-input>
          </el-form-item>
          
          <el-form-item label="备注 " prop="comment">
            <el-input v-model="dictionary.comment" ></el-input>
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
    dictionary:{type:Object}
  },
  data() {
    return {
      validator: {
        code: [{ required: true, message: '请输入字典项编码', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典项值', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入字典项名称', trigger: 'blur' }]
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
      return this.dictionary;
    },
    doCreate() {
      let params = this.buildParam();
      Util.clean(params);
      this.$api.dictionary.create(params).then(this.onCreate).catch(Util.error);
    },
    onCreate(result) {
      this.$emit("onDictionaryCreate", result.data);
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
      this.$api.dictionary.update(params).then(this.onModify).catch(Util.error);
    },
    onModify(result) {
      //通知parent，创建成功消息
      this.$emit("onDictionaryModify", result.data);
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
