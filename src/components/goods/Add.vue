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
            <!-- 提示区 -->
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false"
            ></el-alert>
          
                <el-steps
                    :space="200"
                    :active="activeIndex * 1"
                    finish-status="success"
                    align-center
                >
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
                <!-- tabs标签页 -->
                  <!-- 步骤条区 -->
            <el-form
                :model="addRuleForm"
                :rules="addRules"
                ref="ruleForm"
                label-width="100px"
                label-position="top"
            >
                <el-tabs
                    :tab-position="'left'"
                    v-model="activeIndex"
                    :before-leave="beforeTabLeave"
                    @tab-click="tabClicked"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input
                                v-model="addRuleForm.goods_name"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input
                                v-model="addRuleForm.goods_price"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input
                                v-model="addRuleForm.goods_weight"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input
                                v-model="addRuleForm.goods_number"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                v-model="addRuleForm.goods_cat"
                                :options="getAddDataList"
                                :props="{
                                    expandTrigger: 'hover',
                                    value: 'cat_id',
                                    label: 'cat_name',
                                    children: 'children',
                                }"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in manyTabData"
                            :key="item.attr_id"
                        >
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    :label="cb"
                                    v-for="(cb, i) in item.attr_vals"
                                    :key="i"
                                    border
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attr_name"
                            v-for="item in onlyTabData"
                            :key="item.attr_id"
                        >
                            <el-input v-model="item.attr_name"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="addHeaders"
                            :on-success="picsSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
                         <!-- 添加商品 -->
                    <el-button type="primary" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 预览图片 -->
        <el-dialog
            title="预览图片"
            :visible.sync="dialogVisible"
            width="50%"
        >
        <img :src="PreviewURl">
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Add",
    data() {
        return {
            activeIndex: "0",
            /* 添加的商品数据对象 */
            addRuleForm: {
                goods_name: "",
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                /* 商品分类数组 */
                goods_cat: [],
                /* 图片信息对象 */
                pics: [],
                /* 富文本框内容 */
                goods_introduce:'',
                attrs:[],
            },
            /* 动态参数列表数据 */
            manyTabData: [],
            /* 静态参数列表数据 */
            onlyTabData: [],
            /* 校验规则 */
            addRules: {
                goods_name: [
                    {
                        required: true,
                        message: "请输入商品名称",
                        trigger: "blur",
                    },
                ],
                goods_price: [
                    {
                        required: true,
                        message: "请输入商品价格",
                        trigger: "blur",
                    },
                ],
                goods_weight: [
                    {
                        required: true,
                        message: "请输入商品重量",
                        trigger: "blur",
                    },
                ],
                goods_number: [
                    {
                        required: true,
                        message: "请输入商品数量",
                        trigger: "blur",
                    },
                ],
               
            },
            /* 商品列表数据 */
            getAddDataList: [],
            /* 上传图片地址 */
            uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
            /* 设置上传图片头部 */
            addHeaders: {
                Authorization: window.sessionStorage.getItem("token"),
            },
            /* 预览图片地址 */
            PreviewURl: "",
            /* 显示与隐藏预览图片 */
            dialogVisible:false,
        };
    },
    created() {
        this.getAddData();
    },
    methods: {
        async getAddData() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status !== 200) {
                this.$message.error("获取商品列表失败");
            } else {
                this.getAddDataList = res.data;
                /* this.getAddData(); */
                console.log(this.getAddDataList);
            }
        },
        /* 点击Cascader 级联选择器,触发函数 */
        handleChange() {
            console.log(this.addRuleForm.goods_cat);
        },
        /*  判断tab页的切换 */
        beforeTabLeave(activeName, oldActiveName) {
            // console.log('进来的'+activeName);
            // console.log("离开的"+oldActiveName);
            if (
                this.addRuleForm.goods_cat.length !== 3 &&
                oldActiveName === "0"
            ) {
                this.$message.error("选择商品分类");
                return false;
            }
        },
        /* tab触发的标签 */
        async tabClicked() {
            if (this.activeIndex === "1") {
                const { data: res } = await this.$http.get(
                    `categories/${this.catId}/attributes`,
                    { params: { sel: "many" } }
                );
                if (res.meta.status !== 200) {
                    this.$message.error("获取动态参数列表失败");
                } else {
                    res.data.forEach((item) => {
                        item.attr_vals =
                            item.attr_vals.length === 0
                                ? []
                                : item.attr_vals.split(" ");
                    });
                    this.manyTabData = res.data;
                    console.log(res.data);
                }
            } else if (this.activeIndex === "2") {
                const { data: res } = await this.$http.get(
                    `categories/${this.catId}/attributes`,
                    { params: { sel: "only" } }
                );
                if (res.meta.status !== 200) {
                    this.$message.error("获取动态参数列表失败");
                } else {
                    res.data.forEach((item) => {
                        item.attr_vals =
                            item.attr_vals.length === 0
                                ? []
                                : item.attr_vals.split(" ");
                    });
                    this.onlyTabData = res.data;
                    console.log(res.data);
                }
            }
        },
        /* 上传图片缩略图事件 */
        handlePreview(file) {
            this.PreviewURl = file.response.data.url;
            this.dialogVisible = true;
        },
        /* 删除图片事件 */
        handleRemove(file) {
            console.log(file);
            /* 要删除的图片路径 */
            const filePics = file.response.data.tmp_path;
            const i = this.addRuleForm.pics.findIndex(
                (x) => x.pics === filePics
            );
            this.addRuleForm.pics.splice(i, 1);
            console.log(this.addRuleForm);
        },
        /* 监听图片上传成功事件 */
        picsSuccess(res) {
            /* 拼接得到一个图片信息对象 */
            const pics = { pics: res.data.tmp_path };
            /* 将图片信息对象,push到pics数组中 */
            this.addRuleForm.pics.push(pics);
            console.log(this.addRuleForm.pics);
        },
        /* 添加商品按钮 */
        add(){
            this.$refs.ruleForm.validate(async val =>{
                if(!val){
                    return this.$message.error('请填写必填项')
                }else{
                        var itemString = JSON.stringify(this.addRuleForm);  
                        var record = JSON.parse(itemString);
                        record.goods_cat = record.goods_cat.join(',')
                        /* 处理动态参数 */
                        this.manyTabData.forEach(item =>{
                            const newInfo = {
                                attr_id:item.attr_id,
                                attr_value:item.attr_vals.join(' ')
                            }
                            this.addRuleForm.attrs.push(newInfo)
                        })
                        /* 处理静态属性 */
                        this.onlyTabData.forEach(item =>{
                            const newInfo = {
                                attr_id:item.attr_id,
                                attr_value:item.attr_vals
                            }
                            this.addRuleForm.attrs.push(newInfo)
                        })
                        record.attrs = this.addRuleForm.attrs
                        console.log(record);
                        /* 发起添加商品请求 */
                        const {data:res} = await this.$http.post('goods',record)
                        if(res.meta.status !==201){
                            return this.$message.error('添加数据失败!')
                        }
                        this.$message.success('添加数据成功!')
                        this.$router.push('/goods')
                }
            })
        }
    },
    computed: {
        catId() {
            if (this.addRuleForm.goods_cat.length === 3) {
                return this.addRuleForm.goods_cat[2];
            } else {
                return null;
            }
        },
    },
};
</script>

<style lang="less" scoped>
/deep/.el-checkbox {
    margin: 0 15px 0 0;
}
img{
    width: 100%;
}
/deep/.ql-container{
    min-height: 300px;
}
.el-button{
    margin-top: 15px;
}
</style>