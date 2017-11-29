<template>
	<div id="indexVue" class="fixed-title-page identification">
		<remind :remind='remind'></remind>
		<!-- <h3 class="title">操作</h3> -->
		<!-- <div class="container">
			<div class="row">
				<div class="cell" @click='goP("/apply_borrow")'>
					<div class="item-icon"><i class="icon-database"></i></div>
					<div class="item-name">分享给经纪人</div>
				</div>
				<div class="cell" @click='goP("/apply_lend")'>
					<div class="item-icon"><i class="icon-banknote"></i></div>
					<div class="item-name">分享给客户</div>
				</div>
				<div class="cell" @click=''>
					<div class="item-icon"><i class="icon-banknote"></i></div>
					<div class="item-name">我要赚钱</div>
				</div>
				<div class="cell" @click='goP("/")'>
				</div>

			</div>
		</div> -->
		<div class="input">
			<h1 class="title" style="text-align: center;">认证信息</h1>
		</div>
		<h3 class='section-title first-title'>必填认证信息</h3>
		<div class="container">
			<div class="row" v-for='row in essentialCell'>
				<div class="cell" v-for='cell in row' @click='goP(cell.link)'>
					<div class="item-icon">
						<img :src="cell.imgFilled" v-if='cell.status===1'  class="icon">
						<img :src="cell.imgNotfilled" v-if='cell.status!==1' class="icon">
						<!-- <i :class="cell.icon"></i> -->
					</div>
					<div class="item-name">{{cell.title}}</div>
				</div>
			</div>
		</div>
		<div class="separator"></div>
		<h3 class="section-title option-title">可选认证信息</h3>
		<div class="container">
			<div class="row" v-for='row in optionalCell'>
				<div class="cell" v-for='cell in row' @click='goP(cell.link)'>
					<div class="item-icon">
						<img :src="cell.imgFilled" v-if='cell.status===1'  class="icon">
						<img :src="cell.imgNotfilled" v-if='cell.status!==1' class="icon">
						<!-- <i :class="cell.icon"></i> -->
					</div>
					<!-- <div class="item-icon"><i :class="cell.icon"></i></div> -->
					<div class="item-name">{{cell.title}}</div>
				</div>
			</div>
		</div>
	</div>

</div>
</template>

<script>
	// import router from'../router'
	import publicFun from '../js/public.js'
	import bus from '../bus.js'
	export default {
		data() {
			return {
				response:null,
				loading:true,
				editing:true,
				backAfterPost:false,// watch out
				url:'url request',
				remind:{
					isShow:false,
					remindMsg:'remind',
					self_:this,
					remindOpts:[
					{msg:'确定',},
					],
				},
// <<<<<<< HEAD

// =======
// 				essentialCell:[
// 				[
// 				{title:'身份认证',link:'/identity',icon:'icon-address-book',},
// 				// {title:'联系方式',link:'/contact_way',icon:'icon-phone',},
// 				// {title:'身份证上传',link:'/upload',icon:'icon-upload',},
// 				{title:'手机认证',link:'/shujumohe',icon:'icon-mobile',},
// 				{title:'芝麻认证',link:'/zhima',icon:'icon-warning',},
// 				{title:'其他信息',link:'/other',icon:'icon-phone',},
// 				],
// 				[
// 				// {title:'负债调查',link:'/debt',icon:'icon-coin-yen',},
// 				],
// 				],
// 				optionalCell:[
// 				[
// 				{title:'个人概况',link:'/profile',icon:'icon-documents',},
// 				{title:'工作信息',link:'/job_info',icon:'icon-profile',},
// 				// {title:'行业名单',link:'/',icon:'icon-info',},
// 				],
// 				]
// >>>>>>> master
			}
		},
		methods:{
			goP(path){
				publicFun.goPage('/index'+path)
			},

		},
		created(){
			publicFun.checkSession(this)
		},
		computed:{
		  fillStatus(){
		    return bus.fillStatus
		  },
		  essentialCell(){
		  	let status=bus.fillStatus
		  	return [[
				  {title:'身份认证',link:'/identity',icon:'icon-identify',
				  	imgFilled:'../../static/xh/icon-identify.png',
				  	imgNotfilled:'../../static/xh/icon-identify-enable.png',
				  	status:status.identity},
				 {title:'芝麻认证',link:'/zhima',icon:'icon-zhima',
				 	imgFilled:require('../assets/'+this.___subName+'/icon-zhima.png'),
				 	imgNotfilled:require('../assets/'+this.___subName+'/icon-zhima-enable.png'),
				 	status:status.zmAuth},
				  // {title:'身份证上传',link:'/upload',icon:'icon-upload',
				  // 	imgFilled:require('../assets/'+this.___subName+'/icon-id-upload.png'),
				  // 	imgNotfilled:require('../assets/'+this.___subName+'/icon-id-upload-enable.png'),
				  // 	status:status.idcardPic},
				  
				  {title:'手机认证',link:'/shujumohe',icon:'icon-mobile',
				  	imgFilled:require('../assets/'+this.___subName+'/icon-phone.png'),
				  	imgNotfilled:require('../assets/'+this.___subName+'/icon-phone-enable.png'),
				  	status:status.sjmh},
				  // {title:'负债调查',link:'/debt',icon:'icon-coin-yen',
				  // 	imgFilled:require('../assets/'+this.___subName+'/icon-debt.png'),
				  // 	imgNotfilled:require('../assets/'+this.___subName+'/icon-debt.png'),
				  // 	status:status.liabilities},
				  ],
				  [
				  {title:'其他信息',link:'/other',icon:'icon-phone',
				  	imgFilled:require('../assets/'+this.___subName+'/icon-phone.png'),
				  	imgNotfilled:require('../assets/'+this.___subName+'/icon-phone-enable.png'),
				  	status:status.contact&&status.relatives&&status.liabilities,},
				  
				 ],]
			},
		  optionalCell(){
		  	return[[
				  {title:'个人概况',link:'/profile',icon:'icon-test',
				  	imgFilled:require('../assets/'+this.___subName+'/icon-profile.png'),
				  	imgNotfilled:require('../assets/'+this.___subName+'/icon-profile-enable.png'),
				  	status:status.personal&&status.address},
				  {title:'工作信息',link:'/job_info',icon:'icon-profile',
				  	imgFilled:require('../assets/'+this.___subName+'/icon-job.png'),
				  	imgNotfilled:require('../assets/'+this.___subName+'/icon-job-enable.png'),
				  	status:status.work},
			  ],]
			}
		},
		events: {},
		components: {}
	}
</script>

<style lang='scss' scoped>




	.separator{
		height: 0.15rem;
	}
	
</style>
