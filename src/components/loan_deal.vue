<template>
	<div id="loanDealVue">
		<div class="input">
			<h1 class="title">
				<app-back></app-back>
				{{action|actionParser}}
			</h1>
      <div >

        <div class="container phone-lender"  >
          <div class="wraper" v-if="action=='renewal'">
            <label class="amout-label">续期费用：</label>
            <div class="amount">{{reBorrowFee | moneyParser}}</div>
          </div>
          <div class="wraper" v-if="action=='reborrow'">
            <label class="amout-label">重借金额：</label>
            <div class="amount">{{moneyFee | moneyParser}}</div>
          </div>

          <div class="wraper" v-if="action==='repay'">
            <label class="amout-label">还款费用：</label>
            <div class="amount">{{repaymentFee | moneyParser}}</div>
          </div>
          <div class="wraper" v-if="action!=='special'">
            <label class="amout-label">{{action=='repay'?'退还':""}}保证金：</label>
            <div class="amount">{{myLendInfo.securityFee||0 | moneyParser}}</div>
          </div>
        </div>
        <div class="container" >
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

        <p class="description" v-if='action=="special"' >
          说明：【特殊】用于补交费用或其他方式还款，金额可以自定义输入,至少10元。
        </p>
      </div>
      <div class="guide" v-if=0>
        <p>如何{{action|actionParser}}？</p>
      </div>
      <div class="guide" v-if='action=="repay"&&false'>
        <div v-if='lendingWay==="借贷宝"'>
          <p>请在借贷宝APP内点击钱包，点击【借入】在里面找到借条，再点击还款。</p>
        </div>
        <div v-if='lendingWay==="今借到"'>
          <p>请进入今借到微信公众号（或者今借到APP），点击（我的），在点击（待还金额），找到借条还款，再点击还款。</p>
        </div>
        <div v-if='lendingWay==="无忧借条"'>
          <p>请进入无忧借条APP，点击借条中心，点击（我欠谁钱），在点击还款</p>
        </div>
        <p>或者联系指定微信号【柒彩虹：13868562997】，微信或支付宝支付费用还款，借贷宝再进行销账。</p>
      </div>
      <div class="guide" v-if='action=="renewal"&&false'>
        <div v-if='lendingWay==="借贷宝"'>
          <p>向指定微信或支付宝【柒彩虹：13868562997】支付续期费用300元后，我们将在借贷宝里发起展期。请再去借贷宝点击展期确认。</p>
        </div>
        <div v-if='lendingWay==="今借到"'>
          <p>向指定微信或支付宝【柒彩虹：13868562997】支付续期费用300元后，再去今借到发布一笔新借款1000元7天0利率0服务费，会借你一笔新的借款，收到新借款【不要提现】再去还上笔到期的借款，完成续期。</p>
        </div>
        <div v-if='lendingWay==="无忧借条"'>
          <p>向指定微信或支付宝【柒彩虹：13868562997】支付续期费用300元后，再进入无忧借条APP——点击借条中心——点击（我欠谁钱）——找到到期借条申请延期（利息、补偿金填0，延期补偿金填0，还款时间：延迟时长为7天）。</p>
        </div>
        <!-- <p>向指定微信或支付宝【柒彩虹：13868562997】支付续期费用300元后，{{lendingWay}}再放款。</p> -->
      </div>
      <div class="guide" v-if='action=="reborrow"&&false'>
        <div v-if='lendingWay==="借贷宝"'>
          <p>借贷宝点击“我要借钱”，发布1张借条，1000元0利率5天，到期还本付息。请将已添加的借贷宝好友【马焕力】设定为指定发布对象。</p>
        </div>
        <div v-if='lendingWay==="今借到"'>
          <p>请进入今借到微信公众号（或者今借到APP），点击（我的），在点击（待还金额），找到借条还款，再点击还款。</p>
        </div>
        <div v-if='lendingWay==="无忧借条"'>
          <p>请进入无忧借条APP，点击借条中心，点击（我欠谁钱），在点击还款</p>
        </div>
        <p>向指定微信或支付宝【柒彩虹：13868562997】支付续期费用300元后，{{lendingWay}}再放款。</p>
      </div>
      <div class="guide" v-if=0>
        <p>如有疑问请联系指定微信号【柒彩虹：13868562997】</p>
      </div>
    </div>
    <remind :remind='remind'></remind>
  </div>
</template>

<script>
import publicFun from '../js/public.js'
import bus from '../bus.js'
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
        securityFee:null,
        action: null,
        specialAmount: null,
        billId: null,
        lendingWay:null,
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
    this.lendingWay=q.lendingWay
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
    // if (this.action === 'reborrow') {
    //   this.submitText = '提交'
    // }
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
        if(data){
          this.myLendInfo = data
          this.overdueFee = data.overdueFee
          this.moneyFee = data.moneyFee
          this.reBorrowFee = data.reBorrowFee
          this.platform = data.lendingWay
          this.repaymentFee = data.repaymentFee
          // this.securityFee = data.securityFee
        }
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
      postBody.phone = bus.phoneLender
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
    securityRefund(){
      let status=this.myLendInfo.status
      if(status===1){
        return this.myLendInfo.securityFee
      }
      return 0
    },
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
  .guide{
    padding:0 0.15rem;
    margin:0.15rem 0;
    text-align: left;
    p{
      font-size: 0.14rem;
      line-height: 1.6;
    }
  }
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
      font-size: 0.14rem;
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