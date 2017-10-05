<template>
  <div class="el-select app-select">

    <div class="select-value " :style="selectValue?{}:{'color':placeholderColor}" :class="{'__disabled':disabled}">{{selectValue||placeholder}}</div>
    <select class="select__"  @change='handleValueChange($event)' :disabled='disabled'>
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
      // selectValue:'',
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
  },
  methods:{
    handleValueChange(e){
      console.log('e',e,e.target)
      this.selectValue=e.target.value
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
/*.app-select{
  height: 100%;
  height: 0.42rem;
  .select__{
    position: absolute;
    top: 0;left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    height: 0.42rem;
  }
  .select-value{
    font-size: 0.16rem;
    text-align: left;
    padding: 0 0.1rem;
    line-height: 0.42rem;

  }
  .__disabled{
    color:#777;
  }
}*/

</style>
