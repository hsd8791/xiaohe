import Vue from 'vue'
import router from './../src/router/index.js'
import publicFun from './js/public.js'
var bus = new Vue({
  data: {
    detailTaskId: null,
    loading: false,
    // phoneLender:13777722216,
    phoneLender: '13868562997',
    // uniqueIdLender: '2qamam',
    account: '请登录',
    uniqueId: '',
    test: 'tstMSG',
    response: null,
    loanInfo: null,
    qualified: 0,
    isNewer: false,
    checkedIsNewer: false,
    sessionChecked: false,
    firstEnterApp: true,
    pendingAutoGoApplyPage: false,
    fillStatus: [{
      status: 0,
      optional: false,
      // url: '/index/apply_borrow/identity',
      label: '基础信息',
      getUrl: 'userInfo/baseInfo',
    }, {
      status: 0,
      optional: false,
      // url: '/index/apply_borrow/zhima',
      label: '芝麻认证',
      getUrl: 'credit/zhimaAuthStatus',
      checkMethod: function(data) {
        // console.warn('zhima data', data)
        if (data.time < publicFun.zhimaAcChangeTime) {
          this.status = 0
          return
        }
        if (data.status) {
          this.status = 0
          if (data.status == 'success') {
            this.status = 1
          }
        }
      }
    }, ],
    remind: {
      isShow: false,
      remindMsg: 'remind',
      self_: undefined,
      remindMsgDscrp:null,
      remindOpts: [
        { msg: '确定', },
      ],
    },
  },
  created: function() {
    this.$on('auto_go_apply', () => {
      console.log('auto_go_apply')
      // this.autoGoApplyAfterCheckedNewer() 
      setTimeout(() => {
        if (this.checkedIsNewer) {
          this.autoGoApplyPage()
        } else {
          this.pendingAutoGoApplyPage = true
        }
      }, 50);

    })
    // this.getLenderInfo()
    this.$on('account_change', (ac, id, q) => {
      // console.log('bus get account change', ac, id)
      this.uniqueId = id
      this.account = ac
      this.qualified = q
    })
  },
  methods: {
    hideRemind() {
      this.remind = {
        isShow: false,
        remindMsg: 'remind',
        self_: undefined,
        remindOpts: [
          { msg: '确定', },
        ],
      }
    },
    autoGoApplyAfterCheckedNewer() {
      if (this.checkedIsNewer) {
        this.autoGoApplyPage()
      } else {
        this.pendingAutoGoApplyPage = true
      }
    },
    autoGoApplyPage() {
      console.log('bus.isNewer', bus.isNewer)
      console.log('bus.isNewer', bus.checkedIsNewer)
      if (bus.isNewer) {
        console.log('%c auto go apply', 'color:red', )
        if (bus.essentialInfoFilled) {
          let currentPath = router.history.current.path
          publicFun.goPage(currentPath + '/apply_borrow')
          return true
        }
      }
    },
    checkAllFilled() {
      let hideLoading = true
      let statuses = this.fillStatus,
        length = statuses.length
      for (let i = 0; i < length; i++) {
        if (statuses[i].status == 1) {
          continue
        }
        publicFun.singleGetPro(statuses[i].getUrl, {}, { hideLoading })
          .then((result) => {
            this.checkStatus(result, i)
          })
      }
    },
    checkStatus(result, index) {
      console.log('%c result,index', 'color:red', result, index)
      let status = this.fillStatus[index]
      let checkMethod = this.fillStatus[index].checkMethod
      if (checkMethod) {
        checkMethod.call(status, result)
      } else {
        if (publicFun.notNullObj(result)) {
          status.status = 1
        }
      }
      // console.log('%c status','color:red',this.fillStatus)
    },
    setStatusFilled(url) {
      let index
      this.fillStatus.find((item, i) => {
        if (item.getUrl === url) {
          index = i
          return true
        }
      })
      console.log('fill status index', index)
      if (index) {
        this.fillStatus[index].status = 1
      }
    },
    // getLenderInfo() {
    // publicFun.get(this.urlLendInfo, this, () => {
    //  console.log('res loan info', this.response)
    //  this.loanInfo = this.response.body.data
    //  console.log('bus', this)
    // })
    // this.$http.get(this.urlLendInfo).then(res => {

    // }, err => {})
    // },
  },
  watch: {
    checkedIsNewer(v) {
      if (v) {
        // this.$emit('auto_go_apply')
        if (this.pendingAutoGoApplyPage) {
          console.log('-----')
          this.autoGoApplyPage()
        }
      }
    },
    account(v) {
      console.log('account', v)
      if (v !== "请登录") {
        console.log('publicFun', publicFun)
        this.checkAllFilled()
        // this.
      }
    },
    essentialInfoFilled(v) {
      console.log('v', v)
    },
  },
  computed: {
    essentialInfoFilled() {
      let allFilled = true
      this.fillStatus.find(item => {
        if (item.status === 0) {
          allFilled = false
          return true
        }
      })
      return allFilled
    },
    relativeUrlTest() {
      if (/test/.test(this.$http.options.root)) {
        return '/test'
      } else {
        return ''
      }
    },
  }
})

export default bus
