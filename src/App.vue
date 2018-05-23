<template>
  <div id="app" v-loading='loading' element-loading-text='请稍后' @touchmove.stop=''>
    <div v-loading='globalLoading' element-loading-text='请稍后'></div>
    <div class="router-view-container" :class="{'show-foot':footNavShow}">
      <keep-alive>
      <!-- <transition :name='enter'> -->
      <router-view v-if="$route.meta.keepAlive"></router-view>
      <!-- </transition> -->
    </keep-alive>
    <!-- <transition :name='enter'> -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </transition> -->

  </div>
  <!-- <transition :name='enter'> -->
  <contact></contact>
  <foot-nav v-if='footNavShow'></foot-nav>
  <!-- </transition> -->
  <remind :remind='remind'></remind >
  <button v-if='isTest' style="position:absolute;left:10px;bottom:100px" @click='test'>test</button>
  </div>
</template>

<script>
  import router from './router'
  import footNav from './foot.vue'
  import contact from './contacts.vue'
  import publicFun from './js/public.js'
  import bus from './bus.js'
  import remind from './components/tmpts/remind.vue'
  import './css/icons.css'
  import './css/input.scss'
  export default {
    name:'App',
    // cmpt:/borrow/,
    data:function() {
      return {
        enter:'',
        urlLendInfo:'accounting/myLendInfo?lendingUid=1',
        urlApply:'lendApply/borrowLoanRecords?limit=1&lendingUid=1',
        urlSales:'qudao/pv?qudao=',
        loading:false,
        vueName:'App',
        footNavShow:true,
        // account:'请登录',
        response:null,
        editing:true,
        backAfterPost:true,
        // remind:{
        //   isShow:false,
        //   remindMsg:'remind',
        //   self_:this,
        //   remindOpts:[
        //   {msg:'确定',},
        //   ],
        // },
      }
    },
    methods: {
      goAuthingPage(){
        let path=localStorage.getItem('pathWhenAuth')
        if(!path){
          return
        }else{
          localStorage.removeItem('pathWhenAuth')
          publicFun.goPage(path)
        }
      },
      fromSales(w) {
        sessionStorage.setItem('salesWay', w)
        // console.log('sales URL', this.urlSales + w)
        publicFun.get(this.urlSales + w, this, () => {

        })
      },

      checkSession() {
        console.log('checkSession')
        this.loading = true
        this.$http.get('account/checkSession').then(res => {
          var data = res.body.data
          console.log('session data', data)
          if (data) {
            // bus.account=data.phone
            // bus.uniqueId=data.uniqueId
            bus.$emit('account_change', localStorage.userID, localStorage.uniqueId, localStorage.qualified)
            if (data.isSetPwd == 0) {
              // console.log('no set pwd')
              var r = this.remind
              r.remindOpts = [{
                msg: '确定',
                callback: () => {
                  publicFun.goPage('/pwd')
                }
              }]
              r.remindMsg = '请设置密码'
              r.isShow = true
            }
            publicFun.wechatAuth(this)
          } else {
            // publicFun.goPage('/login')
          }
          this.loading = false
        }, err => {

        }).finally(() => {
          bus.sessionChecked=true 
        })
      },
      checkNewer(){
        console.log('%c checkNewer','color:red',)
        publicFun.get(this.urlLendInfo,this,()=>{

          if(this.response.body.data){
            bus.isNewer=false
            // this.notNewerRedirect()
          }else{
            publicFun.get(this.urlApply,this,()=>{
              console.log('---',this.response.body.data)
              if(this.response.body.data.data.length){
                bus.isNewer=false
                // this.notNewerRedirect()
              }else{
                bus.isNewer=true
              }
            })
          }
        })
        
      },
      test(){
        console.log('bus',bus)
        // let a=publicFun.singleGetPro('accounting1/myLendInfo',{lendingUid:1})
        // let b=publicFun.singleGetPro('userInfo/work',)
        // let c=publicFun.singleGetPro('userInfo/liabilities',)
        // console.log('Promise.all',Promise.all)
        // let test=publicFun.handleGetPros([a,b,c])
        // a.then((res)=>{
        //   console.log('res from promise',res)
        // },rej=>{
        //   publicFun.errorHandle(rej,bus)
        //   console.log('rej from promise',rej)
        // })
      },
    },
    created:function(){
      var way=this.$route.query.qudao
      // console.log('way',this.$route)
      if(way){
       this.fromSales(way)
       localStorage.qudao=way

      }else{
        // localStorage.removeItem('qudao')
      }
      bus.$on('foot_show_change',(footShow)=>{
        this.footNavShow=footShow
      })
      bus.$on('url_change',(action)=>{
        this.enter=action
      })
      this.checkSession()
      this.footNavShow=true
      // console.log('%c created','color:red',)
      this.goAuthingPage()
    },
    computed:{
      globalLoading(){
        return bus.loading
      },
      remind(){
        return bus.remind
      },
      isTest(){
        return /test/.test(location.href)
      },
      isLoged(){
        // if(bus.account!=='请登录'){
        //   this.$nextTick(()=>{

        //   })
        // }
        return bus.account!=='请登录'
      },
      // checkNewerWatch(){
      //   if(this.isLoged){
      //     this.checkNewer()
      //   }
      //   return this.isLoged
      // },
    },
    watch:{
      isLoged(v){
        if(v){
          this.checkNewer()
        }
      },
    },  
    components: {
      'foot-nav':footNav,
      contact:contact,
    }
  }
