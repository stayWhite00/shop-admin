<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
          <el-option label="显示" :value="1" />
          <el-option label="隐藏" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['mall:banner:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mall:banner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mall:banner:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="轮播图ID" align="center" prop="bannerId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图片" align="center" prop="imageUrl" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 50px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="跳转类型" align="center" prop="linkType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.linkType == 1">商品</el-tag>
          <el-tag v-else-if="scope.row.linkType == 2" type="success">分类</el-tag>
          <el-tag v-else-if="scope.row.linkType == 3" type="warning">外部链接</el-tag>
          <el-tag v-else type="info">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="跳转内容" align="center" prop="linkId" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mall:banner:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:banner:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="form.imageUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-radio-group v-model="form.linkType">
            <el-radio :label="0">无</el-radio>
            <el-radio :label="1">商品</el-radio>
            <el-radio :label="2">分类</el-radio>
            <el-radio :label="3">外链</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转ID/URL" prop="linkId" v-if="form.linkType !== 0">
          <el-select v-if="form.linkType === 1" v-model="form.linkId" filterable placeholder="请选择商品">
            <el-option
              v-for="item in productOptions"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId.toString()"
            ></el-option>
          </el-select>
          <el-cascader
            v-else-if="form.linkType === 2"
            v-model="form.linkId"
            :options="categoryOptions"
            :props="{ value: 'categoryId', label: 'categoryName', emitPath: false }"
            placeholder="请选择分类"
          ></el-cascader>
          <el-input v-else v-model="form.linkId" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { listBanner, getBanner, delBanner, addBanner, updateBanner } from "@/api/mall/banner";
import { listProduct, listCategory } from "@/api/mall/product";

export default {
  name: "Banner",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 轮播图表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        imageUrl: [
          { required: true, message: "图片地址不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      },
      productOptions: [],
      categoryOptions: []
    };
  },
  created() {
    this.getList();
    this.getOptions();
  },
  methods: {
    /** 查询轮播图列表 */
    getList() {
      this.loading = true;
      listBanner(this.queryParams).then(response => {
        this.bannerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询选项数据 */
    getOptions() {
      listProduct({ pageSize: 1000 }).then(response => {
        this.productOptions = response.rows;
      });
      listCategory().then(response => {
        this.categoryOptions = this.handleTree(response.data, "categoryId");
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        bannerId: null,
        title: null,
        imageUrl: null,
        linkType: 0,
        linkId: null,
        sort: 0,
        status: 1,
        remark: null
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
      this.ids = selection.map(item => item.bannerId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bannerId = row.bannerId || this.ids
      getBanner(bannerId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改轮播图";
      });
    },
    /** 状态修改 */
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.title + '"吗？').then(function() {
        return updateBanner(row);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === 1 ? 0 : 1;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bannerId != null) {
            updateBanner(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBanner(this.form).then(response => {
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
      const bannerIds = row.bannerId || this.ids;
      this.$modal.confirm('是否确认删除轮播图编号为"' + bannerIds + '"的数据项？').then(function() {
        return delBanner(bannerIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
