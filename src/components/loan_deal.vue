<template>
	<div id="loanDealVue">
		<div class="input">
			<h1 class="title">
				<app-back></app-back>
				{{action|actionParser}}
			</h1>
<!-- 			<div>
				续期费:￥{{reBorrowFee | moneyParser}}
				逾期费:￥{{overdueFee | moneyParser}}
				重借利息:￥{{reBorrowFee____ | moneyParser}}
			</div> -->

      <div class="container phone-lender" >

        <div class="wraper" v-if="action=='renewal'">
          <label class="amout-label">续期费用：</label>
          <div class="amount">{{reBorrowFee | moneyParser}}</div>
        </div>
        <!-- <div class="wraper" v-if="action=='special'||action=='renewal'"> -->

        <div class="wraper" v-if="action=='reborrow'">
          <label class="amout-label">重借金额：</label>
          <div class="amount">{{moneyFee | moneyParser}}</div>
        </div>
<!--         <div class="wraper" v-if="true">
          <label class="amout-label">逾期费用：</label>
          <div class="amount">{{overdueFee | moneyParser}}</div>
        </div> -->
        <div class="wraper" v-if="action==='repay'">
          <label class="amout-label">还款费用：</label>
          <div class="amount">{{repaymentFee | moneyParser}}</div>
        </div>
      </div>
      <div class="container">
        <div class="wraper"  v-if="action!=='special'&&action!=='reborrow'">
          <label class="amout-label">总和：</label>
          <div class="amount">{{ttlFee | moneyParser}}</div>
        </div>
        <div class="wraper" v-if="action=='special'">
          <label class="amout-label">支付:</label>
          <el-input class='custom-pay' id='specialInput' v-model='specialAmount'  placeholder="0.00" type='number' @blur.once='blured'  :class='{"valid-border":specialAmountValid,"error-border":!specialAmountValid}'></el-input>
          <!-- <i :class="{'el-icon-check':otherLiabilitiesValid,'el-icon-close':!otherLiabilitiesValid}"></i> -->
        </div>
      </div>
      <div class="amount-emphasis" >￥{{amount | amountParser}}</div>
      <el-button type='success' @click='submit' :disabled='amount==0||(action=="special"&&!specialAmountValid)'  >{{submitText}}</el-button>

    </div>
    <p class="description" v-if='action=="special"'>
      说明：【特殊】用于补交费用或其他方式还款，金额可以自定义输入,至少10元。
    </p>
    <remind :remind='remind'></remind>
  </div>
</template>

