<template>
  <div class="page-container">
	<el-row>
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="角色名"></el-input>
			</el-form-item>
			<el-form-item>
				<permission-button icon="el-icon-search" permission="sys:role:view" type="primary" @click="findPage(null)">查询</permission-button>
			</el-form-item>
			<el-form-item>
				<permission-button icon="el-icon-circle-plus-outline" permission="sys:role:add" type="primary" @click="handleAdd">新增</permission-button>
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
    <el-table :data="result.content" highlight-current-row @selection-change="selectionChange" 
          @row-click ="onRowClick" style="width:100%;" >
      <el-table-column type="selection" width="40" ></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable">
      </el-table-column>
      <el-table-column label="操作" width="185" fixed="right" header-align="center" align="center">
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

	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <permission-button type="danger" @click="handleBatchDelete()" :disabled="this.selections.length==0" style="float:left;">批量删除</permission-button>
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="result.page" :page-size="result.size" :total="result.rows" style="float:right;">
      </el-pagination>
    </div>
	</el-row>

	<!--角色菜单，表格树内容栏-->

	<el-row>
		<div class="role-module-tree-header">
			<span><B>角色菜单授权  子系统</B></span>
			<sub-system-combox v-model="subSystemId" @change="findModulesBySubSystem" ></sub-system-combox>
		</div>
		<el-tree :data="moduleTree" show-checkbox node-key="moduleId" :props="props"
			ref="menuTree"  :check-strictly="true" @check-change="handleMenuCheckChange">
					<span class="column-container" slot-scope="{ node, data }">
						<span class="role-module-tree-node">{{data.name}}</span>
						<span class="role-module-tree-node">
							<el-tag :type="data.type === 0?'':data.type === 1?'success':'info'">
								{{data.type === 0?'目录':data.type === 1?'菜单':'按钮'}}
							</el-tag>
						</span>
						<span class="role-module-tree-node"> <i :class="data.icon"></i></span>
						<span class="role-module-tree-node">{{data.parentName?data.parentName:'顶级菜单'}}</span>
						<span class="role-module-tree-node">{{data.url? data.url:'\t'}}</span>
					</span>
		</el-tree>
		<el-row >
				<el-col :span="12"><el-checkbox v-model="checkAll" @change="handleCheckAll"><b>全选</b></el-checkbox></el-col>
				<el-col :span="12">
					<permission-button permission="sys:role:edit" type="primary" @click="resetSelection" >重置</permission-button>
					<permission-button permission="sys:role:edit" type="primary" @click="submitAuthForm" >提交</permission-button>
				</el-col>
		</el-row>

	</el-row>

	<!-- 新增修改界面 -->
    <edit-dialog
      ref="edit-dialog"
      :title=" dialog.modify ? '修改' : '新增'"
      :modify="dialog.modify"
      :role="dialog.role"
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
			size: 'small',
			filters: {
				name: ''
			},
			result:{},
			selections: [],  // 列表选中列
			columns: [
				{prop:"roleId", label:"ID", minWidth:100},
				{prop:"name", label:"角色名", minWidth:120},
				{prop:"comment", label:"备注", minWidth:120},
				{prop:"sortNo", label:"排序", minWidth:120},
				// {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			],
			// pageRequest: { pageNum: 1, pageSize: 10 },
			// pageResult: {},
			dialog: {
				visible: false,
				modify:false,
				role: {
					roleId: '',
					name: '',
					comment: ''
				},
      },
			// 子系统
			subSystemId:'',			
			selectRole: {},
			moduleTree: [],

			menuSelections: [],
			menuLoading: false,
			authLoading: false,
			checkAll: false,
			roleModules: [],
			props: {
 					label: "name",
          children: "children"
			}
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (page) {
			let params = Util.stringify({page:page,size:5});
			this.$api.role.findAll(params).then(this.onPaging).catch(Util.error);
		},
		onPaging(result){
			this.result = result.data;
		},
		    // 换页刷新
		refreshPageRequest: function (page) {
      // this.result.page = page;
      this.findPage(page)
    },
		selectionChange(selections){
				this.selections = selections;
		},
		// 角色选择切换
    onRowClick(row,column, event) {
			this.selectRole = row;
			this.onRoleSelectChange(row);
    },
		// 批量删除
		handleDelete: function (row) {
			Util.confirm('确定要删除当前记录吗？',row).then(this.doDelete).catch((action)=>{});
		},
		doDelete(row){
				this.$api.role.delete(row.roleId).then(this.onDelete).catch(Util.error);
		},
		onDelete(result){
			Util.message("删除成功");
			this.findPage(1);
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialog.modify = false;
			this.dialog.visible = true
		},
		// 显示编辑界面
		handleEdit: function (row) {
			this.dialog.modify = true;
			this.dialog.visible = true
			this.dialog.role = row;
		},
		// 编辑
		submitForm: function () {
			this.$refs.form.validate((valid) => {
				if (valid) {
						let params = Object.assign({}, this.role)
						this.$api.role.create(params).then(this.onCreate).catch(Util.error);
				}
			})
		},
		onCreate(result){
			Util.message("新增成功");
			this.findPage(1);
		},
		// 获取数据
		findModulesBySubSystem: function (subSystemId) {
			this.$api.module.fetchTree(subSystemId).then(result => {
        this.moduleTree = result.data;
      });
		},
		// 角色选择改变监听
		onRoleSelectChange(role) {
			this.$api.roleModule.findAllByRoleId(role.roleId).then(this.doCheckNode).catch(Util.error);
		},
		doCheckNode(result){
			this.roleModules = result.data;
			this.$refs.menuTree.setCheckedNodes(this.roleModules);
		},
		// 树节点选择监听
		handleMenuCheckChange(data, check, subCheck) {
			if(check) {
				// 节点选中时同步选中父节点
				let parentId = data.parentId
				this.$refs.menuTree.setChecked(parentId, true, false)
			} else {
				// 节点取消选中时同步取消选中子节点
				if(data.children != null) {
					data.children.forEach(element => {
						this.$refs.menuTree.setChecked(element.id, false, false)
					});
				}
			}
		},
		// 重置选择
		resetSelection() {
			this.checkAll = false
			this.$refs.menuTree.setCheckedNodes(this.roleModules)
		},
		// 全选操作
		handleCheckAll() {
			if(this.checkAll) {
				let allMenus = []
				this.checkAllMenu(this.moduleTree, allMenus)
				this.$refs.menuTree.setCheckedNodes(allMenus)
			} else {
				this.$refs.menuTree.setCheckedNodes([])
			}
		},
		// 递归全选
		checkAllMenu(moduleTree, allMenus) {
			moduleTree.forEach(menu => {
				allMenus.push(menu)
				if(menu.children) {
					this.checkAllMenu(menu.children, allMenus)
				}
			});
		},
		// 角色菜单授权提交
		submitAuthForm() {
			let roleId = this.selectRole.roleId
			if('webmaster' == this.selectRole.name) {
				this.$message({message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error'})
				return
			}
			let nodes = this.$refs.menuTree.getCheckedNodes(false, true);
			let rms = [];
			nodes.forEach((node,index) =>{
					rms.push({roleId: roleId, moduleId: node.moduleId});
			});
			
			this.$api.roleModule.create(roleId,this.subSystemId,rms).then(this.onRoleModule).catch(Util.error);
		},
		onRoleModule(result){
				Util.message("设置成功");
		},
	// 时间格式化
	  dateFormat: function (row, column, cellValue, index){
	     return Util.format(new Date(row[column.property]));
	  }
		
	},
	mounted() {
		this.findPage(1);
	}
}
</script>
<style scoped>
.role-module-tree-node{
	text-algin:center;
	margin-right:80px;
}
.role-module-tree-header {
	padding-left: 8px;
	padding-bottom: 5px;
	text-align: left;
	font-size: 16px;
	color: rgb(20, 89, 121);
	
}
</style>