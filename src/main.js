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
import record from './components/tmpts/record.vue'
import choose from './components/tmpts/choose_remind.vue'
import bindCard from './components/views/card_bind.vue'
import radio from './components/tmpts/radio.vue'
import check from './components/tmpts/check.vue'
import bus from './bus.js'
// console.log('process.argv',process.argv)
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });
Vue.use(VueResource)
Vue.component('remind', remind)
Vue.component('app-back', back)
Vue.component('app-check', check)
Vue.component('app-radio', radio)
Vue.component('app-record', record)
Vue.component('app-choose', choose)
Vue.component('app-bind-card',bindCard)

Vue.config.productionTip = false
Vue.http.options.credentials = true;
Vue.http.options.emulateJSON = true;
// Vue.http.options.root = 'https://www.ho163.com/api';
Vue.http.options.root = 'http://hzg.he577.com';
// Vue.http.options.root = 'http://hzg.he577.com/test';
import {
	Button,
	Select,
	Input,
	Loading,
	Collapse,
	Upload,
	Checkbox,
	CollapseItem,
	Option,
} from 'element-ui'
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Loading.directive)
Vue.use(Collapse)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CollapseItem)
Vue.use(Option)
Vue.prototype.$loading = Loading.service
Vue.prototype.___logo=''
Vue.prototype.___companyName='柒彩虹'
Vue.prototype.___borrowText='我的借款'
Vue.prototype.___borrowText='我要收米'
Vue.prototype.___billName='借单'
Vue.prototype.___billName='收米'
Vue.prototype.___marketName='贷款超市'
Vue.prototype.___marketName='放米超市'
Vue.prototype.___loanName='借款'
Vue.prototype.___loanName='放米'
Vue.prototype.___daikuan='贷款'
Vue.prototype.___daikuan='放米'


document.querySelector('title').innerHTML='柒彩虹'
if(0){
// if(/qudao=A7NBVf/.test(location.href)){
	Vue.prototype.___logo='_wallet'
	Vue.prototype.___companyName='小禾钱包'
	Vue.prototype.___borrowText='我要收米'
	Vue.prototype.___billName='收米'
	Vue.prototype.___marketName='放米超市'
	Vue.prototype.___loanName='放米'
	document.querySelector('title').innerHTML='小禾钱包'
}
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