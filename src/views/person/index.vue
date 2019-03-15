<template>
  <el-row class="warp">
    <edit-person-dialog
      ref="edit-person-dialog"
      :title = "dialog.modify ?  '修改组织人员' : '新增组织人员' "
      :modify= "dialog.modify"
      :person="dialog.person"
      :organization="dialog.organization"
      v-on:onModify="onModify"
      v-on:onCreatePerson="onCreatePerson"
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
    ></edit-person-dialog>
    
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>组织人员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-row>
      <el-col :span="6">
        <el-button @click="onAddPerson('edit-person-dialog')" :disabled="buttons.disabled">新增组织人员</el-button>
      </el-col>
      <el-col :span="18">
        <!--工具条-->
        <el-row>
          <el-col :span="10" class="toolbar">
            <el-button
              type="danger"
              @click="batchDelete"
              :disabled="this.selections.length===0"
            >批量删除</el-button>
            <!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                        style="float:right;">
            </el-pagination>-->
          </el-col>
          <el-col :span="8">
            <el-form :inline="true" :model="filters">
              <el-form-item>
                <el-input
                  v-model="filters.name"
                  placeholder="用户名/姓名/昵称"
                  style="min-width: 200px;"
                  @keyup.enter.native="handleSearch"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="3">
        <organization-tree @node-click="handleNodeClick" ref="tree"></organization-tree>
      </el-col>
      <el-col :span="21">
        <el-table
          :data="persons"
          highlight-current-row
          @selection-change="onSelection"
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column type="index" width="60"></el-table-column> -->
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-tooltip content="编辑">
                <el-button @click="onModifyButton('edit-person-dialog',scope.$index,scope.row)" icon="el-icon-edit" type="primary" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除">
                <el-button @click="onDeletePerson(scope.$index,scope.row)" icon="el-icon-delete" type="danger" circle ></el-button>
              </el-tooltip>
              <el-popover placement="right" trigger="click" @show="onShowRolesByPerson(scope.$index,scope.row)">
                <el-select v-model="roles" multiple placeholder="请选择" >
                  <el-option v-for="item in items"
                    :key="item.roleId" :label="item.name" :value="item.roleId">
                  </el-option>
                </el-select>
                <el-tooltip content="保存">
                  <el-button @click="onSaveRolePerson(scope.$index,scope.row)" icon="el-icon-check" type="primary" circle ></el-button>
                </el-tooltip>
                <el-tooltip content="角色" slot="reference">
                  <el-button  icon="el-icon-more" type="success" circle></el-button>
                </el-tooltip>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column prop="personId" label="ID"  sortable></el-table-column>
          <el-table-column prop="personCode" label="编码" sortable></el-table-column>
          <el-table-column prop="firstName" label="姓" sortable></el-table-column>
          <el-table-column prop="lastName" label="名" sortable></el-table-column>
          <el-table-column prop="fullName" label="全名" sortable></el-table-column>
          <el-table-column prop="birthday" label="出生日期" sortable></el-table-column>
          <el-table-column prop="mobile" label="手机" sortable></el-table-column>
          <el-table-column prop="email" label="邮箱" sortable></el-table-column>
          
          <el-table-column prop="sex" label="性别" :formatter="formatSex" sortable></el-table-column>
          <!-- <el-table-column prop="organizationCode" label="编码" min-width="160" sortable></el-table-column>
          <el-table-column prop="level" label="层级" sortable></el-table-column>
          <el-table-column prop="parentId" label="上级" sortable></el-table-column>
          <el-table-column prop="sortNo" label="排序" sortable></el-table-column> -->
          <el-table-column prop="comment" label="备注" sortable></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import OrganizationTree from "../../components/OrganizationTree"
