<template>
    <el-dialog
            model-value="dialogVisible"
            :title="dialogTitle"
            width="60%"
            @close="handleClose"
    >
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
        >
            <el-form-item label="菜品名称" prop="name">
                <el-input v-model="form.name" style="width: 400px"/>
            </el-form-item>
            <el-form-item label="菜品价格" prop="price">
                <el-input v-model="form.price" style="width: 100px"/>
            </el-form-item>
            <el-form-item label="菜品库存" prop="stock">
                <el-input v-model="form.stock" style="width: 100px"/>
            </el-form-item>
            <el-form-item label="菜品类别">
                <el-select v-model="bigTypeId" class="m-2" placeholder="请选择商品大类..."
                           @change="handleBigTypeChange">
                    <el-option
                        v-for="item in bigTypeSelectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                &nbsp;&nbsp;
                <el-select v-model="form.typeId" class="m-2" placeholder="请选择商品小类..." >
                    <el-option
                        v-for="item in smallTypeSelectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜品描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="4"/>
            </el-form-item>
            <el-form-item label="菜品配料">
            </el-form-item>
            <QuillEditor
                ref="ingredientEditor"
                v-model:content="form.ingredient"
                contentType="html"
                toolbar="full"
                theme="snow"
                style="height:200px"
            />
            <el-form-item label="制作步骤">
            </el-form-item>
            <QuillEditor
                ref="stepsEditor"
                v-model:content="form.steps"
                contentType="html"
                toolbar="full"
                theme="snow"
                style="height:200px"
            />
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
import {defineEmits, defineProps, ref, toRaw, watch} from "vue";
import axios from "@/util/axios";
import {ElMessage} from "element-plus";

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
const bigTypeId = ref("");
const bigTypeSelectList = ref([]);
const smallTypeSelectList = ref([]);
const formRef = ref(null);
const ingredientEditor = ref();
const stepsEditor = ref();
const form = ref({
    id: -1,
    name: '',
    price: null,
    stock: null,
    typeId: '',
    description: '',
    ingredient: '',
    steps: ''
});
const rules=ref({
    name:[
        {required: true, message: '请输入菜品名称！'},
    ],
    price:[
        { required: true, message: '请输入菜品价格！' },
        { type: 'number', message: '菜品价格是数值类型！',transform: (value) => Number(value) },
    ],
    stock:[
        { type: 'number', message: '菜品库存是数值类型！',transform: (value) => Number(value) },
    ],
    description:[
        {required: true, message: '请输入菜品描述！'},
    ]
})

const initFormData = async (id) => {
    const res = await axios.get("good-serv/admin/product/detail/"+id);
    bigTypeId.value = res.data.result.bigTypeId;
    initSmallTypeSelectList(bigTypeId.value);
    form.value = res.data.result;
    toRaw(ingredientEditor.value).setHTML(form.value.ingredient);
    toRaw(stepsEditor.value).setHTML(form.value.steps);
}
const initBigTypeSelectList = async () => {
    const res = await axios.get('good-serv/admin/bigType/getSelectList');
    bigTypeSelectList.value = res.data.result;
}
initBigTypeSelectList();
const handleBigTypeChange = (bigTypeId) => {
    initSmallTypeSelectList(bigTypeId);
}
const initSmallTypeSelectList = async (bigTypeId) => {
    form.value.typeId = ""
    const res = await axios.post("good-serv/admin/smallType/getSelectList?bigTypeId="+bigTypeId);
    smallTypeSelectList.value = res.data.result;
}

watch(
    () => props.dialogVisible,
    ()=>{
        let id = props.id;
        if (id !== -1 && props.dialogVisible === true) {
            initFormData(id);
        }
        if (id === -1) {
            form.value = {
                id: -1,
                name: '',
                price: null,
                stock: null,
                typeId: '',
                description: '',
                ingredient: '',
                steps: ''
            }
        }
    }
);
const handleConfirm=()=>{
    formRef.value.validate(async (valid) => {
        if(valid){
            if(form.value.typeId === ""){
                ElMessage.error("请选择商品大类");
                return;
            }
            let res = await axios.post("good-serv/admin/product/save", form.value);
            if(res.data.code === 200){
                ElMessage.success("执行成功！")
                formRef.value.resetFields();
                emits("initProductList")
                handleClose();
            }else{
                ElMessage.error(res.data.msg);
            }
        }else{
            console.log("fail")
        }
    })
}
const emits = defineEmits(['update:modelValue','initProductList']);
const handleClose = () => {
    formRef.value.resetFields();
    bigTypeId.value = "";
    toRaw(ingredientEditor.value).setHTML('');
    toRaw(stepsEditor.value).setHTML('');
    form.value = {
        id: -1,
        name: '',
        price: null,
        stock: null,
        typeId: '',
        description: '',
        ingredient: '',
        steps: ''
    }
    emits('update:modelValue', false);
}
</script>

<style scoped>

</style>