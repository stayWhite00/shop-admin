<template>
  <div class="slide">
    <mark-display
      :markdown="markdown"
      @title="setTitle"
      keyboard-ctrl
      url-hash-ctrl
      auto-blank-target
      supportPreview
    ></mark-display>
    <!--
     auto-font-size 是否调整字体大小以适应屏幕大小
     -->
  </div>
</template>

<script>
import MarkDisplay from "vue-mark-display";


export default {
  components: { MarkDisplay },
  data() {
    return {
      markdown: '',
    };
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      var params = localStorage.getItem('MAEK_DISPLAY')
      this.markdown = params!=null&&params!=''&&params!='null'?params:' '
    },
    setTitle({ title }) {
      document.title = title;
    }
  }
};
</script>

<style scoped>
.slide {
  margin: 0;
  overflow: hidden;

}
</style>
