<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
          style="width: 140px"
        >
          <el-option label="待付款" :value="10" />
          <el-option label="待发货" :value="20" />
          <el-option label="待收货" :value="30" />
          <el-option label="已完成" :value="40" />
          <el-option label="已取消" :value="50" />
          <el-option label="售后中" :value="60" />
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

    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="订单号"
        align="center"
        prop="orderNo"
        width="160"
      />
      <el-table-column
        label="订单金额(元)"
        align="center"
        prop="totalAmount"
        width="100"
      >
        <template slot-scope="scope">
          <span>¥{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="支付方式"
        align="center"
        prop="payType"
        width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.payType === 'wechat'">微信</span>
          <span v-else-if="scope.row.payType === 'alipay'">支付宝</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配送方式"
        align="center"
        prop="deliveryType"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deliveryType === 1" type="primary" size="mini"
            >快递</el-tag
          >
          <el-tag
            v-else-if="scope.row.deliveryType === 2"
            type="warning"
            size="mini"
            >同城</el-tag
          >
          <el-tag
            v-else-if="scope.row.deliveryType === 3"
            type="info"
            size="mini"
            >自提</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="下单人" align="center" prop="consignee" />
      <el-table-column
        label="联系电话"
        align="center"
        prop="phone"
        width="120"
      />
      <el-table-column label="订单状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 10" type="warning">待付款</el-tag>
          <el-tag v-else-if="scope.row.status === 20" type="primary"
            >待发货</el-tag
          >
          <el-tag v-else-if="scope.row.status === 30" type="info"
            >待收货</el-tag
          >
          <el-tag v-else-if="scope.row.status === 40" type="success"
            >已完成</el-tag
          >
          <el-tag v-else-if="scope.row.status === 50" type="danger"
            >已取消</el-tag
          >
          <el-tag v-else-if="scope.row.status === 60" type="danger"
            >售后中</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
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
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-truck"
            v-if="scope.row.status === 20"
            @click="handleShip(scope.row)"
            >发货</el-button
          >
          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, scope.row)"
            v-if="[10, 20, 30, 60].includes(scope.row.status)"
          >
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right"
              >改状态</el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.status === 10" command="cancel"
                >取消订单</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.status === 30"
                command="complete"
                >完成订单</el-dropdown-item
              >
              <el-dropdown-item command="forceCancel"
                >强行取消</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 发货对话框 -->
    <el-dialog
      title="订单发货"
      :visible.sync="shipOpen"
      width="500px"
      append-to-body
    >
      <el-form
        ref="shipForm"
        :model="shipForm"
        :rules="shipRules"
        label-width="80px"
      >
        <el-form-item label="快递公司" prop="expressCompany">
          <el-select
            v-model="shipForm.expressCompany"
            placeholder="请选择快递公司"
            style="width: 100%"
          >
            <el-option label="顺丰速运" value="顺丰速运" />
            <el-option label="中通快递" value="中通快递" />
            <el-option label="圆通速递" value="圆通速递" />
            <el-option label="韵达快递" value="韵达快递" />
            <el-option label="京东物流" value="京东物流" />
            <el-option label="邮政EMS" value="邮政EMS" />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNo">
          <el-input v-model="shipForm.expressNo" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShip">确 定</el-button>
        <el-button @click="shipOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <el-dialog
      title="订单详情"
      :visible.sync="detailOpen"
      width="800px"
      append-to-body
    >
      <div v-if="currentOrder">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="订单号">{{
            currentOrder.orderNo
          }}</el-descriptions-item>
          <el-descriptions-item label="订单金额"
            >{{ currentOrder.totalAmount }} 元</el-descriptions-item
          >
          <el-descriptions-item
            label="收货人"
            v-if="currentOrder.deliveryType !== 3"
            >{{ currentOrder.consignee }}</el-descriptions-item
          >
          <el-descriptions-item label="联系电话">{{
            currentOrder.phone
          }}</el-descriptions-item>
          <el-descriptions-item label="配送方式">
            {{
              currentOrder.deliveryType === 1
                ? "快递"
                : currentOrder.deliveryType === 2
                ? "同城配送"
                : "门店自提"
            }}
          </el-descriptions-item>
          <el-descriptions-item
            label="自提门店ID"
            v-if="currentOrder.deliveryType === 3"
          >
            {{ currentOrder.storeId }}
          </el-descriptions-item>
          <el-descriptions-item
            label="收货地址"
            :span="2"
            v-if="currentOrder.deliveryType !== 3"
            >{{ currentOrder.address }}</el-descriptions-item
          >
          <el-descriptions-item label="买家备注" :span="2">{{
            currentOrder.remark || "无"
          }}</el-descriptions-item>
          <el-descriptions-item
            label="物流公司"
            v-if="currentOrder.status >= 30 && currentOrder.deliveryType === 1"
            >{{ currentOrder.expressCompany || "无" }}</el-descriptions-item
          >
          <el-descriptions-item
            label="物流单号"
            v-if="currentOrder.status >= 30 && currentOrder.deliveryType === 1"
            >{{ currentOrder.expressNo || "无" }}</el-descriptions-item
          >
        </el-descriptions>

        <h4 style="margin-top: 20px">商品明细</h4>
        <el-table :data="currentOrderItems" border size="small">
          <el-table-column label="商品图片" width="80" align="center">
            <template slot-scope="scope">
              <image-preview
                :src="scope.row.productImage"
                :width="50"
                :height="50"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="productName" />
          <el-table-column
            label="单价"
            prop="price"
            width="100"
            align="center"
          />
          <el-table-column
            label="数量"
            prop="quantity"
            width="80"
            align="center"
          />
          <el-table-column label="小计" width="100" align="center">
            <template slot-scope="scope">
              ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  shipOrder,
  updateOrderStatus,
} from "@/api/mall/order";

