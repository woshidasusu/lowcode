<template>
  <router-view></router-view>
</template>

<script>
import dynamicStore from '@src/store/dynamic-store';
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    dynamicStore.cfDesignerEdit.register();
  },
  async mounted() {},
  destroyed() {
    dynamicStore.cfDesignerEdit.unregister();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
