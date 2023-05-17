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
            <el-form-item label="小类名称" prop="name">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="所属大类" prop="bigTypeId">
                <el-select v-model="form.bigTypeId" placeholder="请选择..">
                    <el-option
                        v-for="item in bigTypeSelectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="小类描述" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="4"/>
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
    id:-1,
    name:"",
    remark:"",
    bigTypeId: null
});
const rules = ref({
    name: [
        {
            required: true,
            message: '请输入商品小类名称！'
        }
    ],
    remark: [
        {
            required: true,
            message: '请输入商品小类描述！'
        }
    ],
    bigTypeId: [
        {
            required: true,
            message: '请选择商品大类！'
        }
    ]
});
const bigTypeSelectList = ref([]);

const initBigTypeSelectList = async () => {
    const res = await axios.get('good-serv/admin/bigType/getSelectList');
    bigTypeSelectList.value = res.data.result;
}
initBigTypeSelectList();
watch(
    ()=>props.dialogVisible,
    ()=>{
        let id = props.id;
        if (id !== -1 && props.dialogVisible === true) {
            initFormData(id);
        }
        if (id === -1) {
            form.value = {
                id:-1,
                name:"",
                remark:""
            }
        }
    }
);
const emits = defineEmits(['update:modelValue','initSmallTypeList']);
const initFormData = async (id) => {
    const res = await axios.get('good-serv/admin/smallType/detail/' + id);
    form.value = res.data.result;
}
const handleConfirm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            console.log(form.value.bigTypeId)
            let res = await axios.post('good-serv/admin/smallType/save', form.value);
            if (res.data.code == 200) {
                ElMessage.success("执行成功！");
                formRef.value.resetFields();
                emits('initSmallTypeList');
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