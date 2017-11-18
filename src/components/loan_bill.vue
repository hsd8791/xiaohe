<template>
	<div id="loanBillVue" class="fixed-title-page">
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<h1 class="title">
				我的借款
				<div class="input bttn-refresh" v-if='auditing!==4' audit-ctrl='refresh' @click='get'>
					<i class="icon-refresh refresh-icon"></i>
					<span>
						刷新
					</span>
				</div>
			</h1>
		</div>
		<re-audit v-if='auditing===4' :remark="auditingRemark" :auditing='4'></re-audit>

		<div class="container auditing" v-if='auditing===0' audit-ctrl='auditing' >
			<p class="auditing-txt">
			<span v-if="loanInfo">重借</span><span v-if="!loanInfo">小禾微贷</span> 审核中
			</p>
		</div>
		<div class="container auditing" v-if='auditing===1' audit-ctrl='approved quota' >
			<app-quota :quotaCfg='applyRecord'></app-quota>
		</div>
			<!-- <app-quota :quotaCfg='applyRecord'></app-quota> -->

		<div class="container" v-if='!loanInfo&&(auditing===0)' audit-ctrl='guide'>
		<!-- <div class="container" v-if='true' audit-ctrl='guide'> -->
			<p class="remind">新用户审核时间：上午9：00-下午5：00。</p>
			<p class="remind">下午5：00以后申请的将在第二天开始审核。</p>
			<p class="remind">必须添加QQ公众号【4000577009】才能进行审核。</p>
			<!-- <p class="remind">识别以下二维码关注【小禾微贷公众号】，输入“审核”咨询结果。</p> -->
			<!-- <img src="./../assets/img/QRxh.jpg" alt="" class="qrcode"> -->
			<img src="./../assets/img/hzg_qr.jpg" alt="" class="qrcode">
			<p class="remind">点击<span class="link" @click='hzgMarket'>【更多贷款】</span>可以直接申请其他贷款</p>

		</div>
		<div class="container auditing" v-if='1' audit-ctrl='no-apply'>
			无申请记录
		</div>
		<re-audit v-if='auditing===2' :remark="auditingRemark"></re-audit>

		<div class="input" v-if='auditing===2 || applyRecord.quotaStatus===3' audit-ctrl='reapply'>
			<el-button type='success' @click='reapply' > 重新申请</el-button>
		</div>
		<div class="container" v-if='auditing===3&&loanInfo' audit-ctrl='bill-status' >
			<div class="shadow-box">
				<div class="inner-contaier loan-amount-container">
					<div class="detail-li">
						<span class="li-title">借款金额</span>
						<span class="li-content loan-amount">{{loanInfo.moneyFee | moneyParser}}元</span>
					</div>
				</div>
				<div class="inner-contaier loan-date">
					<div class="detail-li">
						<span class="li-title">
							<i class="icon-status li-icon"></i>
							借款日期
						</span>
						<span class="li-content">{{loanInfo.borrowTime|timeParser}}</span>
					</div>
					<div class="detail-li">
						<span class="li-title">
							<i class="icon-status li-icon"></i>
							应还日期
						</span>
						<span class="li-content">{{loanInfo.repaymentTime | timeParser}}</span>
					</div>
					<div class="detail-li">
						<span class="li-title">
							<i class="icon-status li-icon"></i>
							当前状态
						</span>
						<span class="li-content" :class="{'enable':loanInfo.status===3,'danger':loanInfo.status!==0||loanInfo.status!==2}">
							{{loanInfo.status | statusParser}}
						</span>
					</div>
				</div>
			</div>
			
			<div class="inner-contaier loan-action input">
				<el-button type='success' class="action-bttn" @click="goP(key,act)" v-for='(act,key ) in actions' :class="{'enable':act.enable}" :disabled='!act.enable' :key='key' v-if='act.show'>
					{{act.act}}
				</el-button>
			</div>
		</div>
		

			<p class="more-loan" v-if='!noApplyRecord'>点击<span class="link" @click='hzgMarket'>【更多贷款】</span>可以直接申请其他贷款</p>
		

		<remind :remind='remind'></remind>
	</div>
