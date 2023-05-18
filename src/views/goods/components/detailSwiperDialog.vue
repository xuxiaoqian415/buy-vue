<template>
  <el-dialog
    model-value="detailSwiperDialogVisible"
    title="详情页轮播图管理"
    width="30%"
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
          <el-form-item label="排列序号" prop="sort">
              <el-input v-model="form.sort" style="width: 100px"/>
          </el-form-item>
          <el-upload
              :headers="headers"
              class="avatar-uploader"
              :action="getServerUrl()+'good-serv/admin/product/uploadImage/3'"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
          </el-upload>
          <el-form-item>
              <el-button type="primary" @click="handleConfirm">添加</el-button>
          </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="image" label="轮播图片">
              <template v-slot="scope">
                  <img :src="getServerUrl()+'image/image/productSwiper/'+scope.row.image"
                       width="80" height="80"/>
              </template>
          </el-table-column>
          <el-table-column prop="sort" label="排列序号" width="100"/>
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
import axios, {getServerUrl} from "@/util/axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, Plus} from '@element-plus/icons-vue'

const props = defineProps(
    {
        detailSwiperDialogVisible: {
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
const form = ref({
    productId: -1,
    image: '',
    sort: null
});
const rules=ref({
    sort: [
        {
            required: true,
            message: '请输入排列序号'
        },
        {
            type:'number',
            message: '排序序号必须是数值类型',
            transform: (value) => Number(value)
        }
    ]
});
const imageUrl = ref("");
const tableData = ref([]);
const headers = ref({
    token:window.sessionStorage.getItem('token')
});
const initImageList = async (productId) => {
    const res = await axios.get('good-serv/admin/product/detailSwiperList/' + productId);
    tableData.value = res.data.result;
};
watch(
    () => props.detailSwiperDialogVisible,
    () => {
        if (props.detailSwiperDialogVisible === true) {
            form.value.productId = props.productId;
            initImageList(props.productId);
        }
    },
    {deep:true, immediate:true}
);
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
    form.value.image = res.result.imageName;
}
const emits = defineEmits(['update:modelValue']);
const handleConfirm = async () => {
    formRef.value.validate(async(valid)=>{
        if(valid){
            let res = await axios.post('good-serv/admin/product/add/detailSwiper', form.value);
            if (res.data.code === 200) {
                ElMessage.success("执行成功！");
                formRef.value.resetFields();
                initImageList(props.productId);
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
            let res=await axios.get('good-serv/admin/product/delete/detailSwiper/'+id)
            if(res.data.code === 200){
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                });
                initImageList(props.productId);
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
        image: '',
        sort: null
    };
    imageUrl.value = "";
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