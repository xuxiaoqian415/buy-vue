<template>
  <el-card>
      <el-row :gutter="20" class="search">
          <el-col :span="7">
              <el-input placeholder="请输入用户昵称.." v-model="queryForm.query" clearable></el-input>
          </el-col>
          <el-button type="primary" :icon="Search" @click="initUserList">搜索</el-button>
      </el-row>
      <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="nickName" label="昵称" width="150" />
          <el-table-column prop="avatarUrl" label="头像" width="120">
              <template v-slot="scope">
                  <img :src="scope.row.avatarUrl" width="50" height="50"/>
              </template>
          </el-table-column>
          <el-table-column prop="openId" label="openID"  width="280"/>
          <el-table-column prop="createTime" label="注册时间" width="180"/>
          <el-table-column prop="lastLoginDate" label="最后登录日期" width="180"/>
          <el-table-column prop="deleted" label="状态" :formatter="userStatusFormatter" />
          <el-table-column prop="action" label="操作" width="200" fixed="right">
              <template v-slot="scope">
                  <el-button type="danger"
                             :disabled="scope.row.deleted == 0 ? false : true"
                             @click="handleStatus(scope.row.id, 1)">
                      禁用
                  </el-button>
                  <el-button type="success"
                             :disabled="scope.row.deleted == 1 ? false : true"
                             @click="handleStatus(scope.row.id, 0)">
                      启用
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
</template>

<script setup>
import {ref} from 'vue';
import {Delete, Search} from '@element-plus/icons-vue';
import axios from '@/util/axios';
import {ElMessage, ElMessageBox} from "element-plus";

const queryForm = ref({
    query: '',
    pageNum: 1,
    pageSize: 8
});
const total = ref(0);
const tableData = ref([]);

const userStatusFormatter = (row) => {
    switch (row.deleted) {
        case 0:
            return "正常"
        case 1:
            return "已禁用"
    }
}
const handleStatus = (id, status) => {
    ElMessageBox.confirm(
        '您确定要修改该用户状态吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let res = await axios.get('user-serv/admin/user/updateWxUser/' + id + '/' + status);
        if (res.data.code === 200) {
            ElMessage({
                type: 'success',
                message: '执行成功',
            })
            initUserList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}
const initUserList = async () => {
    const res = await axios.post('user-serv/admin/user/wx/list', queryForm.value);
    tableData.value = res.data.result.userList;
    total.value = res.data.result.total;
};
const handleSizeChange = (pageSize) => {
    queryForm.value.pageNum = 1;
    queryForm.value.pageSize = pageSize;
    initUserList();
}
const handleCurrentChange = (pageNum) => {
    queryForm.value.pageNum = pageNum;
    initUserList();
}

initUserList();

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