<script>
import publicFun from '../js/public.js'
// import Vue from 'Vue'
export default {
  data() {
      return {
        submitText: '支付',
        title: '',
        response: null,
        loading: true,
        editing: true,
        platform: '',
        backAfterPost: false, // watch out
        myLendInfo: {},
        urlLendInfo: 'accounting/myLendInfo?lendingUid=1',
        urlOrder: 'order/createXiaoheOrder',
        urlLendApply: 'lendApply/lendApply',
        overdueFee: null,
        moneyFee: null,
        reBorrowFee: null,
        repaymentFee: null,
        action: null,
        specialAmount: null,
        billId: null,
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
  filters: {
    moneyParser(v) {
      return Number(v / 100).toFixed(2)
    },
    amountParser(val) {
      // console.log('amount',val)
      if (!val) {
        return (0).toFixed(2)
      }
      // console.log('val',val)
      return Number(val / 100).toFixed(2)
    },
    actionParser(v) {
      var s
      switch (v) {
        case 'special':
          s = '特殊';
          break;
        case 'renewal':
          s = '续期';
          break;
        case 'reborrow':
          s = '重借';
          break;
        case 'repay':
          s = '还款';
          break;
        default:
          s = '未知操作';
          break;
      }
      return s
    }

  },
  created() {
    var q = this.$route.query
      // this.title=q.title
    this.action = q.action
    this.billId = q.billId
      //部分设备直接唤起数字键盘
    var T = setInterval(function() {
        var input = document.querySelector('.el-input__inner')
        if (input) {
          clearInterval(T)
          input.setAttribute('pattern', '[0-9]*')
          console.log('setted pattern')
        }
      }, 50)
      // setTimeout(function() {
      //   var input=document.querySelector('.el-input__inner')
      //   console.log('input',input)
      //   input.setAttribute('pattern','[0-9]*')
      // }, 1000);
    if (this.action === 'reborrow') {
      this.submitText = '提交'
    }
    this.getFee()
  },
  methods: {
    blured($event) {
      var el = $event.target.parentElement.parentElement
      el.className += ' validate'
    },
    getFee() {
      publicFun.get(this.urlLendInfo, this, () => {
        console.log('res lender', this.response)
        var data = this.response.body.data
        console.log('data lending info', data)
        this.myLendInfo = data
        this.overdueFee = data.overdueFee
        this.moneyFee = data.moneyFee
        this.reBorrowFee = data.reBorrowFee
        this.platform = data.lendingWay
        this.repaymentFee = data.repaymentFee
      })
    },
    submit() {
      if (this.action == 'reborrow') {
        this.reborrowSubmit()
        return
      }
      var queryBody = {}
      queryBody.mark = 'none'
      if (this.action == 'special') {
        queryBody.moneyFee = this.specialAmount * 100
      } else {
        queryBody.moneyFee = this.ttlFee
      }
      queryBody.serviceType = this.serviceType
      queryBody.accountingManagementId = this.billId
      var url = publicFun.urlConcat(this.urlOrder, queryBody)
      publicFun.goPage(this.$route.fullPath + '/')
      publicFun.get(url, this, () => {
        var payId = this.response.body.data.payId
        var transactionId = this.response.body.data.transactionId
        var successPath
        if (this.action == 'special') {
          successPath = '/loan_bill'
        } else {
          successPath = publicFun.urlConcat('/loan_bill/loan_deal_remind', {
            action: this.action,
            amount: this.moneyFee,
            platform: this.platform,
          })
        }
        var url = publicFun.urlConcat('/loan_bill/loan_deal/pay', {
          payId: payId,
          transactionId: transactionId,
          action: this.action,
          billId: this.billId,
          path: encodeURIComponent(successPath),
        })
        publicFun.goPage(url)
      })
    },
    reborrowSubmit() {
      let postBody = {}
      postBody.applyType = 1
      postBody.phone = '13777722216'
      postBody.amount = this.moneyFee
      publicFun.post(this.urlLendApply, postBody, this, () => {
        this.remind.remindOpts = [{
          msg: '确定',
          callback: () => {
            publicFun.goPage('/loan_bill')
          }
        }]
      })
    }
  },
  computed: {
    serviceType() {
      var s
      switch (this.action) {
        case 'special':
          s = 0;
          break;
        case 'reborrow':
          s = 1;
          break;
        case 'renewal':
          s = 2;
          break;
        default:
          s = 3;
          break;
      }
      return s
    },
    ttlFee() {
      var m = 0,
        t = this

      switch (t.action) {
        case 'reborrow':
          m = m + t.moneyFee;
          break;
        case 'renewal':
          m += t.reBorrowFee;
          break;
        case 'repayment':
          m += t.overdueFee;
          break;
        case 'special':
          m += t.overdueFee;
          break;
        case 'repay':
          m += t.repaymentFee;
          break;
      }
      return m
    },
    // reBorrowFee____() {
    //   return 0.25 * this.moneyFee
    // },
    amount() {
      if (this.action == 'special') {
        return Number(this.specialAmount * 100).toFixed(0)
      } else {
        return this.ttlFee
      }
    },
    specialAmountValid(){
      let v=this.specialAmount
      if(v>=10){
        return true
      }else{
        return false
      }
    },
  },
  watch: {
    specialAmount(v) {
      console.log('specialAmount', v)
      var n = parseFloat(v)
        // this.specialAmount=n
    }
  },
  events: {},
  components: {}
}
</script>

    <style lang='scss' scoped>
      .amount{
        height: 0.4rem;
        font-size: 0.20rem;
        text-align: right;
        padding-right: 0.15rem;
        line-height: 0.4rem;
        /*font-weight: bold;*/
      }
      #loanDealVue{
        .phone-lender{
          margin-top:0.2rem;
        }
        .amout-label{
          color:#8e8e8e;
        }
      }
      .amount-emphasis{
        font-size: 0.4rem;
      }
      .description{
        font-size: 0.18rem;
        margin:0.2rem;
        text-align:left;
        line-height: 1.6;
      }

    </style>
    <style lang='scss'>
      #loanDealVue{
        .el-input__inner{
          text-align: right;
          padding-right:0.15rem;
          font-size: 0.20rem;
          /*font-weight: bold;*/
        }
      }

    </style>