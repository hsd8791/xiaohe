import fetch from './../js/fetch.js'
let store = {
  namespaced: true,
  state: {
    idcardUrl:'',
    idcardUrl2:'',
    idcardUrl3:'',
    sjmhSimTask:null,
    sjmhTaobaoTask:null,
    sjmhZfbTask:null,
    contactPath:'',
    name:'',
    idcardNum:'',
    acQq:'',
    acWechat:'',
    zmxyScore:'',
    zmxyScore2:'',
  },
  getters:{
    baseInfoCompleted(state) {
      let s = state
      // console.log(s.name ,s.idcardNum ,s.acQq ,s.acWechat ,s.zmxyScore ,s.zmxyScore2)
      return !!(s.name && s.idcardNum && s.acQq && s.acWechat && s.zmxyScore && s.zmxyScore2)
    },
    idCarduploaded(state){
      return !!(state.idcardUrl && state.idcardUrl2 && state.idcardUrl3 )
    },
    shujumoheAuthed(state){
      return !!(state.sjmhSimTask && state.sjmhSimTask.status === "success" )
    },
    taobaoAuthed(state){
      return !!(state.sjmhZfbTask && state.sjmhZfbTask.status === "success")
    },
    zfbAuthed(state){
      return !!(state.sjmhTaobaoTask && state.sjmhTaobaoTask.status === "success")
    },
    contactsUploaded(state){
      return !!(state.contactPath )
    },
  },
  mutations: {
    extractAuthInfo(state,info){
      for(let key in state){
        state[key] = info[key]
      }
    },
    setAuthInfo(state,info){
      for(let key in info){
        state[key] = info[key]
      }
    },
  },
  actions: {
    getAllInfo({commit}) {
      fetch({
        url:'userInfo/auth',
      })
      .then((res) => {
        console.log('res get all info',res)
        commit('extractAuthInfo',res)
      })
    },
  }
}

export default store
