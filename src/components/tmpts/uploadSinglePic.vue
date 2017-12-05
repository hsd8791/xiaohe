<template>
	<div class="input-file-box" >
		<!-- <div></div> -->
		<!-- accept只能过滤上传类型，限定需使用JS的正则表达式 -->
		<!-- <form action="http://hzg.he577.com/userInfo/addAccessory" enctype="multipart/form-data" method="post">  -->
		<div class="container-upload " v-loading='loading' :element-loading-text='loadingText'>
			
			<input type="file" name='imgFile' :id='uploadConfig.id' @change='changeP($event)' accept="image/*" >
			<div class="thumb"  @click.prevent='' :style="{backgroundImage: 'url('+urlPic+')'}">
				
				<!-- <img class="img" :src="urlF" v-if='urlF'> -->
			</div>
			<p class="label-text">{{label}}</p>
			<div  class='img-ctrl-btn' type='success'  @click='reUpload'>{{urlF?'重新上传':'点击上传'}}</div>
			<!-- 	<el-button class='img-ctrl-btn' :disabled='!urlF||!editing' type='warning' @click.prevent='deleteP($event)' v-if='editing'>删除</el-button>
				<p></p>
				<el-button class='img-ctrl-btn' :disabled='!urlF||!editing' type='success' @click.prevent='submit($event)' v-if='editing'>上传</el-button> -->
			<label :for="uploadConfig.id" class="label" v-if='!urlF'> 
				<!-- <add-btn class='select'></add-btn>  -->
			</label>

		</div>
		<remind :remind='remind'></remind >

	<!-- 		
			<span class='file-name'>{{fileName}}</span>
			<input type="text" name='type' value="0">
			<div class='delete' @click.prevent='deleteP($event)'>delete</div> -->


			<!-- <input type="submit" name=''  class="submit"> -->
			<!-- </form> -->
		<!-- <el-button type='success'  v-if='editing' @click='submit'>提交</el-button>
		<el-button type='warning'  v-if='!editing' @click='edit'>修改</el-button>
		<remind :remind='remind'></remind> -->
	</div>

</template>

