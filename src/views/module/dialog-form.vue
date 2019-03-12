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
      <el-form :model="module" :rules="validator" ref="form" label-width="100px"  style="text-align:left;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="module.type">
            <el-radio v-for="(type, index) in moduleTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="moduleTypeList[module.type] + '名称'" prop="name">
          <el-input v-model="module.name" :placeholder="moduleTypeList[module.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
            <popup-tree-input 
              :data="menuTree" :props="menuTreeProps" :prop=" nvl(module.parentName) ? '顶级菜单' : module.parentName" 
              :nodeKey="''+module.parentId" :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
        </el-form-item>
        <el-form-item v-if="module.type !== 0" label="授权标识" prop="permission">
          <el-input v-model="module.permission" placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"></el-input>
        </el-form-item>
        <el-form-item v-if="module.type === 1" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="22">
                <el-input v-model="module.url" placeholder="菜单路由"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
                <el-tooltip placement="top" effect="light" style="padding: 10px;">
                  <div slot="content">
                    <p>URL格式：</p>
                    <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                    <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                    <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="module.type !== 2" label="排序编号" prop="sortNo">
          <el-input-number v-model="module.sortNo" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
        <el-form-item v-if="module.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-input v-model="module.icon" v-popover:iconListPopover :readonly="false" placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
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
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
export default {
  components:{
    PopupTreeInput,
    FaIconTooltip
  },
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: "hi" },
    modify: { type: Boolean, default: false },
    menuTree: { type: Array },
    module:{type:Object}
  },
  data() {
    return {
      moduleTypeList: ["目录", "菜单", "按钮"],
      validator: {
        name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }]
      },
      menuTreeProps: {
          label: "name",
          children: "children"
        },
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
      let { moduleId,type,name,parentId,url,permission,sortNo,icon,subSystemId} = this.module;
      let params = {moduleId, type,name,parentId,url,permission,sortNo,icon,subSystemId};
      Util.clean(params);
      this.$api.module.create(params).then(Util.response).then(this.onCreate).catch(Util.error);
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
      let { moduleId,type,name,parentId,url,permission,sortNo,icon,subSystemId} = this.module;
      let params = {moduleId, type,name,parentId,url,permission,sortNo,icon,subSystemId};
      Util.clean(params);
      this.$api.module.update(params).then(Util.response).then(this.onModify).catch(Util.error);
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
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.module.parentId = data.moduleId;
      this.module.parentName = data.name;
    },
    nvl(arg){
      return Util.nvl(arg);
    }
  },
  mounted(){
    let nvl = Util.nvl('');
  }
};
</script>
