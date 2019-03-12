<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" >
      <el-form-item label="子系统">
        <sub-system-combox v-model="dialog.module.subSystemId" @change="findTreeData" ></sub-system-combox>
      </el-form-item>

			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<permission-button icon="el-icon-search"  permission="sys:module:view" type="primary" @click="findTreeData(null)">查找</permission-button>
			</el-form-item>
			<el-form-item>
				<permission-button icon="el-icon-circle-plus-outline" permission="sys:module:add" type="primary" @click="handleAdd">新增</permission-button>
			</el-form-item>
		</el-form>
	</div>
	<!--表格树内容栏-->
    <el-table :data="moduleTree" stripe style="width: 100%;"
      v-loading="loading" element-loading-text="加载中……">
      <el-table-column
        prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <table-tree-column 
        prop="name" header-align="center" treeKey="id" width="150" label="名称">
      </table-tree-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" >目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        prop="parentName" header-align="center" align="center" width="120" label="上级菜单">
      </el-table-column>
      <el-table-column
        prop="url" header-align="center" align="center" width="150" 
        :show-overflow-tooltip="true" label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="permission" header-align="center" align="center" width="150" 
        :show-overflow-tooltip="true" label="授权标识">
      </el-table-column>
      <el-table-column
        prop="sortNo" header-align="center" align="center" label="排序">
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑">
            <permission-button icon="el-icon-edit" type="primary" circle permission="sys:module:edit" @click="handleEdit(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除">
          <permission-button icon="el-icon-delete" type="danger" circle permission="sys:module:delete"  @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <edit-dialog
      ref="edit-dialog"
      :title=" dialog.modify ? '修改' : '新增'"
      :modify="dialog.modify"
      :module="dialog.module"
      :menuTree="dialog.menuTree"
      v-on:onModify="onModify"
      v-on:onCreate="onCreate"
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
    ></edit-dialog>
  </div>
</template>

<script>
import PermissionButton from "../../components/PermissionButton";
import TableTreeColumn from "@/components/TableTreeColumn";
import FaIconTooltip from "@/components/FaIconTooltip";
import Util from "../../common/util.js";
import SubSystemCombox from "../../components/SubSystemCombox";
import Dialog from "./dialog-form"
export default {
  components: {
    
    TableTreeColumn,
    "permission-button":PermissionButton,
    "sub-system-combox":SubSystemCombox,
    "edit-dialog":Dialog
  },
  data() {
    return {
      loading: false,
      filters: {
        name: ""
      },
      dialog: {
        visible: false,
        modify:false,
        menuTree: [],
        module: {
            type: 1,
            name: "",
            parentId: 0,
            parentName: "",
            url: "",
            permission: "",
            sortNo: 0,
            icon: "",
            subSystemId:"",
            iconList: []
          }
      },
      subSystems:[],//子系统
      moduleTree:[]
    };
  },
  methods: {
    // 获取数据
    findTreeData: function(subSystemId) {
      this.loading = true;
      this.$api.module.fetchTree(subSystemId).then(res => {
        this.moduleTree = res.data;
        this.dialog.menuTree = this.getParentMenuTree(res.data);
        this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(moduleTree) {
      let parent = {
        parentId: 0,
        name: "顶级菜单",
        children: moduleTree
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function() {
      // this.dialogVisible = true;
      this.dialog.modify = false;
      this.dialog.visible = true;
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialog.visible = true;
      this.dialog.modify = true;
      Object.assign(this.dialog.module, row);
      
    },
    // 删除
    handleDelete(row) {
      Util.confirm("确认删除选中记录吗？",row).then(this.doDelete).catch(()=>{});
    },
    doDelete(row){
      let params = this.getDeleteIds([], row);
      this.$api.module.deleteBatch(params).then(Util.response).then(this.onDelete).catch(Util.error);
    },
    onDelete(result){
      this.findTreeData(this.dialog.module.subSystemId);
      Util.message("删除成功");
    },

    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push(row.moduleId);
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.module.icon = iconName;
    },
    onCreate(result){
      this.findTreeData(this.dialog.module.subSystemId);
      Util.message("新增成功");
    },
    onModify(result){
      this.findTreeData(this.dialog.module.subSystemId);
      Util.message("修改成功");
    },
    getSubSystem(){
      let params = Util.stringify({page:1,size:100});
      this.$api.subSystem.findAll(params).then(Util.response).then(this.onSubSystem).catch(Util.error);
    },
    onSubSystem(result){
      this.subSystems = result.data.content;
    }
  },
  mounted() {
    this.getSubSystem();
  }
};
</script>