<template>
	<div id="loanBillVue">
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<h1 class="title">{{___borrowText}}</h1>
		</div>
		<div class="mainBox" v-if='!loading'>


		<div class="container auditing" v-if='(!loanInfo)&&auditing==null' audit-ctrl='no-apply'>
			无申请记录
		</div>
		<div class="container auditing" v-if='auditing===4' audit-ctrl='refused'>
			<p>
				审核拒绝
			</p>
			<div class="auditing-remark">
				<!-- <p class="auditing-description">说明：请根据审·核意见更新或修改资料后重新提交</p> -->
				<!-- <p class="auditing-description" v-html="'审核意见：'+auditingRemark"></p> -->
				<!-- <p class="auditing-description" v-html="'审核意见：'+auditingRemark"></p> -->
				<p class="remind remind-refused">您好，您在柒彩虹的申请未通过审核，感谢您的配合。</p>
				<p class="remind remind-refused">审核未通过可能是以下原因：</p>
				<p class="remind remind-refused">1、年龄未达到要求。</p>
				<p class="remind remind-refused">2、手机非实名、入网时间短或手机号存在异常。</p>
				<p class="remind remind-refused">3、支付宝芝麻分或花呗为达到要求。</p>
				<p class="remind remind-refused">4、其他平台负债高或检测到有逾期记录。</p>
				<p class="remind remind-refused">
					如需咨询请使用QQ联系QQ：356308275。
				</p>
				<p class="remind remind-refused">
					温馨提示：
				</p>
				<p class="remind remind-refused">使用微信搜索【陈管家】或点击
					<span @click='hzgMarket' class="link">【放米超市】</span>
					可以直接申请其他平台
				</p>
				<huabei></huabei>
			</div>
		</div> 
		<div class="container auditing" v-if='auditing===0' audit-ctrl='auditing' >
			<p class="auditing-txt">
			<span v-if="renewalAuditing">续期</span>
			<span v-if="reborrowAuditing">重借</span>
			<span v-if="!loanInfo">{{___companyName}}</span> 审核中
			</p>
		</div>
		<div class="container" v-if='!loanInfo&&(auditing===0)' audit-ctrl='guide'>
			<!-- <div class="container" v-if='true' audit-ctrl='guide'> -->
			<p class="remind">提交申请，QQ客服会添加您进行审核，或添加QQ群：68128711，联系群【管理员】进行审核。</p>
			<p class="remind">点击进入QQ官方群：<span id="qq" @click='joinQQ'>加入QQ群</span></p>
			<p class="remind">新用户审核时间：上午9：00-下午5：00。</p>
			<p class="remind">下午5：00以后申请的将在第二天开始审核。</p>
			<p class="remind">必须添加指定的柒彩虹客服才能进行审核。</p>
			<!-- <p class="remind">点击【放米超市】可以直接申请其他放米</p> -->
			<!-- <img src="./../assets/img/groupQQ.jpg" alt="" class="qrcode"> -->
			<p class="remind">点击<span class="link" @click='hzgMarket'>【{{___marketName}}】</span>可以直接申请其他{{___daikuan}}</p>
			<huabei></huabei>
		</div>
		<div class="container auditing audit-refused" v-if='auditing===2' audit-ctrl='re-fill'>
			<p>
				发回重审
			</p>
			<div class="auditing-remark">
				<p class="auditing-description">
					说明：您好，您在柒彩虹的申请被暂时退回，请根据客服审核意见更新或修改资料后重新提交；若暂时不需要可在需要时重新进行提交。
					如需咨询请联系QQ:356308275
				</p>
				<p class="auditing-description">
					温馨提醒：
					使用微信搜索【陈管家】或点击<span @click='hzgMarket' class="link">【放米超市】</span>可以直接申请其他平台
				</p>
				<!-- <p class="auditing-description">说明：请根据审核意见更新或修改资料后重新提交</p> -->
				<!-- <p class="auditing-description" v-html="'审核意见：'+auditingRemark"></p> -->
			</div>
		</div>


		<div class="container auditing" v-if='auditing===1' audit-ctrl='approved quota' >
		<!-- <div class="container auditing" v-if='true' audit-ctrl='approved quota' > -->
			<p></p>
			<p class="remind"></p>
			<app-quota :quotaCfg='applyRecord'></app-quota>
		</div>

		<div class="input" v-if='auditing===2 ||(applyRecord.quotaStatus===3&&applyRecord.status!==3)' audit-ctrl='reapply'>
			<el-button type='success' @click='reapply' >重新申请</el-button>
		</div>

		<div class="container" v-if='needRepayment||fullRepayedAndNotReborrow' audit-ctrl='bill-status' >
			<div class="inner-contaier loan-amount">
				<div class="detail-li">
					<span class="li-title">{{___loanName}}金额</span>
					<span class="li-content loan-amount">￥{{loanInfo.moneyFee | moneyParser}}</span>
				</div>
			</div>
			<div class="inner-contaier loan-date">
				<div class="detail-li">
					<span class="li-title">{{___loanName}}日期</span>
					<span class="li-content">{{loanInfo.borrowTime|timeParser}}</span>
				</div>
				<div class="detail-li">
					<span class="li-title">应还日期</span>
					<span class="li-content">{{loanInfo.repaymentTime | timeParser}}</span>
				</div>
				<div class="detail-li">
					<span class="li-title">当前状态</span>
					<span class="li-content" :class="{'enable':loanInfo.status===3,'danger':loanInfo.status!==0||loanInfo.status!==2}">
						{{loanInfo.status | statusParser}}
					</span>
				</div>
			</div>

			<div class="inner-contaier loan-action input">
				<el-button type='success' class="action-bttn" @click="goP(key,act)" v-for='(act,key ) in actions' :class="{'enable':act.enable}" :disabled='!act.enable' :key='key' v-if='act.show'>
					{{act.act}}
				</el-button>
			</div>
		</div>



		<div class="input bttn-refresh" v-if='auditing!==4' audit-ctrl='refresh'>
				<el-button type='success' @click='get' >刷新</el-button>
		</div>
			<p class="more-loan" v-if='!noApplyRecord'>点击<span class="link" @click='hzgMarket'>【{{___marketName}}】</span>可以直接申请其他{{___daikuan}}</p>
		
		</div>
		<remind :remind='remind'></remind>
	</div>
