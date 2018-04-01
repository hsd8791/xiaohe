<template>
  <!-- <transition name='back'> -->

  <div id="footNav" class='foot-nav'>
      <span class='nav-btn' :class='{active:activeI===0}' @click='goPage(0)'>
         <div class="nav-icon"><i class="icon-home"></i></div>
         <div class="nav-item">首页</div>
     </span>
     <span class='nav-btn' :class='{active:activeI===1}' @click='goPage(1)'>
         <div class="nav-icon"><i class="icon-bookmarks"></i></div>
         <div class="nav-item">认证</div>
     </span>
     <span class='nav-btn' :class='{active:activeI===2}' @click='goPage(2)'>
         <div class="nav-icon"><i class="icon-file-text"></i></div>
         <div class="nav-item">{{___billName}}</div>
     </span>
     <span class='nav-btn' :class='{active:activeI===3}' @click='goPage(3)'>
         <div class="nav-icon"><i class="icon-user"></i></div>
         <div class="nav-item">我们</div>
     </span>
    <span class="nav-mid" @click='hzgMarket' v-if='showMarketLink'>
        <!-- <span class="txt"> -->
            {{___marketName}}
        <!-- </span> -->
    </span>
 </div>
 <!-- </transition> -->
</template>

<script>
import router from './router'
import bus from './bus.js'
export default {
    data: function() {
        return {
            activeI: 0,
            showFoot: true,
            showMarketLink:false,
            marketHideQudaos:['jEJree','n2MN3y'],
            // footActive:true,
            paths: [ //显示footnav的路径
                '/index0',
                '/index',
                '/loan_bill',
                '/introduce',
                '/',
            ],
        }
    },
    methods: {
        hzgMarket(){
            // console.log('hzg market_list')
            location.href='https://www.ho163.com/m/#/market_list'
        },
        goPage: function(index) {
            setTimeout(() => { //incase same foot component
                this.activeI = index
            }, 50);
            router.push(this.paths[index])
        },
        checkPath(p){
            //先判断是否显示
            //再判断显示哪个
            var arr=p.split('/')
            if(arr[2]!==undefined&&arr[2].length!==0){
                bus.$emit('foot_show_change',false)
                return
            }
            p='/'+arr[1]
            // console.log('? index',p.indexOf('?'))
            var queryMark=p.indexOf('?')

            if(queryMark>0){
                p=p.slice(0,queryMark)
            }

            // console.log('arr',arr)
            var index=this.paths.indexOf(p)
            // console.log('this.paths',p)
            if(index<0){
                bus.$emit('foot_show_change',false)
            }else{
                bus.$emit('foot_show_change',true)
                var splitPath=p.split('/')
                if(splitPath[1]===''){
                    this.activeI=0
                }else{
                this.activeI= this.paths.indexOf('/'+splitPath[1])
                }
            }

        },

    },
    // props:['activeI'],
    created: function() {
        router.beforeEach((to, from, next) => {
                // 先判断全路径
                // 1.判断前进还是后退
                //  下面代码
                // 2.判断是否显示foot
                // check path
                // if(!from.path){
                //     console.log('got the undefined path')
                //     next()
                // }
                
                var depthTo = to.path.split('/').length
                var depthFrom = from.path.split('/').length
               
                var action
                if (depthTo > depthFrom) {
                    action = 'forward'
                } else if (depthTo < depthFrom) {
                    action = 'back'
                } else {
                    action = 'samelevel'
                }
                // console.log('action', action)
                bus.$emit('url_change', action)
               
                this.checkPath(to.path)
                next()

            })
          
            var self_ = this
        // var url = location.href
        var urlPath = location.pathnname
        // console.log('location',location)
        var urlHash = location.hash
        urlHash = urlHash.replace('#', '')

       
        this.checkPath(urlHash)
        function checkHideLinkQudao(arrQudao){
            var strQudao=arrQudao.join(' ')
            return strQudao.indexOf(localStorage.qudao)>-1
        }
        if(!checkHideLinkQudao(this.marketHideQudaos)){
        if(localStorage.qudao==='000000'){
            this.showMarketLink=true
        }
        }else{
            let a=new Date(),
            h=a.getHours()
            if(h>=22||(h<8&&h>0)){
                this.showMarketLink=true
            }
        }
       
    },
    components: {}
}
</script>
<style lang='scss' scoped>
	.hide-foot{
		display: none;
	}
    .nav-mid{
        width: 0.5rem;
        height: 0.5rem;
        background: #d42e84;
        position: absolute;
        border-radius: 50%;
        top: -0.25rem;
        margin:0 auto;
        left: 0;right: 0;
        font-size: 0.13rem;
        line-height: 0.15rem;
        padding:0.1rem 0.1rem;
        /*padding:0.1rem;*/

        color: #fff;
        animation: beat infinite 1.5s linear;
    }
    @keyframes beat{
        0% {
            /*transform: scale(1);*/
            box-shadow: 0px 0px 2px #d42e84;
        }
        50% {
            /*transform: scale(0.9);*/
            box-shadow: 0px 0px 8px #d42e84;
        }
        100% {
            /*transform: scale(1);*/
            box-shadow: 0px 0px 2px #d42e84;
        }
    }
</style>

