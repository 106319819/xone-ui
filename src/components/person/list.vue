<template>
  <el-row class="warp">
    <edit-person-dialog
      ref="edit-person-dialog"
      title="修改组织人员"
      :modify="true"
      :person="dialogs.person"
      :organization="dialogs.organization"
      v-on:onModify="onModify"
      v-if="dialogs.editDialogVisible"
      :visible.sync="dialogs.editDialogVisible"
    ></edit-person-dialog>
    <add-person-dialog
      ref="add-person-dialog"
      title="新增组织人员"
      :modify="false"
      :person="dialogs.person"
      :organization="dialogs.organization"
      v-on:onCreatePerson="onCreatePerson"
      v-if="dialogs.addChildVisible"
      :visible.sync="dialogs.addChildVisible"
    ></add-person-dialog>
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
        <el-button @click="onAddPerson('add-person-dialog')" :disabled="buttons.disabled">新增组织人员</el-button>
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
      <el-col :span="6">
        <el-tree
          :data="tree"
          :props="props"
          node-key="organizationId"
          :load="loadNode"
          lazy
          highlight-current
          @node-click="handleNodeClick"
          v-loading="loading"
          ref="tree"
        ></el-tree>
      </el-col>
      <el-col :span="18">
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
              <el-button @click="onModifyButton('add-person-dialog',scope.$index,scope.row)">修改</el-button>
              <el-button @click="onDeletePerson(scope.$index,scope.row)">删除</el-button>
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
import API from "../../api/api_organization";
import PersonAPI from "../../api/api_person";
import Dialog from "./dialog-form.vue";
import Util from "../../common/util.js";
export default {
  data() {
    return {
      tree: [],
      props: {
        children: "children",
        label: "organizationName",
        isLeaf: "isLeaf"
      },
      buttons: {
        disabled: true
      },
      dialogs: {
        addChildVisible: false,
        editDialogVisible: false,
        person: {account:{accountCode:'',password:''}},
        organization: {}
      },
      filters: {
        name: ""
      },
      loading: false,
      persons: [],
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
    loadNode(node, resolve) {
      let that = this;
      let parentId = 0;
      if (node.data && node.data.organizationId) {
        parentId = node.data.organizationId;
      }
      API.findByParent(parentId)
        .then(Util.response)
        .then(that.doLoadNode)
        .then(resolve)
        .catch(Util.error);
      // API.findByParent(parentId).then(function(result) {
      //   if (result.status == "success") {
      //     let data = result.data;
      //     data.forEach(function(value, index) {
      //       value.isLeaf = value.isLeaf == "1" ? true : false;
      //     });

      //     resolve(data);
      //   }
      // });
    },
    doLoadNode(result) {
      let p = new Promise((resolve, reject) => {
        let data = result.data;
        data.forEach(function(value, index) {
          value.isLeaf = value.isLeaf == "1" ? true : false;
        });

        resolve(data);
      });
      return p;
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
      API.findList(params)
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
      PersonAPI.findByOrganization(data.organizationId).then(function(result) {
        if (result.status == "success") {
          that.persons = result.data;
        }
      });
    },
    onAddPerson(dialog) {
      this.dialogs.addChildVisible = true;
      this.dialogs.organization = this.$refs["tree"].getCurrentNode();

      // if (this.$refs[dialog]) {
      //   this.$refs[dialog].init(node.data);
      // }
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
      this.dialogs.editDialogVisible = true;
      //let organization = this.$refs.tree.getCurrentNode();
      //this.dialogs.organization = organization;
      this.dialogs.person = row;
      let organization = this.$refs.tree.getCurrentNode();
      this.dialogs.organization = organization;
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
       PersonAPI.delete(row.personId)
        .then(Util.response)
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
      PersonAPI.deleteBatch(params.split(","))
        .then(Util.response)
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
    }
  },
  mounted() {
    //this.findByParent(0);
  },
  components: {
    "add-person-dialog": Dialog,
    "edit-person-dialog": Dialog
  }
};
</script>

<style scoped>
</style>