</template>

<script>
import publicFun from '../js/public.js'
import bus from '../bus.js'
import quota from './views/quota.vue'
import huabei from './views/tixian.vue'
export default {
	data() {
			return {
				gettingBillStatud:false,
				response: null,
				applyRecord:{},
				auditingRemark:null,
				auditing: null,
				loanInfo: null,
				loading: true,
				editing: true,
				backAfterPost: false,
				url: 'accounting/myLendInfo?lendingUid=1',
				urlApply: 'lendApply/lendApply',
				phoneLender: null,
				amount: 2000,
				urlApplyRecord: 'lendApply/borrowLoanRecords?limit=1&lendingUid=1',
				remind: {
					isShow: false,
					remindMsg: 'remind',
					self_: this,
					remindOpts: [{
						msg: '确定',
					}, ],
				},

			}
		},
		created() {
			publicFun.checkSession(this)
			bus.$on('quota_recieved',()=>{
				this.get()
			})
			// setTimeout(()=> {
			// 	// test_放款等待还款()
			// 	// this.applyRecord.quotaStatus=1
			// 	// // this.loanInfo.status=3
			// 	// this.auditing=1
			// }, 2000);
			this.get()
			var test_审核通过等待放款=()=>{
				this.auditing=1
			}
			var test_审核中=()=>{
				// !loanInfo&&(auditing===0)
				this.loanInfo=null
				this.auditing=0
			}
			var test_退回重审=()=>{
				this.auditing=2
			}
			var test_申请通过待放款=()=>{
				this.auditing=1
			}
			var test_放款等待还款=()=>{
				// (auditing===3&&loanInfo)|
				this.auditing=3
				this.loanInfo = {
					"overdueFee": 0, //逾期金额分
					"reBorrowFee": 4800, //续期手续费分(若有逾期，包括逾期费用，即重借费用+逾期费用)
					"phone": "17702103430", //借款人手机号
					"moneyFee": 20000, //借款金额
					"borrowTime": 1499616000000, //借款时间戳，毫秒
					"lendingWay": "借贷宝", //借款方式
					"name": "taoyu", //借款人名字
					"idCardNum": "330329199110021432", //借款人身份证
					"id": 3, //借款id
					"repaymentTime": 1499702400000, //应还时间
					"status": 2 //0:逾期未还（本金和逾期费用都未还），1:等待还款（未逾期）, 2:逾期本金已还（需要处理逾期） 3：已还款（正常。可以重借）
				}
			}
		},

		filters: {
			moneyParser(v) {
				return Number(v / 100).toFixed(2)
			},
			timeParser(v) {
				return publicFun.getTimeString(v, 0, 10)
			},
			statusParser(v) {
				var s
				switch (v) {
					case 0:
						s = '逾期未还本金'
						break;
					case 1:
						s = '待还款'
						break;
					case 2:
						s = '逾期已还本金'
						break;
					case 3:
						s = '已还款'
						break;
					default:
						s = '未知'
				}
				return s
			},
		},
		methods: {
			// test() {
			// 	this.auditing = 1
			// },
	  	joinQQ(){
				window.location = "http://qm.qq.com/cgi-bin/qm/qr?k=FUte7gZXvGPuLJHt4DoPcoJzABIvE10W"
	  	},
			hzgMarket(){
			    console.log('hzg market_list')
			    location.href='https://www.ho163.com/m/#/market_list'
			},
			reapply() {
				var remind=this.remind
				var apply = () => {
						var remind=this.remind
						remind.isShow=false
						remind.remindMsgDscrp=null
						let queryBody={
							phone: bus.phoneLender,
							amount: this.amount * 100,
						}
						if(this.applyRecord.quotaStatus===3){
							queryBody.applyType=1
						}
						if(this.loanInfo&&this.loanInfo.status===3){
							queryBody.applyType=1
						}
						if(this.loanInfo&&this.loanInfo.status===1){
							queryBody.applyType=2
						}
						var urlApply = publicFun.urlConcat(this.urlApply, queryBody)
						publicFun.post(urlApply, {}, this, () => {
							if(this.response.body.error){
								return
							}
							remind.remindMsg = '提交完成'
								// remind.remindMsgDscrp='请添加微信或手机联系人以便客服联系'
							remind.remindMsgDscrp = null
							remind.remindOpts = [{
								msg: '确定',
								callback: () => {
									// publicFun.goPage('/loan_bill')
									this.get()
								}
							}]
						}, () => {})
					}

				remind.remindMsg = '请确定是否提交'
				if(!this.applyRecord.quotaStatus===3){
					remind.remindMsgDscrp = '提示：与客服沟通后完善相应信息后提交'
				}
				remind.remindOpts = [{
					msg: '确定',
					callback: apply,
				}, {
					msg: '取消',
				}, ]
				remind.isShow = true
			},
			submitByAction(type){
				var action,applyType
				switch(type){
					case 'renewal':action='续期'; applyType=2;break;
					case 'reborrow':action='重借'; applyType=1;break;
				}
				var apply = () => {
					console.log('xuqi')
					let urlApply = publicFun.urlConcat(this.urlApply, {
						phone: bus.phoneLender,
						amount: this.amount * 100,
						applyType:applyType,
					})
					publicFun.post(urlApply, {}, this, () => {
						if (this.response.body.error) {
							return
						}
						remind.remindMsg = '提交完成'
							// remind.remindMsgDscrp='请添加微信或手机联系人以便客服联系'
						remind.remindMsgDscrp = null
						remind.remindOpts = [{
							msg: '确定',
							callback: () => {
								// publicFun.goPage('/loan_bill')
								this.get()
							}
						}]
					}, () => {})
				}
				var remind=this.remind
				remind.remindMsg = '提交'+action
				remind.remindOpts = [{
					msg: '确定',
					callback: apply,
				}, {
					msg: '取消',
				}, ]
				remind.isShow = true

			},
			goP(key, act) {
				console.log('act',act,key)
				if(key==='repay'){   
					let url=publicFun.urlConcat('/loan_deal',{
						action: key,
						billId:this.loanInfo.id,
						v:Math.random().toFixed(5),
						lendingWay:this.loanInfo.lendingWay,
						expired:this.loanInfo.status===0?1:"",
					})
					publicFun.goPage(this.$route.path+url)
					return
				}
				// if(key==='renewal'){
					// this.submitByAction('renewal')
				// }
				// if(key==='reborrow'){
				// 	this.submitByAction('reborrow')
				// }
				if(key==="special"||key==='renewal'){
					console.log('%c special','color:red',)
					let url=publicFun.urlConcat('/loan_deal',{
						action: key,
						billId:this.loanInfo.id,
						v:Math.random().toFixed(5),
						lendingWay:this.loanInfo.lendingWay,
					})
					publicFun.goPage(this.$route.path+url)
					return
				}
				if(key==='reborrow'){
					let url = publicFun.urlConcat('/debt', {
						action: key,
						billId: this.loanInfo.id,
						v: Math.random().toFixed(5),
						// title:act.act,
						// amount:this.loanInfo.moneyFee,
					})
					console.log('gopage', url)
					var r=this.remind
					r.remindMsg='请更新负债调查'
					r.remindOpts = [
						{
							msg: '确认',
							callback: () => {
								publicFun.goPage(this.$route.path + url)
							}
						}, {
							msg: '取消',
						},
					]
					r.isShow=true
				}
				// // var url = publicFun.urlConcat('/loan_deal', {
				// let url = publicFun.urlConcat('/debt', {
				// 	action: key,
				// 	billId: this.loanInfo.id,
				// 	v: Math.random().toFixed(5),
				// 	// title:act.act,
				// 	// amount:this.loanInfo.moneyFee,
				// })
				// console.log('gopage', url)
				// var r=this.remind
				// r.remindMsg='请更新负债调查'
				// r.remindOpts = [
				// 	{
				// 		msg: '确认',
				// 		callback: () => {
				// 			publicFun.goPage(this.$route.path + url)
				// 		}
				// 	}, {
				// 		msg: '取消',
				// 	},
				// ]
				// r.isShow=true
			},
			get() {
				var checkAuditing = () => {
					this.gettingBillStatud=false
					// var r=this.remind
					console.log('res apply record', this.response.body.data.data)
					var data = this.response.body.data.data[0]
					if (data) {
						// console.log('have records means auditing')
						this.auditing = data.status

						this.auditingRemark = data.remark
						this.phoneLender = data.phone
						this.applyRecord = data
					} else {
					}
				}
				this.gettingBillStatud=true
				publicFun.get(this.url, this, () => {
					function isOverDueOneWeek(repaymentTime){
						return repaymentTime+345600000>(new Date()).getTime()
					}
					console.log('res loan info', this.response)
					this.loanInfo = this.response.body.data
					if(this.loanInfo){
						this.loanInfo.canReborrow=isOverDueOneWeek(this.loanInfo.repaymentTime)
					}
					// this.loanInfo.repaymentTime
						publicFun.get(this.urlApplyRecord, this, checkAuditing)
					if (!this.loanInfo) {
					}
				})
			},
		},
		computed: {


			renewalAuditing(){
				var l = this.loanInfo
			  return this.auditing===0&&l&&(l.status===1||l.status===2)
			},
			reborrowAuditing(){
			  	var l = this.loanInfo
			    return this.auditing===0&&l&&l.status===3
			},
			waitReleasing(){
				// l=this.loanInfo
			  return this.auditing==1
			},
			noApplyRecord(){
				return this.applyRecord.apply_id===undefined
			},
			actions() {
				var l = this.loanInfo
					//0:逾期未还（本金和逾期费用都未还），1:等待还款（未逾期）, 2:逾期本金已还（需要处理逾期） 3：已还款（正常。可以重借）
				var temp = {

						renewal: {
							act: '续期',
							enable: true,
							show:true,
							index: 1
						},
						reborrow: {
							act: '重借',
							enable: true,
							show:true,
							index: 1
						},
						repay:{
							act:'还款',
							enable:true,
							show:true,
							index:1,
						},
						special: {
							act: '特殊',
							enable: true,
							show:true,
							index: 1
						},
					}
					temp.renewal.show=(l.status===1||l.status===0)&&l.canReborrow&&!this.renewalAuditing
					temp.repay.show=l.status===1||l.status===0
					temp.reborrow.show=(l.status===3 || l.status===2)&&(!this.reborrowAuditing)&&(!this.waitReleasing)
				return temp
			},
			//billStatus 未全还且无已过审批的申请（needRepayment）||已全还且无重借申请（fullRepayedAndNotReborrow）
			needRepayment(){
				var notAllRepayed=this.loanInfo&&this.loanInfo.status!==3
				return notAllRepayed&&this.auditing!==1
			},
			fullRepayedAndNotReborrow(){
			  return this.auditing!==0&&this.loanInfo&&this.loanInfo.status===3
			},


			// xiaoheRepayed(){
			//   return this.loanInfo&&this.loanInfo.status===3&&this.applyRecord.quotaStatus===2
			// },
			// thirdPartRepayed(){
			// 	if(!this.loanInfo){
			// 		return false
			// 	}
			// 	let isThirdPart=this.loanInfo.lendingWay!="___companyName"
			//   return this.loanInfo&&this.loanInfo.status===3&&isThirdPart
			// },
			// reBorrowAfterFullRepayed(){
			//   return this.auditing===0&&this.loanInfo.status===3
			// },
		},
		events: {},
		components: {
			'app-quota':quota,
			'huabei':huabei,
		}
}
</script>

