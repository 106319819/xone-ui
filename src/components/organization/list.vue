<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-row>
    <el-col :span="16">
      <el-button  @click="onAdd">新增组织</el-button>
      <el-button  @click="onAddChild('add-child-dialog')" :disabled="buttons.disabled">新增子组织 </el-button>
      <add-child ref="add-child-dialog" title = "新增子组织" :modify ="false" :organization="{}"
         :parent="dialogs.parent" v-on:onCreateChild="onCreateChild"
         v-if="dialogs.addChildVisible" :visible.sync="dialogs.addChildVisible"></add-child>

      <el-button  @click="handleSearch" :disabled="buttons.disabled">删除</el-button>
      <el-button  @click="onModifyButton('add-child-dialog')"  :disabled="buttons.disabled">修改</el-button>
      <edit-dialog ref="edit-dialog" title = "修改" :modify ="true" :organization="dialogs.organization"
         :parent="dialogs.parent" v-on:onModify="onModify"
         v-if="dialogs.editDialogVisible" :visible.sync="dialogs.editDialogVisible"></edit-dialog>

    </el-col>
    <el-col :span="8" :inline="true">
      
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="用户名/姓名/昵称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>        
    </el-col>
    </el-row>
    <el-col :span="6">
      <el-tree :data="tree" :props="props" node-key="organizationId" :load="loadNode" lazy highlight-current
        @node-click="handleNodeClick" v-loading="loading" ref="tree">
      </el-tree>
    </el-col>
    <el-col :span="18">
      <el-table :data="organizations" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="organizationId" label="ID" width="120" sortable></el-table-column>
        <el-table-column prop="organizationName" label="名称" width="120" sortable></el-table-column>
        <el-table-column prop="organizationNameEn" label="英文名称" width="100" :formatter="formatSex" sortable></el-table-column>
        <el-table-column prop="organizationCode" label="编码" min-width="160" sortable></el-table-column>
        <el-table-column prop="level" label="层级" sortable></el-table-column>
        <el-table-column prop="parentId" label="上级" sortable></el-table-column>
        <el-table-column prop="sortNo" label="排序" sortable></el-table-column>
        <el-table-column prop="comment" label="备注" sortable></el-table-column>
      </el-table>

    </el-col>
  </el-row>


</template>

<script>
  import API from '../../api/api_organization';
  import Dialog from './dialog-form.vue'
  export default {
    data() {
      
      return {
        tree: [],
        props: {
          children: 'children',
          label: 'organizationName',
          isLeaf:'isLeaf'
        },
        buttons:{
          disabled:true
        },
        dialogs:{
          addChildVisible:false,
          editDialogVisible:false,
          parent:{},
          organization:{}
        },
        filters: {
          name: ''
        },
        loading: false,
        organizations: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false
      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : row.organizationNameEn;
      },
      onAdd(){
          this.$router.push('/organization/edit');
      },

      disable(){
        let disabled =  (null == this.$refs.tree.getCurrentNode());
        this.buttons.disabled = disabled;
        return disabled;
      },
      loadNode(node, resolve) {
         let that = this;
        let parentId = 0;
         if(node.data && node.data.organizationId){
           parentId = node.data.organizationId;
         }
        API.findByParent(parentId).then(function(result){
          if(result.status =='success'){
              let data = result.data;
              data.forEach(function(value, index){
                 value.isLeaf = (value.isLeaf == '1') ? true : false;
              });
             
              resolve(data);
          }
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.users) {
            that.total = result.total;
            that.users = result.users;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      handleNodeClick(data,node){
        console.log('handleNodeClick...');
        console.log(data);

        let that = this;
        this.disable();
        API.findByParent(data.organizationId).then(function(result){
            if(result.status == 'success'){
              that.organizations = result.data;
            }
        });
      },
      onAddChild(dialog){
        this.dialogs.addChildVisible = true;
        this.dialogs.parent = this.$refs['tree'].getCurrentNode();
        if(this.$refs[dialog]){
          this.$refs[dialog].init(node.data);
        }        
      },
      onCreateChild(child){
        //this.$refs.tree.getCurrentNode()
        let parent = this.$refs.tree.getCurrentNode();
        this.$refs.tree.append(child,parent);
        let node = this.$refs.tree.getNode(parent);
        node.expand();
        //this.loadNode()

      },
      onModifyButton(dialog){
        this.dialogs.editDialogVisible = true;
        let organization = this.$refs.tree.getCurrentNode();;
        this.dialogs.organization = organization
        let node = this.$refs.tree.getNode(organization);
        this.dialogs.parent = node.parent.data;
      },
      onModify(data){
        console.log("onModify");
        console.log(data);
      },
    },
    mounted() {
      //this.findByParent(0);
    },
    components:{
      'add-child':Dialog,
      'edit-dialog':Dialog
    }
  }
</script>

<style scoped>

</style>