</script>

<style lang="scss" scoped>
  body{
    /*position: relative;*/
    
  }
  .router-view-container{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: scroll;
    overflow-x: hidden;
  }
  .show-foot{
    margin-bottom: 0.5rem;

  }


</style>
<style type="text/css" lang='scss' >
  /*$navColor:#8f8e94;*/
  $navColor:#8f8e94;
  $navHeight:0.5rem;
  /*$activeColor:#cd331c;*/
  $activeColor:#d42e84;
  /*$navBackground:#eee;*/
  $navBackground:#fcf9fe;
  /*$itemNameColor:#8f8e94;*/
  /*#323233;*/
  /*$itemIconColor:#8f8e94;*/

  .foot-nav{
    /*border-top:0.5px solid $navColor ;*/
    width: 100%;
    background: $navBackground;
    position: absolute;
    height: $navHeight;
    bottom: 0;
    display: flex;
    border: 0px solid #efeff4;
    border-top-width: 1px;
    .nav-btn{
      -webkit-tap-highlight-color: transparent;
      width: 50%;
      flex-grow:1;
      height: 100%;
      text-decoration: none;
      display: inline-block;
      position: relative;
      font-size: 0.16rem;
      vertical-align: center;
      line-height: $navHeight;
      color: $navColor;
      /*position: relative;*/
      *{
        /*border:1px solid red;*/
      }
      .nav-icon{
        width: 30%;
        /*height: 50%;*/
        /*position: relative;*/
        /*top: 0;*/
        /*right: 0;left: 0;*/
        margin: 0.03rem auto 0;
        font-size: 0.2rem;
        line-height: 1.5;
      }
      .nav-item{
        /*width: 100%;*/
        /*margin: 0 auto;*/
        /*height: 50%;*/
        font-size: 0.12rem;
        line-height: 1.2;
      }
    }
    .active{
      /*background: #eee;*/
      color:$activeColor;
    }
  }
  
  /*.back-enter-active{
    transition: transform .5s
  }
  .back-enter,   {
    transform: translateX(100%)
  }
  .back-leave-to{
    transform: translateX(-100%);
  }*/
    #app {
    position: absolute;
    top: 0;bottom: 0;
    width: 100%;
    overflow: hidden;
    left: 0;right: 0;
    /*height: 100%;*/ 
    /*height: 100%;*/
    /*z-index: 2;*/
    /*padding-bottom: 0.5rem;*/
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding-bottom: 0.65rem;
    /*background: #fcf9fe;*/
    background: #f4f4f4;
    z-index: 9;
    /*margin-top: 0.6rem;*/
  }
</style>