// 加载Vue
import Vue from 'Vue';

// 加载App
Vue.component('App', () => import(/* webpackChunkName: 'App' */'$$'));

// 启用App
window.onload = () => new Vue({ el: 'app' });