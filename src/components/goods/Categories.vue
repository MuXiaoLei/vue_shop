<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片化 -->
        <el-card>
            <el-button type="primary" @click="addClassButton"
                >添加分类</el-button
            >
            <!-- 商品分类列表 -->
            <tree-table
                :data="catesList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
            >
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i
                        class="el-icon-success"
                        v-if="scope.row.cat_deleted === false"
                        style="color: green"
                    ></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序 -->
                <template slot="sort" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini"
                        >一级</el-tag
                    >
                    <el-tag
                        v-else-if="scope.row.cat_level === 1"
                        type="success"
                        size="mini"
                        >二级</el-tag
                    >
                    <el-tag v-else type="warning" size="mini">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="oreration" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        >编辑</el-button
                    >
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        >删除</el-button
                    >
                </template>
            </tree-table>
            <!-- 页面切换 -->
            <el-pagination
                @size-change="carteSizeChange"
                @current-change="cartCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 8]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addClassDialog"
            width="50%"
            @close="addCateClose"
        >
            <el-form
                :model="addruleForm"
                :rules="addrules"
                ref="addruleFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addruleForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                        :options="getAddObj"
                        expandTrigger="hover"
                        :props="cateAddProps"
                        v-model="selctKeys"
                        @change="selectHandle"
                        clearable
                        change-on-select
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addClassDialog = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Categories",
    data() {
        return {
            /* 查询条件 */
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            /* 商品数据列表,默认为空 */
            catesList: [],
            /* 总数据条数 */
            total: 0,
            /* 为table指定列定义 */
            columns: [
                {
                    label: "分类名称",
                    prop: "cat_name",
                },
                {
                    label: "是否有效",
                    /* 定义成模板列 */
                    type: "template",
                    /* 定义模板列的名称 */
                    template: "isok",
                },
                {
                    label: "排序",
                    /* 定义成模板列 */
                    type: "template",
                    /* 定义模板列的名称 */
                    template: "sort",
                },
                {
                    label: "操作",
                    /* 定义成模板列 */
                    type: "template",
                    /* 定义模板列的名称 */
                    template: "oreration",
                },
            ],
            /* 显示与隐藏分类 */
            addClassDialog: false,
            /* 添加分类对象 */
            addruleForm: {
                /* 添加分类名称 */
                cat_name: "",
                /* 父级分类的id */
                cat_pid: 0,
                /* 分类等级 默认添加一级分类 */
                cat_level: 0,
            },
            /* 添加分类对象的验证规则 */
            addrules: {
                cat_name: [
                    {
                        required: true,
                        message: "请输入添加分类名",
                        trigger: "blur",
                    },
                ],
            },
            /* 获取父级对象 */
            getAddObj: [],
            /* 指定级联选择器的配置对象 */
            cateAddProps: {
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },
            /* 选中父级分类的id数组 */
            selctKeys: [],
        };
    },
    created() {
        this.getCatesList();
    },
    methods: {
        /* 获取商品数据 */
        async getCatesList() {
            const { data: res } = await this.$http.get("categories", {
                params: this.queryInfo,
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败");
            } else {
                this.catesList = res.data.result;
                this.total = res.data.total;
                console.log(this.catesList);
            }
        },
        /* 监听改变pagesize */
        carteSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getCatesList();
        },
        /* 监听改变pagenum */
        cartCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCatesList();
        },
        addClassButton() {
            this.getAddForm();
            this.addClassDialog = true;
        },
        /* 获取父级分类的数据列表 */
        async getAddForm() {
            const { data: res } = await this.$http.get("categories", {
                params: { type: 2 },
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取父类列表失败");
            } else {
                this.getAddObj = res.data;
                console.log(this.getAddObj);
            }
        },
        /* 选择项发生变化触发这个函数 */
        selectHandle() {
            console.log(this.selctKeys);
            /* 如果selctKeys中数组大于0,说明选中了父级分类
                如果小于0,这说明没有选中父级分类 */
            if (this.selctKeys.length > 0) {
                /* 父级分类的id */
                this.addruleForm.cat_pid =
                    this.selctKeys[this.selctKeys.length - 1];
                /* 为当前父级分类赋值 */
                this.addruleForm.cat_level = this.selctKeys.length;
                return;
            } else {
                this.addruleForm.cat_pid = 0;
                this.addruleForm.cat_level = 0;
            }
        },
        /* 点击按钮添加分类 */
        addCate() {
            console.log(this.addruleForm);
            this.$refs.addruleFormRef.validate(async val=>{
                if(!val)return
                const {data:res} = await this.$http.post('categories',this.addruleForm)
                if(res.meta.status !==201)return this.$message.error('添加分类失败')
                
                this.getCatesList();
                this.addClassDialog = false
                this.$message.success('添加成功')
            })
        },
        /* 清空添加分类对话框 重置表单*/
        addCateClose() {
            this.$refs.addruleFormRef.resetFields();
            this.selctKeys = [];
            this.addruleForm.cat_pid = 0;
            this.addruleForm.cat_level = 0;
        },
    },
};
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
/* /deep/.el-cascader-panel {
    max-height: 300px;
}  */
/deep/.zk-table{
    margin-top: 20px;
}
</style>