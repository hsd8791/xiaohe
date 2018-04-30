<template>
  <div id="debtVue" class="input" v-loading='loading' element-loading-text='请稍后'>
    <!-- <h1 class="title">
      <app-back></app-back>负债调查
      <span class="edit-input" v-if='!editing' @click='edit'>编辑</span>
    </h1> -->
    <div class="container">
      <div class="wraper">
        <label class="label" :disabled='!editing'>借贷宝负债：</label>
        <el-input :disabled='!editing' type='number' placeholder='借贷金额，无负债填0' v-model='baseInfo.jiedaibaoLiabilities' @blur.once='blured' :class='{"valid-border":jiedaibaoLiabilitiesValid,"error-border":!jiedaibaoLiabilitiesValid}'></el-input>
        <i :class="{'el-icon-check':jiedaibaoLiabilitiesValid,'el-icon-close':!jiedaibaoLiabilitiesValid}"></i>
      </div>
      <div class="wraper">
        <label class="label">今借到负债：</label>
        <el-input :disabled='!editing' type='number' placeholder='借贷金额，无负债填0' v-model='baseInfo.jinjiedaoLiabilities' @blur.once='blured' :class='{"valid-border":jinjiedaoLiabilitiesValid,"error-border":!jinjiedaoLiabilitiesValid}'></el-input>
        <i :class="{'el-icon-check':jinjiedaoLiabilitiesValid,'el-icon-close':!jinjiedaoLiabilitiesValid}"></i>
      </div>
      <div class="wraper">
        <label class="label">其他网贷负债：</label>
        <el-input :disabled='!editing' type='number' placeholder='借贷金额，无负债填0' v-model='baseInfo.otherLiabilities' @blur.once='blured' :class='{"valid-border":otherLiabilitiesValid,"error-border":!otherLiabilitiesValid}'></el-input>
        <i :class="{'el-icon-check':otherLiabilitiesValid,'el-icon-close':!otherLiabilitiesValid}"></i>
      </div>
      <div class="wraper">
        <label class="label">花呗额度：</label>
        <el-input :disabled='!editing' type='number' placeholder='填写花呗额度' v-model='baseInfo.zmxyScore' @blur.once='blured' :class='{"valid-border":zmxyScoreValid,"error-border":!zmxyScoreValid}'></el-input>
        <i :class="{'el-icon-check':zmxyScoreValid,'el-icon-close':!zmxyScoreValid}"></i>
      </div>
      <div class="wraper">
        <label class="label">芝麻信用分：</label>
        <el-input :disabled='!editing' type='number' placeholder='填写芝麻信用分' v-model='baseInfo.zmxyScore2' @blur.once='blured' :class='{"valid-border":zmxyScore2Valid,"error-border":!zmxyScore2Valid}'></el-input>
        <i :class="{'el-icon-check':zmxyScore2Valid,'el-icon-close':!zmxyScore2Valid}"></i>
      </div>
    </div>
    <transition>
      <!-- <el-button type='success' :disabled='!(allValid&&creditValid)' class='submit' v-if='editing' @click='submit'>提交2</el-button> -->
      <!-- <el-button type='warning'  class='submit' v-if='!editing' @click='edit'>修改</el-button> -->
    </transition>
  </div>
