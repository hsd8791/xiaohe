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
    <remind :remind='remind'></remind>
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
  name: 'App',
  // cmpt:/borrow/,
  data: function() {
    return {
      jdtInterval: null,
      enter: '',
      urlLendInfo: 'accounting/myLendInfo?lendingUid=1',
      urlApply: 'lendApply/borrowLoanRecords?limit=1&lendingUid=1',
      urlSales: 'qudao/pv?qudao=',
      loading: false,
      vueName: 'App',
      footNavShow: true,
      // account:'请登录',
      response: null,
      editing: true,
      backAfterPost: true,
      // remind: {
      //   isShow: false,
      //   remindMsg: '',
      //   self_: this,
      //   remindOpts: [
      //     { msg: '', disabled:true},
      //   ],
      // },
    }
  },
  methods: {
    waitJDT(remainSecond) {
      let r = bus.remind
      r.remindMsg = '请耐心等待申请结果'
      let option = r.remindOpts[0]
      option.disabled = true
      option.msg = `最多等待${remainSecond}s`
      r.isShow = true
      // option = { msg: '最多等待59s', disabled:true}
    },
    startCheckJdtStatus() {
      this.checkJdtApplyStatus()
      this.countDown = 5
      this.jdtInterval = setInterval(() => {
        this.waitJDT(this.countDown)
        if (this.countDown-- <= 0) {
          clearInterval(this.jdtInterval)
          this.onJdtCheckFail()
        }
      }, 1000)
    },
    onJdtCheckSuccess() {
      clearInterval(this.jdtInterval)
      bus.hideRemind()
    },
    onJdtCheckFail() {
      //todo 文案
      let r = bus.remind
      r.remindMsg = '申请超时,请重新申请'
      r.remindOpts = [{
        msg: '确定',
      }]
    },
    goAuthingPage() {
      let path = localStorage.getItem('pathWhenAuth')
      if (!path) {
        return
      } else {
        localStorage.removeItem('pathWhenAuth')
        publicFun.goPage(path)
        bus.$emit('auto_go_apply')
      }
    },
    fromSales(w) {
      sessionStorage.setItem('salesWay', w)
      // console.log('sales URL', this.urlSales + w)
      publicFun.get(this.urlSales + w, this, () => {

      })
    },
    onAccountChange() {
      bus.$emit('account_change', localStorage.userID,
        localStorage.uniqueId, localStorage.qualified)
    },
    checkSession() {
      let promise = publicFun.singleGetPro('account/checkSession', {}, {
          hideLoading: true,
        })
        .then((response) => {
          console.log('%c check session response', 'color:red', response)
          if (response) {

          }
          return response
        })
      return promise


      // this.loading = true
      // this.$http.get('account/checkSession').then(res => {
      //   var data = res.body.data
      //   console.log('session data', data)
      //   if (data) {
      //     // bus.account=data.phone
      //     // bus.uniqueId=data.uniqueId
      //     bus.$emit('account_change', localStorage.userID, localStorage.uniqueId, localStorage.qualified)
      //     if (data.isSetPwd == 0) {
      //       // console.log('no set pwd')
      //       var r = bus.remind
      //       r.remindOpts = [{
      //         msg: '确定',
      //         callback: () => {
      //           publicFun.goPage('/pwd')
      //         }
      //       }]
      //       r.remindMsg = '请设置密码'
      //       r.isShow = true
      //     }
      //     publicFun.wechatAuth(this)
      //   } else {
      //     // publicFun.goPage('/login')
      //   }
      //   this.loading = false
      // }, err => {

      // }).finally(() => {
      //   // bus.sessionChecked = true
      // })
    },
    checkNewer() {
      publicFun.get(this.urlLendInfo, this, () => {
        if (this.response.body.data) {
          bus.isNewer = false
          // this.notNewerRedirect()
        } else {
          publicFun.get(this.urlApply, this, () => {
            console.log('---', this.response.body.data)
            bus.checkedIsNewer = true
            if (this.response.body.data.data.length) {
              bus.isNewer = false
              // this.notNewerRedirect()
            } else {
              bus.isNewer = true
            }
          })
        }
      })
    },
    checkJdtApplyStatus() {
      let promise = publicFun.singleGetPro('lendApply/jdtLendApplyStatus', {}, {})
      promise.then(response => {
        console.log('%c response jdt status', 'color:red', response)
        if (response.status === 1) {
          this.onJdtCheckSuccess()
        } else {
          if (this.countDown >= 0) {
            setTimeout(() => {
              this.checkJdtApplyStatus()
            }, 1000);
          }
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    checkToken() {
      var promise
      let query = this.$route.query
      if (query.jdt) {
        console.log('%c token', 'color:red', query.token)
        promise = publicFun.singleGetPro('account/loginByJdtToken', {
          token: query.token
        }, {
          hideLoading: false,
        }).finally(res => {
          setTimeout(function() {
            bus.loading = false
          }, 2000);
        })
        // .then((response) => {
        //   console.log('%c check token response','color:red',response) 
        // })
      } else {
        console.log('%c no token', 'color:red', )
        promise = Promise.resolve({
          noToken: false,
        })
      }
      return promise

    },
    onTokenLogin(response) {
      localStorage.userID = response.phone
      localStorage.uniqueId = response.uniqueId
      this.onAccountChange()
    },
    onCookieLogin(response) {
      this.onAccountChange()
    },
    autoLogin() {
      let promiseSession = this.checkSession()
      let promiseToken = this.checkToken()
      Promise.all([promiseSession, promiseToken])
        .then((values) => {
          bus.sessionChecked = true
          let isLoged = values.find(item => {
            return item && item.userId
          })
          let sessionValue = values[0]
          let tokenValue = values[1]
          if (tokenValue.userId) {
            this.onTokenLogin(tokenValue)
          } else if (sessionValue.userId) {
            this.onCookieLogin(sessionValue)
          } else {
            let r = bus.remind
            r.remindMsg = "请登录"
            r.remindOpts = [{
              msg: '确定',
              callback() {
                publicFun.goPage(this.$route.path + '/login')
              },
            }]
            r.isShow = true
          }
          if (isLoged) {
            if (this.$route.query.jdt) {
              this.startCheckJdtStatus()
            }
            publicFun.wechatAuth(this)
          }
        })
    },
    test() {
      console.log('bus', bus)
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
  created() {
    setTimeout((params) => {
      // this.startCheckJdtStatus()
    }, 2000);
    var way = this.$route.query.qudao
    if (way) {
      this.fromSales(way)
      localStorage.qudao = way

    } else {
      // localStorage.removeItem('qudao')
    }
    bus.$on('foot_show_change', (footShow) => {
      this.footNavShow = footShow
    })
    bus.$on('url_change', (action) => {
      this.enter = action
    })
    this.footNavShow = true
    // let query = this.$route.query
    // if (query.jdt) {
    //   console.log('%c token', 'color:red', query.token)
    //   // checkToken(query.token)
    // }
    this.autoLogin()
  },
  mounted() {
    this.goAuthingPage()
  },
  computed: {
    globalLoading() {
      return bus.loading
    },
    remind() {
      return bus.remind
    },
    isTest() {
      return /test/.test(location.href)
    },
    isLoged() {
      // if(bus.account!=='请登录'){
      //   this.$nextTick(()=>{

      //   })
      // }
      return bus.account !== '请登录'
    },
    // checkNewerWatch(){
    //   if(this.isLoged){
    //     this.checkNewer()
    //   }
    //   return this.isLoged
    // },
  },
  watch: {
    isLoged(v) {
      if (v) {
        this.checkNewer()
      }
    },
  },
  components: {
    'foot-nav': footNav,
    contact: contact,
  }
}

</script>
<style lang="scss" scoped>
body {
  /*position: relative;*/
}

.router-view-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: scroll;
  overflow-x: hidden;
}

.show-foot {
  margin-bottom: 0.5rem;
}

</style>
<style type="text/css" lang='scss'>
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

.foot-nav {
  /*border-top:0.5px solid $navColor ;*/
  width: 100%;
  background: $navBackground;
  position: absolute;
  height: $navHeight;
  bottom: 0;
  display: flex;
  border: 0px solid #efeff4;
  border-top-width: 1px;
  .nav-btn {
    -webkit-tap-highlight-color: transparent;
    width: 50%;
    flex-grow: 1;
    height: 100%;
    text-decoration: none;
    display: inline-block;
    position: relative;
    font-size: 0.16rem;
    vertical-align: center;
    line-height: $navHeight;
    color: $navColor;
    /*position: relative;*/
    * {
      /*border:1px solid red;*/
    }
    .nav-icon {
      width: 30%;
      /*height: 50%;*/
      /*position: relative;*/
      /*top: 0;*/
      /*right: 0;left: 0;*/
      margin: 0.03rem auto 0;
      font-size: 0.2rem;
      line-height: 1.5;
    }
    .nav-item {
      /*width: 100%;*/
      /*margin: 0 auto;*/
      /*height: 50%;*/
      font-size: 0.12rem;
      line-height: 1.2;
    }
  }
  .active {
    /*background: #eee;*/
    color: $activeColor;
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
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  left: 0;
  right: 0;
  /*height: 100%;*/
  /*height: 100%;*/
  /*z-index: 2;*/
  /*padding-bottom: 0.5rem;*/
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
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
