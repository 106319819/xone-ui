<template>
  <div class="container">
      <!-- 导航菜单栏 -->
      <navigate-bar></navigate-bar>
      <!-- 头部区域 -->
      <header-bar @closeAll="onCloseAll"></header-bar>
      <!-- 主内容区域 -->
      <main-content ref="main-content"></main-content>
  </div>
</template>

<script>
import HeaderBar from "./header-bar"
import NavigateBar from "./navigate-bar"
import MainContent from "./main-content"
export default {
  components:{
        "header-bar":HeaderBar,
        "navigate-bar":NavigateBar,
        "main-content":MainContent
  },
  mounted(){
    // this.$on
    // this.$on('closeAll',this.onCloseAll);
  },
  methods:{
    onCloseAll(){
      // this.$refs["main-content"].tabsCloseAllHandle();
    }
  }
};
</script>

<style scoped lang="scss">
  .container {
    position:absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    // background: rgba(224, 234, 235, 0.1);
  }
</style>  