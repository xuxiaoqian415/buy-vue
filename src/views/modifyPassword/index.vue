<template>
  <el-card>
      <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="150px"
      >
          <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName" readonly/>
          </el-form-item>
          <el-form-item label="旧密码" prop="password">
              <el-input v-model="form.password" type="password"/>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form.newPassword" type="password"/>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newPassword2">
              <el-input v-model="form.newPassword2" type="password"/>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm">
                  确认修改
              </el-button>
              <el-button @click="resetForm(formRef)">重置</el-button>
          </el-form-item>
      </el-form>
  </el-card>
</template>

<script setup>
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import axiosUtil from '@/util/axios';
import router from "@/router";

const form = ref({
    userName: '',
    password: '',
    newPassword: '',
    newPassword2: ''
});
const rules = ref({
    userName: [
        {required: true}
    ],
    password: [
        {required: true, message: '请输入原先的密码'}
    ],
    newPassword: [
        {required: true, message: '请输入新的密码'}
    ],
    newPassword2: [
        {required: true, message: '请确认新密码'}
    ]
});
const formRef = ref(null);
const initFormData = () => {
    const userName = window.sessionStorage.getItem("userName");
    form.value.userName = userName;
}
const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            if (form.value.newPassword !== form.value.newPassword2) {
                ElMessage.error("两次新密码不一致！");
            } else {
                try {
                    const res = await axiosUtil.post("user-serv/user/modifyPassword", form.value);
                    const data = res.data;
                    if (data.code === 200) {
                        ElMessage.success({
                            message: "密码修改成功，正在跳转至登录页..",
                            duration: 3000
                        });
                        // formRef.value.resetFields();
                        window.sessionStorage.clear();
                        router.replace("/login");
                    } else {
                        ElMessage.error(data.msg);
                    }
                } catch (err) {
                    console.log(err);
                    ElMessage.error("系统错误，请联系管理员！");
                }
            }
        } else {
            console.log("fail");
        }
    });
}

initFormData();

</script>

<style lang="scss" scoped>
.el-input {
    width: 300px;
}
</style>