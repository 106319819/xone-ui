
<script>
import {Button} from 'element-ui'
import hasPermission from '../common/permission.js'
import Util from "../common/util.js";

export default {
  extends:Button,//继承基本按钮功能
  //扩展权限
  props: {
     // 按钮权限标识，外部使用者传入
    permission: { type: String, default: null},
    // //提示文本内容
    // content:{type:String,default:null},
    // //显示位置top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    // placement:{type:String,default:'bottom'}
  },
  data() {
    return {
    }
  },
  methods: {
    handleClick: function () {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
  },
  mounted() {
     // 根据权限标识和外部指示状态进行权限判断
      this.disabled = Util.nvl(this.permission);
  }
}
</script>

<style scoped>

</style>