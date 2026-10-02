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
      <el-form-item label="姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入真实姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="等级" prop="level">
        <el-select
          v-model="queryParams.level"
          placeholder="会员等级"
          clearable
          style="width: 140px"
        >
          <el-option label="普通用户" :value="0" />
          <el-option label="初级会员" :value="1" />
          <el-option label="银牌会员" :value="2" />
          <el-option label="金牌会员" :value="3" />
          <el-option label="铂金会员" :value="4" />
          <el-option label="钻石会员" :value="5" />
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

    <el-table v-loading="loading" :data="memberList">
      <el-table-column label="用户ID" align="center" prop="userId" width="80" />
      <el-table-column
        label="真实姓名"
        align="center"
        prop="realName"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column label="性别" align="center" width="60">
        <template slot-scope="scope">
          {{
            scope.row.gender === 1
              ? "男"
              : scope.row.gender === 2
              ? "女"
              : "未知"
          }}
        </template>
      </el-table-column>
      <el-table-column label="会员状态" align="center" width="90">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isMember === 1 ? 'warning' : 'info'"
            size="small"
          >
            {{ scope.row.isMember === 1 ? "会员" : "非会员" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="levelTagType(scope.row.level)"
            size="small"
            effect="dark"
          >
            {{ levelName(scope.row.level) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="成长值"
        align="center"
        prop="growthValue"
        width="90"
      >
        <template slot-scope="scope">
          <span style="font-weight: bold; color: #e6a23c">
            {{ scope.row.growthValue }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计消费(元)"
        align="center"
        prop="totalSpent"
        width="110"
      >
        <template slot-scope="scope">
          <span style="color: #e53935">¥{{ scope.row.totalSpent }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开通时间"
        align="center"
        prop="memberSince"
        width="160"
      />
      <el-table-column
        label="注册时间"
        align="center"
        prop="createTime"
        width="160"
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listMember } from "@/api/mall/member";

export default {
  name: "Member",
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      memberList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: undefined,
        level: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listMember(this.queryParams).then((response) => {
        this.memberList = response.rows;
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
    levelName(level) {
      const names = [
        "普通用户",
        "初级会员",
        "银牌会员",
        "金牌会员",
        "铂金会员",
        "钻石会员",
      ];
      return names[level] || "未知";
    },
    levelTagType(level) {
      const types = ["info", "", "info", "warning", "", "danger"];
      return types[level] || "";
    },
  },
};
</script>
