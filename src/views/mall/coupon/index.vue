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
      <el-form-item label="优惠券名" prop="couponName">
        <el-input
          v-model="queryParams.couponName"
          placeholder="请输入优惠券名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="券类型"
          clearable
          style="width: 120px"
        >
          <el-option label="满减券" :value="1" />
          <el-option label="立减券" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          style="width: 120px"
        >
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:coupon:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:coupon:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="couponList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" align="center" prop="couponId" width="80" />
      <el-table-column
        label="优惠券名称"
        align="center"
        prop="couponName"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column label="类型" align="center" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type === 1 ? 'warning' : 'success'"
            size="small"
          >
            {{ scope.row.type === 1 ? "满减" : "立减" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="门槛(元)"
        align="center"
        prop="threshold"
        width="90"
      />
      <el-table-column
        label="优惠(元)"
        align="center"
        prop="discount"
        width="90"
      >
        <template slot-scope="scope">
          <span style="color: #e53935; font-weight: bold"
            >-¥{{ scope.row.discount }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="总量"
        align="center"
        prop="totalCount"
        width="70"
      />
      <el-table-column
        label="剩余"
        align="center"
        prop="remainCount"
        width="70"
      >
        <template slot-scope="scope">
          <span :style="{ color: scope.row.remainCount <= 0 ? '#ccc' : '' }">
            {{ scope.row.remainCount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" align="center" width="160">
        <template slot-scope="scope">
          <span style="font-size: 12px">
            {{ scope.row.startTime }}<br />至 {{ scope.row.endTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="领取对象" align="center" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="
              scope.row.targetType === 0
                ? ''
                : scope.row.targetType === 1
                ? 'warning'
                : 'danger'
            "
            size="small"
          >
            {{
              scope.row.targetType === 0
                ? "所有用户"
                : scope.row.targetType === 1
                ? "仅会员"
                : "Lv" + (scope.row.minUserLevel || 0) + "+"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'info'"
            size="small"
          >
            {{ scope.row.status === 1 ? "启用" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:coupon:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:coupon:remove']"
            >删除</el-button
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

    <!-- 添加或修改优惠券对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="form.couponName" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">满减券</el-radio>
            <el-radio :label="2">立减券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="满减门槛" prop="threshold" v-if="form.type === 1">
          <el-input-number
            v-model="form.threshold"
            :min="0"
            :precision="2"
            placeholder="满多少元可用"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="优惠金额" prop="discount">
          <el-input-number
            v-model="form.discount"
            :min="0.01"
            :precision="2"
            placeholder="优惠金额(元)"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="发放总量" prop="totalCount">
          <el-input-number
            v-model="form.totalCount"
            :min="1"
            placeholder="发放总量"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="有效期" prop="dateRange">
          <el-date-picker
            v-model="form.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="领取对象" prop="targetType">
          <el-radio-group v-model="form.targetType">
            <el-radio :label="0">所有用户</el-radio>
            <el-radio :label="1">仅会员</el-radio>
            <el-radio :label="2">指定等级以上</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="最低等级"
          prop="minUserLevel"
          v-if="form.targetType === 2"
        >
          <el-input-number
            v-model="form.minUserLevel"
            :min="1"
            :max="10"
            placeholder="最低用户等级"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCoupon,
  getCoupon,
  addCoupon,
  updateCoupon,
  delCoupon,
} from "@/api/mall/coupon";

export default {
  name: "Coupon",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      couponList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        couponName: undefined,
        type: undefined,
        status: undefined,
      },
      form: {},
      rules: {
        couponName: [
          { required: true, message: "优惠券名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择券类型", trigger: "change" }],
        discount: [
          { required: true, message: "优惠金额不能为空", trigger: "blur" },
        ],
        totalCount: [
          { required: true, message: "发放总量不能为空", trigger: "blur" },
        ],
        dateRange: [
          { required: true, message: "请选择有效期", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询优惠券列表 */
    getList() {
      this.loading = true;
      listCoupon(this.queryParams).then((response) => {
        this.couponList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        couponId: null,
        couponName: null,
        type: 1,
        threshold: 0,
        discount: null,
        totalCount: null,
        dateRange: [],
        startTime: null,
        endTime: null,
        targetType: 0,
        minUserLevel: null,
        status: 1,
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.couponId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加优惠券";
    },
    handleUpdate(row) {
      this.reset();
      const couponId = row.couponId || this.ids;
      getCoupon(couponId).then((response) => {
        this.form = response.data;
        if (this.form.startTime && this.form.endTime) {
          this.form.dateRange = [this.form.startTime, this.form.endTime];
        }
        this.open = true;
        this.title = "修改优惠券";
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 处理日期范围
          if (this.form.dateRange && this.form.dateRange.length === 2) {
            this.form.startTime = this.form.dateRange[0];
            this.form.endTime = this.form.dateRange[1];
          }
          // 立减券门槛设为0
          if (this.form.type === 2) {
            this.form.threshold = 0;
          }
          if (this.form.couponId != null) {
            updateCoupon(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCoupon(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const couponIds = row.couponId || this.ids;
      this.$modal
        .confirm('是否确认删除优惠券编号为"' + couponIds + '"的数据项？')
        .then(function () {
          return delCoupon(couponIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
