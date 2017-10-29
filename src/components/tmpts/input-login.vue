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
.___input-login-vue{
  /*border:1px solid red;*/
  .icon{

  }
  .___input{
  }
}

</style>
