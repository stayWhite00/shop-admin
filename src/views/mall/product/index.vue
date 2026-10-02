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
      <el-form-item label="商品名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          style="width: 140px"
        >
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
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
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
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
      :data="productList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="商品ID"
        align="center"
        prop="productId"
        width="80"
      />
      <el-table-column
        label="封面"
        align="center"
        prop="coverImage"
        width="100"
      >
        <template slot-scope="scope">
          <image-preview :src="scope.row.coverImage" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column
        label="所属分类"
        align="center"
        prop="categoryName"
        width="120"
      />
      <el-table-column label="价格/积分" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.categoryId === 999"
            >{{ scope.row.price }} 积分</span
          >
          <span v-else>¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="stock" width="100" />
      <el-table-column label="销量" align="center" prop="sales" width="100" />
      <el-table-column label="评分" align="center" prop="rating" width="80" />
      <el-table-column
        label="销售范围"
        align="center"
        prop="saleScope"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.saleScope === 1 ? "全国" : "本地" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100">
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
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分类" prop="categoryId">
              <treeselect
                v-model="form.categoryId"
                :options="categoryOptions"
                :normalizer="normalizer"
                placeholder="请选择分类"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="form.categoryId === 999 ? '所需积分' : '价格'"
              prop="price"
            >
              <el-input-number
                v-model="form.price"
                :min="0"
                :precision="form.categoryId === 999 ? 0 : 2"
                :step="form.categoryId === 999 ? 1 : 0.1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number
                v-model="form.stock"
                :min="0"
                :step="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售范围" prop="saleScope">
              <el-select v-model="form.saleScope" style="width: 100%">
                <el-option label="全国" :value="1" />
                <el-option label="本地" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保质期" prop="shelfLifeType">
              <el-select v-model="form.shelfLifeType" style="width: 100%">
                <el-option label="长保" :value="1" />
                <el-option label="短保" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图片" prop="coverImage">
          <image-upload v-model="form.coverImage" :limit="1" />
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <image-upload v-model="form.images" :limit="5" />
        </el-form-item>
        <el-form-item label="商品详情">
          <editor v-model="form.detail" :min-height="192" />
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
  listProduct,
  getProduct,
  delProduct,
  addProduct,
  updateProduct,
  changeProductStatus,
  listCategory,
} from "@/api/mall/product";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Product",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      productList: [],
      categoryList: [],
      categoryOptions: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        status: undefined,
      },
      form: {},
      rules: {
        productName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "分类不能为空", trigger: "change" },
        ],
        price: [{ required: true, message: "价格不能为空", trigger: "blur" }],
        stock: [{ required: true, message: "库存不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getCategoryList();
  },
  methods: {
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then((response) => {
        this.productList = response.rows || [];
        this.total = response.total || 0;
        this.loading = false;
      });
    },
    /** 转换分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.categoryId,
        label: node.categoryName,
        children: node.children,
      };
    },
    getCategoryList() {
      listCategory().then((res) => {
        this.categoryList = res.data || [];
        this.categoryOptions = this.handleTree(
          res.data,
          "categoryId",
          "parentId"
        );
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
      this.ids = selection.map((item) => item.productId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleStatusChange(row) {
      let text = row.status === 1 ? "上架" : "下架";
      this.$modal
        .confirm('确认要"' + text + '""' + row.productName + '"商品吗？')
        .then(function () {
          return changeProductStatus(row.productId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === 1 ? 0 : 1;
        });
    },
    reset() {
      this.form = {
        productId: null,
        categoryId: null,
        productName: null,
        coverImage: null,
        images: null,
        price: 0,
        stock: 0,
        saleScope: 1,
        shelfLifeType: 1,
        detail: null,
      };
      this.resetForm("form");
    },
    handleAdd() {
      this.reset();
      this.getCategoryList();
      this.open = true;
      this.title = "添加商品";
    },
    handleUpdate(row) {
      this.reset();
      this.getCategoryList();
      const id = row.productId || this.ids;
      getProduct(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品";
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.productId != null) {
            updateProduct(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.productId || this.ids;
      this.$modal
        .confirm('是否确认删除商品编号为"' + ids + '"的数据项？')
        .then(function () {
          return delProduct(ids);
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
