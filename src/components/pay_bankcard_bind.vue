<template>
	<div id="bankcardBindVue" class="fixed-title-page">
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<h1 class="title">
				<app-back></app-back>
				绑定银行卡
			</h1>
    </div>
    <app-bind-card></app-bind-card>
		</div>
</template>

<script>
import publicFun from '../js/public.js'
import bindCard from './views/card_bind.vue'
export default {
  data() {
    return {
    	bankcard:'',
      name:'',
      nameValid:true,
   		response:null,
   		loading:false,
   		editing:true,
   		backAfterPost:false,// watch out
   		url:'unspay/bind?bankCardNo=',
   		remind:{
   			isShow:false,
   			remindMsg:'remind',
   			self_:this,
   			remindOpts:[
   			{msg:'确定',},
   			],
   		},
    }
  },
  methods:{
  
  },
  events: {},
  created(){
    
  },
  computed:{
  	
  },
  components: {
    'app-bind-card':bindCard,
  }
}
</script>

<style lang='scss' scoped>
#bankcardBindVue{

  .icon-warning{
    color:#09bb07;
    opacity: 1; 
  }
  .card-remind{
    padding:0.1rem 0.2rem;
    font-size: 0.14rem;
    text-align: left;
    line-height: 1.4;
  }
}
</style>
