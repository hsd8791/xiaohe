<template>
  <div id="infoTaobao" class="input" v-loading='loading' element-loading-text='请稍后'>
    <h1 class="title">
      <app-back></app-back>
      淘宝绑定
      <!-- <span class="edit-input" v-if='!editing' @click='edit'>编辑</span> -->
    </h1>
    <h2 class="sub-title">绑定状态</h2>
    <div class="container status">
      <div class="wraper">
        <div class="icon icon-taobao">
          <!-- <i class="icon-mobile"></i> -->
        </div>
        <div class="info phone">{{queryRslt.phone}}</div>
        <!-- <div class="info">黄树栋</div> -->
        <div class="info info-time">{{queryRslt.time | timeParse}}</div>
        <!-- <div class="status">等待用户处理或服务器完成查询</div> -->
        <div class="info" v-if='queryRslt.status'>{{queryRslt.status | statusParse}}</div>
      </div>
    </div>
    <el-button type='success' :disabled='false' class='submit' v-if='!isFirst' @click='get(1)'>重新查询</el-button>
    <el-button type='success' :disabled='false' class='submit' v-if='isFirst' @click='get(0)'>开始绑定</el-button>

    <!-- <el-button type='warning'  class='submit' v-if='!editing' @click='edit'>修改</el-button> -->
    <remind :remind='remind'></remind>
  </div>
