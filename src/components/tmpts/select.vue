<template>
  <div class="app-select">

    <div class="select-value " :style="selectValue?{}:{'color':placeholderColor}" :class="{'__disabled':disabled}" >
      <p class="text">
        {{parsedValue||placeholder}}
      </p>
    </div>
     <!-- @change='handleValueChange($event)' -->
    <select class="select__"  :disabled='disabled'@change='handleValueChange($event)' >
      <option v-for='item in options' :value="item.value" :key='item.value'>{{item.value}}</option>
      <!-- <option value ="volvo">Volvo</option>
      <option value ="saab">Saab</option>
      <option value="opel">Opel</option>
      <option value="audi">Audi</option> -->
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
    selectValue:{
      default:'',
    },
    filter:{
      default :false,
    },
  },
  computed:{
    parsedValue(){
      console.log('process',process)
      if(this.filter){
        return this.filter(this.selectValue)
      }else{
        return this.selectValue
      }
    },
  },
  methods:{
    handleValueChange(e){
      console.log('CHANGE',this)
      // this.selectValue=e.target.value
    },
  },
  created(){
    console.log('select options',this.options)
  },
  watch:{
    // selectValue(v){
    //   this.$emit('update:selectValue', v)
    // }
  },
  events: {},
  components: {}
}
</script>

<style lang='scss' scoped>


</style>
