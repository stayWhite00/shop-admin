<template>
  <div class="app-container home">
    <div v-show="!formVisible">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card class="update-log" shadow="never">
            <div slot="header" class="clearfix">
              <span>文件夹列表</span>
            </div>
            <div class="body">
              <div class="head-container">
                <el-row :gutter="10">
                  <el-col :span="18">
                    <el-input v-model="folderName" maxlength="30" placeholder="请输入文件夹名称" clearable size="mini" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                  </el-col>
                  <el-col :span="6" style="text-align: right;">
                    <el-tooltip class="item" effect="dark" content="添加" placement="top">
                      <el-button type="primary" size="mini" plain icon="el-icon-plus" @click="addFolder()" v-hasPermi="['cms:folder:add']"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                      <el-button size="mini" circle icon="el-icon-refresh" @click="getFolderTree" />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              <div class="container-tree">
                <el-tree class="flow-tree" v-loading="loadingFolderTree" :data="folderOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" node-key="id" :default-expand-all="false" highlight-current @node-click="handleNodeClick">
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div><img src="~@/assets/cms/images/folder.png" class="folderImg" />
                      <el-tooltip :content="node.label" placement="top" effect="dark" :disabled="node.label== null || node.label.length < 15">
                        <div class="treeOverHidden">{{ node.label }}</div>
                      </el-tooltip>
                    </div>
                    <span style="text-align: right;">
                      <el-button type="text" size="mini" @click="() => updateFolder(data)" icon="el-icon-edit" v-hasPermi="['cms:folder:add']"></el-button>
                      <el-button type="text" size="mini" @click="() => removeFolder(node, data)" icon="el-icon-delete" v-hasPermi="['cms:folder:remove']"></el-button>
                    </span>
                  </div>
                </el-tree>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="update-log" shadow="never">
            <div slot="header" class="clearfix">
              <span>文件列表</span>
            </div>
            <div class="body">
              <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
                <el-row>
                  <el-col :span="14">
                    <el-input v-model="queryParams.docsName" maxlength="30" placeholder="请输入文件名称" clearable size="mini" @keyup.enter.native="handleQuery" @change="handleQuery" prefix-icon="el-icon-search"  style="margin-bottom: 10px"/>
                  </el-col>
                  <el-col :span="10" style="text-align: right;">
                    <el-tooltip class="item" effect="dark" content="添加" placement="top">
                      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['cms:docs:add']"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['cms:docs:remove']"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                      <el-button size="mini" circle icon="el-icon-refresh" @click="resetQuery" />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </el-form>
              <el-table v-loading="loading" :data="docsList" @selection-change="handleSelectionChange" @row-click="rowClick">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="" align="center">
                  <template slot-scope="scope">
                    <img v-show="scope.row.docsType==='txt'" src="~@/assets/cms/images/file_txt.png" />
                    <img v-show="scope.row.docsType==='world'" src="~@/assets/cms/images/file_docx.png" />
                    <img v-show="scope.row.docsType==='markdown'" src="~@/assets/cms/images/markdown.svg" />
                    <img v-show="scope.row.docsType==='excel'" src="~@/assets/cms/images/file_excel.png" />
                    <img v-show="scope.row.docsType==='ppt'" src="~@/assets/cms/images/file_ppt.png" />
                    <img v-show="scope.row.docsType==='img'" src="~@/assets/cms/images/file_img.png" />
                    <img v-show="scope.row.docsType==='mindMapping'" src="~@/assets/cms/images/mindMapping.svg" style="width: 18px;height: 18px;" />
                    <img v-show="scope.row.docsType==='bpmn'" src="~@/assets/cms/images/bpmn.svg" style="width: 18px;height: 18px;" />
                    <img v-show="scope.row.docsType==='code'" src="~@/assets/cms/images/codeImg.svg" style="width: 18px;height: 18px;" />
                  </template>
                </el-table-column>
                <el-table-column label="文件名称" align="center" prop="docsName" show-overflow-tooltip />
                <el-table-column label="文件类型" align="center" prop="docsType" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                      v-hasPermi="['cms:docs:edit']"></el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                      v-hasPermi="['cms:docs:remove']"></el-button>
                  </template>
                </el-table-column>
                <div slot="empty" style="text-align: center;height: 280px;">暂无数据</div>
              </el-table>

              <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :layout="'total, prev, pager, next'" :limit.sync="queryParams.pageSize" @pagination="getList" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="update-log" shadow="never">
            <div slot="header" class="clearfix">
              <span>文件信息</span>
            </div>
            <div class="body">
              <div class="text-center">
                <img v-show="docsInfo.docsType===undefined||docsInfo.docsType===null" src="~@/assets/cms/images/file_none@3x.png" />
                <img v-show="docsInfo.docsType==='txt'" src="~@/assets/cms/images/file_txt@3x.png" />
                <img v-show="docsInfo.docsType==='world'" src="~@/assets/cms/images/file_docx@3x.png" />
                <img v-show="docsInfo.docsType==='markdown'" src="~@/assets/cms/images/markdown.svg" style="width: 66px;height: 66px;"/>
                <img v-show="docsInfo.docsType==='excel'" src="~@/assets/cms/images/file_excel@3x.png" />
                <img v-show="docsInfo.docsType==='ppt'" src="~@/assets/cms/images/file_ppt@3x.png" />
                <img v-show="docsInfo.docsType==='img'" src="~@/assets/cms/images/file_img@3x.png" />
                <img v-show="docsInfo.docsType==='mindMapping'" src="~@/assets/cms/images/mindMapping.svg" style="width: 55px;height: 55px;margin: 5px;" />
                <img v-show="docsInfo.docsType==='bpmn'" src="~@/assets/cms/images/bpmn.svg" style="width: 55px;height: 55px;margin: 5px;" />
                <img v-show="docsInfo.docsType==='code'" src="~@/assets/cms/images/codeImg.svg" style="width: 55px;height: 55px;margin: 5px;" />
              </div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  文件名称
                  <div class="pull-right">
                    <el-tooltip :content="docsInfo.docsName" placement="top" effect="dark" :disabled="docsInfo.docsName== null || docsInfo.docsName.length < 15">
                      <div class="overHidden">{{ docsInfo.docsName }}</div>
                    </el-tooltip>
                  </div>
                </li>
                <li class="list-group-item">
                  文件类型
                  <div class="pull-right">{{ docsInfo.docsType }}</div>
                </li>
                <li class="list-group-item">
                  文件路径
                  <div class="pull-right">
                    <el-tooltip :content="docsInfo.folderPath" placement="top" effect="dark" :disabled="docsInfo.folderPath== null || docsInfo.folderPath.length < 15">
                      <div class="overHidden">{{ docsInfo.folderPath }}</div>
                    </el-tooltip>
                  </div>
                </li>
                <li class="list-group-item">
                  文件大小
                  <div class="pull-right" >{{ docsInfo.contentSize }}</div>
                </li>
                <li class="list-group-item">
                  创建人
                  <div class="pull-right">{{ docsInfo.createBy }}</div>
                </li>
                <li class="list-group-item">
                  创建日期
                  <div class="pull-right">{{ docsInfo.createTime }}</div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>


      <el-divider />
      <el-row :gutter="20" style="margin-top: -15px;">
        <el-col :span="8" style="padding-left: 20px">
          <el-link :href="showImpress" :underline="false" target="_blank">
            <svg width="150" height="50">
              <text class="webName" x="0" y="35">文档便利店</text>
            </svg>
            <!-- <h2 class="webName">文档便利店</h2> -->
          </el-link>
          <p style="text-indent: 2em;">文档便利店是一个在线的写作创作平台，它可以让你随时随地记录下灵感和想法。在文档便利店上，你可以创建各种类型的文档，包括笔记、日记、文章、论文等等。无论你是学生、工作者还是创作者，文档便利店都能为你提供一个方便的写作环境，让你的创作更加自由和畅快。 文档便利店的界面简洁清晰，操作简单易懂。你可以随时保存你的文档，以备后续编辑或分享，让你的写作更加高效和便捷。</p>
        </el-col>

        <el-col :span="16" style="padding-left: 50px">
          <el-row>
            <el-col :span="12">
              <h2>快速创建</h2>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" v-for="(item, index) in docsTypeOptions" :key="index" style="width: 100px;">
              <div @click="clickCard(item,0)">
                <el-card shadow="hover" :body-style="{ padding: '0px' }" style="height: 110px;">
                  <div style="text-align: center;margin-top: 3px;">
                    <img v-show="item.value==='txt'" src="~@/assets/cms/images/file_txt@3x.png" />
                    <img v-show="item.value==='world'" src="~@/assets/cms/images/file_docx@3x.png" />
                    <img v-show="item.value==='markdown'" src="~@/assets/cms/images/markdown.svg" style="width: 55px;height: 55px;margin: 5px;"/>
                    <img v-show="item.value==='excel'" src="~@/assets/cms/images/file_excel@3x.png" />
                    <img v-show="item.value==='ppt'" src="~@/assets/cms/images/file_ppt@3x.png" />
                    <img v-show="item.value==='img'" src="~@/assets/cms/images/file_img@3x.png" />
                  <img v-show="item.value==='mindMapping'" src="~@/assets/cms/images/mindMapping.svg" style="width: 55px;height: 55px;margin: 5px;" />
                  <img v-show="item.value==='bpmn'" src="~@/assets/cms/images/bpmn.svg" style="width: 55px;height: 55px;margin: 5px;" />
                  <img v-show="item.value==='code'" src="~@/assets/cms/images/codeImg.svg" style="width: 55px;height: 55px;margin: 5px;" />
                  </div>
                  <div style="padding: 14px;text-align: center;">
                    <span style="color: #8d8989;">{{ item.label }}</span>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- 添加或修改文件夹对话框 -->
    <el-dialog :title="title" :visible.sync="openFolder" width="800px" lock-scroll append-to-body :close-on-click-modal="false">
      <el-form ref="formFolder" :model="formFolder" :rules="rulesFolder" label-width="100px">
        <el-form-item label="父文件夹" prop="parentId">
          <treeselect v-model="formFolder.parentId" :options="folderOptionsSelect" :normalizer="normalizer"
            placeholder="请选择父文件夹id" />
        </el-form-item>
        <el-form-item label="文件夹名称" prop="folderName">
          <el-input v-model="formFolder.folderName" maxlength="30" placeholder="请输入文件夹名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="formFolder.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFolder">确 定</el-button>
        <el-button @click="cancelFolder">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1030px" lock-scroll append-to-body class="JNPF-dialog">
        <el-row :gutter="10">
          <el-col :span="8" v-for="(item, index) in docsTypeOptions" :key="index" style="width: 110px;">
            <div @click="clickCard(item,1)">
              <el-card shadow="hover" :body-style="{ padding: '0px' }" style="height: 110px;">
                <div style="text-align: center;margin-top: 3px;">
                  <img v-show="item.value==='txt'" src="~@/assets/cms/images/file_txt@3x.png" />
                  <img v-show="item.value==='world'" src="~@/assets/cms/images/file_docx@3x.png" />
                  <img v-show="item.value==='markdown'" src="~@/assets/cms/images/markdown.svg" style="width: 55px;height: 55px;margin: 5px;"/>
                  <img v-show="item.value==='excel'" src="~@/assets/cms/images/file_excel@3x.png" />
                  <img v-show="item.value==='ppt'" src="~@/assets/cms/images/file_ppt@3x.png" />
                  <img v-show="item.value==='img'" src="~@/assets/cms/images/file_img@3x.png" />
                  <img v-show="item.value==='mindMapping'" src="~@/assets/cms/images/mindMapping.svg" style="width: 55px;height: 55px;margin: 5px;" />
                  <img v-show="item.value==='bpmn'" src="~@/assets/cms/images/bpmn.svg" style="width: 55px;height: 55px;margin: 5px;" />
                  <img v-show="item.value==='code'" src="~@/assets/cms/images/codeImg.svg" style="width: 55px;height: 55px;margin: 5px;" />
                </div>
                <div style="padding: 14px;text-align: center;">
                  <span style="color: #8d8989;font-family: YouYuan;">{{ item.label }}</span>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
    </el-dialog>
    <FolderDocsAdd v-if="formVisible" ref="docsForm" @refresh="refresh" />

  </div>
