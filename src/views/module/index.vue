<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" >
      <el-form-item label="子系统">
        <sub-system-combox v-model="dialog.dataForm.subSystemId" @change="findTreeData" ></sub-system-combox>
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
    <el-table :data="tableTreeDdata" stripe style="width: 100%;"
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
      :dataForm="dialog.dataForm"
      :popupTreeData="dialog.popupTreeData"
      :popupTreeProps="dialog.popupTreeProps"
      v-on:onModify="onModify"
      v-on:onCreate="onCreate"
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
    ></edit-dialog>

    <!-- 新增修改界面 -->
    <!-- <el-dialog icon="el-icon-menu" :title="!dataForm.moduleId ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" 
        label-width="80px"  style="text-align:left;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in moduleTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="moduleTypeList[dataForm.type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="moduleTypeList[dataForm.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
            <popup-tree-input 
              :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName" 
              :nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="permission">
          <el-input v-model="dataForm.permission" placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="22">
                <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
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
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="sortNo">
          <el-input-number v-model="dataForm.sortNo" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="false" placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-close-outline"  @click="dialogVisible = false">取消</el-button>
        <el-button icon="el-icon-circle-check-outline"  type="primary" @click="submitForm()">保存</el-button>
      </span>
    </el-dialog> -->
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
      size: "small",
      loading: false,
      filters: {
        name: ""
      },
      dialog: {
        visible: false,
        modify:false,
        popupTreeData: [],
        popupTreeProps: {
          label: "name",
          children: "children"
        },
        dataForm: {
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
      tableTreeDdata:[]
    };
  },
  methods: {
    // 获取数据
    findTreeData: function(subSystemId) {
      this.loading = true;
      this.$api.module.fetchTree(subSystemId).then(res => {
        this.tableTreeDdata = res.data;
        this.dialog.popupTreeData = this.getParentMenuTree(res.data);
        this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: "顶级菜单",
        children: tableTreeDdata
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
      Object.assign(this.dialog.dataForm, row);
      
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = this.getDeleteIds([], row);
        this.$api.module.batchDelete(params).then(res => {
          this.findTreeData();
          this.$message({ message: "删除成功", type: "success" });
        });
      });
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.moduleId });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    onCreate(result){
      this.findTreeData(this.dialog.dataForm.subSystemId);
      Util.message("新增成功");
    },
    onModify(result){
      this.findTreeData(this.dialog.dataForm.subSystemId);
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