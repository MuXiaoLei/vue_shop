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
            <!-- 警告区域 -->
            <el-alert
                show-icon
                title="注意:只允许为第三级分类参数设置相关参数!"
                type="warning"
                :closable="false"
            ></el-alert>
            <!-- 选择商品分类区 -->
            <el-row class="cat_row">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品级联选择框 -->
                    <el-cascader
                        v-model="selectCascader"
                        :options="goodsList"
                        :props="{
                            expandTrigger: 'hover',
                            value: 'cat_id',
                            label: 'cat_name',
                            children: 'children',
                        }"
                        @change="selectChange"
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="ParamsActiveName" @tab-click="paeamsClick">
                <!-- 动态参数标签 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="paramsButton"
                        @click="addCatchDialog = true"
                        >添加参数</el-button
                    >
                    <!-- 动态参数表格 -->
                    <el-table border stripe :data="manyTableData">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- tag标签循环显示所有数据 -->
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close='TagClose(i,scope.row)'
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- tag添加标签 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(scope.row)
                                    "
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="#"
                        ></el-table-column>
                        <el-table-column
                            label="参数名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row.attr_id)"
                                    >编辑</el-button
                                >
                                <el-button
                                    type="primary"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="showDeleteDialog(scope.row.attr_id)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性标签 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="paramsButton"
                        @click="addCatchDialog = true"
                        >添加属性</el-button
                    >
                    <!-- 静态属性表格 -->
                    <el-table border stripe :data="onlyTableData">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- tag标签循环显示所有数据 -->
                                <el-tag
                                    v-for="(item, i) in scope.row.attr_vals"
                                    :key="i"
                                    closable
                                    @close='TagClose(i,scope.row)'
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- tag添加标签 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(scope.row)
                                    "
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="#"
                        ></el-table-column>
                        <el-table-column
                            label="参数名称"
                            prop="attr_name"
                        ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row.attr_id)"
                                    >编辑</el-button
                                >
                                <el-button
                                    type="primary"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="showDeleteDialog(scope.row.attr_id)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数对话框 -->
        <el-dialog
            :title="'添加' + this.addCatchTitle"
            :visible.sync="addCatchDialog"
            width="50%"
            @close="addClose"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="100px"
            >
                <el-form-item :label="addCatchTitle" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatchDialog = false">取 消</el-button>
                <el-button type="primary" @click="addParamsDialog"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 修改参数对话框 -->
        <el-dialog
            :title="'修改' + this.addCatchTitle"
            :visible.sync="editCatchDialog"
            width="50%"
            @close="editClose"
        >
            <el-form
                :model="editForm"
                :rules="addFormRules"
                ref="editFormRef"
                label-width="100px"
            >
                <el-form-item :label="addCatchTitle" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCatchDialog = false">取 消</el-button>
                <el-button type="primary" @click="editParamsDialog"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Params",
    data() {
        return {
            goodsList: [],
            /* 级联选择框双向绑定的数组 */
            selectCascader: [],
            /* 被激活的页签名称 */
            ParamsActiveName: "many",
            /* 动态参数的数据 */
            manyTableData: [],
            /* 静态参数的数据 */
            onlyTableData: [],
            /* 显示与隐藏添加参数对话框 */
            addCatchDialog: false,
            /* 添加参数的表单对象 */
            addForm: {
                attr_name: "",
            },
            /* 添加参数的表单对象的校验 */
            addFormRules: {
                attr_name: {
                    required: true,
                    message: "请输入活动名称",
                    trigger: "blur",
                },
            },
            /* 显示与隐藏修改参数对话框 */
            editCatchDialog: false,
            /* 修改参数表单对象 */
            editForm: {
                attr_name: "",
            },
        };
    },
    created() {
        this.getgoodsList();
    },
    methods: {
        async getgoodsList() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败");
            } else {
                this.goodsList = res.data;
            }
        },
        /* 级联选择框变化,会触发这个函数 */
        selectChange() {
            /* console.log(this.selectCascader); */
            this.getParams();
        },
        /* tab页签,点击处理函数 */
        async paeamsClick() {
            /* console.log(this.ParamsActiveName); */
            this.getParams();
        },
        /* 获取参数据列表 */
        async getParams() {
            const { data: res } = await this.$http.get(
                `categories/${this.catchId}/attributes`,
                { params: { sel: this.ParamsActiveName } }
            );
            if (res.meta.status !== 200) {
                this.$message.error("获取参数列表失败");
            } else {
                console.log(res.data);
                res.data.forEach((item) => {
                    item.attr_vals = item.attr_vals
                        ? item.attr_vals.split(" ")
                        : [];
                    /* 控制ag标签按钮与文本框的切换显示 */
                    item.inputVisible = false;
                    /* 文本框输入的内容 */
                    item.inputValue = "";
                });
                if (this.ParamsActiveName === "many") {
                    return (this.manyTableData = res.data);
                } else {
                    return (this.onlyTableData = res.data);
                }
            }
        },
        /* 清空添加参数对话框 */
        addClose() {
            this.$refs.addFormRef.resetFields();
        },
        /* 添加参数按钮 */
        async addParamsDialog() {
            this.$refs.addFormRef.validate(async (val) => {
                if (!val) return;
                const { data: res } = await this.$http.post(
                    `categories/${this.catchId}/attributes`,
                    {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.ParamsActiveName,
                    }
                );
                console.log(this.catchId);
                if (res.meta.status !== 201) {
                    return this.$message.error("添加参数失败!");
                } else {
                    this.$message.success("添加参数成功");
                    this.getParams();
                    this.addCatchDialog = false;
                }
            });
        },
        /* 修改按钮,获取参数对象 */
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(
                `categories/${this.catchId}/attributes/${id}`,
                { params: { attr_sel: this.ParamsActiveName } }
            );
            if (res.meta.status !== 200) {
                return this.$message.error("获取参数失败");
            }
            this.editForm = res.data;
            this.editCatchDialog = true;
        },
        /* 修改参数对话框,提交数据 */
        async editParamsDialog() {
            const { data: res } = await this.$http.put(
                `categories/${this.catchId}/attributes/${this.editForm.attr_id}`,
                {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.ParamsActiveName,
                }
            );
            if (res.meta.status !== 200) {
                this.$message.error("提交数据失败");
            }
            this.$message.success("提交数据成功");
            this.getParams();
            this.editCatchDialog = false;
        },
        /* 清空修改参数对话框 */
        editClose() {
            this.$refs.editFormRef.resetFields();
        },
        /* 删除按钮,获取参数对象 */
        async showDeleteDialog(id) {
            const con = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (con !== "confirm") {
                return this.$message.info("取消删除");
            } else {
                const { data: res } = await this.$http.delete(
                    `categories/${this.catchId}/attributes/${id}`
                );
                if (res.meta.error) {
                    return this.$message.error("删除失败");
                }
                this.$message.success("删除成功");
                this.getParams();
            }
        },
        /* 文本框失去焦点与按下enter都会触发 */
        async handleInputConfirm(row) {
            if(row.inputValue.trim().length ===0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            /* 输入了内容 */
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row)
        }, 
        /* attr_vals保存到数据库 */
        async saveAttrVals(row){
             const {data:res} =  await this.$http.put(`categories/${this.catchId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join()
            })
            if(res.meta.status!==200){
                return this.$message.error('修改参数失败!')
            }else{
                return this.$message.success('修改参数成功!')
            }
        },
        /* 点击按钮显示文本框 */
        showInput(row) {
            row.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        /* 删除tag标签 */
        TagClose(i,row){
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        },
    },
    computed: {
        /* 判断动态参数与静态属性是否禁用 */
        paramsButton() {
            if (this.selectCascader.length !== 3) {
                return true;
            } else {
                return false;
            }
        },
        /* 获取分类id */
        catchId() {
            if (this.selectCascader.length === 3) {
                /* console.log(this.selectCascader[2]); */
                return this.selectCascader[2];
            } else {
                return null;
            }
        },
        /* 添加参数对话框的标题 */
        addCatchTitle() {
            if (this.ParamsActiveName === "many") {
                return "动态参数";
            } else {
                return "静态属性";
            }
        },
    },
};
</script>

<style lang="less" scoped>
.cat_row {
    margin-top: 20px;
}
.el-tag {
    margin-right: 20px;
}
.el-input {
    width: 120px;
}
</style>