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
          <el-table-column prop="userName" label="USERNAME" width="180" />
          <el-table-column prop="createTime" label="注册时间" width="200" />
          <el-table-column prop="deleted" label="状态" :formatter="userStatusFormatter" />
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
import {Search} from '@element-plus/icons-vue';
import axios from '@/util/axios';

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
const initUserList = async () => {
    const res = await axios.post('user-serv/admin/user/list', queryForm.value);
    tableData.value = res.data.result.userList;
    total.value = res.data.result.total;
}
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