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
        this.remind.remindMsg = STATUS_CODE[data.data.code]
        this.remind.remindOpts=[{
          msg:"确定"
        }]
      }else {
        return
      }
    },
    submit() {
      let data = JSON.stringify({
        action:"taobaoAuth",
        data:{
          name:this.real_name,
          mobile:this.phone,
          idCarNo:this.identity_code,
          taskId:this.taskId,
        },
      })
      window.postMessage(data,"*")
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
            this.createTask()
          }
        }, {
          msg: '取消',
        }, ]
      }
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
