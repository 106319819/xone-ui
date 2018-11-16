<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/organization/list'}">组织管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑组织</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

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
          <el-input v-model="organization.parentId"></el-input>
        </el-form-item>
         <el-form-item label="备注">
          <el-input v-model="organization.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="onAdd">保存</el-button>
          <el-button type="default" @click="onCancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_organization';
  export default{
    data(){
      return {
        organization: {
          organizationName: '',
          organizationNameEn: '',
          organizationCode:'',
          sortNo: 0,
          parentId:0,
          comment:''
        },
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
      onAdd() {
        let that = this;
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return ;
          }
          
          that.loading = true;
          API.create(this.organization).then(function (result) {
              that.loading = false;
              if(result.status == 'success'){
                that.$message.success({showClose: true, message: '新增成功', duration: 2000});
             
              } else {
                let txt = `新增失败，原因：${result.error} ${result.message}`;
                that.$message.error({showClose: true, message: txt, duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          
        });
      },
      onCancle(){
        this.$router.back();// .push('/organization/list');
      }
    }
  }
</script>
