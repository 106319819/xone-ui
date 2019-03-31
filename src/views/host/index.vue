<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		 <el-form :inline="true" :model="filters" >
			<el-form-item>
				<el-input v-model="filters.name" placeholder="主机名"></el-input>
			</el-form-item>
			<el-form-item>
				<permission-button icon="el-icon-search" permission="sys:host:view" type="primary" @click="findPage(null)">查询</permission-button>
			</el-form-item> 
			<el-form-item>
				<permission-button icon="el-icon-circle-plus-outline" permission="sys:host:add" type="primary" @click="handleAdd">新增</permission-button>
			</el-form-item>
		</el-form> 
	</div>
	<!--表格内容栏-->
    <el-table :data="result.content" highlight-current-row @selection-change="selectionChange"  style="width:100%;" >
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

	<!-- 新增修改界面 -->
    <edit-dialog
      ref="edit-dialog"
      :title=" dialog.modify ? '修改' : '新增'"
      :modify="dialog.modify"
      :host="dialog.host"
      v-on:onModify="onModify"
      v-on:onCreate="onCreate"
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
    ></edit-dialog>
  </div>	
</template>


<script>
import PermissionButton from "../../components/PermissionButton";
import Util from "../../common/util.js";
import Dialog from "./dialog-form"
export default {
  components: {
    "permission-button":PermissionButton,
    "edit-dialog":Dialog
  },
	data() {
		return {
			filters: {
				name: ''
			},
			result:{},
			selections: [],  // 列表选中列
			columns: [
				{prop:"hostId", label:"ID", minWidth:100},
				{prop:"name", label:"主机名", minWidth:120},
				{prop:"variable", label:"变量名", minWidth:120},
				{prop:"url", label:"主机URL", minWidth:120},
				{prop:"comment", label:"备注", minWidth:120}
			],
			dialog: {
				visible: false,
				modify:false,
				host: {
					hostId: '',
					name: '',
					variable: '',
					url: '',
					comment: ''
				},
      },
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (page) {
			let params = Util.stringify({page:page,size:20});
			this.$api.host.findAll(params).then(this.onPaging).catch(Util.error);
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
		// 主机选择切换
    onRowClick(row,column, event) {
			this.selectRole = row;
			this.onRoleSelectChange(row);
    },
		// 批量删除
		handleDelete: function (row) {
			Util.confirm('确定要删除当前记录吗？',row).then(this.doDelete).catch((action)=>{});
		},
		doDelete(row){
				this.$api.host.delete(row.hostId).then(this.onDelete).catch(Util.error);
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
			this.dialog.host = row;
		},
		// 编辑
		submitForm: function () {
			this.$refs.form.validate((valid) => {
				if (valid) {
						let params = Object.assign({}, this.host)
						this.$api.host.create(params).then(this.onCreate).catch(Util.error);
				}
			})
		},
		onCreate(result){
			Util.message("新增成功");
			this.findPage(1);
		},
		onModify(result){

		},
		// 获取数据
		findModulesBySubSystem: function (subSystemId) {
			this.$api.module.fetchTree(subSystemId).then(result => {
        this.moduleTree = result.data;
      });
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