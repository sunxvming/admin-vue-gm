<!-- 顶栏 -->
<template>
  <div :class="['ele-admin-header',{'ele-bg-primary':theme.headStyle===2}]">
    <div class="ele-admin-logo"><img src="@/assets/logo.png" alt="logo"/><span>{{ $setting.name }}</span></div>
    <!-- 左侧功能区 -->
    <el-menu v-if="showLeft" mode="horizontal" :class="['ele-header-left',{'ele-menu-dark':theme.headStyle!==0}]">
      <el-menu-item index="fold" @click="collapse"><i :class="theme.collapse?'el-icon-_unfold':'el-icon-_fold'"></i>
      </el-menu-item>
      <el-menu-item index="refresh" @click="refresh"><i class="el-icon-refresh-right"></i></el-menu-item>
    </el-menu>
    <ele-breadcrumb v-if="theme.layoutStyle===0"/><!-- 面包屑导航 -->
    <ele-header-nav v-if="theme.layoutStyle!==0"/><!-- 顶部菜单区 -->
    <div class="ele-admin-logo2"><span>设计实现者：
      <b>孙旭明</b></span></div>
    <ele-header-right/><!-- 右侧功能区 -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import EleBreadcrumb from './Breadcrumb'
import EleHeaderNav from './HeaderNav'
import EleHeaderRight from '../fragment/HeaderRight'
import NProgress from "nprogress"

export default {
  name: "EleHeader",
  components: {EleBreadcrumb, EleHeaderNav, EleHeaderRight},
  data() {
    return {}
  },
  computed: {
    showLeft() {  // 是否显示左侧部分menu
      return this.theme.layoutStyle !== 1 || this.theme.screenWidth < 768;  // 小屏幕强制显示
    },
    ...mapGetters(['theme'])
  },
  methods: {
    /* 折叠 */
    collapse() {
      this.$store.dispatch('theme/toggle', 'collapse');
    },
    /* 刷新 */
    refresh() {
      NProgress.start();
      if (this.theme.reload) return;
      this.$store.dispatch('theme/toggle', 'reload');
      this.$nextTick(() => {
        this.$store.dispatch('theme/toggle', 'reload');
        setTimeout(() => {
          NProgress.done();
        }, 150);
      });
    }
  }
}
</script>


<style >
.ele-admin-logo2 {
    color: rgba(0, 0, 0, 0.75);
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 1.5px;
    width: 256px;
    height: 60px;
    background-color: #FFFFFF;
    transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
    box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.08);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
}



</style>