// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)
import 'element-ui/lib/theme-default/index.css'
import router from './router'
import VueResource from 'vue-resource'
import publicFun from './js/public.js'
import remind from './components/tmpts/remind.vue'
import back from './components/tmpts/route_back.vue'
import choose from './components/tmpts/choose_remind.vue'
import bindCard from './components/views/card_bind.vue'
import select from './components/tmpts/select.vue'
import inputLogin from './components/tmpts/input-login.vue'
// import record from './components/tmpts/record.vue'
import bus from './bus.js'

Vue.use(VueResource)
Vue.component('remind', remind)
Vue.component('app-back', back)
Vue.component('app-choose', choose)
Vue.component('app-bind-card',bindCard)
Vue.component('app-select',select)
Vue.component('app-input-login',inputLogin)
// Vue.component('app-record', record)

Vue.config.productionTip = false
Vue.http.options.credentials = true;
Vue.http.options.emulateJSON = true;

if(/test\/xh/.test(location.href)){
	Vue.http.options.root = 'http://hzg.he577.com/test';
}else{
	Vue.http.options.root = 'http://hzg.he577.com';
}
// Vue.http.options.root = 'http://hzg.he577.com';
// Vue.http.options.root = 'http://hzg.he577.com/test';
import {
	Button,
	Select,
	Input,
	Loading,
	Collapse,
	// Upload,
	Checkbox,
	// CollapseItem,
	Option,
} from 'element-ui'
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Loading.directive)
// Vue.use(Collapse)
// Vue.use(Upload)
Vue.use(Checkbox)
// Vue.use(CollapseItem)
Vue.use(Option)
Vue.prototype.$loading = Loading.service
Vue.directive('scroll-load', {
	bind: function(el, binding, vnode) {
		el.addEventListener('scroll', () => {
				// console.log('scrolling')
				// console.log('binding value', binding.value)
				var value = binding.value
					// binding.value.crrtPage++
				var el = document.querySelector('.list-container-inner')
				var btt = el.getBoundingClientRect().bottom
					// console.log('btt',btt)
				if (btt < (screen.height + 50)) {
					value.method()
				}
			}, false)
			// console.log('value', this)
	}
})
// Vue.directive('select',{
// 	bind: function(el, binding, vnode) {
// 		console.warn('el',el,binding.value)
// 		let valueName=binding.expression
// 		vnode.componentInstance.selectValue=binding.value
// 		// let select=el.getElementsByClassName('select__')[0]
// 			// console.log('',select.value,select.selectedIndex,valueName)
// 		// select.addEventListener('change',(e)=>{
// 		// 	// alert('test change',select.value)
// 		// 	console.log('e',select.value,vnode.componentInstance)
// 		// 	console.log('valueName',valueName)
// 		// 	// nameArr=valueName.split('.')
// 		// 	// vnode.context.$parent.education=select.value
// 		// 	// vnode.education=select.value="opel
// 		// 	vnode.componentInstance.$parent[valueName]=select.value
// 		// 	// select.selectedIndex=0
// 		// })
// 	}
// })
Vue.directive('input',{
	bind: function(el, binding, vnode) {
		let valueName=binding.expression
		let input=el.getElementsByClassName('___input')[0]
		input.addEventListener('input',(e)=>{
			vnode.componentInstance.$parent[valueName]=input.value
		})
	}
})
var pathMap={
	'http://localhost:8000/xh':'xh',
	'http://localhost:8000/test/xh':'xh',
	'http://localhost:8000/test/xh2':'xh',
	'http://localhost:8000/xh2':'xh2',
	'http://hzg.he577.com/xh':'xh',
	'http://hzg.he577.com/test/xh':'xh',
	'http://hzg.he577.com/test/xh2':'xh',
	'http://hzg.he577.com/xhtest':'xh',
}
Vue.directive('inner-scroll',{
	bind:function(el,binding,vnode){
		var cfg = binding.value,
			containerTop = 0
			// console.warn('config', cfg)
			// console.warn('config', binding)
		var touch = {
			start: null,
			end: null,
			last: null,
			crrt: null,
		}
		var scrollTop,outer
		console.log('bindded v-inner-scroll')
		
		el.addEventListener('touchstart', (e) => {
			e.stopPropagation()
			touch.start = e.touches[0].clientY
			touch.last = e.touches[0].clientY
		}, false)
		el.addEventListener('touchmove', (e) => {
			e.stopPropagation()
			e.preventDefault()
			// console.log('e',e)
			touch.crrt = e.touches[0].clientY
			outer= e.currentTarget.parentElement
			// console.log('outer',outer)
			scrollTop =outer.scrollTop
			// console.log('outer.scrollTop',outer.scrollTop)
			bus.marketListScrollTop=outer.scrollTop
			if (scrollTop > 0) {
				var step = touch.crrt - touch.last
				outer.scrollTop-=step
				touch.last = touch.crrt
				return
			} else {
				if (touch.crrt <= touch.last) {
					if (containerTop === 0) {
						var step = touch.crrt - touch.last
						outer.scrollTop-=step
						touch.last = touch.crrt
						return
					} else {
						containerTop -= 0.025;
						el.style.paddingTop = containerTop + 'rem'

					}
				} else {
					// e.stopPropagation()
					// e.preventDefault()
					// containerTop += 0.025
					// el.style.paddingTop = containerTop + 'rem'
				}
			}
			touch.last = touch.crrt
		}, false)
		el.addEventListener('touchend', (e) => {
			e.stopPropagation()
			touch.end = e.changedTouches[0].clientY
		}, false)
	}
})
/* eslint-disable no-new */
var url=location.href
// console.log('host',url.slice(0,url.indexOf('#')-1))
var host=url.slice(0,url.indexOf('#')-1)

let path=pathMap[host]
console.log('img path',path)
Vue.prototype.___imgPath=path
Vue.prototype.___subName=path
Vue.prototype.___banner=process.env.banner
let str=JSON.stringify(process.env.PIC_SRC)

// console.log('JSON.stringify(process.env.PIC_SRC)',str)
// console.log('parsed str',JSON.parse(str))
// Vue.prototype.pics=JSON.parse(str)
Vue.prototype.pics=process.env.PIC_SRC
bus.testSrc="../assets/xh2/banner.png"

console.log('process',process.env)
if(process.env.NODE_ENV=="development"){
	// let path=pathMap[host]
	// Vue.prototype.___imgPath=path
	// Vue.prototype.___subName=path
	Vue.prototype.___testImgPath='xh2'
	// 
}else if(process.env.NODE_ENV==='production'){
	Vue.prototype.___testImgPath=process.env.COMPANY_NAME
}
console.log('__testImgPath',Vue.prototype.___testImgPath,process.env.NODE_ENV=="development")
new Vue({
	el: '#app',
	router,
	template: `<app></app>`,
	components: {
		app: App
	},
	methods: {

	},
	render: h => h(App),
})

// function test() {
// 	console.log('test global function')
// }