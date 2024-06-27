<template>
  <el-drawer size="80%" :visible="visible" :with-header="false" :before-close="close" :append-to-body="true" :show-close="false">
    <div class="drawer-container">
      <BigLanguageModel></BigLanguageModel>
    </div>
  </el-drawer>
</template>

<script>
import BigLanguageModel from '@/components/BigLanguageModel'

export default {
  components: { BigLanguageModel },
  data() {
    return {

    };
  },
  computed: {
    visible: {
      get() {
        return this.$store.state.bigLanguageModel.showChat
      }
    },
  },
  methods: {
    close() {
      this.$store.dispatch('bigLanguageModel/changeSetting', {
        key: 'showChat',
        value: false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .drawer-container {
    height: 100%;
    padding: 20px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    background-color: rgb(39, 42, 55);

  }
</style>