<style lang='scss' scoped>
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
	*{
		/*border:1px solid red;*/
	}
	.link{
		color:#2447D1;
	}
	.more-loan{
		margin: 0.1rem;
		font-size: 0.14rem;
	}
		.loan-amount{
			color:#000;
			font-size: 0.2rem;
			line-height: 0.15rem;
		}
		.auditing{
			font-size: 0.28rem;
			line-height: 1.4;
			.auditing-remark{
				border: 0px solid #efeff4 ;
				padding:0.15rem 0.05rem;
				border-top-width: 1px;
			}
			.auditing-description{
				line-height: 1.6;
				font-size: 0.16rem;
				text-align: left;
				margin:0.05rem 0.15rem;
			}
			.auditing-txt{
				border: 0px solid #efeff4 ;
				border-bottom-width: 1px;
				padding:0.1rem;
			}
		}
		.bttn-refresh{
			padding:0.15rem 0;
		}
		.container{
			background: #fff;
			margin-top:0.2rem;
			border:1px solid transparent;
			.qrcode{
				width: 60%;
				margin:0 auto;
			}
			.remind{
				font-size: 0.16rem;
				text-align: left;
				margin:0.1rem 0.15rem;
			}
			.remind-refused{
				line-height: 1.2;
				font-size: 0.14rem;
				margin:0.05rem 0.15rem;
			}
			.inner-contaier{
				margin-left: 0.2rem;
				padding: 0.12rem 0;
				padding-right: 0.2rem;
				border: 0px solid #bbb ;
				border-top-width: 1px;
				line-height: 1;
				.detail-li{
					color: #8e8e8e;
					display: flex;
					font-size: 0.15rem;
					margin:0.12rem 0;
					.li-title,.li-content{
						width: 50%;
					}
					.li-title{
						text-align: left;
					}
					.li-content{
						text-align: right;
					}
				}
				&:first-child{
					border-top-width: 0px;
				}
			}
			.loan-action{
				display: flex;
				font-size: 0.16rem;
				padding:0 0.15rem;
				color:#8e8e8e;
				justify-content:center;
				.action-bttn{
					width: 40%;
					margin:0.1rem 0.15rem;
					padding:0.1rem 0;
					opacity: 0.5;
					flex-grow:0;
				}
				.action-bttn:last-child{
					margin-right:0.45rem;
				}

			}
		}
	#loanBillVue{
		.container{
			.enable{
				/*color:#09bb07;*/
				opacity: 1;
			}
			.danger{
				color: #e94f4f;
			}
		}
	}
</style>
