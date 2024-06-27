<template>
  <div class="impress">
    <ImpressDemo />
  </div>
</template>

<script>
import ImpressDemo from '@/components/Impress'

export default {
  name: 'impress',
  components: {
    ImpressDemo
  }
}
</script>

<style scoped>
.impress {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
