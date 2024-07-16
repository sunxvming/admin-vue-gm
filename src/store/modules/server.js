/**
 *
 */
import axios from 'axios'
// import setting from '@/config/setting'
// import util from '@/utils/util'

// let loginUser = {};
// try {
//     loginUser = JSON.parse(localStorage.getItem(setting.userStoreName) || '{}') || {};
// } catch (e) {
//     console.error(e);
// }

export default {
    namespaced: true,
    state: {
      serverList:[]
    },
    mutations: {
        SET: (state, obj) => {
            state[obj.key] = obj.value;
        },
        SET_SERVERLIST(state,data){
            state.serverList=data
        }
    },
    actions: {
        setServerList({commit},data){
            commit('SET_SERVERLIST',data)
        },
        getServerList(){
          // return new Promise((res,rej)=>{
            axios.get('/gm/serverlist').then(res=>{
              console.log(res)
            })
          // })
        }
    }
}

