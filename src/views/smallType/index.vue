<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入商品小类名称.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-col :span="7">
                <el-select v-model="queryForm.bigTypeId" clearable placeholder="请选择所属大类..">
                    <el-option
                        v-for="item in bigTypeSelectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-col>
            <el-button type="primary" :icon="Search" @click="initSmallTypeList">搜索</el-button>
            <el-button type="primary" :icon="DocumentAdd" @click="handleDialogValue()">添加商品小类</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="商品小类名称" width="200" />
            <el-table-column prop="bigTypeName" label="所属大类" width="200" />
            <el-table-column prop="remark" label="商品小类描述" />
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
            :id="smallTypeId"
            :dialogVisible="dialogVisible"
            :dialog-title="dialogTitle"
            @initSmallTypeList="initSmallTypeList"
    ></Dialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, Delete, DocumentAdd, Edit} from '@element-plus/icons-vue';
import axios from '@/util/axios';
import {ElMessage, ElMessageBox} from "element-plus";
import Dialog from "@/views/smallType/components/dialog";

const queryForm = ref({
    query: '',
    bigTypeId: null,
    pageNum: 1,
    pageSize: 8
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const smallTypeId = ref(-1);
const dialogTitle = ref('');
const bigTypeSelectList = ref([]);

const initSmallTypeList = async () => {
    const res = await axios.post('good-serv/admin/smallType/list', queryForm.value);
    tableData.value = res.data.result.smallTypeList;
    total.value = res.data.result.total;
};
const initBigTypeSelectList = async () => {
    const res = await axios.get('good-serv/admin/bigType/getSelectList');
    bigTypeSelectList.value = res.data.result;
}
initBigTypeSelectList();
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initSmallTypeList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initSmallTypeList();
}
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '确定删除该商品小类吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('good-serv/admin/smallType/delete/' + id)
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            initSmallTypeList();
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
        smallTypeId.value = id;
        dialogTitle.value = '修改商品小类';
    } else {
        smallTypeId.value = -1;
        dialogTitle.value = '添加商品小类';
    }
    dialogVisible.value = true;
}

initSmallTypeList();

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