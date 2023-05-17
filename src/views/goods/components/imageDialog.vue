<template>
  <el-dialog
    model-value="imageDialogVisible"
    title="菜品图片更换"
    width="30%"
    @close="handleClose"
    center
  >
      <el-form
        ref="formRef"
        :model="form"
        label-width="100px"
        style="text-align: center"
      >
          <el-upload
              :headers="headers"
              class="avatar-uploader"
              :action="getServerUrl()+'good-serv/admin/product/uploadImage'"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
          </el-upload>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
              <el-button type="primary" @click="handleConfirm">确认更换</el-button>
          </span>
      </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios, {getServerUrl} from "@/util/axios";
import {ElMessage} from "element-plus";
import { Plus } from '@element-plus/icons-vue'

const props = defineProps(
    {
        imageDialogValue: {
            type: Object,
            default: ()=>{},
            required: true
        }
    }
)
const formRef = ref(null);
const form = ref({
    id: -1,
    proPic: ''
});
const imageUrl = ref("");
const headers = ref({
    token:window.sessionStorage.getItem('token')
});

watch(
    () => props.imageDialogValue,
    () => {
        form.value = props.imageDialogValue;
        imageUrl.value = getServerUrl()+'image/image/product/' + form.value.proPic
    },
    {deep:true, immediate:true}
)
const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isJPG) {
        ElMessage.error('图片必须是jpg/png格式')
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5M!')
    }
    return isJPG && isLt5M
}
const handleAvatarSuccess = (res) => {
    console.log(res)
    imageUrl.value = getServerUrl() + res.result.src;
    form.value.proPic = res.result.imageName;
}
const emits = defineEmits(['update:modelValue','initProductList']);
const handleConfirm = async () => {
    let res = await axios.post('good-serv/admin/product/save', form.value);
    if (res.data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        emits('initProductList');
        handleClose();
    } else {
        ElMessage.error(res.data.msg);
    }
}
const handleClose = () => {
    formRef.value.resetFields();
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
.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>