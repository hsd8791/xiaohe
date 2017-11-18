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
  // import './css/icons.css'
  import './css/input.scss'
  import './css/app-cmpt.scss'
  // import './css/input.css'
  // import './css/xh.scss'

  // import './css/icons.css'
  import '../static/icons.css'

  // import './libs/font-awesome.min.css'
  export default {
    name:'App',
    // cmpt:/borrow/,
    data:function() {
      return {
        enter:'',
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
    fromSales(w) {
      sessionStorage.setItem('salesWay', w)
      console.log('sales URL', this.urlSales + w)
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

      })

    },
        // <<<<<<< HEAD
    checkNewer(){
      publicFun.get(this.urlLendInfo,this,()=>{
        console.log('this',this.response)
        if(this.response.body.data){
          bus.isNewer=false
          this.noNewerRedirect()

        }else{
          publicFun.get(this.urlApply,this,()=>{
            console.warn('this urlApply',this.response)
            if(this.response.body.data.data.length){
              bus.isNewer=false
              this.noNewerRedirect()
            }else{
              bus.isNewer=true
            }
          })
        }
      })
      
    },
    addCssLink(){
      function add(path){
       let body=document.querySelector('body')
       let link=document.createElement('link')
       link.type = 'text/css';
       link.rel = 'stylesheet';
       link.href= path
       body.appendChild(link);
      }
      // add('../'+this.___subName+'.css')
      // add('../static/test.css')
      // link.href = '../'+this.___subName+'_icon.css';
      // var head = document.getElementsByTagName('head')[0];
    },
    test(){
      console.log('bus',bus)
      // let a=publicFun.singleGetPro('accounting/myLendInfo',{lendingUid:1})
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
    this.addCssLink()
    // bus.checkStatus()
        // =======


      
            // },
          // created:function(){
        // >>>>>>> master

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
  },
  watch:{
      // account:function(val){
      //   // console.log('account change',val)
      //   Bus.$emit('account change',val)
      // }
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



</style>
<style type="text/css" lang='scss' >
  /*$navColor:#8f8e94;*/

  
  /*.back-enter-active{
    transition: transform .5s
  }
  .back-enter,   {
    transform: translateX(100%)
  }
  .back-leave-to{
    transform: translateX(-100%);
  }*/
</style>