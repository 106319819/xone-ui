<template>
  <el-row class="warp">
    <edit-dialog
      ref="edit-dialog"
      :title=" dialog.modify ? '修改' : '新增子组织'"
      :modify="dialog.modify"
      :organization="dialog.organization"
      :parent="dialog.parent"
      v-on:onModify="onModify"
      v-on:onCreateChild="onCreateChild"
      v-if="dialog.visible"
      :visible.sync="dialog.visible"
    ></edit-dialog>
    
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>组织管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-row>
      <el-col :span="6">
        <el-button @click="onAdd('edit-dialog')">新增组织</el-button>
        <el-button @click="onAddChild('edit-dialog')" :disabled="buttons.disabled">新增子组织</el-button>
        <el-button @click="onModifyNode('edit-dialog')" :disabled="buttons.disabled">修改</el-button>
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
        <organization-tree @node-click="handleNodeClick" ref="tree"></organization-tree>
      </el-col>
      <el-col :span="18">
        <el-table
          :data="organizations"
          highlight-current-row
          @selection-change="onSelection"
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column type="index" width="60"></el-table-column> -->
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="onModifyButton('edit-dialog',scope.$index,scope.row)">修改</el-button>
              <el-button @click="onDeleteOrganization(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>

          <el-table-column prop="organizationId" label="编码"  sortable></el-table-column>
          <el-table-column prop="organizationName" label="名称" sortable></el-table-column>
          <el-table-column
            prop="organizationNameEn"
            label="英文名称"
            width="100"
            :formatter="formatSex"
            sortable
          ></el-table-column>
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
import Dialog from "./dialog-form.vue";
import OrganizationTree from "../../components/OrganizationTree"
import Util from "../../common/util.js";
export default {
   components: {
    "edit-dialog": Dialog,
    "organization-tree":OrganizationTree
  },
  data() {
    return {
      buttons: {
        disabled: true
      },
      dialog: {
        visible: false,
        modify:false,
        parent: {},
        organization: {
          organizationName: '',
          organizationNameEn: '',
          organizationCode:'',
          sortNo: 0,
          comment:''
        }
      },
      filters: {
        name: ""
      },
      loading: false,
      organizations: [],
      total: 0,
      page: 1,
      limit: 10,
      selections: []
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : row.organizationNameEn;
    },
    onAdd(dom) {
      //this.$router.push("/organization/edit");
      this.dialog.visible = true;
      this.dialog.modify = false;
      this.dialog.parent = {};
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
      console.log("handleNodeClick..");
      console.log(data);

      let that = this;
      this.disable();
      that.$api.organization.findByParent(data.organizationId).then(function(result) {
        if (result.status == "success") {
          that.organizations = result.data;
        }
      });
    },
    onAddChild(dom) {
      this.dialog.visible = true;
      this.dialog.modify = false;
      this.dialog.parent = this.$refs["tree"].getCurrentNode();
    },
    onCreateChild(child) {
      //this.$refs.tree.getCurrentNode()
      let parent = this.$refs.tree.getCurrentNode();
      this.$refs.tree.append(child, parent);
      let node = this.$refs.tree.getNode(parent);
      node.expand();
      //this.loadNode()
      this.handleNodeClick(parent,node);
    },
    onModifyNode(dom) {
      this.dialog.visible = true;
      this.dialog.modify = true;
      let organization = this.$refs.tree.getCurrentNode();
      this.dialog.organization = organization;
      let node = this.$refs.tree.getNode(organization);
      this.dialog.parent = node.parent.data;
    },
    onModifyButton(dom, index, row) {
      this.dialog.visible = true;
      this.dialog.modify = true;
      //let organization = this.$refs.tree.getCurrentNode();
      //this.dialog.organization = organization;
      this.dialog.organization = row;
      let node = this.$refs.tree.getNode(row.organizationId);
      this.dialog.parent = node.parent.data;
    },
    onModify(data) {
      console.log("onModify");
      console.log(data);
    },
    onDeleteOrganization(index, row){},
    onDelete() {
      let that = this;
      let organization = this.$refs.tree.getCurrentNode();
      //function(action, instance)，action 的值为'confirm', 'cancel'或'close', instance 为 MessageBox 实例
      Util.confirm(`确认删除 ${organization.organizationName} 及其孩子节点吗?`)
        .then(that.doDeleteNode)
        .catch(action => {});
    },
    doDeleteNode() {
      let organization = this.$refs.tree.getCurrentNode();
      that.$api.organization.delete(organization.organizationId)
        .then(Util.response)
        .then(this.onDeleteNode)
        .catch(Util.error);
    },
    onDeleteNode(result) {
      let organizationId = result.data;
      let organization = this.$refs.tree.getCurrentNode();
      let children = [];
      organization.children.forEach((item, index) => {
        children.push(item.organizationId);
      });
      result.data = children;
      this.onBatchDelete(result);
      this.$refs.tree.remove(organizationId);
    },
    onSelection(selections) {
      this.selections = selections;
    },
    //批量删除
    batchDelete() {
      Util.confirm("确认删除选中记录吗？")
        .then(this.doBatchDelete)
        .catch(action => {});
    },
    doBatchDelete(action) {
      let that = this;
      let params = that.selections.map(item => item.organizationId).toString();
      that.$api.organization.deleteBatch(params.split(","))
        .then(Util.response)
        .then(that.onBatchDelete)
        .catch(Util.error);
    },
    onBatchDelete(result) {
      let ids = result.data;
      ids.forEach(value => {
        for (let i = 0; i < this.organizations.length; i++) {
          let item = this.organizations[i];
          if (value == item.organizationId) {
            //删除表格对应数组元素
            this.organizations.splice(i, 1);
            //同步删除树节点
            this.$refs["tree"].remove(value);
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
 
};
</script>

<style scoped>
</style>
