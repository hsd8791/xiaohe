import fetch from './../js/fetch.js'
let store = {
  namespaced: true,
  state: {
    idcardUrl:'',
    idcardUrl2:'',
    idcardUrl3:'',
    sjmhSimTask:'',
    contactPath:'',
  },
  getters:{
    idCarduploaded(state){
      return state.idcardUrl && state.idcardUrl2 && state.idcardUrl3
    },
    shujumoheAuthed(state){
      return state.sjmhSimTask && state.sjmhSimTask.status === "success"
    },
    taobaoAuthed(state){
    },
    contactsUploaded(state){
      return state.contactPath
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
