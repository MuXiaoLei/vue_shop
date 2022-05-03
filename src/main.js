import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//element的c3样式
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import {Button,Form,FormItem,Input,Header,
    Container,Aside,Main,Breadcrumb,BreadcrumbItem,
    Menu,Submenu,MenuItemGroup,MenuItem,Row,
    Col,Card,MessageBox  } from 'element-ui';

import axios from 'axios';
//配置请求的根路径
axios.defaults.baseURL  = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.prototype.$http = axios;

Vue.prototype.$confirm = MessageBox.confirm ;
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'
//element使用
Vue.use(ElementUI);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header),
Vue.use(Container),
Vue.use(Aside),
Vue.use(Main),
Vue.use(Breadcrumb),
Vue.use(BreadcrumbItem),
Vue.use(Menu),
Vue.use(Submenu),
Vue.use(MenuItemGroup),
Vue.use(MenuItem),
Vue.use(Row),
Vue.use(Col),
Vue.use(Card),

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
