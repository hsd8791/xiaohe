<template>
  <div id='identityVue' class="input title-fixed" v-loading='loading' element-loading-text='请稍后' v-inner-scroll style="padding-bottom: 0.15rem">
    <h1 class='title'>
      <app-back></app-back>身份验证
      <span class="edit-input" v-if='!editing' @click='edit'>编辑</span>
    </h1>
    <h2 class="sub-title">基本信息</h2>
    <div class="container">
      <div class="wraper">
        <label>姓名：</label>
        <!-- :class="{'valid':idCardNumValid,'error':!idCardNumValid}" -->
        <el-input :disabled='!editing' placeholder='请输入真实姓名' v-model='baseInfo.name' @blur.once='blured' :class='{"valid-border":nameValid,"error-border":!nameValid}'></el-input>
        <i :class="{'el-icon-check':nameValid,'el-icon-close':!nameValid}"></i>
      </div>
      <div class="wraper">
        <label>身份证号：</label>
        <el-input :disabled='!editing' placeholder='身份证' v-model='baseInfo.idCardNum' @blur.once='blured' :class='{"valid-border":idCardNumValid,"error-border":!idCardNumValid}'></el-input>
        <i :class="{'el-icon-check':idCardNumValid,'el-icon-close':!idCardNumValid}"></i>
      </div>
      <!-- <div class="wraper">
        <label>身份证地址：</label>
        <el-input :disabled='!editing' placeholder='身份证地址 选填' v-model='baseInfo.idcardAdr'@blur.once='blured'  :class='{"valid-border":idcardAdrValid,"error-border":!idcardAdrValid}'></el-input>
        <i :class="{'el-icon-check':idcardAdrValid,'el-icon-close':!idcardAdrValid}"></i>
      </div> -->
      <div class="wraper">
        <label>银行卡号：</label>
        <el-input :disabled='!editing' placeholder='银行卡/信用卡' v-model='baseInfo.bankCard' @blur.once='blured' :class='{"valid-border":bankCardValid,"error-border":!bankCardValid}'></el-input>
        <i :class="{'el-icon-check':bankCardValid,'el-icon-close':!bankCardValid}"></i>
      </div>
      <div class="wraper">
        <label>邮箱：</label>
        <el-input :disabled='!editing' placeholder='邮箱' v-model='baseInfo.email' @blur.once='blured' :class='{"valid-border":emailValid,"error-border":!emailValid}' type='email'></el-input>
        <i :class="{'el-icon-check':emailValid,'el-icon-close':!emailValid}"></i>
      </div>
      <div class="wraper">
        <label>备用手机：</label>
        <el-input :disabled='!editing' placeholder='备用手机号 选填' v-model='baseInfo.cellphone' @blur.once='blured' :class='{"valid-border":cellphoneValid,"error-border":!cellphoneValid}' type='tel'></el-input>
        <i :class="{'el-icon-check':cellphoneValid,'el-icon-close':!cellphoneValid}"></i>
      </div>
    </div>
    <h2 class="sub-title">负债调查</h2>
    <app-debt  v-model="baseInfo" ref="input_debt"></app-debt>
    <h2 class="sub-title">个人联系方式</h2>
    <app-contacts v-model="baseInfo" ref="input_contacts"></app-contacts>
    <h2 class="sub-title">紧急联系人</h2>
    <app-relatives v-model="baseInfo" ref="input_relatives"></app-relatives>
    <el-button type='success' :disabled='!(allValid&&ageValid)' class='submit' v-if='editing' @click='submit'>提交</el-button>
    <!-- <el-button type='warning'  class='submit' v-if='!editing' @click='edit'>修改</el-button> -->
    <remind :remind='remind'></remind>
  </div>