<script>
	import bus from '../../bus.js'
	// import '../../css/input.css'
	import publicFun from '../../js/public.js'
	import remind from './remind.vue'
	import addBtn from './add-btn.vue'
	export default {
		data() {
			return {
				loadingText:'请稍后',
				fileImg:null,
				editing: true,
				loading: false,
				fileName: '',
				response:null,
				// url:'userInfo/addAccessory',
				urlF: '',
				remind: {
					isShow: false,
					remindMsg: 'remind',
					self_: this,
					remindOpts: [{
						msg: '确定',
					}, ],
				},
				testdata:null,
				input:null,
			}
		},
		props:{
			uploadConfig:{},
			picHolderUrl:{
				default:require('../../assets/xh/id-front.png')
			},
			label:{
			  default:'请上传'
			},
      // {url:'userInfo/addAccessory',data:{type:0},resKey:'idcardUrl',id:'IDscanFront'},
    },
    methods: {
    	reUpload:function(){
    		// console.log('test test')
    		this.edit()
    		this.deleteP()
    	},
    	submit(){
    		var formData = new FormData();
    		var cfg=this.uploadConfig
    		formData.append('imgFile',this.input.files[0])

    		for(let key in cfg.data){
    			formData.append(key,cfg.data[key])
    		}
    		// console.log('formData',formData) // sorry this can't work
    		var xhr=new XMLHttpRequest()
    		xhr.withCredentials = true;  
    		xhr.open('post',this.$http.options.root+'/'+cfg.url)
    		// xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    		xhr.addEventListener('readystatechange',()=>{
    			if(xhr.readyState===4&&xhr.status===200){
    				console.log('success',xhr.response)
	    			this.response={}
	    			this.response.body=JSON.parse(xhr.response)
    				// console.log('this,response',JSON.parse(xhr.response))    			
    				publicFun.postRes(this.response,this)
    			}
    			console.log('xhr ready change')
    			console.log('xhr',xhr.readyState)
    			console.log('xhr',xhr.response)
    			console.log('xhr',xhr)
    		},false)
    		xhr.onerror=function(e){
    			console.log('error',e)
    		}
    		xhr.onloadstart=function(){
    			console.log('start upload')
    		}
    		
					if (!xhr.upload) {
						console.log('xhr.upload error')
					} else {
						if (xhr.upload.onprogress === undefined) {
							console.log('xhr.upload.onprogress error')
						} else {
							xhr.upload.addEventListener("progress", (e) => {
								console.log('progress', e)
								var percentage = Math.round((e.loaded * 100) / e.total);
								this.loadingText = percentage + '%'
								console.log('loaded', percentage)
							})
						}
					}
				
    		
    		// xhr.
    		// xhr.upload.addEventListener("progress", function(e) {
    			// if (e.lengthComputable) {

    			// 	console.log('progrssing')
    			// }
    		// }, false);
    		xhr.send(formData)
    		this.loading=true
    		// publicFun.post(cfg.url, formData, this,()=>{
    		// 	console.log('success')
    		// } )  
    	},
    	get(){
    		var cfg=this.uploadConfig
				// console.log('cfg',cfg)
				publicFun.get(cfg.url, this,()=>{
					// console.log('response',this.response)
					var res=this.response.body.data
					// console.log('this.url',this.urlF,res.idcardUrl)
					if(res){
						this.urlF=res[cfg.resKey]
					}
					if(!this.urlF){
						this.editing=true
					}
				})
			},
			edit:function($event){
				// console.log('editing')
				this.editing=true
				// this.input.value = ''
				this.urlF = ''
				this.fileName = ''
			},
			changeP: function($event) {
				var input = $event.target.parentElement.parentElement.getElementsByTagName('input')[0]
				console.log('input.files[0].size',input.files[0].size)
				console.log('input.files[0].size',input.files[0].type)
				if(input.files[0].size>3*1024*1024-10){
					var r = this.remind
					r.remindMsg='大小不得超过3M'
					r.isShow=true
					return
				}
				// console.log(' $event.target.parentElement', $event.target.parentElement.parentElement)
				// console.log(' $event.target', $event.target)
				// console.log('input',input)
				this.input=input
				var urlF = this.getFileUrl(this.input)
				this.fileImg=urlF
				this.submit()
				var outer = input.parentElement
					// var img=outer.getElementsByTagName('img')[0]
					// var name=outer.getElementsByTagName('span')[0]
					// console.log('url',urlF)
					// console.log('changed', input.files[0].name)
					// console.log('img',img)
					this.fileName = input.files[0].name
					this.urlF = urlF
					outer.removeChild(input)//避免卡顿
					setTimeout(function() {
						outer.appendChild(input)
					}, 30);
				},
				deleteP: function() {
					// console.log('delete',$event.target.parentElement.parentElement)
					// var outer = $event.target.parentElement
					// var input = outer.getElementsByTagName('input')[0]
					// var img=outer.getElementsByTagName('img')[0]
					// console.log('input',input)
					// console.log('input',input.files[0].name)
					if(this.input){
						this.input.value = ''
					}
					this.urlF = ''
					this.fileName = ''

				},
			getFileUrl: function(input) { //缩略图
				var urlF;
				if (navigator.userAgent.indexOf("MSIE") >= 1) {
					urlF = input.value;
				} else if (navigator.userAgent.indexOf("Firefox") > 0) {
					urlF = window.URL.createObjectURL(input.files.item(0));
				} else if (navigator.userAgent.indexOf("Chrome") > 0) {
					urlF = window.URL.createObjectURL(input.files.item(0))
				} else {
					urlF = window.URL.createObjectURL(input.files.item(0))
				}
				return urlF;
			}
		},
		computed:{
		  urlPic(){
		    return this.urlF||this.picHolderUrl
		  },
		},
		created:function(){
			// this.testdata=new FormData()
			// this.testdata.append('testkey','testvalue')
			// console.log('this',this)
			// console.log('this',this.$el)
			// console.log('parent',this.$parent)
			// console.log('this',this.$data)
			this.get()
			
			// console.log('this.$el',this)
			// console.log('this.$el',this.$el)
			// this.input=this.$el.getElementsByTagName('input')[0]
		},
		events: {},
		components: {
			remind:remind,
			'add-btn':addBtn,
		}
	}
</script>

<style lang='scss' scoped>
/*	form{
		position: relative;
		border:1px solid cyan;
	}*/
	
	$outerHeight:0.8rem;
	$outerWidth:100%;
	$boxSize:0.6rem;
	*{
		/*border:1px solid red;*/
	}
	input,label{
		-webkit-tap-highlight-color:transparent;
	}
	input{
		height: 0;
		width: 0;
		/*height: $outerHeight;*/
		line-height: 1;
		/*width: 100%;*/
		position: absolute;
		top: 0;
		opacity: 0;
		z-index: -1;
	}
	div.container-upload{
		border:1px solid transparent;
		width: 100%;
		height: 100%;
		position: relative;
		.thumb{
			width:1.13rem;
			height: 0.66rem;
			/*border:1px solid red;*/
		}
		.thumb{
			background:url(#) no-repeat center center;
			background-size: contain;
			position: relative;
			margin: 0 auto;
			margin-top: 0.2rem;
		}
		.label{
			display: block;
			/*background: rgba(0,222,0,0.1);*/
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;left: 0;
			&:active{
				background:rgba(0,0,0,0.1);
			}
		}
		.label-text{
			font-size: 0.16rem;
			color:#383838;
			margin-top: 0.14rem;
			line-height: 1;
		}
		.img-ctrl{
			
		}
		.img-ctrl-label{
		
		}
		.img-ctrl-btn{
			padding: 0.07rem;
			line-height: 1;
			font-size: 0.13rem;
			color:#5494f3;
		}
	}

	.input-file-box{
		width:1.87rem;
		height: 1.44rem;
	}
</style>
