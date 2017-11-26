<template>
  <div class="auditing-vue"  audit-ctrl='guide'>
    <div class="shadow-box">
      <p class="title">小禾微贷审核中</p>
      <img src="../../assets/xh/hzg_qr.jpg" alt="" class="qrcode">
    </div>
    <ul>
      <li class="remind">新用户审核时间：上午9：00-下午5：00。</li>
      <li class="remind">下午5：00以后申请的将在第二天开始审核。</li>
      <li class="remind">必须添加QQ公众号【4000577009】才能进行审核。</li>
    </ul>
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
  methods:{
    hzgMarket(){
        console.log('hzg market_list')
        location.href='http://hzg.he577.com/m/#/market_list'
    },
  },
  events: {},
  components: {}
}
</script>

<style lang='scss' scoped>
.qrcode{
  width: 2.22rem;
  margin-bottom: 0.31rem;
}
.title{
  font-size: 0.19rem;
  line-height: 1;
  margin-top: 0.3rem;
  margin-bottom: 0.25rem;
}
ul{
   list-style-position:inside;
}
.remind{
  text-align: left;
  margin-left: 0.15rem;
  margin:0.1rem 0.15rem;
  font-size: 0.14rem;
  color:#999999;

}
</style>
