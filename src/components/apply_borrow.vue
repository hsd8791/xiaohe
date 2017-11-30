<template>
	<div id="applyBorrowVue" class='input fixed-title-page' v-loading='loading' element-loading-text='请稍后'>
		<h1 class="title"><app-back></app-back><!-- 申请借款 -->分享到微信</h1>
		<div class="amount-box">
			<label class="amount-label">借款金额：</label>
			<div class="amount-select">
				<app-select :options="applyAmountOpts"  v-select='amount' :select-value='amount' :filter='amountPaser'  ></app-select>
			</div>
		</div>
		<!-- <el-button type='success' class="confirm" @click='applyBorrow' :disabled='!(canApply&&allFilled&&norecord)'>点击申请</el-button> -->


		<div class="fill-status " v-if='!allFilled'>
			<div class="container">
			<h3 class="section-title"  v-if='!allFilled'>请完成以下信息后提交</h3>

				<div class="unordered-list"  v-for='(item,index) in unFilledItems' @click='goCompletePage(item.link)' v-if='!item.status'>
					{{item.title}}
					<i class="el-icon-arrow-right"></i>
				</div>
				<!-- <div class="unordered-list"  v-for='(item,index) in fillStatus2' @click='goPage(item.url)' v-if='!(item.status&&item.status2)'>
					{{item.label}}
					<i class="el-icon-arrow-right"></i>
				</div> -->
			</div>
		</div>
		<el-button type='success'  class="confirm" @click='applyBorrow' :disabled='!(canApply&&allFilled&&amountValid)'>点击申请</el-button>

		<!-- <remind :remind='remind'></remind> -->
	</div>
</template>

