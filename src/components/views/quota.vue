<template>
	<div id="quotaVue">
		<p class="audit-msg">
      {{auditMsg}}
    </p>
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<div class="container">
				<div class="wraper right-align-input">
					<label class="label" :disabled='true'>发放额度：</label> 
					<el-input :disabled='true' placeholder='' v-model='quota' @blur.once='blured'  :class='{"valid-border":quota,"error-border":!quota}'></el-input>
					<!-- <i :class="{'el-icon-check':jiedaibaoLiabilitiesValid,'el-icon-close':!jiedaibaoLiabilitiesValid}"></i> -->
				</div>
          <el-button type='success'  @click='chooseReceiveCard' v-if='quotaCfg.quotaStatus==0'>领取</el-button>
			</div>
		</div>
    <div class="binding-card" v-if='binding' >
      <div class="input">
        <h1 class="title">
          <app-back :method='chooseReceiveCard'></app-back>
          绑定新银行卡
        </h1>
      </div>
      <app-bind-card :callback='cardPay' ></app-bind-card>
    </div>
    <remind :remind=remind></remind>
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
        response:null,
        backAfterPost:false,// watch out
        remind:{
          isShow:false,
          remindMsg:'remind',
          self_:this,
          remindOpts:[
          {msg:'确定',},
          ],
        },
				tokenChoosed:null,
				choose:{
          back:null,
          isShow:false,
          title:'',
          self_:this,
          chooseOpts:[
          ],
        },
				binding:false,
    }
  },
  props:{
  	quotaCfg:{
  	
  	}
  },
  methods:{
    // cancelBinding(){
    //   this.binding=false
    // },
  	blured($event){
  		var el=$event.target.parentElement.parentElement
  		el.className+=' validate'
  	},
  	chooseReceiveCard(){
      this.binding=false
  		publicFun.get(this.urls.cards,this,()=>{
  		  let cards=this.response.body.data
  		  ,options=[],len=cards.length
  		  ,c=this.choose,temp

  		  for(let i=0;i<len;i++){
  		    let l=cards[i].length
  		    temp={type:'银行卡：'+cards[i].cardNo,callback:()=>{
  		      this.tokenChoosed=cards[i].token
            this.receiveQuota()
  		    }}
  		    options.push(temp)
  		  }
  		  options.push({type:'使用其他银行卡',callback:()=>{
  		      this.binding=true
  		    }})
  		  // c.back=this.cancelChoose.bind(this)
  		  c.chooseOpts=options
  		  c.title='请选择发放禾贷的银行卡'
  		  c.isShow=true
  		})
  	},
    receiveQuota(){
      let url=publicFun.urlConcat(this.urls.receive,{
        applyId:this.quotaCfg.apply_id,
        token:this.tokenChoosed,
      })
      publicFun.get(url,this,()=>{
        console.log('res receive',this.response)
        if(!this.response.body.error){

          let r = this.remind
          r.remindMsg='申请成功'
          r.remindOpts=[{msg:'确定'}]
          r.isShow=true
        }
      })
    }
  },
  computed:{
  	quota(){
  		return  (this.quotaCfg.quotaFee/100).toFixed(2)+'元'
  	},
    auditMsg(){
      let s
      switch(this.quotaCfg.quotaStatus){
        case 0:s='申请通过，请确认领取额度';break;
        case 1:s='等待发放';break;
        case 2:s='已放款';break;
      }
      return s
    },
  },
  events: {},
  components: {}
}
</script>

<style lang='scss' >
#quotaVue{
	.right-align-input .el-input .el-input__inner {
    background-color: #fff;
    border-color: #fff;
    color: #777;
    cursor: not-allowed;
    text-align: right;
    padding-right: 0.3rem;
  }
    .binding-card{
    position: fixed;
    background: rgba(255,255,255,1);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 99999;
  }
  .audit-msg{
    font-size: 0.25rem;
  }
}

</style>
