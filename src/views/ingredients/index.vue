<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入配料名称.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-button type="primary" :icon="Search" @click="initIngredientsList">搜索</el-button>
            <el-button type="primary" :icon="DocumentAdd" @click="handleDialogValue()">添加原料</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="原料名称" width="200" />
            <el-table-column prop="unit" label="单位" width="100" />
            <el-table-column prop="description" label="原料描述" width="200" />
            <el-table-column prop="isDressing" label="是调料包？" width="100" >
                <template v-slot="{row}">
                    <el-switch v-model="row.isDressing" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="300" >
                <template v-slot="scope">
                    <el-button type="primary" :icon="Edit"
                               @click="handleDialogValue(scope.row.id)">
                    </el-button>
                    <el-button type="danger" :icon="Delete"
                               @click="handleDelete(scope.row.id)">
                    </el-button>
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
    <Dialog v-model="dialogVisible"
            :id="ingredientId"
            :dialogVisible="dialogVisible"
            :dialog-title="dialogTitle"
            @initIngredientsList="initIngredientsList"
    ></Dialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, Delete, DocumentAdd, Edit} from '@element-plus/icons-vue';
import axios from '@/util/axios';
import {ElMessage, ElMessageBox} from "element-plus";
import Dialog from "@/views/ingredients/components/dialog";

const queryForm = ref({
    query: '',
    pageNum: 1,
    pageSize: 8
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const ingredientId = ref(-1);
const dialogTitle = ref('');

const initIngredientsList = async () => {
    const res = await axios.post('good-serv/admin/ingredient/list', queryForm.value);
    tableData.value = res.data.result.ingredientList;
    total.value = res.data.result.total;
};
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initIngredientsList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initIngredientsList();
}
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '确定删除该原料吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('good-serv/admin/ingredient/delete/' + id)
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            initIngredientsList();
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
    if (id) {
        ingredientId.value = id;
        dialogTitle.value = '修改原料';
    } else {
        ingredientId.value = -1;
        dialogTitle.value = '添加原料';
    }
    dialogVisible.value = true;
}

initIngredientsList();

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