export default {
  name: "Order",
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      orderList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: undefined,
        status: undefined,
        userId: undefined,
      },
      shipOpen: false,
      shipForm: {
        orderId: null,
        expressCompany: undefined,
        expressNo: undefined,
      },
      shipRules: {
        expressCompany: [
          { required: true, message: "请选择快递公司", trigger: "change" },
        ],
        expressNo: [
          { required: true, message: "请输入快递单号", trigger: "blur" },
        ],
      },
      detailOpen: false,
      currentOrder: null,
      currentOrderItems: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows || [];
        this.total = response.total || 0;
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
    handleSelectionChange(selection) {
      // reserved for potential bulk actions
    },
    handleDetail(row) {
      getOrder(row.orderId).then((res) => {
        this.currentOrder = res.data.order;
        this.currentOrderItems = res.data.items;
        this.detailOpen = true;
      });
    },
    handleShip(row) {
      this.shipForm = {
        orderId: row.orderId,
        expressCompany: undefined,
        expressNo: undefined,
      };
      this.resetForm("shipForm");
      this.shipOpen = true;
    },
    submitShip() {
      this.$refs["shipForm"].validate((valid) => {
        if (valid) {
          shipOrder(this.shipForm).then((res) => {
            this.$modal.msgSuccess("发货成功");
            this.shipOpen = false;
            this.getList();
          });
        }
      });
    },
    handleCommand(command, row) {
      if (command === "cancel") {
        this.changeStatus(row, 50, "取消订单");
      } else if (command === "complete") {
        this.changeStatus(row, 40, "完成订单");
      } else if (command === "forceCancel") {
        this.changeStatus(row, 50, "强行取消订单");
      }
    },
    changeStatus(row, newStatus, operateName) {
      this.$modal
        .confirm(
          '是否确认对订单 "' +
            row.orderNo +
            '" 执行【' +
            operateName +
            "】操作？"
        )
        .then(function () {
          return updateOrderStatus(row.orderId, newStatus);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(operateName + "成功");
        })
        .catch(() => {});
    },
  },
};
</script>
