<template>
	<div id="loginVue" class="input" v-loading='loading'  element-loading-text='登录中'>
	<h1 class="title"><app-back></app-back>登录</h1>
	<div class="logo-container" >
		<img :src="logoSrc" alt="" class="logo" v-if='___logo!==false'>
	</div>

		<!-- <div class="change"  >
			<span class='logOpts' v-show='action=="login"' :class="{'active':pwdLogin}" @click='pwdLog(true)'>密码登录</span>
			<span class='logOpts' v-show='action=="login"' :class="{'active':!pwdLogin}" @click='pwdLog(false)'>手机登录</span>

		</div> -->
		<div class="container" v-if='!pwdLogin'>
			<div class="wraper">
				<label>手机号：</label>
				<!-- :class="{'valid':idCardNumValid,'error':!idCardNumValid}" -->
				<el-input placeholder='请填写手机号' v-model='cellphone' @blur.once='blured'  :class='{"valid-border":cellphoneValid,"error-border":!cellphoneValid}'></el-input>
				<!-- <i :class="{'el-icon-check':cellphoneValid,'el-icon-close':!cellphoneValid}"></i> -->
			</div>
			<div class="wraper">
				<label>验证码：</label>
				<!-- :class="{'valid':idCardNumValid,'error':!idCardNumValid}" -->
				<el-input placeholder='填写验证码' v-model='verifyCode' @blur.once='blured'  :class='{"valid-border":verifyCodeValid,"error-border":!verifyCodeValid}'></el-input>
				<el-button class='getVerify' type="warning" @click='getCode' :disabled="banGetCode||!cellphoneValid">{{codeBtnMsg}}</el-button>
				<!-- <i :class="{'el-icon-check':verifyCodeValid,'el-icon-close':!verifyCodeValid}"></i> -->
			</div>
		</div>
		<div class="container" v-else>
			<div class="wraper">
				<label>手机号：</label>
				<!-- :class="{'valid':idCardNumValid,'error':!idCardNumValid}" -->
				<el-input placeholder='请填写手机号' v-model='cellphone' @blur.once='blured'  :class='{"valid-border":cellphoneValid,"error-border":!cellphoneValid}'></el-input>
				<!-- <i :class="{'el-icon-check':cellphoneValid,'el-icon-close':!cellphoneValid}"></i> -->
			</div>
			<div class="wraper">
				<label>密码：</label>
				<!-- :class="{'valid':idCardNumValid,'error':!idCardNumValid}" -->
				<el-input placeholder='请填写密码' v-model='pwd' @blur.once='blured'  :class='{"valid-border":pwdValid,"error-border":!pwdValid}' type='password'></el-input>
				<!-- <el-button class='getVerify' type="warning" @click='getCode' :disabled="banGetCode">{{codeBtnMsg}}</el-button> -->
				<!-- <i :class="{'el-icon-check':pwdValid,'el-icon-close':!pwdValid}"></i> -->
			</div>
		</div>
		<el-button class='submit' type="success" :disabled='!((allValid&&verifyCodeValid&&!pwdLogin)||(allValid&&pwdValid&&pwdLogin))' @click='login'>{{action=='login'?'登录':'确认'}}</el-button>
		<div class='ctrl-container' v-if='action=="login"'>
			<span class="find-pwd-btn" @click='findPwd'>修改/忘记密码？</span>
		</div>
		<div class='ctrl-container signup-container' v-if='action=="login"'>
			没有账号？<span class='signup-btn' @click='signup'>注册</span>
		</div>

		<remind :remind='remind'></remind>
	</div>
</template>

