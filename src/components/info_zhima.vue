<template>
	<div id="zhimaVue" v-loading='loading' element-loading-text='请稍后' class="input fixed-title-page">
		<h1 class="title"><app-back></app-back>芝麻认证</h1>



		<!-- <el-button type='success' @click='getScore'>芝麻分：{{score.score||'未查询'}}</el-button> -->
		<!-- <el-button type='success' @click='applyWatchList'>行业关注名单：{{watchStatus?'已申请':'未申请'}}</el-button> -->
		<div class="shadow-box">
			<p class="bind-status">{{authorized.status|statusParse}}</p>
			<p class="bind-time" v-if='authorized.time'>查询时间：{{authorized.time | timeParse}}</p>

			<img src="../assets/xh/zhima_0.png" alt="" class="zhima-bind-pic" v-if='!authBinded'>
			<!-- <img src="../assets/xh/shujumohe_0.png" alt="" class="zhima-bind-pic" v-if='false'> -->
			<img src="../assets/xh/shujumohe_4.png" alt="" class="zhima-bind-pic" v-if='authBinded'>
		</div>


<!-- 		<div class="binding" :class='authBinded?"binded":"unbinded"' >
			<i v-if='authBinded' class="icon-checkmark icon-binding"></i>
			<i v-if='!(authBinded)' class="icon-cross icon-binding"></i>
		</div>
		<div class="binding-text">
			<div  class="binding-detail" >
				芝麻信用<span v-if='authBinded'>已</span><span v-if='!authBinded'>未</span>绑定
			</div>

		</div> -->

			<el-button type='success' @click='authorize' class='submit-bttn' v-if='true'><span v-if='authBinded'>重新</span>绑定芝麻信用</el-button>

		<!-- <div class="" v-if='authBinded'> -->
		<div class="" v-if='false'>
			<!-- <div v-if='faceCetified.status' class="face-status">人脸识别绑定{{faceCetified.status | mixRsltParse}}</div> -->
			<!-- <div v-if='!faceCetified.status' class="face-status">人脸识别未绑定</div> -->
			<!-- <el-button type='success' @click='faceCetify' v-if='!faceBinded'>人脸识别绑定</el-button > -->
		
		</div>
		
		<remind :remind='remind'></remind>
	</div>
</template>

<script>
	import remind from './tmpts/remind.vue'
	import publicFun from '../js/public.js'
	import bus from '../bus.js'
	export default {
		data() {
			return {
				response:null,
				authorized:{},
				faceCetified:{
					status:null,
				},
				score:{},
				watchStatus:{},
				loading:false,
				editing:true,
				backAfterPost:false,
				urls:{
					auth:'credit/applyZhimaAuth',
					checkAuth:'credit/zhimaAuthStatus',
					faceCetify:'credit/applyCustomerCertification?f=1',
					faceCetifyStatus:'credit/zhimaCustomerCertificationStatus',
					score:'credit/queryZhimaScore',
					scoreStauts:'credit/zhimaScoreStatus',
					watchList:'credit/queryCreditWatchListii',
					watchListStatus:'credit/zhimaWatchlistStatus'
				},
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
		filters:{
			statusParse(val){
				var s,r
				console.log('this',this)
				if(!val){
					return '尚未绑定,请尽快完成认证'
				}
				switch (val) {

					case 'doing':
						s = '等待用户处理或服务器完成查询'
						break;
					case 'success':
						s = '查询绑定成功'
						break;
					default:
						r = val.slice(val.indexOf(':') + 1)
						s = '绑定失败,失败原因：' + r
				}
				return s
			},
			timeParse(v){
				return publicFun.getTimeString(v)
			},
			mixRsltParse(v){
				console.log('v',v)
				// console.log(typeof(v))
				return publicFun.parseMixRslt(v)
			}
		},
		methods:{
			goP(p){
				publicFun.goPage(p)
			},
			authorize(){
				publicFun.get(this.urls.auth,this,()=>{
					console.log('res',this.response.body.data.url)
					window.location.href=this.response.body.data.url
				})
			},
			checkAuth(){
				publicFun.get(this.urls.checkAuth,this,()=>{
					console.log('res check authorize',this.response.body)
					var data=this.response.body.data
					if(data){
						this.authorized=data
					}

					// window.location.href=this.response.body.data.url
				})
			},
			faceCetify(){
				if(publicFun.isWeiXin()){
					this.remind.remindMsg='请点击右上角使用默认浏览器打开';
					this.remind.remindOpts=[{msg:'确定',callback:()=>{}}]
					this.remind.isShow=true
					return
				}
				publicFun.get(this.urls.faceCetify,this,()=>{
					console.log('faceCetify get res',this.response.body)
					location.href=this.response.body.data.url
				})
			},
			faceCetifyStatus(){
				publicFun.get(this.urls.faceCetifyStatus,this,()=>{
					console.log('faceCetifyStatus',this.response)

					var data=this.response.body.data
					if(data){
						this.faceCetified=data
					}
				})
			},
			// getScore(){
			// 	publicFun.get(this.urls.score,this,()=>{
			// 		console.log('score res',this.response)
			// 		var res = this.response.body
			// 		// this.score=res.data
			// 		console.log('score 成功')
			// 	})
			// },
			// checkScoreStatus(){
			// 	publicFun.get(this.urls.scoreStauts,this,()=>{
			// 		console.log('scoreStauts res',this.response)
			// 		var data = this.response.body.data
			// 		if(data){
			// 			this.score=data
			// 		}
			// 	})
			// },
			// applyWatchList(){
			// 	publicFun.get(this.urls.watchList,this,()=>{
			// 		console.log('watchList res',this.response)
			// 		var res = this.response.body
			// 		// this.watchStatus=res.data
			// 		console.log('watchList 成功')
			// 	})
			// },
			// checkWatchListStatus() {
			// 	publicFun.get(this.urls.watchList, this, () => {
			// 		console.log('watchList res', this.response)
			// 		var data = this.response.body.data
			// 		if (data) {
			// 			this.watchStatus = data
			// 		}
			// 	})
			// },
		},
		computed:{
			authBinded(){
				if(this.authorized.time<publicFun.zhimaAcChangeTime){
					return false
				}
				return this.authorized.status=="success"
			},
			faceBinded(){
				return this.faceCetified.status==='success'
			}
		},
		created(){
			this.checkAuth()
			this.faceCetifyStatus()
			// this.checkScoreStatus()
			// this.checkWatchListStatus()
		},

		events: {},
		components: {
			remind:remind
		}
	}
</script>

<style lang='scss' scoped>
	#zhimaVue{
		.submit-bttn{
			margin-top: 0.6rem;
		}
		.binding{
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			/*margin: 0 auto;*/
			margin: 0.8rem auto 0.3rem ;
		}
		.binded{
			background: #09bb07;
		}
		.unbinded{
			background: #e94f4f;
		}
		.icon-binding{
			line-height: 1rem;
			font-size: 0.55rem;
			/*font-weight: 100;*/
			color: #fff;
		}

		.binding-text{
			margin:0.1rem 0;
			font-size: 0.2rem;
		}
		.binding-time{
			font-size: 0.14rem;
		}
		.binding-detail{
			margin:0.1rem 0;
		}
		.face-status{
			font-size: 0.18rem;
			margin:0.1rem 0;
		}
	}
</style>
<style lang='scss'>
	#zhimaVue{
		.el-button{
			margin-top: 0.05rem;
		}
	}
</style>