</template>
<script>
// import '../css/input.css'
import publicFun from '../../../js/public.js'
// import remind from '../../components/tmpts/remind.vue'
export default {
  // isfilled  暴露出去
  // edit 暴露出去
  // submit 暴露出去 submit succ
  // 暴露一个方法控制edit?
  // 
  // 
  // props...
  // editing
  // data
  // data vilidation
  // 
  // 进入 
  //    multiGet 
  //    ----每一个get 添加相同的callBack，errCallback,get 方法中进行数据判断（数据判断方法分离）
  //        
  //      loading使用全局 loading
  //      !allFilled 
  //      if any err,remind,use glabal remind
  //    
  //    有空则edit=true
  // 编辑
  // 提交
  data() {
    return {
      refreshFill: false,
      response: null,
      // loading:true,
      loading: false,
      // editing:false,
      // jiedaibaoLiabilities:'',
      jinjiedaoLiabilities: '',
      otherLiabilities: '',
      zmxyScore: '',
      zmxyScore2: '',
      data: null,
      url: 'userInfo/liabilities',
      getPromise: null,
      formData: {},
      backAfterPost: true,
      remind: {
        isShow: false,
        remindMsg: 'remind',
        self_: this,
        remindOpts: [
          { msg: '确定', },
        ],
      },
    }
  },
  props: {
    value:{
      required:true,
    },
    // editing:{
      
    // },
    // jiedaibaoLiabilities: {
    //   required: true,
    // },
    // editing:{
    //   default:true,
    // },
  },
  methods: {
    submit() {
      // if(this.refreshFill){
      //  this.$http.post(url,{}).then(res=>{

      //  },err=>{})
      // }
      var postBody = {}
      postBody.jiedaibaoLiabilities = this.jiedaibaoLiabilities
      postBody.jinjiedaoLiabilities = this.jinjiedaoLiabilities
      postBody.otherLiabilities = this.otherLiabilities
      postBody.zmxyScore = this.zmxyScore
      postBody.zmxyScore2 = this.zmxyScore2
      console.log('postBody', postBody)
      let postPro = publicFun.singlePostPro(this.url, postBody)
      return postPro
    },
    get() {
      let getPro = publicFun.singleGetPro(this.url)
      getPro.then(res => {
        Object.assign(this, res)
      })
      return getPro
    },
    // edit(){
    //  this.editing=true
    // },
    blured($event) {
      var el = $event.target.parentElement.parentElement
      el.className += ' validate'
    },
  },
  watch: {

  },
  computed: {
    baseInfo(){
      return this.value
    }, 
    isFilled() {
      return publicFun.checkNullObj(this.data)
    },
    editing() {
      // console.log('this info devt views',this.$parent)
      return this.$parent.editing
    },
    creditValid: function() {
      let baseInfo=this.baseInfo
      // if(this.zmxyScore2<600){
      //  return false
      // }
      if (localStorage.qudao == 'jEJree') {
        return true
      }
      if (localStorage.qudao == 'qYfm6r') {
        if (baseInfo.zmxyScore2 < 580 || baseInfo.zmxyScore < 500) {
          return false
        }
      }
      if (baseInfo.zmxyScore2 < 550) {
        return false
      }
      return true
    },
    jiedaibaoLiabilitiesValid: function() {
      return true
      let baseInfo=this.value
      var reg = /\d/;
      return reg.test(baseInfo.jiedaibaoLiabilities)
    },
    jinjiedaoLiabilitiesValid: function() {
      let baseInfo=this.value
      var reg = /\d/;
      return reg.test(baseInfo.jinjiedaoLiabilities)
    },
    otherLiabilitiesValid: function() {
      let baseInfo=this.value
      var reg = /\d/;
      return reg.test(baseInfo.otherLiabilities)
    },
    zmxyScoreValid: function() {
      let baseInfo=this.value
      var reg = /\d/;
      return reg.test(baseInfo.zmxyScore)
    },
    zmxyScore2Valid: function() {
      let baseInfo=this.value
      var reg = /\d/;
      return reg.test(baseInfo.zmxyScore2)
    },
    allValid: function() {
      var t = this
      return t.jiedaibaoLiabilitiesValid && t.jinjiedaoLiabilitiesValid && t.otherLiabilitiesValid && t.zmxyScoreValid && t.zmxyScore2Valid && t.creditValid && true //&&

    },
  },
  created() {
    // var query=this.$route.query
    // console.log('query debt',this.$route)
    // if(query.action){
    //  this.refreshFill=true
    //  this.backAfterPost=false
    //  this.editing=true
    // }else{
    // // this.get()
    // }
  },
  events: {},
  components: {
    // remind:remind,
  }
}

</script>
<style lang='scss' scoped>


</style>
<style lang='scss'>
#debtVue {
  .container {
    .label {
      font-size: 0.14rem;
      width: 27%;
    }
  }
}

</style>
