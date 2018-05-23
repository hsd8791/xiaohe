<template>
  <div class="cover input" v-if='value'>
    <!-- <div class="remind" :class="{'remind-higher':remind.remindMsgDscrp}"> -->
    <div class="remind remind-higher  container">
      <div class="input-box">
        <el-input :placeholder='placeholder' v-model='text'> </el-input>
      </div>
      <div class="dialog-msg">{{dialogMsg}}</div>
      <div class="ctrl-box">
        <div class="ctrl-btn"  @click.once='_onOk()'>
          确定
          <!-- <a class="href" v-show='item.href' :href="item.href" @click.once='close()'> -->
          </a>
        </div>
        <div class="ctrl-btn"  @click.once='_onCancel()'>
          取消
          <!-- <a class="href" v-show='item.href' :href="item.href" @click.once='close()'> -->
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dialog',
  data() {
    return {
      text: null,

    }
  },
  props: {
    placeholder: {
      default: '请输入'
    },
    dialogMsg: {
      default: "如未收到验证码，请取消重新授权登录",
    },
    value: {

    },
    // dialog
    onOk: {
      // type: 'function',
    },
    onCancel: {
      type: 'function',
    },
  },
  created(){

  },
  methods: {
    close(callback, vm) {
      this.$emit('input', false)
      // callback()
      // console.log('vm',vm)
    },
    _onOk() {
      this.close()
      this.onOk(this.text)
    },
    _onCancel() {
      this.close()
      if(this.onCancel){
        this.onCancel()
      }
    },
  },
  computed: {
    // options() {
    //   return [{
    //     msg: '确定',
    //     callback:function() {
    //       console.log('this',this)
    //       this._onOk()
    //     },

    //   }, {
    //     msg: '取消',
    //     callback() {
    //       this._onCancel()
    //     },
    //   }]
    // },
  },
  components: {},
}

</script>
<style lang='scss' scoped>
.input-box {
  /*border:1px solid red;*/
  padding: 0 .15rem;
}

.cover {
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 99999;
  .remind {
    /*height: 1.05rem;*/
    padding-top: .25rem;
    width: 2.7rem;
    background: #f8f8f8;
    position: relative;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid transparent;
    /*left: 0;right: 0;*/
    /*top: 0;bottom: 0;*/
    border-radius: 0.15rem;
    .dialog-msg {
      width: 100%;
      /*height: 0.64rem;*/
      line-height: 1.4;
      font-size: 0.13rem;
      margin-top: 0.2rem;
      padding: 0 0.05rem;
      color: #010101;
      /*font-weight: bold;*/
    }


    .ctrl-box {
      display: flex;
      position: relative;
      bottom: 0;
      margin-top: 0.15rem;
      width: 100%;
      .ctrl-btn {
        text-decoration: none;
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.16rem;
        border: 0px solid #d2d2d2;
        border-right-width: 1px;
        border-top-width: 1px;
        color: #0081ff;
        position: relative;
        flex-grow: 1;
        .href {
          width: 100%;
          height: 100%;
          display: block;
          position: absolute;
          top: 0;
        }
      }
      .ctrl-btn:last-child {
        border-right-width: 0px;
      }
    }
  }
  .remind-higher {
    /*height: 1.25rem;*/
  }
}

</style>
<style lang="scss">
#app .cover .container {

  .el-input__inner {
    text-align: right;
    padding-right: .15rem;
  }
}

</style>
