<template>
	<div id="index0Vue">

	<!--<div class="title">这是div模式选项卡中的第1个子页面.</div>
	<div class="title">何谓div模式的选项卡？
		其实就是通过DIV模拟一个独立页面，通过DIV的显示、隐藏模拟不同页面的切换，典型的SPA模式；</div>
	<div class="title">
		这种模式适合简单业务系统，因为每个选项卡内容要写在一个DIV中，
		若逻辑复杂，会导致当前页面DOM结构繁杂，造成webview响应缓慢，甚至崩溃；
		因此若系统较复杂，需要下拉刷新等操作，推荐使用webview模式的选项卡；</div>-->
	<img class="banner" src="../assets/img/banner.jpg"/>
	<div class="box">
		<img :src='pics.logo'  v-if='___logo!==false'   alt="" class="sub-banner" />
		<p class="slogan" v-if='___logo!==false' >安全 · 快速 · 便捷</p>
    <div class="logo-holder sub-banner"  v-if='___logo===false'></div>
		<div class="mybtn" id="newBorrow" @click="user" v-if='isNewer'>
			开始{{___loanName}}
			<!--<img src="../assets/img/oldCustomer.png"/>-->
		</div>
		<div class="mybtn" id='oldBorrow' @click='dealBill' v-if='!isNewer'>
			欢迎回来
		</div>
    <img :src="pics.qrcode"  v-if='___logo!==false'class="xh-public-qr">
    <p class="slogan" v-if='___logo!==false'>{{___companyName}} · 微信服务号</p>

		<!-- <div class="mybtn" id="oldBorrow" @click="user(1)"> -->
			<!-- 老用户 -->
			<!--<img src="../assets/img/oldCustomer.png"/>-->
		<!-- </div> -->
	</div>
	<remind :remind='remind'></remind>
		
	</div>
</template>

<script>
import publicFun from '../js/public.js'
import bus from '../bus.js'
export default {
  data() {
    return {
      pics:{
        logo:this.___logo!==false?require("../assets/img/logo"+this.___logo+".png"):'#',
        qrcode:this.___logo!==false?require("../assets/img/xh_public_qr"+this.___logo+".jpg"):'#',
      },
      
    	isNewer:false,
      response:null,
      loading:true,
      editing:true,
      noFromRoute:false,
      backAfterPost:false,// watch out
      urlLendInfo:'accounting/myLendInfo?lendingUid=1',
      urlApply:'lendApply/borrowLoanRecords?limit=1&lendingUid=1',
      // urlSales:'qudao/pv?qudao=',
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
  created(){
  	this.checkNewer()
  },
  beforeRouteEnter (to, from,next){
  	console.log('to',to)
  	console.log('from',from)
  	
  	next(vm=>{
  		if(!from.name){
  			vm.noFromRoute=true
  		}
  	})
  },
  methods:{
  	// fromSales(w){
	  // 	sessionStorage.setItem('salesWay',w)
  	// 	console.log('sales URL',this.urlSales+w)
  	// 	publicFun.get(this.urlSales+w,this,()=>{

  	// 	})
  	// },
  	noNewerRedirect(){
  		if(this.noFromRoute){
 				publicFun.goPage('/loan_bill')
  		}
  		// if(bus.firstEnterApp){
  		// 	publicFun.goPage('/loan_bill')
  		// 	bus.firstEnterApp=false
  		// }
  	},
  	checkNewer(){
  		publicFun.get(this.urlLendInfo,this,()=>{
  			console.log('this',this.response)
  			if(this.response.body.data){
  				this.isNewer=false
  				this.noNewerRedirect()

  			}else{
  				publicFun.get(this.urlApply,this,()=>{
  					console.warn('this urlApply',this.response)
  					if(this.response.body.data.data.length){
  						this.isNewer=false
  						this.noNewerRedirect()
  					}else{
  						this.isNewer=true
  					}
  				})
  			}
  		})
  		
  	},

  	dealBill(){
  		publicFun.goPage('/loan_bill')
  	},
  	user() {
					publicFun.goPage('/index/apply_borrow')
					// if(index == 0) {
					// 	//新用户
					// 	// sessionStorage.setItem("oldman","no");
					// 	// if(limitFlag) {
					// 	// 	alert("系统正在维护中，开放时间10:00～17:00");
					// 	// 	return;
					// 	// }
					// 	// window.location = "newCustomer.html";
					// } else if(index == 1){
					// 	//老用户
					// 	// sessionStorage.setItem("oldman","yes");
					// 	// if(limitFlag) {
					// 	// 	alert("系统正在维护中，开放时间10:00～17:00");
					// 	// 	return;
					// 	// }
					// 	window.location = "oldCustomer.html";
					// } else {
					// 	window.location = "oldCustomer2.html";
					// }
				},
  },
  events: {},
  components: {}
}
</script>

<style lang='scss' scoped>
#index0Vue{
	.banner{
		width: 100%;
	}
	.box {
		padding: 0 80px 30px;
		.sub-banner{
			margin-top: 40px;
			width: 55%;
		}
	}
  .xh-public-qr{
    width: 80%;
  }
	#newBorrow {
	    border: 1px solid #e71419;
	    padding: 16px 0;
	    margin: 0.4rem 0;
	    font-family: "microsoft yahei";
	    font-size: 20px;
	    font-weight: 700;
	    color: #e71419;
	}
	#oldBorrow{
		border: 1px solid #e49731;
		padding: 16px 0;
    margin: 0.4rem 0;
		font-family: "microsoft yahei";
		font-size: 20px;
		font-weight: 700;
		color: #e49731;
	}
  .logo-holder{
    height: 0.5rem;
  }
	.slogan{
		margin-top: 0;
    margin-bottom: 10px;
    color: #8f8f94;
    /*padding-bottom: 0.4rem;*/
    font-size: 12px;
	}
	.mybtn {
    border-radius: 10px;
	}
}
</style>