</template>
<script>
// import '../css/input.css'
class EmptyBaseInfo {
  constructor() {
    this.acQq = null
    this.acWechat = null
    this.bankCard = null
    this.email = null
    this.idcardAdr = null
    this.idcardNum = null
    this.jiedaibaoLiabilities = null
    this.jinjiedaoLiabilities = null
    this.name = null
    this.nickQq = null
    this.nickWechat = null
    this.otherLiabilities = null
    this.phone = null
    this.relatives = null
    this.wuyouLiabilities = null
    this.zmxyScore = null
    this.zmxyScore2 = null
    // this.data=this._data
  }
  get idCardNum() {
    return this.idcardNum
  }
  set idCardNum(v) {
    this.idcardNum = v
  }
  get cellphone(){
    return this.phone
  }
  set cellphone(v){
    this.phone = v
  }
  get acQQ(){
    return this.acQq
  }
  set acQQ(value){
    this.acQq=value
  }
  // get data(){
  //   // return JSON.stringify(this.relatives)
  // }
// acWechat
}
import uploadId from './info_upload.vue'

import remind from './tmpts/remind.vue'
import publicFun from '../js/public.js'
import bus from '../bus.js'
import debt from './views/info_container/debt.vue'
// import contacts from './views/info_contacts.vue'
import contacts from './views/info_container/contacts.vue'
import relatives from './views/info_container/relatives.vue'
// import relatives from './views/info_relatives.vue'
export default {
  data() {
    return {
      baseInfo: new EmptyBaseInfo(),
      urlBaseInfo: 'userInfo/baseInfo',
      editing: false, //edit or review
      loading: false,
      response: null,
      url: 'userInfo/identity',
      name: '',
      idCardNum: '',
      idcardAdr: '',
      cellphone: '',
      bankCard: '',
      email: '',
      backAfterPost: true,
      remind: {
        isShow: false,
        remindMsg: 'remind',
        self_: this,
        remindOpts: [
          { msg: '确定', },
        ],
      },
      // isIDCard1:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
      // isIDCard2:/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    }
  },
  methods: {
    getBaseInfo() {
      // publicFun.get(this.urlBaseInfo,this,(res) => {

      // })
      publicFun.singleGetPro(this.urlBaseInfo).then(data => {
        bus.loading = false
        console.log('base info data', data)
        this.baseInfo = Object.assign(this.baseInfo, data)
        this.$refs.input_relatives.initialValidate()
      })
    },
    postBaseInfo() {

    },
    submit(){
      // this.loading=true
      // console.log('this.baseInfo',this.baseInfo.relatives)
      this.baseInfo.data=JSON.stringify(this.baseInfo.relatives)
      let body=this.baseInfo
      publicFun.post(this.urlBaseInfo,body,this,(res)=>{
        console.log('%c submit base info result','color:red',res)
      })
      // publicFun.singlePostPro(this.urlBaseInfo,this.baseInfo)
      // .then(result=>{
      //   console.log('%c result','color:red',result)
      //   this.loading=false
      //   bus.loading=false
      //   this.editing=false

      // })
    },
    _submit() {
      var postProIdentity = this.postIdentityPromise()
      var postProDebt
      var postProContacts
      var postProRelatives
      var postArr = [postProDebt, postProIdentity, postProRelatives, postProContacts]
      setTimeout(() => {
        postProDebt = this.$refs.input_debt.submit()
      }, 200);
      setTimeout(() => {
        postProContacts = this.$refs.input_contacts.submit()
      }, 400);
      setTimeout(() => {
        postProRelatives = this.$refs.input_relatives.submit()
        var prosHandler = publicFun.handlePostPros(postArr)
        prosHandler.then(values => {
          publicFun.onPostIdentificationSucc()
          console.log('prosHandler then', values)
        })
      }, 600);
    },
    postIdentityPromise() {
      var postBody = {}
      postBody.idcardNum = this.idCardNum
      postBody.bankCard = this.bankCard
      postBody.phone = this.cellphone
      postBody.name = this.name
      postBody.idcardAdr = this.idcardAdr
      postBody.email = this.email
      return publicFun.singlePostPro(this.url, postBody)
    },
    get() {
      let promiseDebt = this.$refs.input_debt.get()
      let promiseIdentity = this.getIdentity()
      let promiseContacts = this.$refs.input_contacts.get()
      let promiseRelatives = this.$refs.input_relatives.get()
      let promises = [promiseDebt, promiseIdentity, promiseContacts, promiseRelatives]
      publicFun.handleGetPros(promises)
        .then(res => {
          console.log('res', res)
          publicFun.onGetIdentificationSucc(res, this)
        })
    },
    getIdentity() {
      let promise = publicFun.singleGetPro(this.url)
      promise.then(res => {
        console.log('%c res', 'color:red', res)
        if (!res) {
          return
        }
        Object.assign(this, res, {
          idCardNum: res.idcardNum,
          cellphone: res.phone
        })
      })
      return promise
    },
    edit() {
      this.editing = true
    },
    blured($event) {
      var el = $event.target.parentElement.parentElement
      el.className += ' validate'
    },
    setFormData(dataKey) {
      if (this[dataKey + 'Valid']) {
        this.formData[dataKey] = this[dataKey]
      } else {
        this.formData[dataKey] = null
      }
    },
  },
  watch: {
  },
  computed: {
    ageValid: function() {
      let baseInfo = this.baseInfo
      if (!this.idCardNumValid) {
        return false
      }
      const minAge = 20
      const maxAge = 39 // 40-1
      var ID = baseInfo.idCardNum
      var bornY = ID.slice(6, 10) * 1,
        bornM = ID.slice(10, 12) * 1,
        bornD = ID.slice(12, 14) * 1
      var today = new Date()
      var todayY = today.getFullYear(),
        todayM = today.getMonth() + 1,
        todayD = today.getDate()
      if ((bornY + minAge) < todayY && (bornY + maxAge) > todayY) {
        return true
      } else {
        if (bornY + minAge === todayY) {
          if (bornM < todayM) {
            return true
          } else if (bornM === todayM) {
            if (bornD <= todayD) {
              return true
            }
          }
        }
        if (bornY + maxAge === todayY) {
          if (bornM > todayM) {
            return true
          } else if (bornM === todayM) {
            if (bornD > todayD) {
              return true
            }
          }
        }
      }
      return false
    },
    idCardNumValid: function() {
      var reg = publicFun.reg.idCardNum
      let baseInfo=this.baseInfo
      return reg.test(baseInfo.idCardNum)
    },
    nameValid: function() {
      var reg = /^[\u4e00-\u9fa5]+$/;
      let baseInfo=this.baseInfo
      return reg.test(baseInfo.name)
    },
    idcardAdrValid: function() {
      var reg = /.{0,}/;
      let baseInfo=this.baseInfo
      return reg.test(baseInfo.idcardAdr)
    },
    cellphoneValid: function() {
      let baseInfo=this.baseInfo
      var reg = publicFun.reg.cellphone,
        flag = (baseInfo.cellphone == '')
      return reg.test(baseInfo.cellphone) || flag
    },
    bankCardValid: function() {
      var reg = /^\d{12,19}$/;
      let baseInfo=this.baseInfo
      return reg.test(baseInfo.bankCard)
    },
    emailValid: function() {
      var reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/;
      let baseInfo=this.baseInfo
      return reg.test(baseInfo.email)
    },
    allValid: function() {
      let refs = this.$refs
      return this.idCardNumValid && this.nameValid &&
        refs.input_debt.allValid &&
        refs.input_contacts.allValid &&
        refs.input_relatives.allValid
    },
  },
  mounted: function() {
    // this.get()
    this.getBaseInfo()
  },
  events: {},
  components: {
    remind: remind,
    'app-upload': uploadId,
    'app-debt': debt,
    'app-contacts': contacts,
    'app-relatives': relatives,
  }
}

</script>
<style lang='scss' scoped>
/*  $iconSize:0.2rem;
  $validColor:#52f352;
  $errColor:#f53333;

  *{
  
  }*/

</style>
