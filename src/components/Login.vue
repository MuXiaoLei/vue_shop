<template>
    <div class="login_container">
        <!-- 头像区 -->
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/images/v2.jpg" alt="">
            </div>
            <!-- 登录表单区 -->
            <el-form ref="loginFormRef" class="login_from" :rules='loginFromRules' :model='loginFrom'> 
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginFrom.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                    prefix-icon="iconfont icon-3702mima" 
                    v-model="loginFrom.password"
                    type="password"></el-input>
                </el-form-item>
                <el-row class="buns">
                    <el-button type="primary" @click="loginInBut">登录</el-button>
                    <el-button type="info" @click="resetLoginBut">重置</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: "Login",
  data(){
      return{
          /* 这是登录表单数据绑定对象 */
          loginFrom:{
            username:'admin',
            password:'123456'
          },
          /* 登录表单数据验证 */
          loginFromRules:{
            username: [
                { required: true, message: '请输入姓名', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
            ],
          }
      }
  },
  methods: {
      //点击重置按钮重置表单
      resetLoginBut() {
          this.$refs.loginFormRef.resetFields();
      },
      loginInBut(){
          this.$refs.loginFormRef.validate(async val=>{
              /* console.log('登录数据'+val); */
              if(!val) return;
              const result = await this.$http.post('login',this.loginFrom);
              console.log(result.data);
              if(result.data.meta.status === 200){
                /* console.log("登录成功"); */
                this.$message.success('登录成功!');  //登录成功的弹窗
                console.log("哈哈"+result.data.meta.status);
                window.sessionStorage.setItem('token',result.data.data.token);
                this.$router.push('/home');
              }else{
                /* console.log('登录失败'); */
                return this.$message.error('登录失败!');  //登录是失败的弹窗
              } 
          })
      }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.login_from{
    position: absolute;
    bottom: 10%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;    
}
.buns{
      display: flex;
      justify-content: flex-end;
  }

</style>
