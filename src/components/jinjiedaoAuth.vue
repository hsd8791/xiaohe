<template>
  <div class="vue input">
    <h1 class="title">
      <app-back></app-back>今借到授权
    </h1>
    <div class="logo-box"></div>
    <div class="container">
      <div class="wraper">
        <label class="label">账号：</label>
        <el-input placeholder='请填写今借到账号' v-model='account' @blur.once='blured' :class='{"valid-border":accountValid,"error-border":!accountValid}'></el-input>
        <!-- <i :class="'{el-icon-check':accountValid,'el-icon-close':!accountValid}"></i> -->
      </div>
      <div class="wraper">
        <label class="label">密码：</label>
        <el-input type="password" placeholder='请填写今借到密码' v-model='password' @blur.once='blured' :class='{"valid-border":passwordValid,"error-border":!passwordValid}'></el-input>
        <!-- <i :class="{'el-icon-check':passwordValid,'el-icon-close':!passwordValid}"></i> -->
      </div>
    </div>
    <el-button type='success' :disabled='!(allValid)' class='submit-button' @click='submitAuth'>提交认证</el-button>
    <p class="clare">保护隐私安全，杜绝信息泄露</p>
    <p class="clare">本服务由京东云万象提供</p>
    <app-dialogue v-model="showDialog" placeholder="请输入短信验证码" :onOk='onConfirmSubmit'>
    </app-dialogue>
    <remind :remind=remind></remind>
  </div>
</template>
<script>
import bus from '../bus.js'
import publicFun from './../js/public.js'
export default {
  name: 'jinjiedaoAuth',
  data() {
    return {
      // account: null,
      account: null,
      password: null,
      showDialog: false,
      verifyCode:null,
      createUrl: 'credit/jjdCreate',
      codeUrl: 'credit/jjdInput',
      loading:false,
      remind:{
        isShow:false,
        remindMsg:'remind',
        self_:this,
        remindOpts:[
        {msg:'确定',},
        ],
      },
      taskId:null
      // onConfirmSubmit:this.submit.bind(this)
    }
  },
  created(){

  },
  methods: {
    submitAuth() {
      // publicFun.get(this.createUrl)
      let params = {
        userName:this.account,
        password:this.password
      }
      let getPro = publicFun.singlePostPro(this.createUrl,params)
      publicFun.handleGetPros([getPro]).then((res) => {
        res=res[0].data
        this.taskId=res.taskId
        this.onTaskCreated(res) 
      })
    },
    onTaskCreated(res){
      console.log('res',res)
      if(res.code===0){
        if(res.status==='failed'){
          this.onAuthFailed(res)
        }else{
          this.onAuthSuccess(res)
        }
      }else if(res.code===1){
        this.authNeedCode(res)
      }else{
      }
    },
    onAuthFailed(res){
      this.remind.isShow=true
      this.remind.remindMsg=res.statusRemark
    },
    authNeedCode(){
      this.showDialog = true
    },
    onAuthSuccess(res){
      console.log('success')
      this.remind.isShow=true
      this.remind.remindMsg = res.statusRemark
    },
    submitWithCode(){
      let params = {
        taskId:this.taskId,
        code:this.verifyCode
      }
      let getPro = publicFun.singlePostPro(this.codeUrl,params)
      publicFun.handleGetPros([getPro]).then((res) => {
        let data = res[0].data
        
      })
    },
    onConfirmSubmit(msgCode) {
      console.log('msgCode', msgCode)
      this.verifyCode = msgCode
      this.submitWithCode()
    },
    blured($event) {
      var el = $event.target.parentElement.parentElement
      el.className += ' validate'
    },
  },
  watch:{
    sessionChecked(v){
      if(v){

      this.$nextTick(() => {
        if(!this.isLoged){
          console.log('%c not loged','color:red',)
        }else{
          console.log('is loged')
        }
      })
      }
    },
  },
  computed: {
    sessionChecked(){
      return bus.sessionChecked
    },
    isLoged(){
      return bus.account!='请登录'
    },
    accountValid() {
      return true
    },
    passwordValid() {
      return true
    },
    allValid() {
      return true
    },

  },
  components: {},
}

</script>
<style lang='scss' scoped>
.logo-box {
  height: .5rem;
}

.submit-button {
  margin: 0.15rem;
}

.clare {
  font-size: .14rem;
  color: #999;
  text-align: center;
  margin: 0.05rem;
}

</style>
