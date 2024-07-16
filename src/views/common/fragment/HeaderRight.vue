<!-- 顶栏右侧部分 -->
<template>
  <el-menu mode="horizontal" :class="['ele-header-right',{'ele-menu-dark':$store.state.theme.headStyle!==0}]">
    <!-- <el-menu-item index="full" @click="fullScreen">
      <i :class="isFullScreen?'el-icon-_screen-restore':'el-icon-_screen-full'"></i>
    </el-menu-item>
    <el-menu-item index="notice">
      <ele-notice/>
    </el-menu-item> -->

    <div style="display:inline-block;font-weight:600">当前游戏：</div>
    <el-submenu index="game" popper-class="ele-menu-pop" >
      <template slot="title">
        <span>{{ handleGame(user.gameId) }}</span>
      </template>
      <el-menu-item v-for="(item,index) in user.game_list"  :key="index" @click="changeGame(item.gameId)"><span>{{item.name}}</span></el-menu-item>
    </el-submenu>



    <el-submenu index="user" popper-class="ele-menu-pop">
      <template slot="title">
        <el-avatar :src="user.avatar"/>
        <span>{{ user.realname || '' }}</span>
      </template>
      <el-menu-item index="password" @click="showPassword"><i class="el-icon-key"></i><span>修改密码</span></el-menu-item>
      <el-divider/>
      <el-menu-item index="logout" @click="logout"><i class="el-icon-switch-button"></i><span>退出登录</span></el-menu-item>
    </el-submenu>
    <el-menu-item index="more" v-if="$setting.showSetting" @click="showSetting">
      <i class="el-icon-_more"></i>
    </el-menu-item>
  </el-menu>
</template>

<script>
// import EleNotice from './Notice'

export default {
  name: "EleHeaderRight",
  components: {},
  data() {
    return {
      isFullScreen: false  // 是否全屏
    }
  },
  computed: {
    user() {  // 当前登录用户信息
      return this.$store.state.user.user || {};
    }
  },
  methods: {
    /* 退出登录 */
    logout() {
      this.$confirm('确定要退出登录吗?', '提示', {type: 'warning'}).then(() => {
        this.$http.get('/index/logout').then((res) => {
          if (res.data.code === 0) {
            localStorage.removeItem('user');
            this.$message({type: 'success', message: '注销成功'});
            // 清除缓存的token
            this.$store.dispatch('user/setToken').then(() => {
              // this.$router.push({path: "/login"});
              window.location.replace('/');
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }).catch(() => 0);
    },

    /* 打开修改密码弹窗 */
    showPassword() {
      this.$store.dispatch('theme/toggle', 'showPassword');
    },
    /* 打开主题设置 */
    showSetting() {
      this.$store.dispatch('theme/toggle', 'showSetting');
    },
    /* 全屏 */
    fullScreen() {
      this.isFullScreen = !this.$util.fullScreen();
      if (!this.$setting.watchResize) this.$store.dispatch('theme/set', {
        key: 'screenWidth', value: document.documentElement.clientWidth || document.body.clientWidth
      });
    },

    getUserInfo() {
      if (this.$setting.userUrl) {
        this.$http.get(this.$setting.userUrl).then(res => {
          if (res.data.code === 0) {
            if (this.$setting.parseUser) {
              res.data = this.$setting.parseUser(res.data);
            }
            this.form = JSON.parse(JSON.stringify(res.data.data))
            let user = res.data.data;
            this.$store.dispatch('user/setUser', user);
            this.$store.dispatch('user/setRoles', user ? user.roles : null);
            this.$store.dispatch('user/setAuthorities', user ? user.authorities : null);
            // window.location.reload()
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    changeGame(gameId){
      this.$http.post('/index/setGame',{gameId}).then(res=>{
        if(+res.data.code===0){
          this.getUserInfo()
        }else{
          this.$message.error(res.data.message);
        }
      }).catch(err=>{
        this.$message.error(err.message);
      })
    },
    handleGame(gameId){
      if(this.user.game_list == undefined){
        return ""
      }
      if(!this.user.game_list.length) return this.$message.error('无法获取您的游戏权限，请联系管理员');
      if(!gameId){
        // gameId = this.user.game_list[0].gameId
        return this.changeGame(this.user.game_list[0].gameId)
      }
      let gameName
      if(gameId){
        const gameObj = this.user.game_list.find(item=>{
          return item.gameId === gameId
        })
        if(!gameObj){
          this.$message.error('游戏权限已变更，为您自动切换已有权限的游戏，若有疑问请联系管理员');
          localStorage.removeItem('user');
          return this.changeGame(this.user.game_list[0].gameId)
        }
        gameName = gameObj.name
      }else{
        gameName = ''
      }
      return gameName
    },

  }
}
</script>
