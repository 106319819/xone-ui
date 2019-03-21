<template>
 <el-row class="iframe-container" >
    <p v-loading="loading" ></p>
    <iframe id="iframe" :src = "src" scrolling="auto"  frameborder="0" class="frame" :onload="onloaded()"></iframe>
  </el-row>
</template>

<script>
import axios from "@/api/axios"
import util from '../../common/util';
import Cookies from "js-cookie";
 export default{
  // 使用时请使用 :url.sync=""传值
  data () {
   return {
    loading: false,
    src: ''
   }
  },
  mounted() {
    // this.resetSrc(this.$store.state.iframe.iframeUrl);
    this.load(this.$store.state.iframe.iframeUrl)
  },
  methods: {
    load (url) {
      // let token = Cookies.get('token');
        // 1. 请求开始的时候可以结合 vuex 开启全屏 loading 动画
        // console.log(store.state.loading)
        // console.log('准备发送请求...')
        // 2. 带上token
      this.src = url;// + "?Authorization=" + token;
      // 加载中
      // this.loading = true
      // axios({url:url, method:'get'}).then((response) => {
      // document.getElementById('iframe').contentWindow.document.write(response.data) ;
      // // 处理HTML显示
      // // this.html = "data:text/html;charset=utf-8," + escape(response.data);
      // }).catch((error) => {
        
      // this.loading = false
      // this.html = JSON.stringify(error);
      // });
    },
    onloaded(){
      this.loading = false
    }
  }
 }
</script>


<style lang="scss">
.iframe-container {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;;
  bottom: 0px;
  .frame {
    width: 100%;
    height: 100%;
  }
}
</style>