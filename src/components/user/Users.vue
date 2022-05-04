<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片化 -->
        <el-card>
            <!-- 添加用户 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUseData"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUseData"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUser = true"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <!-- 用户列表 -->
            <el-table
                :data="userList"
                style="width: 100%"
                :key="userList.id"
                border
                stripe
            >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!--  {{ scope.row }} -->
                        <el-switch
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="userChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showReviseUser(scope.row.id)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="delectUser(scope.row.id)"
                        ></el-button>
                        <!-- 角色分配按钮 -->
                        <el-tooltip
                            content="角色分配"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showUsersRoleButton(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addUser"
            width="50%"
            @close="addUserClose"
        >
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="ruleForm"
                label-width="100px"
            >
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮件号" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUser = false">取 消</el-button>
                <el-button type="primary" @click="addUserObj">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="reviseUser"
            width="50%"
            @close="reviseUserClose"
        >
            <el-form
                :model="reviseForm"
                :rules="reviseFormRules"
                ref="ruleForm"
                label-width="100px"
            >
                <el-form-item label="用户名称">
                    <el-input v-model="reviseForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="reviseForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="reviseForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="reviseUser = false">取 消</el-button>
                <el-button type="primary" @click="reviseUserObj"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="showUsersVisible" width="50%" @close='setRoleClose'>
            <div>
                <p>当前的用户:{{ userInfo.username }}</p>
                <p>当前的角色:{{ userInfo.role_name }}</p>
                <p>
                    分配新角色:
                    <el-select v-model="selectUserValueId" placeholder="请选择">
                        <el-option
                            v-for="item in getUserList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showUsersVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUsersVisible"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Users",
    data() {
        /* 验证邮箱规则 */
        var checkemail = (rule, value, cb) => {
            const rulesEmail =
                /^[A-Za-z0-9-._]+@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,6})$/;
            if (rulesEmail.test(value)) {
                cb();
            } else {
                cb(new Error("邮箱不正确"));
            }
        };
        /* 验证手机号规则 */
        var checkMobile = (rule, value, cb) => {
            let reg =
                /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (reg.test(value)) {
                cb();
            } else {
                cb(new Error("手机号码格式不正确"));
            }
        };
        return {
            /* 获取用户列表参数对象 */
            queryInfo: {
                query: "",
                pagenum: 1, //当前的页数
                pagesize: 3, //当前每页显示多少条数据
            },
            /* 用户列表 */
            userList: [],
            /*  */
            total: 0,
            /* 控制添加用户对话框的显示与隐藏 */
            addUser: false,
            /* 添加用户的表单数据 */
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            /* 添加用户的表单验证规则 */
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 8,
                        message: "长度在 3 到 8 个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 18,
                        message: "长度在 6 到 18 个字符",
                        trigger: "blur",
                    },
                ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱号",
                        trigger: "blur",
                    },
                    { validator: checkemail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
            },
            /* 控制修改用户的显示与隐藏对话框 */
            reviseUser: false,
            /* 修改用户的表单数据 */
            reviseForm: {},
            /* 修改用户的表单验证规则 */
            reviseFormRules: {
                email: [
                    {
                        required: true,
                        message: "请输入邮箱号",
                        trigger: "blur",
                    },
                    { validator: checkemail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
            },
            /* 控制显示与隐藏分配角色对话框 */
            showUsersVisible: false,
            /* 需要配分配角色的信息 */
            userInfo: {},
            /* 所有角色的数据列表 */
            getUserList: [],
            /* 已选中的角色id值 */
            selectUserValueId:'',
        };
    },
    created() {
        this.getUseData();
    },
    methods: {
        async getUseData() {
            const { data: res } = await this.$http.get("users", {
                params: this.queryInfo,
            });
            if (res.meta.status != 200)
                return this.$message.error("获取用户列表失败!");
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        /* 监听每页显示条数 */
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUseData();
        },
        /* 监听 页码值改变事件 */
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUseData();
        },
        /* 监听用户状态事件 */
        async userChange(info) {
            const { data: res } = await this.$http.put(
                `users/${info.id}/state/${info.mg_state}`
            );
            if (res.meta.status !== 200) {
                info.mg_state = !info.mg_state;
                return this.$message.error("状态修改失败!");
            } else {
                this.$message.success("状态修改成功!");
            }
        },
        /* 监听添加用户表单 关闭事件 */
        addUserClose() {
            this.$refs.ruleForm.resetFields();
        },
        /* 点击按钮 添加用户 */
        addUserObj() {
            this.$refs.ruleForm.validate(async (val) => {
                if (val) {
                    const { data: res } = await this.$http.post(
                        "users",
                        this.addForm
                    );
                    if (res.meta.status !== 201) {
                        return this.$message.error("添加用户失败");
                    } else {
                        return this.$message.success("添加用户成功");
                    }
                }
            });
        },
        /* 展示修改用户对话框 */
        async showReviseUser(id) {
            this.reviseUser = true;
            console.log(id);
            const { data: res } = await this.$http.get("users/" + id);
            if (res.meta.status !== 200) {
                return this.$message.error("修改获取用户失败");
            } else {
                this.reviseForm = res.data;
                this.reviseUser = true;
            }
        },
        /* 监听修改用户表单 关闭事件 */
        reviseUserClose() {
            this.$refs.ruleForm.resetFields();
        },
        /* 修改用户表单 提交数据 */
        reviseUserObj() {
            this.$refs.ruleForm.validate(async (val) => {
                if (!val) return;
                const { data: res } = await this.$http.put(
                    "users/" + this.reviseForm.id,
                    {
                        email: this.reviseForm.email,
                        mobile: this.reviseForm.mobile,
                    }
                );
                if (res.meta.status !== 200) {
                    return this.$message.error("更新用户失败");
                } else {
                    this.$message.success("更新用户成功");
                    this.getUseData();
                    this.reviseUser = false;
                }
            });
        },
        /* 根据id删除用户数据 */
        async delectUser(id) {
            const userList = await this.$confirm(
                "此操作将永久删除用户, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((error) => error);
            if (userList !== "confirm") {
                this.$message.info("已取消删除用户");
            } else {
                const { data: res } = await this.$http.delete("users/" + id);
                if (res.meta.status !== 200) {
                    this.$message.error("删除用户失败");
                } else {
                    this.$message.success("删除用户成功");
                    this.getUseData();
                }
            }
        },
        /* 展示分配角色对话框 */
        async showUsersRoleButton(rowId) {
            this.userInfo = rowId;
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200) {
                return this.$message.error("角色获取失败");
            }
            this.getUserList = res.data;
            this.showUsersVisible = true;
            console.log('角色获取成功');
        },
        async addUsersVisible(){
            if(!this.selectUserValueId){
                return this.$message.error('请选择要分配的角色')
            }
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectUserValueId});
            if(res.meta.status !== 200){
                return this.$message.error('设置角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUseData();
            this.showUsersVisible=false;
        },
        /* 清空分配角色对话框 */
        setRoleClose(){
            this.selectUserValueId = '';
            this.userInfo = {};
        }
    },
};
</script>

<style lang="less" scoped>
</style>