<template>
	<div id="quotaVue">
		申请通过
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<div class="container">
				<div class="wraper">
					<label class="label" :disabled='true'>发放额度：</label> 
					<el-input :disabled='true'   placeholder='' v-model='quota' @blur.once='blured'  :class='{"valid-border":quota,"error-border":!quota}'></el-input>
					<!-- <i :class="{'el-icon-check':jiedaibaoLiabilitiesValid,'el-icon-close':!jiedaibaoLiabilitiesValid}"></i> -->
				</div>
					<el-button type='success'  @click='receiveQuota'>领取</el-button>
			</div>
		</div>
		<app-choose :choose='choose'></app-choose>
	</div>
</template>

<script>
import publicFun from '../../js/public.js'
	export default {
		data() {
			return {
				loading:false,
				urls:{
					receive:'lendApply/receiveQuota',
          cards: 'unspay/mycards',
				},
				tokenChoosed:null,
				choose:{},
				binding:false,
    }
  },
  props:{
  	quotaCfg:{
  	
  	}
  },
  methods:{
  	blured($event){
  		var el=$event.target.parentElement.parentElement
  		el.className+=' validate'
  	},
  	receiveQuota(){
  		this.choose.isShow=true
  		// publicFun.get(this.urls.cards,this,()=>{
  		//   let cards=this.response.body.data
  		//   ,options=[],len=cards.length
  		//   ,c=this.choose,temp

  		//   for(let i=0;i<len;i++){
  		//     let l=cards[i].length
  		//     temp={type:'银行卡：'+cards[i].cardNo,callback:()=>{
  		//       this.tokenChoosed=cards[i].token
  		//     }}
  		//     options.push(temp)
  		//   }
  		//   options.push({type:'使用其他银行卡',callback:()=>{
  		//       this.binding=true
  		//     }})
  		//   // c.back=this.cancelChoose.bind(this)
  		//   c.chooseOpts=options
  		//   c.title='请选择发放禾贷的银行卡'
  		//   c.isShow=true
  		// })
  	},
  },
  computed:{
  	quota(){
  		return  (this.quotaCfg.quotaFee/100).toFixed(2)+'元'
  	}
  },
  events: {},
  components: {}
}
</script>

<style lang='scss' >
#quotaVue{
	.wraper{
		/*margin:0;*/
	}
	.input .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #fff;
    color: #777;
    cursor: not-allowed;
    text-align: right;
    padding-right: 0.3rem;
  }
}

</style>
