<template>
  <div class="app-select">
    <div class="select-value " :style="value?{}:{'color':placeholderColor}" :class="{'__disabled':disabled}" >
      <p class="text">
        {{parsedValue||placeholder}}
      </p>
    </div>
    <select class="select__" ref='select'  :disabled='disabled'@change='handleValueChange($event)' @select='testSelect($event)' >
      <option disabled selected value>-请选择-</option>
      <option v-for='item in options' :value="item.value" :key='item.value'>{{item.value}}</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props:{
    value:{},//v-model  directive binding.value
    options:{},
    disabled:{
      default:false,
    },
    placeholder:{
      default:'请选择'
    },
    placeholderColor:{
      default:'#97a7be'
    },
    filter:{
      default :false,
    },
  },
  computed:{
    parsedValue(){
      if(this.filter){
        return this.filter(this.value)
      }else{
        return this.value
      }
    },
  },
  methods:{
   
    handleValueChange(e){
      // this.$emit('select',e.target.value)
      this.$emit('input',e.target.value) // v-model used on this component will register $on event listenr for parent component
      // this.$emit('change',e.target.value)
    },
  },
  created(){
    // console.log('value',this.value)
  },
}
</script>

<style lang='scss' scoped>


</style>
