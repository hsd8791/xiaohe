<template>
  <div class="shadow-box  " audit-ctrl='re-fill'>
    <img src="../../assets/xh/re-auditing.png" v-if='auditing===2' class="audit-icon">
    <img src="../../assets/xh/re-auditing.png" v-if='auditing===4' class="audit-icon">
    <p class='audit-title'>
      {{title}}
    </p>
    <p class="audit-remind" v-if='auditing===2' >请根据审核意见更新或修改资料后重新提交</p>
    <div class="audit-remark-box">
      <div class="audit-remark">
        <p class="audit-remark">
          <p v-html='remarkHtml' class="audit-remark"></p>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props:{
    remark:{
      default:'意见意见'
    },
    auditing:{
      default:2
    },
  },
  computed:{
    title(){
      switch(this.auditing){
        case 4:return '永久拒绝';break;
        case 2:return '发回重审';break;
      }
    },
    remarkHtml(){
      return `<span class='remark-head'>审核意见: </span>${this.remark}`
    },
  },
  methods:{},
  events: {},
  components: {}
}
</script>

<style>

</style>
