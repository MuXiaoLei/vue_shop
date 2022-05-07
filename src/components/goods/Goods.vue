<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片化 -->
        <el-card>
            <!-- 添加商品 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        clearable
                        v-model="queryInfo.query"
                        @clear="getGoodsList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getGoodsList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoods"
                        >添加商品</el-button
                    >
                </el-col>
            </el-row>
            <!-- 商品表格 -->
            <el-table :data="goodsList" style="width: 100%" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称">
                </el-table-column>
                <el-table-column
                    prop="goods_price"
                    label="商品价格(元)"
                    width="95px"
                >
                </el-table-column>
                <el-table-column
                    prop="goods_weight"
                    label="商品重量"
                    width="95px"
                ></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | filterDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteId(scope.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 8]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Goods",
    data() {
        return {
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5,
            },
            /* 商品列表 */
            goodsList: [],
            /* 总数据条数 */
            total: 0,
        };
    },
    created() {
        this.getGoodsList();
    },
    methods: {
        /* 根据分页获取对应的商品列表 */
        async getGoodsList() {
            const { data: res } = await this.$http.get("goods", {
                params: this.queryInfo,
            });
            if (res.meta.status !== 200) {
                this.$message.error("获取商品列表失败");
            } else {
               /*  this.$message.success("获取商品列表成功"); */
                this.goodsList = res.data.goods;
                this.total = res.data.total;
                /* console.log(this.total); */
            }
        },
        /* 改变每页显示的条数 */
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        /* 改变页码 */
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },
        /* 根据id删除商品*/
        async deleteId(id){
            const {data:res} = await this.$http.delete(`goods/${id}`)
            if(res.meta.status !==200){
                this.$message.error('删除商品失败')
            }else{
                this.$message.success("删除商品成功")
                this.getGoodsList();
            }
        },
        /* 添加商品 */
        addGoods(){
            this.$router.push('/goods/add')
        }
    },
};
</script>

<style lang="less" scoped>
</style>