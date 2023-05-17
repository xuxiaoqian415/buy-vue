<template>
  <el-dialog
    model-value="dialogVisible"
    title="订单商品详情"
    width="40%"
    @close="handleClose"
  >
      <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="goodPic" label="商品图片">
              <template v-slot="scope">
                  <img :src="getServerUrl()+'image/image/product/'+scope.row.goodPic"
                       width="80" height="80" alt="can not find"/>
              </template>
          </el-table-column>
          <el-table-column prop="goodName" label="商品名称" />
          <el-table-column prop="goodPrice" label="商品价格" width="100"/>
          <el-table-column prop="goodNum" label="商品数量" width="100"/>
      </el-table>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios, {getServerUrl} from "@/util/axios";

const tableData = ref([]);

const props = defineProps(
    {
        id: {
            type: Number,
            default: -1,
            required: true
        }
    }
)
const initOrderDetail = async (id) => {
    const res = await axios.get('order-serv/admin/order/detail/list/' + id);
    tableData.value = res.data.result;
}

watch(
    ()=>props.id,
    ()=>{
        let id = props.id;
        if (id !== -1) {
            initOrderDetail(id);
        }
    }
)

const emits = defineEmits(['update:modelValue']);
const handleClose = () => {
    emits('update:modelValue', false);
}
</script>

<style scoped>

</style>