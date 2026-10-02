<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="商品ID" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品ID"
          clearable
          style="width: 160px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="审核状态"
          clearable
          style="width: 120px"
        >
          <el-option label="待审核" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
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

    <el-table v-loading="loading" :data="reviewList">
      <el-table-column label="ID" align="center" prop="reviewId" width="80" />
      <el-table-column
        label="商品ID"
        align="center"
        prop="productId"
        width="90"
      />
      <el-table-column
        label="昵称"
        align="center"
        prop="nickname"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column label="评分" align="center" width="100">
        <template slot-scope="scope">
          <span style="color: #ffb400; font-weight: bold; font-size: 16px">
            {{ "★".repeat(scope.row.rating)
            }}<span style="color: #ddd">{{
              "★".repeat(5 - scope.row.rating)
            }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="评价内容"
        align="center"
        prop="content"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.status === 1
                ? 'success'
                : scope.row.status === 0
                ? 'warning'
                : 'danger'
            "
            size="small"
          >
            {{
              scope.row.status === 0
                ? "待审核"
                : scope.row.status === 1
                ? "已通过"
                : "已拒绝"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="商家回复"
        align="center"
        prop="replyContent"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        label="评价时间"
        align="center"
        prop="createTime"
        width="160"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 0"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row, 1)"
            >通过</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            size="mini"
            type="text"
            icon="el-icon-close"
            @click="handleAudit(scope.row, 2)"
            >拒绝</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-chat-dot-round"
            @click="handleReply(scope.row)"
            >回复</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 回复对话框 -->
    <el-dialog
      title="回复评价"
      :visible.sync="replyOpen"
      width="500px"
      append-to-body
    >
      <el-input
        v-model="replyContent"
        type="textarea"
        :rows="4"
        placeholder="请输入回复内容"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReply">确 定</el-button>
        <el-button @click="replyOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReview, auditReview, replyReview } from "@/api/mall/review";

export default {
  name: "Review",
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      reviewList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productId: undefined,
        status: undefined,
      },
      replyOpen: false,
      replyContent: "",
      replyId: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listReview(this.queryParams).then((response) => {
        this.reviewList = response.rows;
        this.total = response.total;
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
      const statusText = status === 1 ? "通过" : "拒绝";
      this.$modal.confirm(`确认${statusText}该评价？`).then(() => {
        auditReview(row.reviewId, status).then(() => {
          this.$modal.msgSuccess(`已${statusText}`);
          this.getList();
        });
      });
    },
    handleReply(row) {
      this.replyId = row.reviewId;
      this.replyContent = row.replyContent || "";
      this.replyOpen = true;
    },
    submitReply() {
      if (!this.replyContent.trim()) {
        return this.$modal.msgWarning("请输入回复内容");
      }
      replyReview(this.replyId, this.replyContent).then(() => {
        this.$modal.msgSuccess("回复成功");
        this.replyOpen = false;
        this.getList();
      });
    },
  },
};
</script>
