<template>
	<div id="cardBindView">
		<div class="input" v-loading='loading' element-loading-text='请稍后'>
        <img src="../../assets/xh/bankcard.png" alt="" class="card-pic">
      <div class="bankcard-container">
				<div class="horizontal-input-box">
          <label class="horizontal-label" :disabled='!editing'>姓名：</label> 
          <el-input :disabled='true'   placeholder=''  class='horizontal-input   name-box'v-model='name' @blur.once='blured'  :class='{"valid-border":nameValid,"error-border":!nameValid}'></el-input>
          <i class="icon-warning" @click='nameRemind'></i>
        </div>
  			<div class="horizontal-input-box">
  				<label class="horizontal-label" :disabled='!editing'>银行卡：</label> 
  				<el-input :disabled='false'  type='number' class='horizontal-input ' placeholder='仅支持储蓄卡' v-model='bankcard' @blur.once='blured'  :class='{"valid-border":bankcardValid,"error-border":!bankcardValid}'></el-input>
  				<!-- <i :class="{'el-icon-check':bankcardValid,'el-icon-close':!bankcardValid}"></i> -->
  			</div>
			</div>
        <p  class="card-remind">支持以下银行储蓄卡：</p>
        <p  class="card-remind">工商银行 / 农业银行 / 中国银行 / 建设银行 / 民生银行 /</p>
        <p  class="card-remind">储蓄银行 / 广发银行 / 光大银行 / 中信银行 / 华夏银行 /</p>
        <p  class="card-remind">兴业银行 / 交通银行 / 浦发银行 / 平安银行 / 招商银行 </p>
			<el-button type='success' :disabled='!bankcardValid' class='submit'  @click='submit'>提交</el-button>
		</div>
		<remind :remind='remind'></remind>
	</div>
</template>

<script>
import publicFun from '../../js/public.js'
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
  props:{
    callback:{
      default:()=>{

      }
    }
  },
  methods:{
  	submit(){
  		publicFun.get(this.url+this.bankcard,this,()=>{
  			let r=this.remind
  			r.remindMsg='绑定成功'
  			r.remindOpts=[{msg:'确定',callback:()=>{
          if(this.callback instanceof Function){
            this.callback()
          }
        }}]
  			r.isShow=true
  		})
  	},
    nameRemind(){
      let r=this.remind
      r.remindMsg='只能绑定本人的卡号用于支付和接受放款，如姓名有误请到认证信息中修改。'
      r.remindOpts=[{msg:'我知道了'}]
      r.isShow=true
    },
    getName(){
      publicFun.get('userInfo/identity',this,()=>{
        this.name=this.response.body.data.name
        console.log('res name and ..',this.response.body)
      })
    },
  	blured($event){
  		var el=$event.target.parentElement.parentElement
  		el.className+=' validate'
  	},
  },
  events: {},
  created(){
    this.getName()
  	publicFun.checkSession(this)
  },
  computed:{
  	bankcardValid:function(){
  		var reg=/\d/;
  		return reg.test(this.bankcard)
  	},
  },
  components: {}
}
</script>

<style lang='scss' >
#cardBindView{

}

#cardBindView{
  .card-remind{
    /*padding:0.1rem 0.2rem;*/
    margin:0.1rem 0.15rem;
    font-size: 0.14rem;
    text-align: left;
    line-height: 1;

    color: #999999;
  }
  .card-pic{
    width: 3.45rem;
    margin: 0.2rem 0;
  }
  .submit{
    margin-top: 0.6rem;
  }
  .icon-warning{
    display: block;
    height: 0.16rem;
    color:#09bb07;
    opacity: 1; 
    position: absolute;
    top: 0;bottom: 0;
    margin:auto 0;
    right: 0.1rem;
  }
  .bankcard-container{
    background: #fff;
    .name-box{
      input.el-input__inner{
        /*border:1px solid red;*/
        padding-right: 0.15rem;
      }
    }

   /* .input-box{
      height: 0.5rem;
      .label{
        position: absolute;
        left: 0;top: 0;
      }
    }*/
  }
}

</style>

