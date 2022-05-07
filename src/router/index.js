import Vue from 'vue'
import VueRouter from 'vue-router'
//引用Login组件
import Login from '../components/Login'
import Home from '../components/Home'
import Welcom from '../components/Welcom'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/Categories'
import Params from '../components/goods/Params'
import Goods from '../components/goods/Goods'
import Add from '../components/goods/Add'

Vue.use(VueRouter)

const routes = [
    /* 重定向 */
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect:'/welcom',
        children: [
            { path: '/welcom', component: Welcom },
            { path:'/users',component:Users},
            { path:'/rights',component:Rights},
            { path:'/roles',component:Roles},
            { path:'/categories',component:Categories},
            { path:'/params',component:Params},
            { path:'/goods',component:Goods},
            { path:'/goods/add',component:Add},
        ]
    },
]

const router = new VueRouter({
    routes
})

/* 路由导航守卫 */
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    else {
        if (!window.sessionStorage.getItem('token')) return next('/login');
        else next();
    }
})

export default router