</template>
<script>
// import '../css/input.css'
const STATUS_CODE = {
  50:"用户取消",
  0:"操作成功",
  10:"网络错误",
  11:"网络错误",
  30:"网络错误，请稍后重试",
  31:"网络错误，请稍后重试",
  40:"网络错误，请稍后重试",
  // -1:  任务失败  请反馈具体错误信息给技术支持
  // 0: 任务成功  客户端登录成功，等待回调通知
  // 50:  任务被用户强制关闭 用户关闭客户端
  // 10:  网络异常无法连接到服务 检查手机网络情况
  // 11:  服务访问失败导致任务创建失败  检查手机网络情况
  // 20:  任务创建失败  请反馈具体错误信息给技术支持
  // 30:  数据解析失败  网站改版或访问限制，请稍后重试
  // 31:  返回的数据为空 网站改版或访问限制，请稍后重试
  // 40:  爬取网页失败  网站改版或访问限制，请稍后重试
  // 1050: - 1100 内部请求异常引起的相关错误 请反馈具体错误信息给技术支持
  // 2897:  未购买此服务  请和商务确认是否已开通流量
}
import publicFun from '../js/public.js'
import bus from '../bus.js'
import remind from '../components/tmpts/remind.vue'
export default {
  data() {
    return {
      // useAccount:true,
      response: null,
      isFirst: false,
      // loading:true,
      loading: false,
      editing: false,
      phone: '',
      taskId: null,
      urlStatus: 'credit/shujumoheTaobaoQueryStatus',
      url: 'credit/createShujumoheTaobaoTask',
      // exUrl:'https://open.shujumohe.com/box/yys',
      exUrl: 'https://open.shujumohe.com/box/tb',
      real_name: '',
      identity_code: '',
      formData: {},
      queryRslt: {},
      // backAfterPost:true,
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
  methods: {
    onMessage(event){
      let data = JSON.parse(event.data)
      let contacts
      console.log('data',data)
      if(data.action === "taobaoAuthResult"){
        this.remind.isShow = true
        let index = Number(data.data.code)
        let message = STATUS_CODE[index]
        if(message){
          this.remind.remindMsg = message
        }else {
          this.remind.remindMsg = "未知错误，请联系客服"
        }
        // this.remind.remindMsgDscrp = STATUS_CODE[Number(data.data.code)]
        this.remind.remindOpts=[{
          msg:"确定"
        }]
        this.getStatus()
      }else {
        return
      }
    },
    submit() {
      let data = {
        action:"taobaoAuth",
        data:{
          name:this.real_name,
          mobile:this.phone,
          idCarNo:this.identity_code,
          taskId:this.taskId,
        },
      }
      if(publicFun.isAndroid){
        window.webView.postMessage(JSON.stringify(data))
      }
      if(publicFun.isIOS){
         window.postMessage(JSON.stringify(data),"*")
      }
      // window.webView.postMessage(JSON.stringify(data))
      // window.postMessage(data,"*")
      return
    },
    get(type) {
      if (type === 0) {
        this.createTask()
        return
      } else if (type === 1) {
        this.remind.remindMsg = '覆盖现有记录'
        this.remind.isShow = true
        this.remind.remindOpts = [{
          msg: '确定',
          callback: () => {
            if(publicFun.isIOS){
              setTimeout(() =>{
                this.iosRemind(this.createTask)
              }, 10);
            }else{
              this.createTask()
            }
          }
        }, {
          msg: '取消',
        }, ]
      }
    },
    iosRemind(cb){
      let r = this.remind
      r.isShow = true
      r.remindMsg = "ios用户需知"
      r.remindMsgDscrp = "如首次淘宝授权提示“非法表单”，请回到小海带此页面，再次发起淘宝授权；授权完成后需要手动切换回APP。"
      r.remindOpts=[{
        msg:'确定',
        callback:() => {
          cb()
          r.isShow = false
        }
      }]
    },
    createTask() {
      publicFun.get(this.url, this, () => {
        var data = this.response.body.data
        console.log('data', data)
        if (data) {
          this.taskId = data.taskId
          this.real_name = data.name
          this.phone = data.phone
          this.identity_code = data.idCardNum
          this.submit()
        }
      })
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
    getStatus() {
      publicFun.get(this.urlStatus, this, () => {
        var data = this.response.body.data
        if (data) {
          this.queryRslt = data
          var now = new Date().getTime()
          var passed = now - data.time
          if (passed >= 600 * 1000) {
            this.queryRslt.status = 'failure:超时！'
          }
          // console.log('now',now-this.queryRslt.time)
          console.log('data', data)
        } else {
          this.isFirst = true
        }
      })
    },

  },
  watch: {

  },
  computed: {
    phoneValid: function() {
      var reg = publicFun.reg.cellphone;
      return reg.test(this.phone)
    },
    allValid: function() {
      var t = this
      return t.phoneValid && true //&&

    },
  },
  filters: {
    timeParse(val) {
      return publicFun.getTimeString(val)
    },
    statusParse(val) {
      var s, r
      if (!val) {
        return
      }
      switch (val) {
        case 'doing':

          s = '等待用户处理或服务器完成查询'
          break;
        case 'success':
          s = '查询绑定成功'
          break;
        default:
          r = val.slice(val.indexOf(':') + 1)
          s = '绑定失败,失败原因：' + r
      }
      return s
    }
  },
  created() {
    this.getStatus()
    publicFun.checkSession(this)
    this.useAccount = true
    window.document.addEventListener("message", this.onMessage, false);

    // this.get()
  },
  beforeDestroy(){
    window.document.addEventListener("message", this.onMessage, false);
  },
  events: {},
  components: {
    remind: remind,
  }
}

</script>
<style lang='scss' scoped>
a {
  font-size: 0.2rem;
  display: block;
  padding: 0.05rem;
}

#infoTaobao {
  * {
    /*border:1px solid red;*/
  }
  .sub-title {
    padding: 0.0rem 0.15rem;
  }
  .wraper {
    margin-left: 0.15rem;
    height: 0.95rem;
    .info {
      margin: 0.15rem 0;
      margin-left: 0.6rem;
      text-align: left;
    }
    .phone {
      font-size: 0.2rem;
    }
    .info-time {
      position: absolute;
      right: 0.1rem;
      top: 0;
      font-size: 0.14rem;
      line-height: 0.2rem;
      color: #999;
    }
    .status {
      position: absolute;
      top: 0;
      right: 0;
      width: 1rem;
      text-align: right;
    }
  }
  .icon {
    width: 0.4rem;
    height: 0.4rem;
    /*border:1px solid #ccc;*/
    border-radius: 0.03rem;
    position: absolute;
    top: 0.16rem;
    line-height: 0.4rem;
    font-size: 0.36rem;
    color: #666;
    /*  .icon-mobile{
        color: #ccc;
        position: absolute;
        top: 0;left: 0;
      }
      */
  }
}

</style>
