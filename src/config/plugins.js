/**
 * 引用框架
 */
import Vue from 'vue'
import './axios'
import setting from './setting'
import util from '@/utils/util'
import permission from '@/utils/permission'  // 角色权限控制
import gm from '@/utils/gm'  
// 第三方组件
import NProgress from 'nprogress'  // 顶部进度条
import 'nprogress/nprogress.css'
import VueClipboard from 'vue-clipboard2'  // 剪切板
// 扩展组件
import EleDataTable from '@/components/EleDataTable'  // 数据表格
import EleIconPicker from '@/components/EleIconPicker'  // 图标选择器
import EleAvatarList from '@/components/EleAvatarList'  // 头像列表
import EleDot from '@/components/EleDot'  // 状态文字
import EleResult from '@/components/EleResult'  // 操作结果
import EleTagsInput from '@/components/EleTagsInput'  // 标签输入框
import EleEmpty from '@/components/EleEmpty'  // 空视图
// UI框架
import ElementUI from 'element-ui'  // ElementUI
import 'element-ui/lib/theme-chalk/display.css'
import '@/styles/eleadmin/icon.scss'  // 图标
import '@/styles/eleadmin/index.scss'  // 样式
import {Base64} from 'js-base64'

Vue.prototype.$util = util;
Vue.prototype.$gm = gm;
Vue.prototype.$setting = setting;
Vue.prototype.$Base64 = Base64;
Vue.use(ElementUI, {size: 'medium'});
Vue.use(permission);
Vue.use(gm);
Vue.use(VueClipboard);
NProgress.configure({showSpinner: false});

/* 全局注册常用组件 */
Vue.component(EleDataTable.name, EleDataTable);
Vue.component(EleIconPicker.name, EleIconPicker);
Vue.component(EleAvatarList.name, EleAvatarList);
Vue.component(EleDot.name, EleDot);
Vue.component(EleResult.name, EleResult);
Vue.component(EleTagsInput.name, EleTagsInput);
Vue.component(EleEmpty.name, EleEmpty);

/** 添加全局过滤器 */
Vue.filter('timeAgo', (value, onlyDate) => {
    return util.timeAgo(value, onlyDate);
});
Vue.filter('digit', (value, length) => {
    return util.digit(value, length);
});
Vue.filter('toDateString', (value, format) => {
    return util.toDateString(value, format);
});
Vue.filter('toDateByTimezone', (value, format) => {
    return util.toDateByTimezone(value, format);
});

Vue.filter('toUtcSub8', (value) => {
    return util.toDateByTimezone(value, -8);
});

Vue.filter('activityFromUtcSub8', (s) => {
    if (s == '' || s == null || s == undefined) {
        return ''
    }    

    let tz = -8
    let ms = s.split('|')
    if(ms.length < 6){
        return s
    }
    ms[1]=parseInt(ms[1])-1
    let t = new Date(...ms.map(parseFloat))
    let t2 = new Date()
    t2.setTime((t.getTime()/ 1000 + tz*3600)*1000)
    t = t2
    return `${t.getFullYear()}|${t.getMonth()+1}|${t.getDate()}|${t.getHours()}|${t.getMinutes()}|${t.getSeconds()}`
});



Vue.filter('escape', (value) => {
    return util.escape(value);
});
Vue.filter('base64Encode', (value) => {
    return util.base64Encode(value);
});
Vue.filter('htmlToText', (value) => {
    return util.htmlToText(value);
});
