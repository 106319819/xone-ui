<template>
  <el-row class="warp">
    <edit-sub-system-dialog
      ref="edit-sub-system-dialog"
      title="修改组织子系统"
      :modify="true"
      :subSystem="dialogs.subSystem"
      :organization="dialogs.organization"
      v-on:onModify="onModify"
      v-if="dialogs.editDialogVisible"
      :visible.sync="dialogs.editDialogVisible"
    ></edit-sub-system-dialog>
    <add-sub-system-dialog
      ref="add-sub-system-dialog"
      title="新增组织子系统"
      :modify="false"
      :subSystem="dialogs.subSystem"
      :organization="dialogs.organization"
      v-on:onCreateSubSystem="onCreateSubSystem"
      v-if="dialogs.addChildVisible"
      :visible.sync="dialogs.addChildVisible"
    ></add-sub-system-dialog>
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>组织子系统管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-row>
      <el-col :span="6">
        <el-button @click="onAddSubSystem('add-sub-system-dialog')" :disabled="buttons.disabled">新增组织子系统</el-button>
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
          :data="subSystems"
          highlight-current-row
          @selection-change="onSelection"
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column type="index" width="60"></el-table-column> -->
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="onModifyButton('add-sub-system-dialog',scope.$index,scope.row)">修改</el-button>
              <el-button @click="onDeleteSubSystem(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>

          <el-table-column prop="subSystemId" label="ID"  sortable></el-table-column>
          <el-table-column prop="code" label="编码" sortable></el-table-column>
          <el-table-column prop="name" label="名称" sortable></el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable></el-table-column>
          <el-table-column prop="comment" label="备注" sortable></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import OrganizationTree from "../../components/OrganizationTree"
import Dialog from "./dialog-form.vue";
import Util from "../../common/util.js";
export default {
  data() {
    return {

      buttons: {
        disabled: true
      },
      dialogs: {
        addChildVisible: false,
        editDialogVisible: false,
        subSystem: {},
        organization: {}
      },
      filters: {
        name: ""
      },
      loading: false,
      subSystems: [],
      total: 0,
      page: 1,
      limit: 10,
      selections: []
    };
  },
  methods: {
    //性别显示转换
    formatStatus: function(row, column) {
      //0停用 1启用 2禁用 3删除
      let statusMap = {"0":"停用", "1":"启用", "2":"禁用", "3":"删除"};
      return statusMap[row.status];
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
      that.$api.subSystem.findByOrganization(data.organizationId).then(function(result) {
        if (result.status == "success") {
          that.subSystems = result.data;
        }
      });
    },
    onAddSubSystem(dialog) {
      this.dialogs.addChildVisible = true;
      this.dialogs.organization = this.$refs["tree"].getCurrentNode();

      // if (this.$refs[dialog]) {
      //   this.$refs[dialog].init(node.data);
      // }
    },
    onCreateSubSystem(child) {
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
      this.dialogs.subSystem = row;
      let organization = this.$refs.tree.getCurrentNode();
      this.dialogs.organization = organization;
    },
    onModify(data) {
      console.log("onModify");
      console.log(data);
    },
    onDeleteSubSystem(index, row){
      let that = this;
      //function(action, instance)，action 的值为'confirm', 'cancel'或'close', instance 为 MessageBox 实例
      Util.confirm(`确认删除 ${row.fullName} ?`,row)
        .then(that.doDeleteSubSystem)
        .catch(action => {});
    },
    doDeleteSubSystem(row) {
      //Util.alert(`${row.fullName}`);
      // let organization = this.$refs.tree.getCurrentNode();
       that.$api.subSystem.delete(row.subSystemId)
        
        .then(this.onDeleteNode)
        .catch(Util.error);
    },
    onDeleteNode(result) {
      let subSystemId = result.data;
      for (let i = 0; i < this.subSystems.length; i++) {
          let item = this.subSystems[i];
          if (subSystemId == item.subSystemId) {
            //删除表格对应数组元素
            this.subSystems.splice(i, 1);
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
      let params = selections.map(item => item.subSystemId).toString();
      that.$api.subSystem.deleteBatch(params.split(","))
        
        .then(that.onBatchDelete)
        .catch(Util.error);
    },
    onBatchDelete(result) {
      let ids = result.data;
      ids.forEach(value => {
        for (let i = 0; i < this.subSystems.length; i++) {
          let item = this.subSystems[i];
          if (value == item.subSystemId) {
            //删除表格对应数组元素
            this.subSystems.splice(i, 1);
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
    "add-sub-system-dialog": Dialog,
    "edit-sub-system-dialog": Dialog,
    "organization-tree":OrganizationTree
  }
};
</script>

<style scoped>
</style>
