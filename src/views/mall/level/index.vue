<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="levelList">
      <el-table-column label="等级" align="center" prop="level" width="80" />
      <el-table-column label="等级名称" align="center" prop="levelName" />
      <el-table-column label="所需最小成长值" align="center" prop="minGrowth">
        <template slot-scope="scope">
          <span style="font-weight: bold; color: #e6a23c">{{
            scope.row.minGrowth
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣系数" align="center" prop="discountRate">
        <template slot-scope="scope">
          <el-tag type="success" size="medium">{{
            scope.row.discountRate
          }}</el-tag>
          <span style="margin-left: 10px; color: #666; font-size: 12px">
            ({{ (scope.row.discountRate * 10).toFixed(1) }}折)
          </span>
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
            v-hasPermi="['mall:level:edit']"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改会员等级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="等级数值" prop="level">
          <el-input v-model="form.level" disabled />
        </el-form-item>
        <el-form-item label="等级名称" prop="levelName">
          <el-input v-model="form.levelName" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item
          label="最小成长值"
          prop="minGrowth"
          v-if="form.level !== 0"
        >
          <el-input-number
            v-model="form.minGrowth"
            :min="0"
            placeholder="所需最小成长值"
          />
        </el-form-item>
        <el-form-item label="折扣系数" prop="discountRate">
          <el-input-number
            v-model="form.discountRate"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="1"
            placeholder="折扣系数 (如0.90为9折)"
          />
          <div style="color: #999; font-size: 12px; margin-top: 5px">
            提示：1.00表示不打折，0.90表示9折，以此类推。
          </div>
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
import { listLevel, getLevel, updateLevel } from "@/api/mall/level";

export default {
  name: "MemberLevel",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 会员等级表格数据
      levelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        levelName: [
          { required: true, message: "等级名称不能为空", trigger: "blur" },
        ],
        discountRate: [
          { required: true, message: "折扣系数不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询会员等级列表 */
    getList() {
      this.loading = true;
      listLevel().then((response) => {
        this.levelList = response.data;
        this.loading = false;
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
        levelId: null,
        level: null,
        levelName: null,
        minGrowth: 0,
        discountRate: 1.0,
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const levelId = row.levelId;
      getLevel(levelId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会员等级";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateLevel(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
  },
};
</script>
