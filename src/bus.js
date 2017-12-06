import Vue from 'vue'
// import publicFun from './js/public.js'
var publicFun = require('./js/public.js')

var bus = new Vue({
	data: {
		detailTaskId: null,
		loading: false,
		phoneLender: '13777722216',
		uniqueIdLender: '2qamam',
		account: '请登录',
		uniqueId: '',
		test: 'tstMSG',
		response: null,
		loanInfo: null,
		qualified: 0,
		firstEnterApp: true,
		isNewer:true,
		fillStatus: {
			"address": -1,
			"idcardPic": -1,
			"zmAuth": -1,
			"identity": -1,
			"work": -1,
			"sjmh": -1,
			"contact": -1,
			"liabilities": -1,
			"personal": -1,
			"relatives": -1,
		},
		remind: {
			isShow: false,
			remindMsg: 'remind',
			self_: undefined,
			remindOpts: [{
				msg: '确定',
			}, ],
		},
	},
	created: function() {
		// this.getLenderInfo()
		this.$on('account_change', (ac, id, q) => {
			// console.log('bus get account change', ac, id)
			this.uniqueId = id
			this.account = ac
			this.qualified = q
		})
	},
	methods: {
		checkFilled(){
		  this.checkStatus()
		},
		checkStatus() {
			publicFun.default.get('userInfo/authInfo', this, () => {
				console.log('bus authInfo', this.response.body)
				this.fillStatus = this.response.body.data
			})
		},
		// getLenderInfo() {
		// publicFun.get(this.urlLendInfo, this, () => {
		// 	console.log('res loan info', this.response)
		// 	this.loanInfo = this.response.body.data
		// 	console.log('bus', this)
		// })
		// this.$http.get(this.urlLendInfo).then(res => {

		// }, err => {})
		// },
	},
	watch: {
		account(v) {
			if (v !== '请登录') {
				this.checkStatus()
			}
		}
	},
	computed: {
		relativeUrlTest() {
			if (/test/.test(this.$http.options.root)) {
				return '/test'
			} else {
				return ''
			}
		},
		imgPath() {
			return this.___imgPath
		},
		essentialCell() {
			let status = this.fillStatus
			return [
				[{
						title: '身份认证',
						link: '/identity',
						icon: 'icon-identify',
						imgFilled: '../../static/xh/icon-identify.png',
						imgNotfilled: '../../static/xh/icon-identify-enable.png',
						status: status.identity
					}, {
						title: '芝麻认证',
						link: '/zhima',
						icon: 'icon-zhima',
						imgFilled: require('./assets/' + this.___subName + '/icon-zhima.png'),
						imgNotfilled: require('./assets/' + this.___subName + '/icon-zhima-enable.png'),
						status: status.zmAuth
					},
					// {title:'身份证上传',link:'/upload',icon:'icon-upload',
					// 	imgFilled:require('./assets/'+this.___subName+'/icon-id-upload.png'),
					// 	imgNotfilled:require('./assets/'+this.___subName+'/icon-id-upload-enable.png'),
					// 	status:status.idcardPic},

					{
						title: '手机认证',
						link: '/shujumohe',
						icon: 'icon-mobile',
						imgFilled: require('./assets/' + this.___subName + '/icon-phone.png'),
						imgNotfilled: require('./assets/' + this.___subName + '/icon-phone-enable.png'),
						status: status.sjmh
					},
					// {title:'负债调查',link:'/debt',icon:'icon-coin-yen',
					// 	imgFilled:require('./assets/'+this.___subName+'/icon-debt.png'),
					// 	imgNotfilled:require('./assets/'+this.___subName+'/icon-debt.png'),
					// 	status:status.liabilities},
				],
				[{
						title: '其他信息',
						link: '/other',
						icon: 'icon-phone',
						imgFilled: require('./assets/' + this.___subName + '/icon-other.png'),
						imgNotfilled: require('./assets/' + this.___subName + '/icon-other-enable.png'),
						status: status.contact && status.relatives && status.liabilities,
					},

				],
			]
		},
		optionalCell() {
			let status = this.fillStatus
			return [
				[{
					title: '个人概况',
					link: '/profile',
					icon: 'icon-test',
					imgFilled: require('./assets/' + this.___subName + '/icon-profile.png'),
					imgNotfilled: require('./assets/' + this.___subName + '/icon-profile-enable.png'),
					status: status.personal && status.address
				}, {
					title: '工作信息',
					link: '/job_info',
					icon: 'icon-profile',
					imgFilled: require('./assets/' + this.___subName + '/icon-job.png'),
					imgNotfilled: require('./assets/' + this.___subName + '/icon-job-enable.png'),
					status: status.work
				}, ],
			]
		}
	}
})

export default bus