<script>
//借款金额
//点击申请
	import publicFun from '../js/public.js'
	// import checkFill from '../js/checkFill.js'
	import bus from '../bus.js'
	import remind from '../components/tmpts/remind.vue'
	export default {
		data() {
				return {
					norecord:false,
					// ttlRequest: 7, // qty of requset
					// undoneRequest: null, //记录未完成的请求判断，全部完成后判断是否可以提交
					getById: false, //判定是否由uniqueId 传入获取lenderPhone
					canApply: false,
					// firstEnter: true,
					response: null,
					loading: false,
					editing: true,
					lenderInfo: {
						name: '',
						phone: '',
					},
					applyAmountOpts:[
						{value:1000,},
						{value:2000,},
					],
					unFilledItem:[],
					lenderInfoAlert: '',
					uniqueIdLender: null,
					urlPhone: 'lendApply/phoneInfo?phone=',
					// urlUniqueId: 'userInfo/userInfo?uniqueId=',
					urlApply: 'lendApply/lendApply',
					urlLendInfo:'accounting/myLendInfo?lendingUid=1',
					urlApplyRecord:'lendApply/borrowLoanRecords?limit=1&lendingUid=1',
					confirmOpts: [{
						msg: '确定',
						callback: () => {}
					}, {
						msg: '取消'
					}],
					remind: {
						isShow: false,
						remindMsg: 'remind',
						self_: this,
						remindOpts: [{
							msg: '确定',
						}, ],
					},
					phoneLender: null,
					amount: 1000,

				
				}
			},
			methods: {
				goCompletePage(url){
				  publicFun.goPage(this.$route.path+url)
				},
				amountPaser(v){
				  return (+v).toFixed(2)+'元'
				},
				checkNewer() {
					var r=this.remind
					var checkAuditing = () => {
						console.log('res apply record', this.response.body)
						if(this.response.body.data.data.length>0){
							// console.log('have records means auditing')
							r.remindMsg='审核中'
							r.remindMsgDscrp=null
							// r.remindMsgDscrp=this.response.body.data.data
							r.remindOpts=[{
								msg:'确定',
								callback:()=>{
									publicFun.goPage('/loan_bill')
								}
							}]
							r.isShow=true
						}else{
							this.norecord=true
						}
					}
					var checkLend = () => {
						if (this.response.body.data) {
							var r = this.remind
							r.remindMsg = '已有借款记录'
							r.remindMsgDscrp = ''
							r.remindOpts = [{
								msg: '确定',
								callback: () => {
									publicFun.goPage('/loan_bill')
								}
							}]
							r.isShow = true
						} else {// check if have applied if no lend info
							publicFun.get(this.urlApplyRecord, this, checkAuditing)
						}
					}

					publicFun.get(this.urlLendInfo, this, checkLend)
				},
				goPage(p) {
					publicFun.goPage(p)
				},
				applyBorrow() {
					var apply=()=> {
							var urlApply = publicFun.urlConcat(this.urlApply, {
								phone: this.phoneLender,
								amount: this.amount*100,
							})
							publicFun.post(urlApply, {}, this, () => {
								// console.log('res apply_borrow', this.response)
								// this.remind.remindMsg='提示:添加联系方式'
								this.remind.remindMsg='提交完成'
								// this.remind.remindMsgDscrp='请添加微信或手机联系人以便客服联系'
								this.remind.remindMsgDscrp='请添加QQ公众号：4000577009，否则不能完成借款'
								this.remind.remindOpts = [{
									msg: '确定',
									callback: () => {
										publicFun.goPage('/loan_bill')
									}
								}]
							}, () => {
							})
						}
					if (!this.allFilled||!this.canApply||!this.amountValid) {
						console.error('sth undone ！')
						// return
					}
					console.log('applying')
					this.remind.remindMsg = '请确认是否提交'
					this.remind.remindMsgDscrp=null
					this.remind.remindOpts = [{
						msg: '确定',
						callback: apply,
					}, {
						msg: '取消',
					}, ]
					this.remind.isShow = true

				},
				blured($event) {
					var el = $event.target.parentElement.parentElement
					el.className += ' validate'
				},

				// addUnfilledItems(u){
				// 	u.forEach(item=>{
				// 		let exited=this.unFilledItems.find(i=>{
				// 			return i.label===item.label
				// 		})
				// 		if(exited){
				// 			return
				// 		}
				// 		if(item.status===0){
				// 			this.unFilledItems.push(item)
				// 		}
				// 	})
				// 	console.log('unFilledItems',this.unFilledItems)
				// },
				getLenderInfo(url) {
					publicFun.get(url, this, () => {
						var res = this.response.body
							// console.log('getlenderInfo', res)
						if (!res.error) {
							// console.log('set lenderInfo')
							this.lenderInfo.name = res.data.name
							this.phoneLender = res.data.phone
								// var p=res.data.phone.toString()
								// console.log('string phoneLender',p)
							this.lenderInfo.phone = res.data.phone
								// this.phoneLender=res.data.phone
							bus.phoneLender = this.lenderInfo.phone
							this.lenderInfoAlert = ''
								// this.phoneExist = true
							this.canApply = true
						} else {
							// if(res.error=20000){}
							this.lenderInfoAlert = res.msg
							this.lenderInfo = {}
								// this.phoneExist = false
						}
					})
				},
				// qualify(){
				// 	if(bus.qualified===true){
				// 		return
				// 	}
				// 	var r=this.remind,remindInterval=200
				// 	function scoreOk(){
				// 		r.remindMsg='花呗额度需大于1500'
				// 		r.remindMsgDscrp='提示：低于1500的用户无法通过借款申请'
				// 		r.remindOpts=[
				// 		{msg:'满足条件',callback:allOk},
				// 		{msg:'不满足条件',callback:failed},
				// 		]
				// 		setTimeout(function() {
				// 			r.isShow=true
				// 		}, remindInterval);
						
				// 	}
				// 	function allOk(){
				// 		bus.qualified=true
				// 		r.remindMsg='满足基本条件'
				// 		r.remindMsgDscrp='请继续完成认证信息'
				// 		r.remindOpts=[{
				// 			msg:'确定',
				// 		}]
				// 		setTimeout(function() {
				// 			r.isShow=true
				// 		}, remindInterval);
						
				// 	}
				// 	function failed(){
				// 		r.remindMsg='无法申请借款'
				// 		r.remindMsgDscrp=''
				// 		r.remindOpts=[{
				// 			msg:'确定',callback:()=>{
				// 				publicFun.goPage('/introduce')
				// 			}
				// 		}]
				// 		r.isShow=true
				// 	}
				// 	r.remindMsg='芝麻信用分需大于630'
				// 	r.remindMsgDscrp='提示：低于630的用户无法通过借款申请'
				// 	r.remindOpts=[
				// 	{msg:'满足条件',callback:scoreOk},
				// 	{msg:'不满足条件',callback:failed},
				// 	]
				// 	r.isShow=true
				// },
				edit() {
					this.editing = true
				},
			},
			events: {},
			created: function() {
				publicFun.qualify(this)
				this.checkNewer()//非newer 不会有提示覆盖qulify 函数中的提示，
				// 以上两个函数只会有一个出现提示框
				// this.checkFilled()
				if (bus.phoneLender) {
					this.phoneLender = bus.phoneLender
				}
				
			},
			filters: {
				nameParse(val) {
					if (!val) {
						return '未知'
					}
					var s = val.split('')
					s[0] = '*'
					s = s.join('')
					return s
				},
				phonePartshow(val) {
					var s = val.split('')
					s[3] = '*'
					s[4] = '*'
					s[5] = '*'
					s[6] = '*'
					s = s.join('')
					return s
				}
			},
			watch: {
				phoneLenderValid: function(val) {
					if (this.phoneLenderValid) {
						bus.phoneLender = this.phoneLender
						this.getLenderInfo(this.urlPhone + this.phoneLender)
							// setTimeout(()=> {
							// this.allFilled = this.checkAllFilled()
							// }, 1000);
							// console.log('this.checkAllFilled',this.checkAllFilled())
					} else {
						this.canApply = false
					}
				},

				// undoneRequest: function(val) {
				// 	console.log('undoneRequest', val)
				// 	if (val === 0) {
				// 		this.allFilled = this.checkAllFilled()
				// 	}
				// }
			},
			computed: {
				unFilledItems(){
					let itemMtrix=bus.essentialCell
					let itemArr=[]
					for(let i=0;i<itemMtrix.length;i++){
						for(let j=0;j<itemMtrix[i].length;j++){
							itemArr.push(itemMtrix[i][j])
						}
					}
				  return itemArr
				},
				allFilled(){
				  let s= bus.fillStatus
				  return s.identity&&
				  s.zmAuth&&
				  s.sjmh&&
				  s.contact&&
				  s.relatives&&
				  s.liabilities
				},
				phoneLenderValid: function() {
					var reg = publicFun.reg.cellphone
					return reg.test(this.phoneLender)
				},
				amountValid: function() {
					var reg = /^[1-9][0-9]*$/
					return reg.test(this.amount)
				},
			},
			components: {
				remind: remind,
			}
	}
</script>

<style lang='scss' scoped>

#applyBorrowVue{
	height: 100%;
}
</style>
