<template>
    <el-dialog
        model-value="dialogVisible"
        title="菜品原料管理"
        width="50%"
        @close="handleClose"
        center
    >
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            style="text-align: center"
        >
            <el-form-item label="原料" prop="ingredientId">
                <el-select v-model="form.ingredientId" placeholder="请选择.."
                           @change="handleIngredientChange">
                    <el-option
                            v-for="item in ingredientSelectList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="number">
                <el-input v-model="form.number" style="width: 100px"/><el-form-item :label="unit"/>
            </el-form-item>
<!--            <template>-->
<!--                <el-autocomplete-->
<!--                    v-model="form.ingredient"-->
<!--                    :fetch-suggestions="querySearchAsync"-->
<!--                    placeholder="请选择原料.."-->
<!--                    @select="handleSelect"-->
<!--                />-->
<!--            </template>-->
            <el-form-item>
                <el-button type="primary" @click="handleConfirm">添加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="ingredientName" label="原料名称" width="100" />
            <el-table-column prop="number" label="数量" width="100" />
            <el-table-column prop="unit" label="单位" width="100" />
            <el-table-column prop="description" label="原料描述" width="200" />
            <el-table-column prop="action" label="操作" width="100" >
                <template v-slot="scope">
                    <el-button type="danger" :icon="Delete"
                               @click="handleDelete(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios from "@/util/axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete} from '@element-plus/icons-vue'

const props = defineProps(
    {
        dialogVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        productId: {
            type: Number,
            default: -1,
            required: true
        }
    }
);
const formRef = ref(null);
const ingredientSelectList = ref([]);
const unit = ref('');
const form = ref({
    productId: -1,
    ingredientId: '',
    number: ''
});
const rules = ref({
    ingredientId: [
        {
            required: true,
            message: '请选择要添加的原料'
        }
    ],
    number: [
        {
            required: true,
            message: '请输入原料数量'
        },
        {
            type:'number',
            message: '必须是数值类型',
            transform: (value) => Number(value)
        }
    ]
});
const tableData = ref([]);

const handleIngredientChange = (id) => {
    let item = ingredientSelectList.value.find(function (i) {
        return i.id === id;
    });
    unit.value = item.unit;
}
const initIngredientSelectList = async () => {
    const res = await axios.get('good-serv/admin/ingredient/getSelectList');
    ingredientSelectList.value = res.data.result;
}
initIngredientSelectList();
const initIngredientList = async (productId) => {
    const res = await axios.get('good-serv/admin/ingredient/listByProduct/' + productId);
    tableData.value = res.data.result;
};
watch(
    () => props.dialogVisible,
    () => {
        let id = props.productId;
        form.value.productId = id;
        console.log(id)
        console.log(props.dialogVisible)
        if (props.dialogVisible === true) {
            initIngredientList(id);
        }
    },
);
const emits = defineEmits(['update:modelValue']);
const handleConfirm = async () => {
    formRef.value.validate(async(valid)=>{
        if(valid){
            let res = await axios.post('good-serv/admin/ingredient/addToProduct', form.value);
            if (res.data.code === 200) {
                ElMessage.success("执行成功！");
                formRef.value.resetFields();
                initIngredientList(props.productId);
            } else {
                ElMessage.error(res.data.msg);
            }
        }
    })
}
const handleDelete = (id) =>{
    ElMessageBox.confirm(
        '您确定要删除这条记录吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async() => {
            let res=await axios.get('good-serv/admin/ingredient/deleteFromProduct/'+id)
            if(res.data.code === 200){
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                });
                initIngredientList(props.productId);
            }else{
                ElMessage({
                    type: 'error',
                    message: res.data.msg,
                });
            }
        })
        .catch(() => {
        })
}
const handleClose = () => {
    formRef.value.resetFields();
    form.value = {
        productId: -1,
        ingredient: ''
    };
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