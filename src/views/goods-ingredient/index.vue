<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入菜品名称.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-col :span="5">
                <el-select v-model="queryForm.typeId" clearable placeholder="请选择所属小类..">
                    <el-option
                            v-for="item in smallTypeSelectList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                </el-select>
            </el-col>
            <el-button type="primary" :icon="Search" @click="initProductList">搜索</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="菜品名称" width="120" />
            <el-table-column prop="proPic" label="菜品首图" width="120">
                <template v-slot="scope">
                    <img :src="getServerUrl()+'image/image/product/'+scope.row.proPic"
                         width="80" height="80"/>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column prop="typeName" label="类别" width="100" />
            <el-table-column prop="ingredient" label="菜品配料" width="500" :show-overflow-tooltip='true'/>
            <el-table-column prop="action" label="操作" width="200">
                <template v-slot="scope">
                    <el-button type="primary" :icon="Setting"
                               @click="handleIngredientDialogValue(scope.row.id)"
                    >菜品原料管理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                v-model:current-page="queryForm.pageNum"
                v-model:page-size="queryForm.pageSize"
                :page-sizes="[4, 8, 12, 16]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </el-card>
    <Dialog v-model="dialogVisible"
            :dialogVisible="dialogVisible"
            :productId="productId"
    ></Dialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, Setting} from '@element-plus/icons-vue';
import axios, {getServerUrl} from '@/util/axios';
import Dialog from "@/views/goods-ingredient/components/dialog";

const queryForm = ref({
    query: '',
    typeId: null,
    pageNum: 1,
    pageSize: 4
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const productId = ref(-1);
const smallTypeSelectList = ref([]);

const initSmallTypeSelectList = async () => {
    const res = await axios.get('good-serv/admin/smallType/getSelectList?bigTypeId=0');
    smallTypeSelectList.value = res.data.result;
}
initSmallTypeSelectList();
const initProductList = async () => {
    const res = await axios.post('good-serv/admin/product/list', queryForm.value);
    tableData.value = res.data.result.productList;
    total.value = res.data.result.total;
};
initProductList();
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initProductList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initProductList();
}
const handleIngredientDialogValue = (id) => {
    dialogVisible.value = true;
    productId.value = id;
}
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