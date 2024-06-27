<template>
  <iframe class="reveal" frameborder="0" ref="reveal"></iframe>
</template>

<script>

export default {
  components: { },
  data() {
    return {
      markdown: '',
    };
  },
  watch: {
    markdown(value) {
      const frame = this.$refs.reveal
      frame.contentWindow.document.open()
      frame.contentWindow.document.write(value)
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    init(){
      var params = localStorage.getItem('REVEALDATA')
      this.markdown = params!=null&&params!=''&&params!='null'?params:' '
    },
  }
};
</script>

<style scoped>
.reveal {
  width: 100%;
  height: 99%;
}
</style>
