<template>
  <div class="shadow-box">
    <p class="title">暂无申请记录</p>
    <img src="../../assets/xh/apply-record.png" class="no-record-img">
    <!-- <img src="../assets/xh/apply_record.png" alt="" class="no-record-img"> -->
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
.title{
  /*font-family: PingFangSC;*/
  font-size: 0.19rem;
  font-weight: 500;
  text-align: center;
  color: #383838;
  margin-top: 0.5rem;
}
.no-record-img{

    width:1.7rem;
    margin-top: 0.45rem;
    margin-bottom: -0.5rem;
    /*height: 0.95rem;*/
  }

</style>
