<template>
<!-- 使form组件也支持v-model指令 -->
  <el-select v-model="roles" multiple placeholder="请选择" 
      v-bind:value="value"
      v-on:change="$emit('change', $event)">
    <el-option v-for="item in items"
      :key="item.roleId" :label="item.name" :value="item.roleId">
    </el-option>
  </el-select>
</template>
<script>
import Util from "../common/util.js";
export default {
   name: 'RoleCombox',
  //扩展v-model指令支持
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
     //组织ID
    //values: { type: Array, default: []},
    value:{type:Array,default:[]} //扩展v-model指令支持，与model中的prop属性一致
  },
  data() {
    return {
      items:[],
      roles:[],
    }
  },
  methods: {
    // onChange: function (subSystemId) {
    //   // 按钮操作处理函数
    //   this.$emit('change', subSystemId)
    // },
    findAll(){
        let params = Util.stringify({page:1,size:100});
        this.$api.role.findAll(params).then(Util.response).then(this.onFindAll).catch(Util.error);
    },
    onFindAll(result){
      if(result.data.content){
        this.items = result.data.content;
      }else{
        this.items = result.data;
      }
      //外边传入的选中值
      //this.roles = values;
    },setCheck(values){
      this.roles = values;
    }
  },
  mounted() {
    this.findAll();
  }
}
</script>

<style scoped>

</style>