<template>
  <div v-if='false'>
    <div class="box">
      <div class="dscrp">
        <p>24小时花贝自助码</p>
        <p>系统自动回款，无需担心资金风险</p>
        <p>花贝套王见</p>
        <p>付完秒回支付宝</p>
        <p>详情可以扫微信二维码微信咨询</p>
      </div>
      <div class="img-box">
        <img src="./../../assets/img/qr_huabei.jpg" class="img">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
    }
  },
  methods:{},
  events: {},
  components: {}
}
</script>

<style lang='scss' scoped>
.img{
  width: 1.2rem;
}
.dscrp{
  text-align: left;
  padding-top: 0.05rem;
  p{
    font-size: 0.13rem;
    color:#333;
    position: relative;
    margin: 0.05rem 0;
    margin-left: 0.15rem;
    line-height: 1.2;
    &:after{
      content:'';
      position: absolute;
      left: -0.14rem;
      top: 0;
      bottom: 0;
      margin:auto ;
      width: 0;
      height:0;
      border: 0 solid transparent;
      border-width: 0.06rem 0.12rem;
      border-left-color: #8bc34a;
    }
  }
}
.box{
  position: relative;
  margin: 0.15rem;
  height: 1.25rem;
  /*border:1px solid red;*/
}
.img-box{
 position: absolute;
 top: 0;
 right: 0;
}
</style>
