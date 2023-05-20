<template>
    <el-dialog
            model-value="dialogVisible"
            :title="dialogTitle"
            width="40%"
            @close="handleClose"
    >
        <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="150px"
        >
            <el-form-item label="原料名称" prop="name">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="原料单位" prop="unit">
                <el-select v-model="form.unit" placeholder="请选择..">
                    <el-option label="克" value="g"></el-option>
                    <el-option label="个" value="个"></el-option>
                    <el-option label="只" value="只"></el-option>
                    <el-option label="份" value="份"></el-option>
                    <el-option label="斤" value="斤"></el-option>
                    <el-option label="千克" value="kg"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="原料描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="4"/>
            </el-form-item>
            <el-form-item label="是否为调料包" prop="isDressing">
                <el-select v-model="form.isDressing" placeholder="请选择..">
                    <el-option label="否" value="false"></el-option>
                    <el-option label="是" value="true"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="handleConfirm">确认</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios from "@/util/axios";
import {ElMessage} from "element-plus";

const formRef = ref(null);
const props = defineProps(
    {
        id: {
            type: Number,
            default: -1,
            required: true
        },
        dialogTitle: {
            type: String,
            default: '',
            required: true
        },
        dialogVisible: {
            type: Boolean,
            default: false,
            required: true
        }
    }
);
const form = ref({
    id: -1,
    name: "",
    unit: "",
    description: "",
    isDressing: ""
});
const rules = ref({
    name: [
        {
            required: true,
            message: '请输入原料名称！'
        }
    ],
    unit: [
        {
            required: true,
            message: '请选择原料单位！'
        }
    ],
    isDressing: [
        {
            required: true,
            message: '请选择是否为配料！'
        }
    ]
});
watch(
    ()=>props.dialogVisible,
    ()=>{
        let id = props.id;
        if (id !== -1 && props.dialogVisible === true) {
            initFormData(id);
        }
        if (id === -1) {
            form.value = {
                id: -1,
                name: "",
                unit: "",
                description: "",
                isDressing: ""
            }
        }
    }
);
const emits = defineEmits(['update:modelValue','initIngredientsList']);
const initFormData = async (id) => {
    const res = await axios.get('good-serv/admin/ingredient/detail/' + id);
    form.value = res.data.result;
}
const handleConfirm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let res = await axios.post('good-serv/admin/ingredient/save', form.value);
            if (res.data.code === 200) {
                ElMessage.success("执行成功！");
                formRef.value.resetFields();
                emits('initIngredientsList');
                handleClose();
            } else {
                ElMessage.error(res.data.msg);
            }
        } else {
            console.log("fail");
        }
    })
}
const handleClose = () => {
    formRef.value.resetFields();
    emits('update:modelValue', false);
}
</script>

<style scoped>

</style>