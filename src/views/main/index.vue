<template>
  <div class="container">
      <!-- 导航菜单栏 -->
      <navigate-bar></navigate-bar>
      <!-- 头部区域 -->
      <header-bar></header-bar>
      <!-- 主内容区域 -->
      <main-content></main-content>
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