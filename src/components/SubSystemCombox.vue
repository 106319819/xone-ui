<template>
<!-- 使form组件也支持v-model指令 -->
  <el-select v-model="subSystemId" placeholder="请选择子系统" 
      v-bind:value="value"
      v-on:change="$emit('change', $event)"
  >
    <el-option
      v-for="item in items"
      :key="item.subSystemId"
      :label="item.name"
      :value="item.subSystemId">
    </el-option>
  </el-select>
</template>
<script>
import Util from "../common/util.js";
export default {
   name: 'SubSystemCombox',
  //扩展v-model指令支持
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
     //组织ID
    organizationId: { type: String, default: ''},
    value:{type:String} //扩展v-model指令支持，与model中的prop属性一致
  },
  data() {
    return {
      items:[],
      subSystemId:'',
    }
  },
  methods: {
    // onChange: function (subSystemId) {
    //   // 按钮操作处理函数
    //   this.$emit('change', subSystemId)
    // },
    getSubSystem(){
      if(!Util.nvl(this.organizationId)){
        this.$api.subSystem.findByOrganization(this.organizationId).then(Util.response).then(this.onSubSystem).catch(Util.error);
      }else{
        let params = Util.stringify({page:1,size:100});
        this.$api.subSystem.findAll(params).then(Util.response).then(this.onSubSystem).catch(Util.error);
      }
    },
    onSubSystem(result){
      if(result.data.content){
        this.items = result.data.content;
      }else{
        this.items = result.data;
      }
    }
  },
  mounted() {
    this.getSubSystem();
  }
}
</script>

<style scoped>

</style>