<template>
  <div class="folder_docs_add" ref="Box">
    <div class="JNPF-common-page-header">
      <el-page-header @back="goBack" :content="!form.id ? '新建' :  isDetail ? '详情':'编辑'" />
      <div class="options">
        <el-button size="mini" :disabled="active === 0" @click="next(0)"> 上一步</el-button>
        <el-button size="mini" :disabled="active === 1" @click="next(1)"> 下一步</el-button>
        <el-button size="mini" type="primary" :disabled="isDetail||active === 0"  @click="submitForm"> 保 存</el-button>
        <el-button size="mini" @click="goBack"> 取 消</el-button>
      </div>
    </div>
    <el-row :gutter="15" class=" main" :style="{margin: '0 auto',width: '${context.fullScreenWidth}'}">
      <el-steps :active="active" simple style="margin-top: 10px;margin-bottom: 10px;">
        <el-step title="基本信息" icon="el-icon-document"></el-step>
        <el-step title="创作内容" icon="el-icon-edit"></el-step>
      </el-steps>
      <div style="position: relative;">
        <el-form size="mini" v-loading="loading" ref="form" :model="form" :rules="rules" label-width="100px" style="width: 800px;margin: 0 auto;">
          <div v-show="active === 0" class="basicItem">
            <div class="text-center" style="margin-bottom: 20px;">
              <img v-show="form.docsType===undefined||form.docsType===null" src="~@/assets/cms/images/file_none@3x.png" />
              <img v-show="form.docsType==='txt'" src="~@/assets/cms/images/file_txt@3x.png" />
              <img v-show="form.docsType==='world'" src="~@/assets/cms/images/file_docx@3x.png" />
              <img v-show="form.docsType==='markdown'" src="~@/assets/cms/images/markdown.svg" style="width: 66px;height: 66px;"/>
              <img v-show="form.docsType==='excel'" src="~@/assets/cms/images/file_excel@3x.png" />
              <img v-show="form.docsType==='ppt'" src="~@/assets/cms/images/file_ppt@3x.png" />
              <img v-show="form.docsType==='img'" src="~@/assets/cms/images/file_img@3x.png" />
              <img v-show="form.docsType==='mindMapping'" src="~@/assets/cms/images/mindMapping.svg" style="width: 66px;height: 66px;" />
              <img v-show="form.docsType==='bpmn'" src="~@/assets/cms/images/bpmn.svg" style="width: 66px;height: 66px;" />
              <img v-show="form.docsType==='code'" src="~@/assets/cms/images/codeImg.svg" style="width: 66px;height: 66px;" />
            </div>
            <el-form-item label="所属文件夹" prop="folderId">
              <treeselect v-model="form.folderId" :options="folderOptionsSelect" :normalizer="normalizerDocs" :flat="true" :multiple="false" placeholder="请选择文件夹" />
            </el-form-item>
            <el-form-item label="名称" prop="docsName">
              <el-input v-model="form.docsName" maxlength="30" placeholder="请输入文件名称" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='txt'">
        <MonacoEditor v-model="form.content" :options="{language: 'plaintext'}" ref="CodeEditor"></MonacoEditor>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='world'">
        <Tinymce :height='tinymceHeight' v-model='form.content'></Tinymce>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='markdown'">
        <CherryMarkdown ref="CherryMarkdown" :height='markdownHeight' v-model='form.contentMarkdown' ></CherryMarkdown>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='img'">
        <TinyWhiteboard v-model='form.content' ></TinyWhiteboard>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='bpmn'">
        <Bpmn v-model='form.content'></Bpmn>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='mindMapping'">
        <SimpleMindMap v-model='form.content'></SimpleMindMap>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='excel'">
        <Luckysheet v-model='form.content' :title="form.docsName"></Luckysheet>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='ppt'">
        <TuiEditor v-model='form.content' :height='tuiEditorHeight'></TuiEditor>
      </div>
      <div v-if="(active === 1||active === 2)&&form.docsType==='code'">
        <Codemirror v-model="form.content" ></Codemirror>
      </div>
    </el-row>
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
  import { DOCS_TYPE } from '@/views/cms/docsType.js'
  import Treeselect from "y_treeselect";
  import "y_treeselect/dist/vue-treeselect.css";
  import Tinymce from '@/components/Tinymce'
  import CherryMarkdown from '@/components/CherryMarkdown'
  import TinyWhiteboard from '@/components/TinyWhiteboard'
  import Bpmn from '@/components/Bpmn'
  import SimpleMindMap from '@/components/SimpleMindMap/Index'
  import Luckysheet from '@/components/Luckysheet'
  import MonacoEditor from '@/components/MonacoEditor'
  import TuiEditor from '@/components/TuiEditor/TuiEditorSlide.vue'
  import Codemirror from '@/components/Codemirror'
  export default {
    props: [],
    components: {
      Treeselect,
      Tinymce,
      CherryMarkdown,
      TinyWhiteboard,
      Bpmn,
      SimpleMindMap,
      Luckysheet,
      MonacoEditor,
      TuiEditor,
      Codemirror,
    },
    data() {
      return {
        loading: false,
        isDetail: false,
        // 表单参数
        form: {
          docsId: null,
          folderId: null,
          contentId: null,
          content: null,
          contentMarkdown: null,
          docsName: null,
          orderNum: null,
          docsType: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        },
        // 表单校验
        rules: {
          docsName: [{
            required: true,
            message: '请输入文件名称',
            trigger: 'change'
          }],
          folderId: [{
            required: true,
            message: '请选择文件夹',
            trigger: 'change'
          }],
          docsType: [{
            required: true,
            message: '请选择文件类型',
            trigger: 'change'
          }],
        },
        // 文件夹树选项
        folderOptionsSelect: [],
        docsTypeOptions: DOCS_TYPE,
        active: 0,
        tinymceHeight: 400,
        markdownHeight: 500,
        tuiEditorHeight: 500,
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getTreeselect()
    },
    mounted() {
      this.getHight()
    },
    methods: {
      getHight(){
        // 获取容器宽高
        let { width, height } = this.$refs.Box.getBoundingClientRect();
        this.markdownHeight = height - 140;
        this.tinymceHeight = height - 242;
        var tui = height - 140
        this.tuiEditorHeight = tui+"px";
      },
      goBack() {
        this.$confirm('是否放弃此次编辑？', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('refresh')
        }).catch(() => {});
      },
      init(id, isDetail, docsType, folderId) {
        this.form.id = id || 0;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          this.$refs['form'].resetFields();
          if (this.form.id) {
            this.loading = true;
            getDocs(this.form.id).then(response => {
              this.form = response.data;
              this.loading = false;
            });
          } else {
            this.form.docsType = docsType
            this.form.folderId = folderId
          }
        })
      },
      next(val) {
        this.active = val;
      },
      /** 查询文件夹下拉树结构 */
      getTreeselect() {
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
      normalizerDocs(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.folderId,
          label: node.folderName,
          children: node.children,
          isDisabled: node.folderId === 0 ? true : false
        };
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$modal.confirm('是否确认保存？').then(()=>{
              this.loading = true;
              if (this.form.docsType === 'markdown'){
                this.setFormContent()
              } else if (this.form.docsType === 'mindMapping') {
                this.form.content = localStorage.getItem('SIMPLE_MIND_MAP_DATA')
              }
              if (this.form.docsId != null) {
                updateDocs(this.form).then(response => {
                  this.active = 2;
                  this.$message({
                    message: "修改成功",
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.$emit('refresh', true)
                    }
                  })
                }).finally(()=>{
                  this.loading = false;
                });
              } else {
                addDocs(this.form).then(response => {
                  this.active = 2;
                  this.$message({
                    message: "新增成功",
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.$emit('refresh', true)
                    }
                  })
                }).finally(()=>{
                  this.loading = false;
                });
              }
            }).catch(() => {})
          } else {
            this.$modal.msgWarning("请将必填项信息填写完整");
          }
        });
      },
      setFormContent(){
        this.form.content = this.$refs.CherryMarkdown.getCherryHtml()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .folder_docs_add {
    margin-top: -20px;
  }
  .JNPF-common-page-header {
    padding: 14px 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;

    .options {
      flex-shrink: 0;
      margin-left: auto;
    }

    .el-page-header {
      .el-page-header__left {
        flex-shrink: 0;
      }

      .el-page-header__content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .steps {
      width: 300px;
      padding: 6px 20px;
      background: #fff;
      justify-items: flex-start;

      .el-step__title {
        cursor: pointer;
      }
    }
  }
  .basicItem {
    height: calc(100vh - 230px);
  }
</style>
