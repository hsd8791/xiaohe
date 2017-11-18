<template>
	<div id="introduceVue">

		<div class="bg-introduce"></div>
		<div class="logo-box">
			
		</div>
		<div class="intro">
			<p class="intro-line">小禾微贷是为社会群体提供的微借贷服务平台。</p>
			<p class="intro-line">平台目前覆盖全国，为用户提供借款服务。</p>
		</div>
		<div class="shadow-box contact-box">
			<h2 class="contact-title">
				<i class="icon-contact icon"></i>
				联系我们
			</h2>
			<div class="contact-items">
				<p class="contact-item">客服电话：400-0577-009</p>
				<p class="contact-item">小禾商务QQ公众号：4000577009</p>
			</div>
			<div class="qq-group">
				<div class="line">
				</div>
				<div class="text-box">
					<span class='text'>点击进入QQ官方群</span>
				</div>
			</div>
		</div>


		<div class="download-box">
			<a class="download-app" href="https://itunes.apple.com/cn/app/%E7%A6%BE%E6%8E%8C%E6%9F%9C%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B/id1282215244?mt=8" @click='testWechat' >
					
					<div class="download-text apple">
						<i class="icon-apple platfor-icon"></i>
						<span>下载苹果同步助手</span>
					</div>
			</a>
			<a class="download-app android" href="http://cdn.he577.com/hzg.0.0.1.apk" @click='testWechat' >
				<div class="download-text android">
					<i class="icon-android platfor-icon"></i>
					<span>下载安卓同步助手</span>
				</div>
			</a>

		</div>

		<button type="button" class="log-bttn logout" @click='logout' v-if='accountName!=="请登录"'>安全退出</button>
		<button type="button" class="log-bttn login" @click='login' v-if='accountName=="请登录"'>登录</button>

		<remind :remind='remind'></remind>
	</div>
</template>

<script>
	import publicFun from '../js/public.js'
	import bus from '../bus.js'
	export default {
		data() {
			return {
				accountName:'请登录',
				response:null,
				loading:true,
				editing:true,
				backAfterPost:false,// watch out
				// url:'url request',
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
		methods:{
			login(){
				publicFun.goPage('/introduce/login')
			},
			logout(){
  		// console.log('outing')
  		if(bus.account==='请登录'){
  			return
  		}
  		publicFun.get('account/logout',this,()=>{
  			// console.log('res outer',this.response)
  			// console.log('app',bus)
  			bus.$emit('account_change','请登录','','')//para1 for account, para2 for uniqueId
  		})
  	},
  	testWechat(){
  		if(publicFun.isWeiXin()){
  			let r=this.remind
  			r.remindMsg='无法在微信中下载'
  			r.remindMsgDscrp='请点击右上方用浏览器打开后下载'
  			r.remindOpts=[{msg:'确定'}]
  			r.isShow=true
  		}
  	},
  	joinQQ(){
			window.location = "http://qm.qq.com/cgi-bin/qm/qr?k=FUte7gZXvGPuLJHt4DoPcoJzABIvE10W"
  	}
  },
  created(){
  	// publicFun.qualify(this)
  	this.accountName=bus.account
		console.log('bus',bus);
  	 bus.$on('account_change',(ac,id)=>{
  	 	console.log('account_change get')
  	 	this.accountName=ac
  	 })
  },
  events: {},
  components: {}
}
</script>

<style lang='scss' scoped>
	.logo-box{
		mask:url('./../../src/assets/xh/logo.png')no-repeat ;
		mask-size: 1.37rem 0.38rem ;
		mask-position: center bottom;
	}
</style>
<style lang='scss'>
	

</style>