<script>
	// import '../css/input.css'
	import publicFun from '../js/public.js'
	import remind from './tmpts/remind.vue'
	import bus from '../bus.js'
	export default {
		data() {
			return {
      	logoSrc:this.___logo!==false?require("../assets/img/logo"+this.___logo+".png"):'#',
				fromRoute:{},
				pwdLogin:true,
				actions:['login','signup','findPwd'],
				action:'login',
				pwdLost:false,
				cellphone:'',
				verifyCode:'',
				banGetCode:false,
				loading:false,
				// loadText:'',
				pwd:'',
				codeBtnMsg:"获取验证码",
				// banSubmit:!this.allValid,
				// verifyCodeValid:true,//!!!!
				formData:{

				},
				backAfterPost:false,
				remind:{
					isShow:false,
					remindMsg:'',
					self_:this,// !!!important 传入自定remind
					remindOpts:[
					{msg:'重试',callback:function(){
						// console.log('try align')
					}}
					]
				},
			}
		},
		methods: {

			signup(){
				publicFun.goPage(this.$route.fullPath+'/login_code?signup=1')
				// this.remind.remindMsg='注册：选择手机登录'
				// this.remind.remindMsgDscrp='将为您直接注册，登录后请设置密码'
				// this.remind.remindOpts=[{msg:'确定'}]
				// this.remind.isShow=true
			},
			findPwd(){
				publicFun.goPage(this.$route.fullPath+'/login_code?findPwd=1')
				// this.pwdLost=true
				// this.remind.remindMsg='找回密码：选择手机登录'
				// this.remind.remindMsgDscrp='请使用手机验证码登录后重置密码'
				// this.remind.remindOpts=[{msg:'确定'}]
				// this.remind.isShow=true
			},
			pwdLog(b){
				this.pwdLogin=b
				// this.verifyCode=''
			},
			blured($event){
				var el=$event.target.parentElement.parentElement
				el.className+=' validate'
			},
			getCode(){
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
				var url='account/sendVerifyCode?phone='+this.cellphone
				this.$http.get(url).then(response=>{
				},err=>{
				})
			},
			setFormData(dataKey){
				if(this[dataKey+'Valid']){
					this.formData[dataKey]=this[dataKey]
				}else{
					this.formData[dataKey]=null
				}
			},
			login(){
				this.loading=true
				var queryBody = {	phone:this.cellphone},subDomain
				if(!this.pwdLogin){
					queryBody.code=this.verifyCode
					queryBody.platform='xh'
					subDomain='/loginByCode'
				}else{
					queryBody.password=this.pwd
					queryBody.platform='xh'
					subDomain='/loginByPwd'
				}
				var url = publicFun.urlConcat('account'+subDomain,queryBody)
				publicFun.get(url,this,()=>{
					var data=this.response.body.data
					console.log('data log',data)
					localStorage.userID=data.phone
					localStorage.pwd=this.pwd
					localStorage.uniqueId=data.uniqueId
					localStorage.qualified=data.mayiQualify
					// console.log('login success',res)
					bus.$emit('account_change', data.phone,data.uniqueId,data.mayiQualify)
					if(data.isSetPwd==='0'||(this.pwdLost===true&&this.pwdLogin===false)){
							// console.log('pwd not set')
							publicFun.goPage('/pwd')
						}else{
							this.remind.remindOpts=[{msg:'确定',callback:()=>{
								// console.log('back',1)
								let rName=this.fromRoute.name
								if(rName&&!(/login/.test(rName))){
										publicFun.goPage(-1)
								}else{
									publicFun.goPage('/index0')
								}
								// publicFun.goPage('/index0')
							}}]
							this.remind.remindMsg='登录成功'
							this.remind.isShow=true
							publicFun.wechatAuth(this)
						}
				})

				// this.$http.get(url).then(response => {
					// console.log('response',response)
					// var res=response.body
					// this.loading=false
					// if(res.error){
					// 	this.remind.isShow=true
					// 	this.remind.remindMsg=res.msg
					// }else if(res.error===0){
					// 	// console.log('bus',bus)
					// 	var data=res.data
					// 	localStorage.userID=data.cellphone
					// 	localStorage.pwd=data.pwd
					// 	localStorage.uniqueId=data.uniqueId
					// 	console.log('login success',res)
					// 	bus.$emit('account_change', data.cellphone,data.uniqueId,data.mayiQualify)
				// 		if(data.isSetPwd==='0'||(this.pwdLost===true&&this.pwdLogin===false)){
				// 			// console.log('pwd not set')
				// 			publicFun.goPage('/pwd')
				// 		}else{
				// 			this.remind.remindOpts=[{msg:'确定',callback:()=>{
				// 				publicFun.goPage(-1)
				// 			}}]
				// 			this.remind.remindMsg='登录成功'
				// 			this.remind.isShow=true
				// 		}
				// 	}
				// 	console.log('response.body',response.body)

				// }, response => {
				// 	this.loading=false
				// 	console.log('res',response)
				// 	this.remind.isShow=true
				// 	this.remind.remindMsg='连接失败'
				// 	this.remind.remindOpts=[{msg:'确定',callback:()=>{publicFun.goPage(-1)}}]
				// });
			},
		},
		created:function(){
			// console.log('route',this.$route.fullPath)
			bus.$on('close_remind',()=>{})
			if(localStorage.userID){
				this.cellphone=localStorage.userID
			}
			if(localStorage.pwd){
				this.pwd=localStorage.pwd
			}
		},
		beforeRouteEnter(to,from,next){
			console.log('from',from);

			next(vm=>{
				vm.fromRoute.name=from.name
			})
		},
		watch:{
			cellphone:function(val){
				this.setFormData('cellphone')
			},
			verifyCode:function(val){
				this.setFormData('verifyCode')
			},
			pwd:function(val){
				this.setFormData('pwd')
			},
		},
		computed:{
			cellphoneValid:function(){
				var reg=/^1[1234567890]\d{9}$/;
				return reg.test(this.cellphone)
			},
			verifyCodeValid:function(){
				var reg=/^\d{6}$/;
				return reg.test(this.verifyCode)
			},
			pwdValid:function(){
				var reg=/^.{6,}$/;
				return reg.test(this.pwd)
			},
			allValid:function(){
				var t=this
				return (t.verifyCodeValid||t.pwdValid)&&t.cellphoneValid&&true//&&
			},
		},
		events: {},
		components: {
			remind:remind
		}
	}
