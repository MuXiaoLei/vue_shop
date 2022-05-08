import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* 引入富文本框 */
import VueQuillEditor from 'vue-quill-editor'
/* 引入富文本框样式 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {Button,Form,FormItem,Input,Header,
    Container,Aside,Main,Breadcrumb,BreadcrumbItem,
    Menu,Submenu,MenuItemGroup,MenuItem,Row,
    Col,Card,MessageBox,Message,Table,TableColumn,
    Switch,Tooltip,Pagination,Dialog,Option,Select,
    Tag,Tree,Cascader,Alert,Tabs,TabPane,Steps,Step,
    Checkbox,CheckboxGroup,Upload,Timeline,
    TimelineItem  } from 'element-ui';

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
Vue.use(Alert),
Vue.use(Tabs),
Vue.use(TabPane),
Vue.use(Steps),
Vue.use(Step),
Vue.use(Checkbox),
Vue.use(CheckboxGroup),
Vue.use(Upload),
Vue.use(Timeline),
Vue.use(TimelineItem),

Vue.filter('filterDate',function(originVal){
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2,'0')
    const d = (dt.getDate() + '').padStart(2,'0')

    const hh = (dt.getHours() + '').padStart(2,'0')
    const mm = (dt.getMinutes() + '').padStart(2,'0')
    const ss = (dt.getSeconds() +'').padStart(2,'0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(VueQuillEditor),

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
