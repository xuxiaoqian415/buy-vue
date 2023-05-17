<template>
    <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="home"
            text-color="#fff"
            router
    >
        <el-menu-item index="home">
            <el-icon><home-filled /></el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="user">
            <template #title >
                <el-icon><user /></el-icon>
                <span>用户管理</span>
            </template>
            <el-menu-item index="user-admin">
                <el-icon><user /></el-icon>
                <span>后台用户</span>
            </el-menu-item>
            <el-menu-item index="user-wx">
                <el-icon><user /></el-icon>
                <span>微信用户</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="good_type">
            <template #title >
                <el-icon><management /></el-icon>
                <span>商品类别管理</span>
            </template>
            <el-menu-item index="bigType">
                <el-icon><management /></el-icon>
                <span>商品大类管理</span>
            </el-menu-item>
            <el-menu-item index="smallType">
                <el-icon><management /></el-icon>
                <span>商品小类管理</span>
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="goods">
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="order">
            <el-icon><tickets /></el-icon>
            <span>订单管理</span>
        </el-menu-item>
        <el-sub-menu index="system">
            <template #title >
                <el-icon><setting /></el-icon>
                <span>系统管理</span>
            </template>
            <el-menu-item index="modifyPassword">
                <el-icon><edit /></el-icon>
                <span>修改密码</span>
            </el-menu-item>
            <el-menu-item >
                <el-icon @click="logout"><switch-button /></el-icon>
                <span @click="logout">安全退出</span>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script setup>
import {HomeFilled,User,Tickets,Goods,DocumentAdd,Management,Setting,Edit,SwitchButton} from '@element-plus/icons-vue';
import {useStore} from 'vuex';

const store = useStore();
const logout = () => {
    store.dispatch('logout');
}
</script>

<style lang="scss" scoped>

</style>