<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入订单号.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-col :span="5">
                <el-select v-model="queryForm.status" clearable placeholder="请选择订单状态">
                    <el-option label="待付款" value="1"></el-option>
                    <el-option label="已付款待采购" value="2"></el-option>
                    <el-option label="已采购" value="7"></el-option>
                    <el-option label="已发货" value="3"></el-option>
                    <el-option label="已完成" value="4"></el-option>
                    <el-option label="退款中" value="5"></el-option>
                    <el-option label="已退款" value="6"></el-option>
                </el-select>
            </el-col>
            <el-date-picker
                v-model="queryForm.dateValue"
                type="date"
                placeholder="选择预订配送日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" :icon="Search" @click="initOrderList">搜索</el-button>
            <el-button type="primary" :icon="StarFilled" @click="handleUpdateByDate">根据预订日期一键采购</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="220" fixed/>
            <el-table-column prop="nickName" label="用户昵称" width="120" />
            <el-table-column prop="totalPrice" label="订单总价" width="120" />
            <el-table-column prop="status" label="订单状态" width="100" :formatter="orderStatusFormatter"/>
            <el-table-column prop="deliveryDate" label="预订配送日期" width="120" />
            <el-table-column prop="createTime" label="订单创建日期" width="180" />
            <el-table-column prop="payDate" label="订单支付日期" width="180" />
            <el-table-column prop="consignee" label="收货人" width="100" />
            <el-table-column prop="telNumber" label="联系电话" width="150" />
            <el-table-column prop="address" label="收货地址" width="400" />
            <el-table-column prop="action" label="操作" width="300" fixed="right">
                <template v-slot="scope">
                    <el-button type="success"
                               @click="handleDialogValue(scope.row.id)">
                        详情
                    </el-button>
                    <el-button type="primary"
                               :disabled="scope.row.status == '7' ? false : true"
                               @click="handleChangeStatus(scope.row.id, '3')">
                        发货
                    </el-button>
                    <el-button type="primary"
                               :disabled="scope.row.status == '5' ? false : true"
                               @click="handleChangeStatus(scope.row.id, '6')">
                        退款
                    </el-button>
                    <el-button type="danger"
                               @click="handleDelete(scope.row.id)"
                               :icon="Delete"
                    />
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                v-model:current-page="queryForm.pageNum"
                v-model:page-size="queryForm.pageSize"
                :page-sizes="[8, 12, 16, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </el-card>
    <Dialog v-model="dialogVisible" :id="orderId"></Dialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, Delete, StarFilled} from '@element-plus/icons-vue';
import axios from '@/util/axios';
import {ElMessage, ElMessageBox} from "element-plus";
import Dialog from "@/views/order/components/dialog";

const queryForm = ref({
    query: '',
    status: '',
    dateValue: '',
    pageNum: 1,
    pageSize: 8
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const orderId = ref(-1);

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
        case '1':
            return "待支付"
        case '2':
            return "已付款待采购"
        case '3':
            return "已发货"
        case '4':
            return "已完成"
        case '5':
            return "退款中"
        case '6':
            return "已退款"
        case '7':
            return "已采购"
    }
}
const handleChangeStatus = (id,status) => {
    ElMessageBox.confirm(
        '您确定要更新这个订单状态吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.post('order-serv/admin/order/update/status', {id:id, status:status})
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '执行成功',
            })
            initOrderList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '您确定要删除该订单吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('order-serv/admin/order/delete/' + id)
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            initOrderList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}
const handleUpdateByDate = () => {
    const date = queryForm.value.dateValue;
    if (date === '' || date === null) {
        ElMessage({
            type: 'error',
            message: '请选择预订配送日期',
        })
        return;
    }
    ElMessageBox.confirm(
        '确定更新该日期下所有有效订单为已采购状态吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('order-serv/admin/purchase/update/toPurchased/'+date)
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '执行成功',
            })
            initOrderList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}
const handleDialogValue = (id) => {
    dialogVisible.value = true;
    orderId.value = id;
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