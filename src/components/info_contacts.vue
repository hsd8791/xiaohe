<template>
  <div id="infoContacts" class="input" v-loading='loading' element-loading-text='请稍后'>
    <h1 class="title">
      <app-back></app-back>
      通讯录上传
      <!-- <span class="edit-input" v-if='!editing' @click='edit'>编辑</span> -->
    </h1>
    <h2 class="sub-title">绑定状态</h2>
    <el-button type='success' :disabled='false' class='submit' v-if='!isFirst' @click='get(1)'>重新上传</el-button>
    <el-button type='success' :disabled='false' class='submit' v-if='isFirst' @click='get(0)'>开始上传</el-button>

    <!-- <el-button type='warning'  class='submit' v-if='!editing' @click='edit'>修改</el-button> -->
    <remind :remind='remind'></remind>
  </div>
</template>
<script>
// import '../css/input.css'
import publicFun from '../js/public.js'
import bus from '../bus.js'
import remind from '../components/tmpts/remind.vue'
export default {
  data() {
    return {
      response: null,
      isFirst: true,
      loading: false,
      editing: false,
      phone: '',
      taskId: null,
      // urlStatus: 'credit/shujumoheTaobaoQueryStatus',
      // url: 'credit/createShujumoheTaobaoTask',
      url: 'userInfo/contactJson',
      real_name: '',
      identity_code: '',
      formData: {},
      queryRslt: {},
      backAfterPost:true,
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
    formatContacts(contacts){
      let str = "'全名','昵称','手机号','运营商'\n"
      let datas = contacts
      function trimPhone(phone){
        phone = phone.replace(/[-| ]/gi,"")
        return phone
      }
      let phones = []
      datas.forEach(item => {
        item.phoneNumbers.forEach((phoneNumber) => {
          str = str + `${item.familyName},${item.givenName},${trimPhone(phoneNumber.number)},\n`
        })
      })
      return str
    },
    postContacts(contacts) {
      let body = {
        contact: this.formatContacts(contacts),
      }
      
      publicFun.post(this.url,body,this,(res) => {
        console.log('res',res)
        //success response
      },(err) => {
        //body 
      })
    },
    onMessage(event){
      let data = JSON.parse(event.data)
      let contacts
      if(data.action === "contactsResult"){
        contacts = data.contacts
      }else {
        return
      }
      this.postContacts(contacts)
    },
    upload() {
      let data = {
        action:"getContacts",
      }
      console.log('post message upload')
      if(publicFun.isAndroid){
        window.webView.postMessage(JSON.stringify(data))
      }
      if(publicFun.isIOS){
         window.postMessage(JSON.stringify(data),"*")
      }
    },
    get(type) {
      if (type === 0) {
        this.upload()
        return
      } else if (type === 1) {
        this.remind.remindMsg = '覆盖现有记录'
        this.remind.isShow = true
        this.remind.remindOpts = [{
          msg: '确定',
          callback: () => {
            this.upload()
          }
        }, {
          msg: '取消',
        }, ]
      }
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
      console.log('this', this)
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
    // this.getStatus()
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
