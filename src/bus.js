import Vue from 'vue'
// import publicFun from './js/public.js'
var publicFun = require('./js/public.js')

var bus = new Vue({
	data: {
		detailTaskId: null,
		phoneLender: '13777722216',
		uniqueIdLender: '2qamam',
		account: '请登录',
		uniqueId: '',
		test: 'tstMSG',
		response: null,
		loanInfo: null,
		qualified: 0,
		firstEnterApp: true,
		fillStatus:{
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
		checkStatus(){
		  publicFun.default.get('userInfo/authInfo',this,()=>{
		  	console.log('bus authInfo',this.response.body)
		  	this.fillStatus=this.response.body.data
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

	},
	computed: {
		relativeUrlTest() {
			if (/test/.test(this.$http.options.root)) {
				return '/test'
			} else {
				return ''
			}
		},
		imgPath(){
		  return this.___imgPath
		},
	}
})

export default bus