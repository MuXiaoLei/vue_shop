import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {Button,Form,FormItem,Input,Header,
    Container,Aside,Main,Breadcrumb,BreadcrumbItem,
    Menu,Submenu,MenuItemGroup,MenuItem,Row,
    Col,Card,MessageBox,Message,Table,TableColumn,
    Switch,Tooltip,Pagination,Dialog,Option,Select,
    Tag,Tree,Cascader  } from 'element-ui';

import axios from 'axios';
//配置请求的根路径
axios.defaults.baseURL  = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.prototype.$http = axios;
/* 导入vue-table-with-tree-grid插件 */
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

Vue.prototype.$confirm = MessageBox.confirm ;
Vue.prototype.$message = Message;
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'


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
Vue.use(Table),
Vue.use(TableColumn),
Vue.use(Switch),
Vue.use(Tooltip),
Vue.use(Pagination),
Vue.use(Dialog),
Vue.use(Option),
Vue.use(Select),
Vue.use(Tag),
Vue.use(Tree),
Vue.use(Cascader),


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