</template>

<script>
import {
    listFolder,
    getFolder,
    delFolder,
    addFolder,
    updateFolder,
    folderTreeSelect
  } from "@/api/cms/folder";
  import {
    listDocs,
    getDocs,
    delDocs,
    addDocs,
    updateDocs
  } from "@/api/cms/docs";
  import FolderDocsAdd from '@/views/cms/folder_docs_add.vue'
  import { DOCS_TYPE } from '@/views/cms/docsType.js'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "FolderDocs",
    components: {
      Treeselect,
      FolderDocsAdd
    },
    data() {
      return {
        // 文件夹名称
        folderName: undefined,
        // 文件夹树选项
        folderOptions: undefined,
        // 文件夹树选项
        folderOptionsSelect: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 文件查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 4,
          folderId: null,
          contentId: null,
          docsName: null,
          orderNum: null,
          docsType: null,
        },
        // 遮罩层
        loading: true,
        loadingFolderTree: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 文件表格数据
        docsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openFolder: false,
        // 表单参数
        formFolder: {},
        docsInfo: {},
        // 表单校验
        rulesFolder: {
          folderName: [{
            required: true,
            message: '请输入文件夹名称',
            trigger: 'change'
          }],
          parentId: [{
            required: true,
            message: '请选择父文件夹',
            trigger: 'change'
          }],
        },
        docsTypeOptions: DOCS_TYPE,
        formVisible: false,
        showImpress: window.location.origin + '/impress',
      };
    },
    watch: {
      // 根据名称筛选文件夹树
      folderName(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.getFolderTree();
    },
    methods: {
      /** 查询文件列表 */
      getList() {
        this.loading = true;
        this.resetInfo()
        listDocs(this.queryParams).then(response => {
          this.docsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查询文件夹下拉树结构 */
      getFolderTree() {
        this.loadingFolderTree = true;
        this.queryParams.folderId = null;
        folderTreeSelect().then(response => {
          this.folderOptions = response.data;
        }).finally(()=>{
          this.loadingFolderTree = false;
          this.getList();
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.folderId = data.id;
        this.handleQuery();
      },
      // 表单重置
      resetFolder() {
        this.formFolder = {
          folderId: null,
          parentId: null,
          ancestors: null,
          folderName: null,
          orderNum: null,
          status: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("formFolder");
      },
      /** 新增按钮操作 */
      addFolder(row) {
        this.resetFolder();
        this.getTreeselect();
        if (row != null && row.folderId) {
          this.formFolder.parentId = row.folderId;
        } else {
          this.formFolder.parentId = 0;
        }
        this.openFolder = true;
        this.title = "添加";
      },
      // 取消按钮
      cancelFolder() {
        this.openFolder = false;
        this.resetFolder();
      },
      /** 提交按钮 */
      submitFolder() {
        this.$refs["formFolder"].validate(valid => {
          if (valid) {
            if (this.formFolder.folderId != null) {
              updateFolder(this.formFolder).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.openFolder = false;
                this.getFolderTree();
              });
            } else {
              addFolder(this.formFolder).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.openFolder = false;
                this.getFolderTree();
              });
            }
          }
        });
      },
      updateFolder(data) {
        this.resetFolder();
        this.getTreeselect();
        if (data != null) {
          this.formFolder.parentId = data.id;
        }
        getFolder(data.id).then(response => {
          this.formFolder = response.data;
          this.openFolder = true;
          this.title = "修改";
        });
      },

      removeFolder(node, data) {
        this.$modal.confirm('是否确认删除"' + data.label + '" ？').then(function() {
          return delFolder(data.id);
        }).then(() => {
          this.getFolderTree();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 查询文件夹下拉树结构 */
      getTreeselect(type) {
        listFolder().then(response => {
          this.folderOptionsSelect = [];
          var data = {
            folderId: 0,
            folderName: '我的桌面',
            children: []
          };
          data.children = this.handleTree(response.data, "folderId", "parentId");
          this.folderOptionsSelect.push(data);
        });
      },
      /** 转换文件夹数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.folderId,
          label: node.folderName,
          children: node.children,
          isDisabled: false
        };
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
        this.ids = selection.map(item => item.docsId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.open = true;
        this.title = "添加";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.formVisible = true
        const docsId = row.docsId || this.ids
        this.$nextTick(() => {
          this.$refs.docsForm.init(docsId, false, null, null)
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const docsIds = row.docsId || this.ids;
        this.$modal.confirm('是否确认删除文件 ？').then(function() {
          return delDocs(docsIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 点击table行查看文件详情 */
      rowClick(row){
        this.resetInfo()
        this.docsInfo = row
      },
      // 表单重置
      resetInfo() {
        this.docsInfo = {
          docsId: null,
          folderId: null,
          contentId: null,
          docsName: null,
          orderNum: null,
          docsType: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
      },
      /** 选择新增文件类型 */
      clickCard(item,type) {
        this.open = false
        this.formVisible = true
        var folderId = null
        if(type===1){
          folderId = this.queryParams.folderId
        }
        this.$nextTick(() => {
          this.$refs.docsForm.init(null, false, item.value, folderId)
        })
      },
      refresh(isrRefresh) {
        this.formVisible = false
        if (isrRefresh) {
          this.handleQuery()
        }
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('cms/docs/export', {
          ...this.queryParams
        }, `docs_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>

<style scoped lang="scss">
.home {
  font-family: YouYuan;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }
}
::v-deep.el-table {

  .el-table__header-wrapper,
  .el-table__fixed-header-wrapper {
    th {
      word-break: break-word;
      background-color: #ffffff;
      color: #676a6c;
      height: 40px;
      font-size: 13px;
    }
  }
}

.update-log {
  width: 100%;
  height: 410px;
  .body {
    height:100%;
    // overflow:auto;

  }
}
.flow-tree{
  overflow:auto;
  flex:1;
  height:300px;
  >>>.el-tree-node{
    > .el-tree-node__children{
        overflow:visible !important;
    }
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.folderImg {
  margin: 0px 5px 0 0;
  width: 18px;
  height: 15px;
}
::v-deep.JNPF-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #dcdfe6;
  }
}
.list-group-item {
  color: #676a6c;
}
.treeOverHidden {
  width: 150px;
  float: right;
  overflow:hidden; //超出的文本隐藏
  white-space:nowrap; //溢出不换行
  text-overflow:ellipsis; //溢出用省略号显示
}
.overHidden {
  max-width: 200px;
  overflow:hidden; //超出的文本隐藏
  text-overflow:ellipsis; //溢出用省略号显示
  white-space:nowrap; //溢出不换行
}
.webName {
  font-family:YouYuan;        /*定义字体*/
   font-size:26px;            /*定义文字大小*/
   // font-weight:bolder;        /*定义字体粗细*/
   fill:transparent;            /*定义文字透明*/
   stroke:rgba(#409EFF, 0.8);            /*定义描边颜色*/
   stroke-dasharray:1.2,1;        /*定义虚线长度和虚线间距*/
   letter-spacing:5px;        /*定义字符间距*/
   -webkit-animation:bounce 2s infinite;/*设置动画*/
}
.webName:hover {
  stroke:rgba(#67C23A, 0.8);            /*定义描边颜色*/
}
@-webkit-keyframes bounce{/*创建动画*/
   0%,100%,20%,50%,80%{
      -webkit-transform:translateY(0);
   }40%{
      -webkit-transform:translateY(-10px);
   }60%{
      -webkit-transform:translateY(-5px);
   }
}
</style>

