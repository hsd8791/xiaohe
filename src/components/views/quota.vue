<template>
	<div id="quotaVue">
		<p class="audit-msg">
      {{auditMsg}}
    </p>
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
			<div class="container">
        <!-- <p class='remind-msg' v-if='quotaCfg.quotaStatus===3'></p> -->
				<div class="wraper right-align-input" v-if='!specialQuota'>
					<label class="label" :disabled='true'>发放额度：</label> 
          <el-input :disabled='true' placeholder='' v-model='quota' @blur.once='blured'  :class='{"valid-border":quota,"error-border":!quota}'></el-input>
          <!-- <i :class="{'el-icon-check':jiedaibaoLiabilitiesValid,'el-icon-close':!jiedaibaoLiabilitiesValid}"></i> -->
        </div>
        <el-checkbox v-model='clause' v-show='quotaCfg.quotaStatus==0&&!specialQuota'>我同意《借款服务与隐私协议》</el-checkbox>
        <el-button type='success' :disabled='!clause'  @click='chooseReceiveCard' v-if='quotaCfg.quotaStatus==0&&!specialQuota'>领取</el-button>
			</div>
      <!-- <div class="container" v-if='quotaCfg.quotaStatus===3'>
        <p>超时未领</p>
      </div> -->
		</div>
    <div class="binding-card" v-if='binding' >
      <div class="input">
        <h1 class="title">
          <app-back :method='chooseReceiveCard'></app-back>
          绑定新银行卡
        </h1>
      </div>
      <app-bind-card></app-bind-card>
    </div>
    <remind :remind=remind></remind>
		<app-choose :choose='choose'></app-choose>
	</div>
</template>

<script>
import publicFun from '../../js/public.js'
import bus from '../../bus.js'
	export default {
		data() {
			return {
				loading:false,
				urls:{
					receive:'lendApply/receiveQuota',
          cards: 'unspay/mycards',
				},
        clause:true,
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
          r.remindOpts=[{msg:'确定',callback:()=>{
            bus.$emit('quota_recieved')
          }}]
          r.isShow=true
        }
      },()=>{
        
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
        case 0:s='申请通过，请领取额度';break;
        case 1:s='等待发放';break;
        case 2:s='已放款';break;
        case 3:s='超时未领，请重新申请';break;
      }
      if(this.quotaCfg.quotaFee===0&&this.quotaCfg.status===1){
        s='申请通过，请联系客服完成放款'
      }
      return s
    },
    specialQuota(){
      if(this.quotaCfg.quotaFee===0&&this.quotaCfg.status===1){
        return true
      }
    },

  },
  created(){
    // setTimeout(()=> {
    //   this.quotaCfg.quotaStatus=3
    // }, 3000);
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
    font-size: 0.24rem;
    margin:0.05rem 0;
  }
}

</style>
