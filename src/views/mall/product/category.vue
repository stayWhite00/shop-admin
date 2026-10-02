<template>
  <div class="app-container">
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
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-circle-check"
          size="mini"
          :disabled="multiple"
          @click="handleBatchEnable"
          >批量启用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-circle-close"
          size="mini"
          :disabled="multiple"
          @click="handleBatchDisable"
          >批量停用</el-button
        >
      </el-col>
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      row-key="categoryId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分类名称" align="left" prop="categoryName" />
      <el-table-column
        label="分类ID"
        align="center"
        prop="categoryId"
        width="100"
      />
      <el-table-column label="图标" align="center" prop="icon" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.icon" :width="40" :height="40" />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" width="100" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleSingleStatusChange(scope.row, 0)"
            >启用</el-button
          >
          <el-button
            v-else
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleSingleStatusChange(scope.row, 1)"
            >停用</el-button
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级分类" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="categoryOptions"
            :normalizer="normalizer"
            placeholder="请选择父级分类"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <image-upload v-model="form.icon" :limit="1" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="parseInt(dict.value)"
              >{{ dict.label }}</el-radio
            >
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
  listCategory,
  addCategory,
  updateCategory,
  delCategory,
  changeCategoryStatus,
} from "@/api/mall/product";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Category",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      loading: true,
      single: true,
      multiple: true,
      categoryList: [],
      categoryOptions: [],
      title: "",
      open: false,
      ids: [],
      form: {},
      rules: {
        categoryName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listCategory().then((response) => {
        this.categoryList = this.handleTree(
          response.data,
          "categoryId",
          "parentId"
        );
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
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
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.categoryId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    getTreeselect() {
      listCategory().then((response) => {
        this.categoryOptions = [];
        const menu = { categoryId: 0, categoryName: "主类目", children: [] };
        menu.children = this.handleTree(
          response.data,
          "categoryId",
          "parentId"
        );
        this.categoryOptions.push(menu);
      });
    },
    reset() {
      this.form = {
        categoryId: null,
        parentId: 0,
        categoryName: null,
        icon: null,
        sort: 0,
        status: 0,
      };
      this.resetForm("form");
    },
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.categoryId) {
        this.form.parentId = row.categoryId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加分类";
    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.categoryId || this.ids[0];
      // Note: Here we assume categoryList has the data. For exact data we might need a getCategory(id) API.
      // But since listCategory returns all, we can just find it.
      listCategory().then((response) => {
        let item = response.data.find((d) => d.categoryId === id);
        if (item) {
          this.form = item;
          this.open = true;
          this.title = "修改分类";
        }
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.categoryId != null) {
            updateCategory(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCategory(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 批量启用 */
    handleBatchEnable() {
      const ids = this.ids;
      if (!ids.length) {
        this.$modal.msgWarning("请选择要启用的分类");
        return;
      }
      this.$modal
        .confirm(`是否确认批量启用选中的 ${ids.length} 个分类？`)
        .then(() => {
          return changeCategoryStatus({ categoryIds: ids, status: 0 });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("批量启用成功");
        })
        .catch(() => {});
    },
    /** 批量停用 */
    handleBatchDisable() {
      const ids = this.ids;
      if (!ids.length) {
        this.$modal.msgWarning("请选择要停用的分类");
        return;
      }
      this.$modal
        .confirm(`是否确认批量停用选中的 ${ids.length} 个分类？`)
        .then(() => {
          return changeCategoryStatus({ categoryIds: ids, status: 1 });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("批量停用成功");
        })
        .catch(() => {});
    },
    /** 状态开关切换处理 */
    handleStatusChange(row) {
      const text = row.status === 0 ? "启用" : "停用";
      this.$modal
        .confirm(`确认要${text}分类【${row.categoryName}】吗？`)
        .then(() => {
          return changeCategoryStatus({
            categoryIds: [row.categoryId],
            status: row.status,
          });
        })
        .then(() => {
          this.$modal.msgSuccess(`${text}成功`);
        })
        .catch(() => {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    /** 单个分类启用/停用按钮处理 */
    handleSingleStatusChange(row, status) {
      const text = status === 0 ? "启用" : "停用";
      this.$modal
        .confirm(`确认要${text}分类【${row.categoryName}】吗？`)
        .then(() => {
          return changeCategoryStatus({
            categoryIds: [row.categoryId],
            status: status,
          });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(`${text}成功`);
        })
        .catch(() => {});
    },
    handleDelete(row) {
      const ids = row.categoryId || this.ids;
      this.$modal
        .confirm('是否确认删除分类编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCategory(ids);
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
