<template>
  <div class="page-container">
	<el-row>
	<!--工具栏-->
	<div class="toolbar" >
		<el-form :inline="true" :model="filters" >
			<el-form-item>
				<el-input v-model="filters.name" placeholder="分类名称"></el-input>
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
	<el-row>
		<div class="role-module-tree-header">
			<span><B>字典分类列表</B></span>
		</div>
    <el-table :data="result.content" highlight-current-row @selection-change="selectionChange" 
          @row-click ="onRowClick" style="width:100%;" >
      <el-table-column type="selection" width="40" ></el-table-column>
      <el-table-column prop="typeCode" label="分类编码" sortable></el-table-column>
      <el-table-column prop="typeName" label="分类名称" sortable></el-table-column>
      <el-table-column prop="comment" label="备注" sortable></el-table-column>

      <el-table-column label="操作" width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tooltip content="编辑">
            <permission-button icon="el-icon-edit" type="primary" circle permission="sys:module:edit" @click="handleEdit(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除">
          	<permission-button icon="el-icon-delete" type="danger" circle permission="sys:module:delete"  @click="handleDelete(scope.row)"/>
          </el-tooltip>
					 <el-tooltip content="增加字典列表">
          	<permission-button icon="el-icon-circle-plus" type="primary" circle permission="sys:module:delete"  @click="onDictinaryAdd(scope.row)"/>
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
	</el-row>

	<!--角色菜单，表格树内容栏-->

	<el-row>
		<div class="role-module-tree-header">
			<span><B>字典项目列表</B></span>
		</div>
		<el-table :data="dictionaries" highlight-current-row @selection-change="selectionItems" style="width:100%;" >
      <el-table-column type="selection" width="40" ></el-table-column>
      <el-table-column prop="code" label="编码" sortable></el-table-column>
      <el-table-column prop="value" label="值" sortable></el-table-column>
			<el-table-column prop="sortNo" label="排序" sortable></el-table-column>
      <el-table-column prop="comment" label="备注" sortable></el-table-column>

      <el-table-column label="操作" width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tooltip content="编辑">
            <permission-button icon="el-icon-edit" type="primary" circle permission="sys:module:edit" @click="onDictinaryEdit(scope.row)"/>
          </el-tooltip>
          <el-tooltip content="删除">
          	<permission-button icon="el-icon-delete" type="danger" circle permission="sys:module:delete"  @click="onDictinaryDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
			<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <permission-button type="danger" @click="onDictionaryBatchDelete()" :disabled="this.selectitems.length==0" style="float:left;">批量删除</permission-button>
    </div>

	</el-row>

	<!-- 新增修改界面 -->
    <edit-dialog
      ref="edit-dialog"
      :title=" dialog.modify ? '修改' : '新增'"
      :modify="dialog.modify"
      :dictionaryType="dialog.dictionaryType"
      v-on:onModify="onModify"
      v-on:onCreate="onCreate"
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
    ></edit-dialog>

		<!-- 字典项目新增修改界面 -->
    <dialog-dictionary
      ref="dialog-dictionary"
      :title=" dialogItem.modify ? '修改' : '新增'"
      :modify="dialogItem.modify"
      :dictionary="dialogItem.dictionary"
      v-on:onDictionaryModify="onDictionaryModify"
      v-on:onDictionaryCreate="onDictionaryCreate"
      v-if="dialogItem.visible"
      :visible.sync="dialogItem.visible"
    ></dialog-dictionary>
  </div>	
</template>

<script>
import PermissionButton from "../../components/PermissionButton";
import Util from "../../common/util.js";
import Dialog from "./dialog-form"
import DialogDictionary from "./dialog-form-dictionary"
export default {
  components: {
    "permission-button":PermissionButton,
		"edit-dialog":Dialog,
		"dialog-dictionary":DialogDictionary
  },
	data() {
		return {
			filters: {
				name: ''
			},
			result:{},
			selections: [],  // 列表选中列
		
			dialog: {
				visible: false,
				modify:false,
				dictionaryType: {
					typeId: '',
					typeCode:'',
					typeName: '',
					comment: ''
				},
			},

			dialogItem: {
				visible: false,
				modify:false,
				dictionary: {
					typeId: '',
					code:'',
					value:'',
					sortNo: '',
					comment: ''
				},
			},
			dictionaries: [],
			selectitems:[],
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (page) {
			let params = Util.stringify({page:page,size:5});
			this.$api.dictionaryType.findAll(params).then(this.onPaging).catch(Util.error);
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
		selectionItems(selections){
				this.selectitems = selections;
		},
		// 角色选择切换
    onRowClick(row,column, event) {
			this.selectRole = row;
			this.onDictionaryTypeSelect(row);
    },
		// 批量删除
		handleDelete: function (row) {
			Util.confirm('确定要删除当前记录吗？',row).then(this.doDelete).catch((action)=>{});
		},
		doDelete(row){
				this.$api.dictionaryType.delete(row.typeId).then(this.onDelete).catch(Util.error);
		},
		onDelete(result){
			Util.message("删除成功");
			this.findPage(1);
		},
		onModify(result){

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
			this.dialog.dictionaryType = row;
		},
		onCreate(result){
			Util.message("新增成功");
			this.findPage(1);
		},
		onDictinaryAdd(row){
			this.dialogItem.modify = false;
			this.dialogItem.visible = true
			this.dialogItem.dictionary.typeId = row.typeId;
		},
		onDictinaryEdit(row){
			this.dialogItem.modify = true;
			this.dialogItem.visible = true
			this.dialogItem.dictionary = row;
		},
		onDictinaryDelete(row){
			Util.confirm('确定要删除当前记录吗？',row).then(this.doDictinaryDelete).catch((action)=>{});
		},
		doDictinaryDelete(row){
			let that = this;
				this.$api.dictionary.delete(row.dictionaryId).then((result)=>{
					Util.message("删除成功");
					that.onDictionaryTypeSelect(row);
				}).catch(Util.error);
		},
		onDictionaryTypeSelect(row){
			let that = this;
			this.$api.dictionary.findListBy(row.typeId).then((result)=>{
				that.dictionaries = result.data;
			}).catch(Util.error);
		},
		onDictionaryCreate(result){
				Util.message("新增成功");
				this.onDictionaryTypeSelect(result);
		},
		onDictionaryModify(result){

		}
		,onDictionaryBatchDelete(){

		}
	},
	mounted() {
		this.findPage(1);
	}
}
</script>