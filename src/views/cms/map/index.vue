<template>
  <div class="app">
    <div class="mapContainer">
      <component :is="comp"></component>
    </div>
    <div class="btnGroupMap">
      <div class="btnMap" :class="{ active: this.comp === 'New' }" @click="compClick('New')">
        优化版
      </div>
      <div class="btnMap" :class="{ active: this.comp === 'Old' }" @click="compClick('Old')">
        原始版
      </div>
    </div>
  </div>
</template>

<script>
  import Old from "./Old";
  import New from "./New";

  export default {
    components: {
      New,
      Old,
    },
    data() {
      return {
        comp: "New",
      };
    },
    methods: {
      compClick(val) {
        this.comp = val
      },
    },
  };
</script>

<style scoped>
  .btnGroupMap {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    display: flex;
    height: 30px;
    background-color: #fff;
    border: 1px solid #b3b3b3;
    border-radius: 5px;
    overflow: hidden;
    line-height: 30px;
    cursor: pointer;
  }

  .btnMap {
    padding: 0 16px;
  }

  .btnMap.active {
    background-color: #e0e0e0;
  }
</style>
