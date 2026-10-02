<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option label="待审核" :value="10" />
          <el-option label="已通过" :value="20" />
          <el-option label="已拒绝" :value="30" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column
        label="售后ID"
        align="center"
        prop="afterSaleId"
        width="180"
      />
      <el-table-column
        label="订单编号"
        align="center"
        prop="orderNo"
        width="180"
      />
      <el-table-column
        label="用户ID"
        align="center"
        prop="userId"
        width="100"
      />
      <el-table-column label="退款金额(元)" align="center" prop="refundAmount">
        <template slot-scope="scope">
          <span style="color: red; font-weight: bold"
            >¥{{ scope.row.refundAmount }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="申请原因"
        align="center"
        prop="reason"
        show-overflow-tooltip
      />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 10" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 20" type="success"
            >审核通过</el-tag
          >
          <el-tag v-else-if="scope.row.status === 30" type="danger"
            >已拒绝</el-tag
          >
          <el-tag v-else type="info">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="处理备注"
        align="center"
        prop="remark"
        show-overflow-tooltip
      />
      <el-table-column
        label="申请时间"
        align="center"
        prop="createTime"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 10 || scope.row.status === 1"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row, 20)"
            >同意售后</el-button
          >
          <el-button
            v-if="scope.row.status === 10 || scope.row.status === 1"
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleAudit(scope.row, 30)"
            >拒绝售后</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 拒绝弹窗 -->
    <el-dialog
      title="拒绝售后"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="拒绝原因" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入拒绝退款的原因"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReject">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAfterSale, auditAfterSale } from "@/api/mall/aftersale";

export default {
  name: "AfterSale",
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
        status: undefined,
      },
      open: false,
      form: {
        id: null,
        remark: "",
      },
      rules: {
        remark: [
          { required: true, message: "拒绝原因不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listAfterSale(this.queryParams).then((res) => {
        this.list = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAudit(row, status) {
      if (status === 20) {
        this.$modal
          .confirm("确认同意该订单的售后申请吗？")
          .then(() => {
            return auditAfterSale({
              afterSaleId: row.afterSaleId,
              status: 20,
              auditRemark: "商家同意售后",
            });
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("已同意售后");
          })
          .catch(() => {});
      } else if (status === 30) {
        this.form.id = row.afterSaleId;
        this.form.remark = "";
        this.open = true;
      }
    },
    submitReject() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          auditAfterSale({
            afterSaleId: this.form.id,
            status: 30,
            auditRemark: this.form.remark,
          }).then(() => {
            this.$modal.msgSuccess("已拒绝售后");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    cancel() {
      this.open = false;
      this.form = { id: null, remark: "" };
    },
  },
};
</script>
