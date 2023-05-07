<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入订单号.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-button type="primary" :icon="Search" @click="initOrderList">搜索</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="orderNo" label="订单号" width="220" />
            <el-table-column prop="nikeName" label="用户昵称" width="120" />
            <el-table-column prop="totalPrice" label="订单总价" width="120" />
            <el-table-column prop="status" label="订单状态" width="100" :formatter="orderStatusFormatter"/>
            <el-table-column prop="createTime" label="订单创建日期" width="180" />
            <el-table-column prop="payDate" label="订单支付日期" width="180" />
            <el-table-column prop="consignee" label="收货人" width="100" />
            <el-table-column prop="telNumber" label="联系电话" width="150" />
            <el-table-column prop="address" label="收货地址" width="400" />
            <el-table-column prop="action" label="操作" width="180" />
        </el-table>
        <el-pagination
                v-model:current-page="queryForm.pageNum"
                v-model:page-size="queryForm.pageSize"
                :page-sizes="[8, 16, 24, 32]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </el-card>
</template>

<script setup>
import {ref} from 'vue';
import {Search} from '@element-plus/icons-vue';
import axios from '@/util/axios';

const queryForm = ref({
    query: '',
    pageNum: 1,
    pageSize: 8
});
const total = ref(0);
const tableData = ref([]);
const initOrderList = async () => {
    const res = await axios.post('order-serv/admin/order/list', queryForm.value);
    tableData.value = res.data.result.orderList;
    total.value = res.data.result.total;
    console.log(tableData.value);
};
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initOrderList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initOrderList();
}
const orderStatusFormatter = (row) => {
    switch (row.status) {
        case 1:
            return "待支付"
        case 2:
            return "待发货"
        case 3:
            return "售后处理中"
    }
}
initOrderList();

</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 16px;
  box-sizing: border-box;
}
.el-pagination{
  padding-top: 15px;
  box-sizing: border-box;
}
</style>