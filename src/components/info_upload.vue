<template>

<!-- <<<<<<< HEAD
  <div id="uploadVue" class="input fixed-title-page">
    <h1 class="title"><app-back></app-back>附件上传</h1>
======= -->
  <div id="uploadVue" class="">
    <!-- <h1 class="title"><app-back></app-back>附件上传</h1> -->
<!-- >>>>>>> master -->
  <div class="upload-container">
    <pic-load :uploadConfig='uploadConfig[0]' :label="'身份证正面'" :picHolderUrl='pics.front'></pic-load>
    <div class="border"></div>
    <pic-load :uploadConfig='uploadConfig[1]' :label="'身份证背面'" :picHolderUrl='pics.back'></pic-load>
  </div>
  <div class="upload-container">
    <pic-load class='single-upload-item' :uploadConfig='uploadConfig[2]' :label="'手持身份证照片'" :picHolderUrl='pics.hold'></pic-load>
  </div>
    <!-- <el-button type='success' @click='goBack'>返回</el-button> -->
    <!-- <div class="container"> -->
    <!-- </div> -->
  </div>

</div>
</template>

<script>
  import picLoad from './tmpts/uploadSinglePic.vue'
  import publicFun from '../js/public.js'
  export default {
    data() {
     return {
      orientedAdd:'',
      IDscanFront:[],
      imgHoldID:[],
      pics:{
        front:require('../assets/xh/id-front.png'),
        back:require('../assets/xh/id-back.png'),
        hold:require('../assets/xh/id-hold.png'),
      },
      uploadConfig:[
      {url:'userInfo/addAccessory',data:{type:0},resKey:'idcardUrl',id:'IDscanFront'},
      {url:'userInfo/addAccessory',data:{type:2},resKey:'idcardUrl3',id:'IDscanBack'},
      {url:'userInfo/addAccessory',data:{type:1},resKey:'idcardUrl2',id:'imgHoldID'},
      ]

    }
  },

  methods:{
    goBack(){
      publicFun.goPage(-1)
    }
  },
  events: {},
  components: {
    'pic-load':picLoad
  }
}
</script>

<style lang='scss' scoped>
  *{
    /*border:1px solid red;*/
  }
  .upload-container{
    display: flex;
    border:0px solid #d3d3d3;
    border-bottom-width: 1px;
    position: relative;
    background: #fff;
    .border{
      height: 0.94rem;
      background: #d3d3d3;

      position: absolute;
      width: 1px;
      top: 0;left: 0;
      right: 0;bottom: 0;
      margin: auto;

    }
    &:last-child{
      border-bottom-width: 0px;
    }
  }
  .single-upload-item{
    margin: 0 auto;
  }
</style>