import Dialog from "./dialog-form.vue";
import RoleCombox from "../../components/RoleCombox"
import Util from "../../common/util.js";
export default {
  components: {
    "edit-person-dialog": Dialog,
    "organization-tree":OrganizationTree,
    "role-combox" : RoleCombox
  },
  data() {
    return {
      
      buttons: {
        disabled: true
      },
      dialog: {
        visible: false,
        modify:false,
        person: {account:{accountCode:'',password:''}},
        organization: {}
      },
      filters: {
        name: ""
      },
      loading: false,
      persons: [],
      roles:[],
      items:[],
      total: 0,
      page: 1,
      limit: 10,
      selections: []
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 'M' ? "男" : row.sex == 'W' ? "女" : '-';
    },

    disable() {
      let disabled = null == this.$refs.tree.getCurrentNode();
      this.buttons.disabled = disabled;
      return disabled;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
    //获取用户列表
    search: function() {
      let that = this;
      let params = {
        page: that.page,
        limit: 10,
        name: that.filters.name
      };

      that.loading = true;
     that.$api.organization.findList(params)
        .then(
          function(result) {
            that.loading = false;
            if (result && result.users) {
              that.total = result.total;
              that.users = result.users;
            }
          },
          function(err) {
            that.loading = false;
            that.$message.error({
              showClose: true,
              message: err.toString(),
              duration: 2000
            });
          }
        )
        .catch(function(error) {
          that.loading = false;
          console.log(error);
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000
          });
        });
    },
    handleNodeClick(data, node) {
      console.log("handleNodeClick...");
      console.log(data);

      let that = this;
      this.disable();
      that.$api.person.findByOrganization(data.organizationId).then(function(result) {
        if (result.status == "success") {
          that.persons = result.data;
        }
      });
    },
    onAddPerson(dialog) {
      this.dialog.visible = true;
      this.dialog.modify = false;
      this.dialog.organization = this.$refs["tree"].getCurrentNode();

    },
    onCreatePerson(child) {
      //this.$refs.tree.getCurrentNode()
      let parent = this.$refs.tree.getCurrentNode();
      this.$refs.tree.append(child, parent);
      let node = this.$refs.tree.getNode(parent);
      node.expand();
      //this.loadNode()
    },
    onModifyButton(dialog, index, row) {
      this.dialog.visible = true;
      this.dialog.modify = true;
      this.dialog.person = row;
      let organization = this.$refs.tree.getCurrentNode();
      this.dialog.organization = organization;
    },
    onModify(data) {
      console.log("onModify");
      console.log(data);
    },
    onDeletePerson(index, row){
      let that = this;
      //function(action, instance)，action 的值为'confirm', 'cancel'或'close', instance 为 MessageBox 实例
      Util.confirm(`确认删除 ${row.fullName} ?`,row)
        .then(that.doDeletePerson)
        .catch(action => {});
    },
    doDeletePerson(row) {
      //Util.alert(`${row.fullName}`);
      // let organization = this.$refs.tree.getCurrentNode();
       that.$api.person.delete(row.personId)
        
        .then(this.onDeleteNode)
        .catch(Util.error);
    },
    onDeleteNode(result) {
      let personId = result.data;
      for (let i = 0; i < this.persons.length; i++) {
          let item = this.persons[i];
          if (personId == item.personId) {
            //删除表格对应数组元素
            this.persons.splice(i, 1);
            break;
          }
        }
        
    },
    onSelection(selections) {
      this.selections = selections;
    },
    //批量删除
    batchDelete() {
      Util.confirm("确认删除选中记录吗？",this.selections)
        .then(this.doBatchDelete)
        .catch(action => {});
    },
    doBatchDelete(selections) {
      let that = this;
      let params = selections.map(item => item.personId).toString();
      that.$api.person.deleteBatch(params.split(","))
        
        .then(that.onBatchDelete)
        .catch(Util.error);
    },
    onBatchDelete(result) {
      let ids = result.data;
      ids.forEach(value => {
        for (let i = 0; i < this.persons.length; i++) {
          let item = this.persons[i];
          if (value == item.personId) {
            //删除表格对应数组元素
            this.persons.splice(i, 1);
            break;
          }
        }
      });

      this.selections = [];
      Util.message("删除成功！");
    },
    findAllRoles(){
        let params = Util.stringify({page:1,size:100});
        this.$api.role.findAll(params).then(this.onFindAllRoles).catch(Util.error);
    },
    onFindAllRoles(result){
      if(result.data.content){
        this.items = result.data.content;
      }else{
        this.items = result.data;
      }
      //外边传入的选中值
      //this.roles = values;
    },
    onShowRolesByPerson(index,row){
        let personId = row.personId;
        this.$api.rolePerson.findRolesByPersonId(personId).then(this.onCheckRoles).catch(Util.error);
    },
    onCheckRoles(result){
      this.roles = [];
      let data = result.data;
      data.forEach((role,index) =>{
        this.roles.push(role.roleId);
      });
      // this.$refs['roleCombox'].setCheck(this.roles);
    },
    onSaveRolePerson(index,row){
      let personId = row.personId;
      let rps = [];
      this.roles.forEach((role,index) =>{
        rps.push({personId:personId,roleId:role});
      });
      this.$api.rolePerson.create(personId,rps).then(this.onCreateRolePerson).catch(Util.error);
    },
    onCreateRolePerson(result){
      Util.message("角色保存成功");
    }
  },
  mounted() {
    //this.findByParent(0);
    this.findAllRoles();
  },
  
};
</script>

<style scoped>
</style>
