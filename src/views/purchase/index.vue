<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入订单号.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-date-picker
                    v-model="queryForm.dateValue"
                    type="date"
                    placeholder="选择预订配送日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
            />&nbsp;&nbsp;
            <el-button type="primary" :icon="Search" @click="initPurchaseList">搜索</el-button>
            <el-button type="primary" :icon="Download" @click="handleDownload">按日期导出采购单</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="220" fixed/>
            <el-table-column prop="ingredientId" label="原料ID" width="120" />
            <el-table-column prop="ingredientName" label="原料名称" width="120" />
            <el-table-column prop="totalNum" label="总数" width="100" />
            <el-table-column prop="unit" label="单位" width="150" />
            <el-table-column prop="description" label="描述" width="180" />
            <el-table-column prop="deliveryDate" label="预订配送日期" width="120" />
        </el-table>
        <el-pagination
                v-model:current-page="queryForm.pageNum"
                v-model:page-size="queryForm.pageSize"
                :page-sizes="[10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </el-card>
    <Dialog v-model="dialogVisible"
            :dialogVisible="dialogVisible"
            :date="downloadDate"
    ></Dialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, Download} from '@element-plus/icons-vue';
import axios from '@/util/axios';
import {ElMessage} from "element-plus";
import Dialog from "@/views/purchase/components/dialog.vue";

const queryForm = ref({
    query: '',
    dateValue: '',
    pageNum: 1,
    pageSize: 10
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const downloadDate = ref('');

const handleDownload = () => {
    const date = queryForm.value.dateValue;
    if (date === '' || date === null) {
        ElMessage({
            type: 'error',
            message: '请选择预订配送日期',
        })
        return;
    }
    dialogVisible.value = true;
    downloadDate.value = date;
}
const initPurchaseList = async () => {
    const res = await axios.post('order-serv/admin/purchase/list', queryForm.value);
    tableData.value = res.data.result.purchaseList;
    total.value = res.data.result.total;
};
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initPurchaseList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initPurchaseList();
}
initPurchaseList();

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