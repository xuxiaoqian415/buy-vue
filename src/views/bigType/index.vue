<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入商品大类名称.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-button type="primary" :icon="Search" @click="initBigTypeList">搜索</el-button>
            <el-button type="primary" :icon="DocumentAdd" @click="handleDialogValue()">添加商品大类</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="商品大类名称" width="180" />
            <el-table-column prop="image" label="商品大类图片" width="200">
                <template v-slot="scope">
                    <img :src="getServerUrl()+'image/image/bigType/'+scope.row.image"
                         width="80" height="80" alt="can not find"/>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="商品大类描述" />
            <el-table-column prop="action" label="操作" width="300" fixed="right">
                <template v-slot="scope">
                    <el-button type="success"
                               @click="handleImageDialogValue(scope.row)">
                        更换图片
                    </el-button>
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
            :id="bigTypeId"
            :dialogVisible="dialogVisible"
            :dialog-title="dialogTitle"
            @initBigTypeList="initBigTypeList"
    ></Dialog>
    <ImageDialog v-model="imageDialogVisible"
                 :imageDialogValue="imageDialogValue"
                 @initBigTypeList="initBigTypeList"
    ></ImageDialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, DocumentAdd, Delete, Edit} from '@element-plus/icons-vue';
import axios, {getServerUrl} from '@/util/axios';
import Dialog from "@/views/bigType/components/dialog";
import ImageDialog from "@/views/bigType/components/imageDialog";
import {ElMessage, ElMessageBox} from "element-plus";

const queryForm = ref({
    query: '',
    pageNum: 1,
    pageSize: 8
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const imageDialogVisible = ref(false);
const bigTypeId = ref(-1);
const dialogTitle = ref('');
const imageDialogValue = ref({});

const initBigTypeList = async () => {
    const res = await axios.post('good-serv/admin/bigType/list', queryForm.value);
    tableData.value = res.data.result.bigTypeList;
    total.value = res.data.result.total;
}
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initBigTypeList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initBigTypeList();
}
const handleDialogValue = (id) => {
    if (id) {
        bigTypeId.value = id;
        dialogTitle.value = '修改商品大类';
    } else {
        bigTypeId.value = -1;
        dialogTitle.value = '添加商品大类';
    }
    dialogVisible.value = true;
}
const handleImageDialogValue = (row) => {
    imageDialogVisible.value = true;
    imageDialogValue.value = JSON.parse(JSON.stringify(row));
}
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '确定要删除该商品大类吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('good-serv/admin/bigType/delete/' + id)
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            initBigTypeList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}

initBigTypeList();

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