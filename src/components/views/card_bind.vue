<template>
	<div id="cardBindView">
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<div class="container">
				<div class="wraper">
          <label class="label" :disabled='!editing'>姓名：</label> 
          <el-input :disabled='true'   placeholder='' v-model='name' @blur.once='blured'  :class='{"valid-border":nameValid,"error-border":!nameValid}'></el-input>
          <i class="icon-warning" @click='nameRemind'></i>
        </div>
  			<div class="wraper">
  				<label class="label" :disabled='!editing'>银行卡：</label> 
  				<el-input :disabled='false'  type='number' placeholder='仅支持储蓄卡' v-model='bankcard' @blur.once='blured'  :class='{"valid-border":bankcardValid,"error-border":!bankcardValid}'></el-input>
  				<!-- <i :class="{'el-icon-check':bankcardValid,'el-icon-close':!bankcardValid}"></i> -->
  			</div>
        <div class="wraper">
          <label class="label" :disabled='!editing'>手机号：</label> 
          <el-input :disabled='false'  type='number' placeholder='银行预留手机号' v-model='phone' @blur.once='blured'  :class='{"valid-border":bankcardValid,"error-border":!bankcardValid}'></el-input>
          <i class="icon-warning" @click='phoneRemind'></i>

          <!-- <i :class="{'el-icon-check':bankcardValid,'el-icon-close':!bankcardValid}"></i> -->
        </div>
        <div class="wraper">
          <label>验证码：</label>
          <!-- :class="{'valid':idCardNumValid,'error':!idCardNumValid}" -->
          <el-input placeholder='手机验证码' v-model='verifyCode' @blur.once='blured'  :class='{"valid-border":verifyCodeValid,"error-border":!verifyCodeValid}'></el-input>
          <el-button class='getVerify' type="warning" @click='getCode' :disabled="banGetCode||!phoneValid||!bankcardValid">{{codeBtnMsg}}</el-button>
          <!-- <i :class="{'el-icon-check':verifyCodeValid,'el-icon-close':!verifyCodeValid}"></i> -->
        </div>  
			</div>
      <div class="card-remind">
        <p>支持以下银行储蓄卡：工商银行、中国银行、建设银行、储蓄银行、广发银行、光大银行、中信银行、兴业银行、交通银行、浦发银行、平安银行、民生银行、华夏银行、招商银行</p>
      </div>
			<el-button type='success' :disabled='!bankcardValid' class='submit'  @click='submit'>提交</el-button>
		</div>
		<remind :remind='remind'></remind>
	</div>
</template>

<script>
import bus from './../../bus.js'
import publicFun from '../../js/public.js'
export default {
  data() {
    return {
      codeBtnMsg:"获取验证码",
    	bankcard:'',
      name:'',
      verifyCode:"",
      nameValid:true,
   		response:null,
   		loading:false,
   		editing:true,
      phone:'',
      banGetCode:false,
   		backAfterPost:false,// watch out
   		url:'unspay/bind',
      urlGetVerifyCode:"unspay/sendBindVerCode",
   		remind:{
   			isShow:false,
   			remindMsg:'remind',
   			self_:this,
   			remindOpts:[
   			{msg:'确定',},
   			],
   		},
    }
  },
  props:{
    callback:{
      default:()=>{

      }
    }
  },
  methods:{
    phoneRemind() {
      let r=this.remind
      r.remindMsg='如果注册账号和银行卡预留手机号不一致，请手动修改'
      r.remindOpts=[{msg:'我知道了'}]
      r.isShow=true
    },
    getCode(){
      var url=this.urlGetVerifyCode+'?phone='+this.phone
      var url=publicFun.urlConcat(this.urlGetVerifyCode,{
        phone:this.phone,
        bankCardNo:this.bankcard,
        name:this.name,
        // code:this.picCode,
        // platform:'xh',
      })
      publicFun.get(url,this,()=>{
        console.log('get code response',this.response)

        this.banGetCode=true
        var expire=60,self_=this
        this.codeBtnMsg=expire+'s后获取'
        var T=setInterval(function(){
          expire--
          self_.codeBtnMsg=expire+'s后获取'
          if(!expire){
            clearInterval(T)
            self_.banGetCode=false
            self_.codeBtnMsg="获取验证码"
          }
        },1000)
      },()=>{},()=>{
      })
    },
  	submit(){
      let url = publicFun.urlConcat(this.url,{
        bankCardNo:this.bankcard,
        phone:this.phone,
        cardType:'helipay',
        smsCode:this.verifyCode,
      })
  		publicFun.get(url,this,()=>{
  			let r=this.remind
  			r.remindMsg='绑定成功'
  			r.remindOpts=[{msg:'确定',callback:()=>{
          if(this.callback instanceof Function){
            this.callback()
          }
        }}]
  			r.isShow=true
  		},null,()=>{
      })
  	},
    nameRemind(){
      let r=this.remind
      r.remindMsg='只能绑定本人的卡号用于支付和接受放款，如姓名有误请到认证信息中修改。'
      r.remindOpts=[{msg:'我知道了'}]
      r.isShow=true
    },
    getInfo(){
      publicFun.get('userInfo/identity',this,()=>{
        this.name=this.response.body.data.name
        this.phone=bus.account
        console.log('res name and ..',this.response.body)
      })
    },
  	blured($event){
  		var el=$event.target.parentElement.parentElement
  		el.className+=' validate'
  	},
  },
  events: {},
  created(){
    setTimeout(function() {
      console.log('bus',bus)
    }, 2000);
    this.getInfo()
  	publicFun.checkSession(this)
  },
  computed:{
    verifyCodeValid:function(){
      var reg=/^\d{6}$/;
      return reg.test(this.verifyCode)
    },
    phoneValid:function(){
      var reg=/^1[1234567890]\d{9}$/;
      return reg.test(this.phone)
    },
  	bankcardValid:function(){
  		var reg=/\d/;
  		return reg.test(this.bankcard)
  	},
    allValid() {
      return (this.verifyCodeValid
        && this.phoneValid
        && this.bankcardValid)
    },
  },
  components: {}
}
</script>

<style lang='scss' scoped>
#cardBindView{

  .icon-warning{
    color:#d42e84;
    opacity: 1; 
  }
  .card-remind{
    padding:0.1rem 0.2rem;
    font-size: 0.14rem;
    text-align: left;
    line-height: 1.4;
  }
  .getVerify {
    position: absolute;
    margin: auto 0;
    top: 0;
    bottom: 0;
    right: 0.05rem;
    height: 0.36rem;
    width: 1rem;
    padding: 0.1rem;
    color: #222;
    background-color: #dfe0dd;
    border-color: #dfe0dd;
    /* box-sizing: content-box; */
  }
  button[class~='el-button--warning'].is-disabled {
      opacity: 0.3;
  }
}
</style>
