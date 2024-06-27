<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Magic-API v2.1.1",
  components: { iFrame },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/magic/web/index.html"
    };
  },
};
</script>
