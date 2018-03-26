<template>
  <div class="___input-login-vue">
    <div class="icon-container">
      <i class='icon' :class="icon" :style="{fontSize:iconSize}"></i>
    </div>

    <input type="text" class="___input"  :value="value" :placeholder='placeholder' >
    <div class="right-container">
      <slot >
      </slot>
    </div>
  </div>
</template>

<script>
//icon
//right slot
//placeholder 
//validcolor
//errorColor
export default {
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
    }
  },
  props:{
    value:{},
    placeholder:{
      default:'请输入'
    },
    icon:{
      default:'icon-icon-phone'
    },
    iconSize:{
      default:'0.22rem'
    },
  },
  methods:{},
  events: {},
  components: {},
}
</script>

<style lang='scss' >
$placeholderColor:#97a7be;
.___input-login-vue{
  /*border:1px solid red;*/
  .icon{

  }
}

.___input-login-vue{
  width: 3.45rem;
  height: 0.42rem;
  margin:0 auto;
  // border:1px solid red;
  position: relative;
  background:#fff;
  border-radius: 0.04rem;
  overflow:hidden;
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
        color:#3077e0;
    }
    input:-moz-placeholder, textarea:-moz-placeholder { 
        color:#3077e0;
    }
    input::-moz-placeholder, textarea::-moz-placeholder { 
        color:#3077e0;
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder { 
        color:#3077e0;
    }
  .icon{
    position: relative;
    display: inline-block;
    line-height: 0.4rem;
    color:#3077e0;
  }
  .icon-container{
    position: absolute;
    left: 0.1rem;
    top:0;
    height:100%;
    width:0.3rem;
  }
  .right-container{
    overflow:hidden;
    height: 100%;
    width: 1.08rem;
    position: absolute;
    right: 0;
    top: 0;
  }
  .___input{
    border:0;
    font-size: 0.15rem;
    outline: none;
    color:$placeholderColor;
    height: 0.4rem;
    width: 3rem;
    margin-left: 0.45rem;
    margin-left: 
    &:focus{
      outline: 0;
    }
  }
}
</style>
