<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <el-button type="primary">添加角色</el-button>
            <!-- 用户列表 -->
            <el-table
                :data="rolesList"
                style="width: 100%"
                :key="rolesList.id"
                border
                stripe
            >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row
                            v-for="(item, i1) in scope.row.children"
                            :key="item.id"
                            :class="[
                                'bdbuttom',
                                i1 === 0 ? 'bdtop' : '',
                                'vcenter',
                            ]"
                        >
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag  closable @close="delectRoles(scope.row,item.id)">{{ item.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级三级权限 -->
                            <el-col :span="19">
                                <!-- for循环添加二级权限 -->
                                <el-row
                                    v-for="(item2, i2) in item.children"
                                    :class="[
                                        i2 === 0 ? '' : 'bdtop',
                                        'vcenter',
                                    ]"
                                    :key="item2.id"
                                >
                                    <el-col :span="7">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close=" delectRoles(scope.row, item2.id)"
                                            >{{ item2.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- for循环添加三级权限 -->
                                    <el-col :span="13">
                                        <el-col
                                            :span="6"
                                            v-for="(
                                                item3, i3
                                            ) in item2.children"
                                            :key="item3.id"
                                        >
                                            <el-tag
                                                type="warning"
                                                closable
                                                @close="
                                                    delectRoles(
                                                        scope.row,
                                                        item3.id
                                                    )
                                                "
                                                >{{ item3.authName }}</el-tag
                                            >
                                        </el-col>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色名称"
                ></el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showReviseUser(scope.row.id)"
                            >编辑</el-button
                        >
                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="delectUser(scope.row.id)"
                            >删除</el-button
                        >
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
                                >分配权限</el-button
                            >
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Roles",
    data() {
        return {
            /* 所有角色列表数据 */
            rolesList: [],
        };
    },
    created() {
        this.getRolesList();
    },
    methods: {
        /* 获取用户列表 */
        async getRolesList() {
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200) {
                return this.$message.error("获取用户角色列表失败");
            }
            this.rolesList = res.data;
            console.log(this.rolesList);
        },
        /* 删除对应权限 */
        async delectRoles(roleId, rightId) {
            const rest = await this.$confirm(
                "此操作将永久删除该权限, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (rest !== "confirm") {
                return this.$message.info("已取消删除");
            } else {
                const { data: res } = await this.$http.delete(
                    `roles/${roleId.id}/rights/${rightId}`
                );
                if (res.meta.status !== 200) {
                    return this.$message.error("删除权限失败");
                } else {
                    roleId.children = res.data;
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.el-tag {
    margin: 10px;
}
.bdbuttom {
    border-bottom: 1px solid #eee;
}
.bdtop {
    border-top: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>