</template>

<script>
	import publicFun from '../js/public.js'
	import bus from '../bus.js'
	import quota from './views/quota.vue'
	import reAudit from './views/re-auditing.vue'
	export default {
		data() {
				return {
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

				this.get()
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
				hzgMarket(){
				    console.log('hzg market_list')
				    location.href='http://hzg.he577.com/m/#/market_list'
				},
				reapply() {
					var remind=this.remind
					var apply = () => {
							var remind=this.remind
							remind.isShow=false
							remind.remindMsgDscrp=null
							let queryBody={
								phone: '13777722216',
								amount: this.amount * 100,
							}
							if(this.applyRecord.quotaStatus===3){
								queryBody.applyType=1
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
				goP(key, act) {
					console.log('act',act)
					if(key==='repay'||key==='renewal'){
						let url=publicFun.urlConcat('/loan_deal',{
							action: key,
							billId:this.loanInfo.id,
							v:Math.random().toFixed(5),
						})
						publicFun.goPage(this.$route.path+url)
						return
					}
					// var url = publicFun.urlConcat('/loan_deal', {
					let url = publicFun.urlConcat('/debt', {
						action: key,
						billId:this.loanInfo.id,
						v:Math.random().toFixed(5),
						// title:act.act,
						// amount:this.loanInfo.moneyFee,
					})
					// console.log('gopage', url)
					var r=this.remind
					r.remindMsg='请更新负债调查'
					r.remindOpts=[

					{msg:'确认',callback:()=>{
						publicFun.goPage(this.$route.path+url)
					}},
					{msg:'取消',},
					]
					r.isShow=true
				},
				get() {
					var checkAuditing = () => {
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
						// temp.special.enable=(l.status===0||l.status==2)
						temp.renewal.show=(l.status===1||l.status===0)&&l.canReborrow
						temp.repay.show=l.status===1||l.status===0
						// temp.renewal.show=false
						temp.reborrow.show=(l.status===3 || l.status===2)

					return temp
				},
			},
			events: {},
			components: {
				'app-quota':quota,
				're-audit':reAudit,
			}
	}
</script>

<style lang='scss' scoped>
	.link{
		color:#2447D1;
	}
/*<<<<<<< HEAD*/
	
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
		width: 0.7rem;
		/*padding-right: 0.15rem;*/
		position: absolute;
		right: 0;
		height: 100%;
		top: 0;
		font-size: 0.15rem;
		/*border:1px solid red;*/
		/*line-height: 0.4rem;*/
		text-align: right;
		
		.refresh-icon,span{
			font-size: 0.15rem;
			position: absolute;
			left: 0;
			top: 0;bottom: 0;
			margin:auto 0;
			display: block;
			height: 0.15rem;
			color:#fff;
			font-weight: bold;
		}
		span{
			left: auto;
			right: 0.15rem;
		}
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
			padding:0.05rem 0.25rem;
		}
		.loan-amount-container{
			border:0px dashed #d3d3d3;
			border-bottom-width: 1px;

		}
		.inner-contaier{
			margin-left: 0.2rem;
			padding: 0.12rem 0;
			width: 3.14rem;
			line-height: 1;
			.detail-li{
				color: #7e7e7e;
				display: flex;
				font-size: 0.13rem;
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
			.loan-amount{
				color:#5494f3;
				font-size: 0.16rem;
				line-height: 0.15rem;
			}
			.li-icon{
				margin-right: 0.1rem;
			}
		}
		.loan-action{
			display: flex;
			font-size: 0.16rem;
			padding:0 0.15rem;
			color:#8e8e8e;
			.action-bttn{
				width: 40%;
				margin:0.1rem 0.15rem;
				padding:0.1rem 0;
				opacity: 0.5;
				
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
