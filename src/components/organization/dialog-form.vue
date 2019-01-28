<template>
  <el-dialog :data="visible" :visible.sync="visible"
   :show-close="false" width="600px"
   :modal="true"
   :close-on-click-modal="false"
   :close-on-press-escape="false"
   :title="title">
    <el-row class="warp">

      <el-col :span="24" class="warp-main">
        <el-form ref="form" :model="organization" :rules="validate" label-width="120px">
          <el-form-item label="组织名称">
            <el-input v-model="organization.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="英文名称">
            <el-input v-model="organization.organizationNameEn"></el-input>
          </el-form-item>
          <el-form-item label="组织编码">
            <el-input v-model="organization.organizationCode"></el-input>
          </el-form-item>
          <el-form-item label="排序索引">
            <el-input v-model="organization.sortNo"></el-input>
          </el-form-item>
          <el-form-item label="上级组织">
            <el-input  :value="parent.organizationName"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="organization.comment"></el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="onSave">保存</el-button>
        <el-button type="default" @click="onClose">关闭</el-button>
    </div>

  </el-dialog>
</template>
<script>
  import API from '../../api/api_organization';
  import Util from '../../common/util.js';

  export default{
    props: {
      visible: {type: Boolean,default: false},
      title:{type:String,default:'hi'},
      parent:{type:Object,default:{}},
      modify:{type:Boolean,default:false},
      organization:{type:Object,default:{}}
    },
    data(){
      return {
        // organization: {
        //   organizationName: '',
        //   organizationNameEn: '',
        //   organizationCode:'',
        //   sortNo: 0,
        //   parentId:0,
        //   comment:''
        // },
        //title:'t-title',
        //parent:{},
         validate: {
          organizationName: [
            {required: true, message: '请输入组织名称', trigger: 'blur'}
          ],
          organizationCode: [
            {required: true, message: '请输入组织编码', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      onSave(){
        let that = this;
        if(that.modify){
          that.update();
        }else{
          that.create();
        }
      },
      create() {
        let that = this;
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return ;
          }
          if(that.parent.organizationId){
            that.organization.parentId = that.parent.organizationId;
          }
          // that.loading = true;
          API.create(that.organization).then(Util.response).then(that.onCreate).catch(Util.error);
        //    res function (result) {
        //       // that.loading = false;
        //       if(result.status == 'success'){
        //         that.$message.success({showClose: true, message: '新增成功', duration: 2000});
        //         //通知parent，创建成功消息
        //         that.$emit('onCreateChild',result.data);
        //       } else {
        //         let txt = `新增失败，原因：${result.error} ${result.message}`;
        //         that.$message.error({showClose: true, message: txt, duration: 2000});
        //       }
        //     }, function (err) {
        //       // that.loading = false;
        //       that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        //     }).catch(function (error) {
        //       // that.loading = false;
        //       console.log(error);
        //       that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        //     });
          
         });
      },
      onCreate(result){
        // Util.confirm('确认要新增吗？').then((action) =>{
        //   Util.info(`${action}`);
        // }).catch((action)=>{
        //   Util.info(`${action}`);
        // });
        // Util.prompt('请输入需要提交的数据').then(({action,value})=> {
        //   Util.info(`${action}  ${value}`);
        // }).catch((action)=>{
        //   Util.info('取消输入');
        // });
        this.$emit('onCreateChild',result.data);
       Util.info('新增成功！');        
      },
      update(){
        let that = this;
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return ;
          }
        let param = Object.assign({},that.organization);
        if(that.organization.isLeaf){
          param.isLeaf = '1';
        }else{
          param.isLeaf = '0';
        }
          // that.loading = true;
          API.update(param).then(function (result) {
              // that.loading = false;
              if(result.status == 'success'){
                that.$message.success({showClose: true, message: '更新成功', duration: 2000});
                //通知parent，创建成功消息
                that.$emit('onModify',result.data);
              } else {
                let txt = `更新失败，原因：${result.error} ${result.message}`;
                that.$message.error({showClose: true, message: txt, duration: 2000});
              }
            }, function (err) {
              // that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              // that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          
        });
      },
      onClose(){
        // 关闭弹窗，触发父组件修改visible值
        this.$emit('update:visible', false);
      },
      
    }
  }
</script>
