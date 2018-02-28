<template>
	<div id="introduceVue">

		<h3 class="title">
			{{___companyName}}丨关于{{___companyName}}
		</h3>
		<p class="total">{{___companyName}}是为社会群体提供的微{{___loanName}}服务平台。平台目前覆盖全国，为用户提供{{___loanName}}服务。</p>
    <p class="total">
      关注微信公众号【{{___companyName}}】，填写申请表，稍后会有QQ客服联系您或进入{{___companyName}}QQ官方群联系群内管理员查询申请进度。如果有其他非管理员QQ或其他非指定微信联系您，一律为骗子。
    </p>
		<div class="input">
			<a class="download-app" href=" https://www.ho163.com/uploads/dm.0.0.1.apk" @click='testWechat' >
				<el-button type='success' id='androidAppDownload'>
					<i class="icon-android platfor-icon"></i>
					<div class="download-text">
						<p>下载安卓</p>
						<p>同步助手</p>
					</div>
				</el-button>
			</a>
			<!-- <a class="download-app" href="https://itunes.apple.com/cn/app/%E7%A6%BE%E6%8E%8C%E6%9F%9C%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B/id1282215244?mt=8" @click='testWechat' > -->
			<a class="download-app" @click='downloadIos' >
				<el-button type='success' id='androidAppDownload'>
					<i class="icon-apple platfor-icon"></i>
					<div class="download-text">
						<p>下载苹果</p>
						<p>同步助手</p>
					</div>
				</el-button>
			</a>
		</div>
		<!-- <p>客服电话：400-0577-009</p> -->
		<!-- <p>{{___companyName}}商务QQ公众号：4000577009</p> -->
    <p>柒彩虹指定微信号：13868562997</p>
		<p>点击进入QQ官方群：<span id="qq" @click='joinQQ'>加入QQ群</span></p>
		<button type="button" id="loginOut" class="" @click='logout' v-if='accountName!=="请登录"'>安全退出</button>
		<button type="button" id="loginOut" class="" @click='login' v-if='accountName=="请登录"'>登录</button>

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
        bus.isNewer=true
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
  	downloadIos(){
      let r=this.remind
      r.remindMsg='重要提示'
      r.remindMsgDscrp='进入App后平台请填写【柒彩虹】'
      r.remindOpts=[{msg:'确认',callback:()=>{
      },href:'https://itunes.apple.com/cn/app/%E5%A4%A7%E6%A2%A6%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B/id1282215244?mt=8'}]
      r.isShow=true
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
	#introduceVue{
		/*padding:0.5rem 0.05rem;*/
		.title{
			font-size: 13*0.01rem;
			color: #b9b8b8;
			text-align: center;
			margin-bottom: 10*0.01rem;
		}
		p{
			margin: 0*0.01rem 15*0.01rem;
			text-align: justify;
			line-height: 24*0.01rem;
			color: #727171;
			font-size: 14*0.01rem;
		}
		#qq{
			background: #24bdff url(../assets/img/add.png) no-repeat 5*0.01rem center;
			background-size: 15*0.01rem auto;
			font-size: 12*0.01rem;
			width: 100*0.01rem;
			color: white;
			padding: 5*0.01rem 10*0.01rem 5*0.01rem 25*0.01rem;
			border-radius: 5*0.01rem;
			margin-bottom: 10*0.01rem;
			text-shadow: none;
			cursor: pointer;
		}
		.sub-title{
			text-align: left;
			color: #d42e84;
			position: relative;
			padding-bottom: 5*0.01rem;
			margin: 20*0.01rem 15*0.01rem 10*0.01rem;
			font-size: 15*0.01rem;
			.title-img{
				height: 14*0.01rem;
			}
			&:after{
				position: absolute;
				content: ' ';
				left: 0;
				right: 88*0.01rem;
				bottom: 0;
				height: 1*0.01rem;
				background: #d42e84;
			}
		}
		#loginOut {
			width: 80%;
			display: block;
			margin: 36*0.01rem auto;
			padding: 12*0.01rem 0;
			text-align: center;
			color: white;
			font-weight: 700;
			border: none;
			background: #d42e84;
			border-radius: 10*0.01rem;
		}
	}
#introduceVue{

	.download-app{
		text-decoration: none;
		color: #fff;
	}
	.platfor-icon{
		position: absolute;
		left: 5%;top: 0;
		font-size: 0.5rem;
		line-height: 0.8rem;
	}
	.download-text{
		margin-left: 30%;
		width: 60%;
	}
	.download-app{
		white-space: wrap;
	}
	#androidAppDownload{
    background: #00d2b2;
		p{
			font-size: 0.24rem;
			color:#fff;
			line-height: 1.4;

		}
	}
}
</style>
<style lang='scss'>
#introduceVue{

		.el-button{
				
			position: relative;
			font-size: 0.24rem;
			line-height: 1.4;
			height: 0.8rem;
			width:50%;
			padding: 0;
		}
		.download-text{
			color: #fff;
		}
	}
	

</style>