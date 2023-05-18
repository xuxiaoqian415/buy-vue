<template>
    <el-dialog
        model-value="dialogVisible"
        title="按日期导出采购单预览"
        width="40%"
        @close="handleClose"
        center
    >
        <el-text class="mx-1" size="large">预订配送日期: {{props.date}}</el-text>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="ingredientName" label="原料名称" width="120" />
            <el-table-column prop="totalNum" label="总数" width="100" />
            <el-table-column prop="unit" label="单位" width="100" />
            <el-table-column prop="description" label="描述" width="180" />
        </el-table>
    </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios from "@/util/axios";

const props = defineProps(
    {
        dialogVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        date: {
            type: String,
            default: '',
            required: true
        }
    }
);
const tableData = ref([]);

const initPurchaseList = async () => {
    const res = await axios.post('order-serv/admin/purchase/getListByDate?date=' + props.date);
    tableData.value = res.data.result;
};
watch(
    () => props.dialogVisible,
    () => {
        if (props.dialogVisible === true) {
            initPurchaseList();
        }
    },
);
const emits = defineEmits(['update:modelValue']);
const handleClose = () => {
    emits('update:modelValue', false);
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
</style>