</script>

<style lang='scss' scoped>
#loginVue{
	.container{
		/*margin-top: 2rem;*/
		/*margin-left:0.5rem;*/
		margin:auto auto;
		width: 80%;
	}
	.logo-container{
		width: 100%;
		height: 2.05rem;
		padding-top: 0.5rem;
		position: relative;
		background: url(#) center center no-repeat;
		background-size: 80%;
		.logo{
			width: 80%;
			position: relative;
		}
	}
	.getVerify{
		position: absolute;
		margin:auto 0;
		top: 0;bottom: 0; right: 0.05rem;
		height: 0.36rem;
		width: 1rem;
		padding:0.1rem;
		color:#222;
		background-color: #dfe0dd;
		border-color:#dfe0dd;
		/*box-sizing: content-box;*/

	}
	button[class~='el-button--warning'].is-disabled{
		opacity: 0.3;
	}
	.change{

		/*margin-bottom: 0.3rem;*/

		color:#6a7fa5;
		color:#666;
		font-size: 0.18rem;
		display: flex;
		width: 80%;
		height: 0.45rem;
		position: relative;
		margin:0.1rem auto;

		/*font-weight: bold;*/
		.logOpts{
			display: block;
			width: 50%;
			padding:0.1rem 0.2rem;
			border: 0px solid #e5e5e5 ;
			border-bottom-width: 0.01rem;
		}
		.find-pwd{
			width: 100%;
		}
		.active{
			border-bottom-color: #d6322c;
			border-bottom-width: 0.04rem;
		}
	}
	.submit{
		/*transition: 0.2s;*/
		width: 80%;
		background-color:#d6322c;
		background: linear-gradient(90deg,#d6322c 0%,#d6322c 30%,#eda29a);
		border-width: 0;
		border-radius: 0.1rem;
    /*border-color: #ff6231;*/
	}
	button[class~='el-button--success'].is-disabled{
		opacity: 0.4;
	}
	.ctrl-container{
		margin: 0.2rem 0;
		font-size: 0.14rem;
		.find-pwd-btn{
			margin-left: 2.4rem;
			color:#6a7fa5;
		}
		.signup-btn{
			color:#6a7fa5;
		}
	}
	.signup-container{
		margin-top:0.5rem;
	}
}
</style>
<style type="text/css">

</style>
