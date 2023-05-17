<template>
    <el-card>
        <el-row :gutter="20" class="search">
            <el-col :span="7">
                <el-input placeholder="请输入商品名称.." v-model="queryForm.query" clearable></el-input>
            </el-col>
            <el-col :span="7">
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
            <el-button type="primary" :icon="DocumentAdd" @click="handleDialogValue()">添加商品</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="商品名称" width="120" fixed/>
            <el-table-column prop="proPic" label="商品首图" width="120">
                <template v-slot="scope">
                    <img :src="getServerUrl()+'image/image/product/'+scope.row.proPic"
                         width="80" height="80"/>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column prop="typeName" label="类别" width="100" />
            <el-table-column prop="isSwiper" label="首页轮播" width="100" align="center">
                <template v-slot="{row}">
                    <el-switch v-model="row.isSwiper" @change="swiperChangeHandle(row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="swiperPic" label="首页轮播图片" width="120" align="center">
                <template v-slot="scope">
                    <img :src="getServerUrl()+'image/image/swiper/'+scope.row.swiperPic"
                         width="150" height="75"/>
                </template>
            </el-table-column>
            <el-table-column prop="swiperSort" label="幻灯排序" width="100" align="center"/>
            <el-table-column prop="description" label="菜品描述" width="800"/>
            <el-table-column prop="ingredient" label="菜品配料" width="800"/>
            <el-table-column prop="steps" label="菜品步骤" width="800"/>
            <el-table-column prop="action" label="操作" width="200" fixed="right">
                <template v-slot="scope">
                    <el-button type="success"
                               @click="handleImageDialogValue(scope.row)"
                    >更换图片</el-button>
                    <el-button type="primary"
                               @click="handleDialogValue(scope.row.id)"
                    >首页轮播设置</el-button>
                    <el-button type="primary"
                               @click="handleDialogValue(scope.row.id)"
                    >详情页轮播图设置</el-button>
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
                :page-sizes="[3, 5, 10, 15]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </el-card>
    <Dialog v-model="dialogVisible"
            :id="productId"
            :dialogVisible="dialogVisible"
            :dialog-title="dialogTitle"
            @initProductList="initProductList"
    ></Dialog>
    <ImageDialog v-model="imageDialogVisible"
                 :imageDialogValue="imageDialogValue"
                 @initProductList="initProductList"
    ></ImageDialog>
</template>

<script setup>
import {ref} from 'vue';
import {Search, Delete, DocumentAdd, Edit} from '@element-plus/icons-vue';
import axios, {getServerUrl} from '@/util/axios';
import {ElMessage, ElMessageBox} from "element-plus";
import Dialog from "@/views/goods/components/dialog";
import ImageDialog from "@/views/goods/components/imageDialog.vue";

const queryForm = ref({
    query: '',
    typeId: null,
    pageNum: 1,
    pageSize: 3
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const productId = ref(-1);
const dialogTitle = ref('');
const smallTypeSelectList = ref([]);
const imageDialogVisible = ref(false);
const imageDialogValue = ref({});

const initProductList = async () => {
    const res = await axios.post('good-serv/admin/product/list', queryForm.value);
    tableData.value = res.data.result.productList;
    total.value = res.data.result.total;
};
const initSmallTypeSelectList = async () => {
    const res = await axios.get('good-serv/admin/smallType/getSelectList');
    smallTypeSelectList.value = res.data.result;
}
initSmallTypeSelectList();
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initProductList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initProductList();
}
const swiperChangeHandle = async (row) => {
    let res = await axios.get("good-serv/admin/product/update/"+row.id+"/swiper/"+row.isSwiper);
    if(res.data.code === 200){
        ElMessage({
            type:'success',
            message:'执行成功！'
        });
    }else{
        ElMessage({
            type:'error',
            message:res.data.msg
        });
    }
    initProductList();
}
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '确定删除该商品吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('good-serv/admin/product/delete/' + id)
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            initProductList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}
const handleImageDialogValue = (row) => {
    imageDialogVisible.value = true;
    imageDialogValue.value = JSON.parse(JSON.stringify(row));
}
const handleDialogValue = (id) => {
    dialogVisible.value = true;
}

initProductList();

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