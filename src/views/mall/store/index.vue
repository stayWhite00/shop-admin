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
      <el-form-item label="门店名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入门店名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="门店状态"
          clearable
          style="width: 140px"
        >
          <el-option label="正常" :value="1" />
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
          v-hasPermi="['system:store:add']"
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
          v-hasPermi="['system:store:remove']"
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
      :data="storeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="门店ID"
        align="center"
        prop="storeId"
        width="80"
      />
      <el-table-column
        label="门店名称"
        align="center"
        prop="storeName"
        width="160"
      />
      <el-table-column
        label="联系电话"
        align="center"
        prop="phone"
        width="120"
      />
      <el-table-column label="所在省" align="center" prop="province" />
      <el-table-column label="所在市" align="center" prop="city" />
      <el-table-column label="所在区/县" align="center" prop="district" />
      <el-table-column
        label="详细地址"
        align="center"
        prop="address"
        show-overflow-tooltip
      />
      <el-table-column
        label="营业时间"
        align="center"
        prop="businessHours"
        width="120"
      />
      <el-table-column
        label="经度"
        align="center"
        prop="longitude"
        width="100"
      />
      <el-table-column
        label="纬度"
        align="center"
        prop="latitude"
        width="100"
      />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:store:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:store:remove']"
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

    <!-- 添加或修改门店对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="所在地区" prop="province">
          <el-cascader
            v-model="selectedRegion"
            :options="regionOptions"
            :props="{ label: 'name', value: 'name', children: 'children' }"
            placeholder="请选择省市区"
            style="width: 100%"
            @change="handleRegionChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            placeholder="请输入详细地址"
          />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input
            v-model="form.businessHours"
            placeholder="例如：08:00-22:00"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number
                v-model="form.longitude"
                :precision="6"
                :step="0.001"
                placeholder="经度"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                :precision="6"
                :step="0.001"
                placeholder="纬度"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
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
  listStore,
  getStore,
  delStore,
  addStore,
  updateStore,
  changeStoreStatus,
} from "@/api/mall/store";
import { getRegionTree } from "@/api/system/region";

export default {
  name: "Store",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 省市区数据
      regionOptions: [],
      selectedRegion: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 门店表格数据
      storeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        province: [
          { required: true, message: "省份不能为空", trigger: "blur" },
        ],
        city: [{ required: true, message: "城市不能为空", trigger: "blur" }],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.loadRegionTree();
  },
  methods: {
    /** 查询门店列表 */
    getList() {
      this.loading = true;
      listStore(this.queryParams).then((response) => {
        this.storeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取省市区结构 */
    loadRegionTree() {
      getRegionTree().then((res) => {
        this.regionOptions = res.data;
      });
    },
    /** 选择省市区 */
    handleRegionChange(val) {
      if (val && val.length > 0) {
        this.form.province = val[0] || "";
        this.form.city = val[1] || "";
        this.form.district = val[2] || "";
      } else {
        this.form.province = "";
        this.form.city = "";
        this.form.district = "";
      }
    },
    /** 门店状态修改 */
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.storeName + '"门店吗？')
        .then(function () {
          return changeStoreStatus(row.storeId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === 1 ? 0 : 1;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.selectedRegion = [];
      this.form = {
        storeId: null,
        storeName: null,
        phone: null,
        province: null,
        city: null,
        district: null,
        address: null,
        businessHours: null,
        longitude: null,
        latitude: null,
        status: 1,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.storeId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加门店";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const storeId = row.storeId || this.ids;
      getStore(storeId).then((response) => {
        this.form = response.data;
        this.selectedRegion = [
          this.form.province,
          this.form.city,
          this.form.district,
        ].filter((item) => item != null && item !== "");
        this.open = true;
        this.title = "修改门店";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.storeId != null) {
            updateStore(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStore(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const storeIds = row.storeId || this.ids;
      this.$modal
        .confirm('是否确认删除门店编号为"' + storeIds + '"的数据项？')
        .then(function () {
          return delStore(storeIds);
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
