<template>
  <div id="contactWayVue" class="input " v-loading='loading' element-loading-text='请稍后' >
    <div class="container" v-for='(item,index) in relatives'>
      <div class="wraper">
        <label>姓名：</label>
        <el-input :disabled='!editing' :placeholder="'请输入'+relationPlaceholders[index]+'姓名'" v-model='item.name' @blur.once='blured' :class='{"valid-border":item.nameValid,"error-border":!item.nameValid}' @change='validatename(item)'></el-input>
        <i :class="{'el-icon-check':item.nameValid,'el-icon-close':!item.nameValid}"></i>
      </div>
      <div class="wraper ">
        <label>关系：</label>
        <el-select :disabled='!editing' v-model="item.relative" placeholder="关系" @change='validateRelative(item)' class=''>
          <el-option v-for="relation in relationOpts[index]" :key="relation.value" :label="relation.label" :value="relation.value"></el-option>
        </el-select>
      </div>
      <!-- <div class="wraper">
        <label>关系：</label>
        <el-input :disabled='!editing'  placeholder='关系' v-model='item.relative' @blur.once='blured'  @change='validateRelative(item)'></el-input>
        <i :class="{'el-icon-check':item.relativeValid,'el-icon-close':!item.relativeValid}"></i>
      </div> -->
      <div class="wraper">
        <label>电话：</label>
        <el-input :disabled='!editing' type='tel' placeholder='电话号码' v-model='item.phone' @blur.once='blured' :class='{"valid-border":item.phoneValid,"error-border":!item.phoneValid}' @change='validatePhone(item)'></el-input>
        <i :class="{'el-icon-check':item.phoneValid,'el-icon-close':!item.phoneValid}"></i>
      </div>
      <!-- <div class="delete"  -->
      <!-- </div> -->
    </div>
    <remind :remind='remind'></remind>
  </div>
</template>
<script>
// import '../css/input.css'
import publicFun from '../../js/public.js'
import remind from '../../components/tmpts/remind.vue'
// 组件refs , 
// refs.viewName.isFilled
// editing = !allFilled || forceEditing
// forcefilled=false after #all# !!  post success
// forceEditing =refs.a.forceEditing &&refs.b.forceEditing && refs.a.forceEditing &&
export default {
  data() {
    return {
      // infoDebt:{},
      directRelation: [{
        value: '父亲',
        label: '父亲'
      }, {
        value: '母亲',
        label: '母亲'
      }, {
        value: '配偶',
        label: '配偶'
      }, ],
      // relationPlaceholders: ['直系亲属', ''],
      relationPlaceholders: ['', ''],
      relatives: [{
        relative: null,
        phone: null,
        name: null
      }, {
        relative: null,
        phone: null,
        name: null
      }],
      relativesAllVailid: false,
      response: null,
      // loading:false,
      loading: false,
      editing: true,
      nickQq: '',
      acQQ: '',
      nickWechat: '',
      acWechat: '',
      urls: {
        contact: 'userInfo/contact',
        relatives: 'userInfo/relatives',
      },
      url: 'userInfo/contact', //temp for upgrade
      url2: 'userInfo/relatives', //temp for upgrade
      formData: {},
      backAfterPost: true,
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
  mounted() {
  },
  methods: {
    // postProAccount() {
    //   var postBody = {}
    //   postBody.nickQq = this.nickQq
    //   postBody.acQq = this.acQQ
    //   postBody.nickWechat = this.nickWechat
    //   postBody.acWechat = this.acWechat
    //   return publicFun.singlePostPro(this.urls.contact, postBody)
    // },
    submit() {
      var postBody = {},
        postData = []
      var l = this.relatives.length,
        i
      for (i = 0; i < l; i++) {
        postData.push({})
        postData[i].name = this.relatives[i].name
        postData[i].relative = this.relatives[i].relative
        postData[i].phone = this.relatives[i].phone
      }
      var jsonStr = JSON.stringify(postData)
      postBody.data = jsonStr
      return publicFun.singlePostPro(this.urls.relatives, postBody)
    },
    // submit_() {
    //   let postProDebt = this.$refs.infoDebt.submit()
    //   let postArr = [postProDebt, this.postProRelative(), this.postProAccount()]
    //   let prosHandler = publicFun.handlePostPros(postArr)
    //   prosHandler.then(values => {
    //     publicFun.onPostIdentificationSucc()
    //     console.log('prosHandler then', values)
    //   })
    // },
    // getProContact() {
    //   let getProContact = publicFun.singleGetPro(this.urls.contact)
    //   getProContact.then(res => {
    //     console.log('%c res', 'color:red', res)
    //     if (!res) {
    //       return
    //     }
    //     this.nickQq = res.nickQq
    //     this.acQQ = res.acQq
    //     this.nickWechat = res.nickWechat
    //     this.acWechat = res.acWechat
    //   })
    //   return getProContact
    // },
    get() {
      let getProRelations = publicFun.singleGetPro(this.urls.relatives)
      getProRelations.then(res => {
        if (!res) {
          return
        }
        if (res.relatives) {
          this.relatives = res.relatives
          var r = this.relatives,
            i
          // console.log('r', r)
          for (i = 0; i < r.length; i++) {
            // console.log('validtae', i)
            this.validatename(r[i])
            this.validateRelative(r[i])
            this.validatePhone(r[i])
          }
        }
      })
      return getProRelations
    },
    // get_() {
    //   let getProContact = this.getProContact()
    //   let getProRelations = this.getProRelations()
    //   let getProDebt = this.$refs.infoDebt.get()
    //   let getProArr = [getProContact, getProRelations, getProDebt]
    //   let handleGetPros = publicFun.handleGetPros(getProArr)
    //   handleGetPros.then(res => {
    //     publicFun.onGetIdentificationSucc(res, this)
    //   })
    // },

    validateAllRelations() {
      var l = this.relatives.length,
        i, flag = true
      for (i = 0; i < l; i++) {
        flag = flag && this.relatives[i].validAll
        if (!flag) {
          this.relativesAllVailid = false
          return
        }
      }
      this.relativesAllVailid = true
    },
    validatename(it) {
      // console.log('validate name')
      var reg = /.+/
      var t = reg.test(it.name)
      it.nameValid = t
      it.validAll = it.nameValid && it.relativeValid && it.phoneValid
      this.validateAllRelations()
    },
    validateRelative(it) {
      var reg = /.+/
      var t = reg.test(it.relative)
      it.relativeValid = t
      it.validAll = it.nameValid && it.relativeValid && it.phoneValid
      this.validateAllRelations()
    },
    validatePhone(it) {
      var reg = /.+/
      var t = reg.test(it.phone)
      it.phoneValid = t
      it.validAll = it.nameValid && it.relativeValid && it.phoneValid
      this.validateAllRelations()
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
  computed: {
    isFilled: function() {
      return !!(this.relatives[0].name && this.acQQ)
    },
    relationOpts: function() {
      return [
        this.directRelation,
        this.directRelation.concat([{
          value: '亲戚',
          label: '亲戚'
        }, {
          value: '朋友',
          label: '朋友'
        }, {
          value: '兄弟姐妹',
          label: '兄弟姐妹'
        }, ])
      ]
    },
    allValid: function() {
      var t = this
      return t.relativesAllVailid  //&&
    },
  },

  created() {

  },
  events: {},
  components: {
    remind: remind,
  }
}

</script>
<style lang='scss' scoped>


</style>
