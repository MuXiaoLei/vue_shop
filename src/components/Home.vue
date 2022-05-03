<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/images/heima.png" alt="图标" />
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="butInfo">退出</el-button>
        </el-header>
        <el-container>
            <!-- 左侧导航区 一级导航-->
            <el-aside :width="iscollapse?'64px':'200px'">
                <div @click="buttonmenu">|||</div>
                <el-menu
                    background-color="#333743"
                    text-color="#fff"
                    active-text-color="#409eff"
                    unique-opened
                    :collapse='iscollapse'
                    :collapse-transition='false'
                    router
                    :default-active='activePath'
                >
                    <el-submenu :index="sublist.id+''" v-for="sublist in menulist" :key="sublist.id">
                        <template slot="title">
                            <i :class="iconFontObj[sublist.id]"></i>
                            <span>{{sublist.authName}}</span>
                        </template>
                        <!-- 二级导航 -->
                        <el-menu-item-group>
                            <el-menu-item 
                            :index="'/'+itemlist.path" 
                            v-for="itemlist in sublist.children"
                            :key="itemlist.id"
                            @click="saveNavState('/'+itemlist.path)">
                                <i class="el-icon-menu"></i>
                                <span>{{itemlist.authName}}</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                   
                </el-menu>
            </el-aside>
            <!-- 内容区 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "Home",
    data(){
        return{
             /* 左侧数据 */
            menulist:[],
            iconFontObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
            },
            iscollapse:false,
            activePath:'',
        }
    },
    created(){
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        butInfo() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getMenuList(){
            const {data : res} =  await this.$http.get('menus');
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menulist = res.data
        },
        /* 点击按钮,切换菜单栏折叠与展开 */
        buttonmenu(){
            this.iscollapse = !this.iscollapse;
        },
        /* 保存连接激活状态 */
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath
        }
    },
};
</script>

<style lang="less" scoped>
/* 头部样式 */
.el-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        > span {
            margin-left: 15px;
        }
    }
}
.el-aside {
    background-color: #333743;
    >div{
        color: white;
        text-align: center;
        letter-spacing : 0.2em;
        cursor: pointer;
    }
    >.el-menu{
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
/* 左侧样式 */
i{
    margin-right: 10px;
    font-size: 20px;
}

</style>