<template>
	<div class="back">
		<span class='text' @click='back' :style="{'color':bindedColor}">{{remind}}</span>
		<!-- <div class="test" :class='testClass'>  -->
			<!-- <slot name='11' class='test'></slot> -->
		<!-- </div> -->
	</div>
</template>

<script>
	import publicFun from '../../js/public.js'
	export default {
		data() {
			return {
				bindedColor:"#fff",
			}
		},
		props:{
			text:{
				default:'首页',
			},
			link:{
				default:'/index',
			},
			type:{
				default:'none'
			},
			color:{},
			method:{

			},
			remind:{
				default:'返回'
			}
		},
		methods:{
			back(){
				if(this.method){
					console.log('back method',this.method)
					this.method()
					console.log('this.',this)
					return
				}
				// console.log('url',location.hash)
				var r=location.hash.replace("#",'')
				var arr=r.split('/')
				arr.pop()
				var newR=arr.join('/')
				publicFun.goPage(newR)
				// publicFun.goPage(-1)
			}
		},
		created(){
			if(this.color){
				this.bindedColor=this.color
			}
		},
		computed:{
			// testClass(){
			// 	var s
			// 	switch(this.type){
			// 		// case 'none':s='default' break;
			// 		case 'success':
			// 		s = 'success'
			// 		break;
			// 		case 'failure':
			// 		s = 'failure'
			// 		break;
			// 		default:
			// 		s = 'default'
			// 	}
			// 	return s
			// },
		},
		events: {},
		components: {}
	}
</script>

<style lang='scss' scoped>
	.back{
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 0.5rem;
		.text{
			height: 0.16rem;
			font-weight: normal;
			line-height: 1;
			font-size: 0.16rem;
			/*color:;*/
			position: absolute;
			display: block;
			margin:auto ;
			top: 0;right: 0;left: 0;bottom: 0;
		}
	}
	.test{
		color:red;
	}
/*	.success{
		background: green;
	}
	.failure{
		background: red;
	}
	.default{
		background: yellow;
	}*/
</style>
