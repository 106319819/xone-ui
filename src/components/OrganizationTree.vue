<template>
    <el-tree :data="tree" :props="props" node-key="organizationId" :load="loadNode" lazy
      highlight-current
      @node-click="handleNodeClick"
      ref="tree"
    ></el-tree>
</template>
<script>
import Util from "../common/util.js";
export default {
   name: 'OrganizationTree',
  //扩展权限
  props: {
     //组织ID
    organizationId: { type: String, default: ''},
  },
  data() {
    return {
            tree: [],
            props: {
              children: "children",
              label: "organizationName",
              isLeaf: "isLeaf"
            },
    }
  },
  methods: {
    loadNode(node, resolve) {
      let that = this;
      let parentId = 0;
      if (node.data && node.data.organizationId) {
        parentId = node.data.organizationId;
      }
      that.$api.organization.findByParent(parentId)
        .then(Util.response)
        .then(that.doLoadNode)
        .then(resolve)
        .catch(Util.error);
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
    handleNodeClick(data, node) {
     this.$emit('node-click',data, node);
    },getCurrentNode(){
      return this.$refs.tree.getCurrentNode();
    },append(child,parent){
      return this.$refs.tree.append(child, parent);
    },getNode(parent){
      return this.$refs.tree.getNode(parent);
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>