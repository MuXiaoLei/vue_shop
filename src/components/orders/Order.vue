<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片化 -->
        <el-card>
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" clearable>
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表 -->
            <el-table :data="orderDataList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    prop="order_number"
                    label="订单编号"
                ></el-table-column>
                <el-table-column
                    prop="order_price"
                    label="订单价格"
                    width="100px"
                ></el-table-column>
                <el-table-column
                    prop="pay_status"
                    label="是否付款"
                    width="100px"
                >
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status === '1'"
                            >已付款</el-tag
                        >
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="is_send"
                    label="是否发货"
                    width="100px"
                ></el-table-column>
                <el-table-column
                    prop="create_time"
                    label="下单时间"
                    width="250px"
                >
                    <template slot-scope="scope">
                        {{ scope.row.create_time | filterDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="showUp"
                    ></el-button>
                    <el-button
                        type="success"
                        icon="el-icon-location-outline"
                        size="mini"
                        @click="showKuaidi"
                    ></el-button>
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
        <!-- 修改地址 -->
        <el-dialog
            title="修改地址"
            :visible.sync="showUpVisible"
            width="50%"
            @close="showUpClose"
        >
            <el-form
                :model="showUpForm"
                :rules="showUpRules"
                ref="showUpRef"
                label-width="100px"
            >
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                        :options="ctiyData"
                        v-model="showUpForm.address1"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="showUpForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showUpVisible = false">取 消</el-button>
                <el-button type="primary" @click="showUpVisible = false"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 显示物流地址 -->
        <el-dialog
            title="物流地址"
            :visible.sync="showKuaidiVisible"
            width="50%"
        >
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in kuaidi.data"
                    :key="index"
                    :timestamp="activity.time"
                >
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import ctiyData from "./citydata";
import kuaidi from "./kuadi";
export default {
    name: "Order",
    data() {
        return {
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5,
            },
            /* 订单列表数据 */
            orderDataList: [],
            /* 总数据条数 */
            total: 0,
            /* 显示与隐藏修改地址对话框 */
            showUpVisible: false,
            /* 修改对话框的数据 */
            showUpForm: {
                address1: [],
                address2: "",
            },
            /* 修改对话框的校验 */
            showUpRules: {
                address1: [
                    {
                        required: true,
                        message: "请输选择省市区/县",
                        trigger: "blur",
                    },
                ],
                address2: [
                    {
                        required: true,
                        message: "请输输入详细地址",
                        trigger: "blur",
                    },
                ],
            },
            ctiyData,
            /* 显示与隐藏物流地址对框 */
            showKuaidiVisible: false,
            // /* 物流地址 */
            kuaidi,
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get("orders", {
                params: this.queryInfo,
            });
            if (res.meta.status !== 200) {
                this.$message.error("获取订单列表失败");
            } else {
                /*   this.$message.success("获取订单列表成功"); */
                this.orderDataList = res.data.goods;
                this.total = res.data.total;
                console.log(res.data);
            }
        },
        /* 改变每页显示的条数 */
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        /* 改变当前页 */
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },
        /* 修改按钮 */
        showUp() {
            this.showUpVisible = true;
        },
        /* 清空修改地址数据 */
        showUpClose() {
            this.$refs.showUpRef.resetFields();
        },
        /* 物流按钮 */
        async showKuaidi() {
            this.showKuaidiVisible = true;
        },
    },
};
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>