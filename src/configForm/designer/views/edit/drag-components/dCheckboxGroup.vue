<template>
  <div>
    <el-checkbox-group v-model="value" :disabled="!!+data.disabled">
      <el-checkbox> 选项1 </el-checkbox>
      <el-checkbox> 选项2 </el-checkbox>
      <el-checkbox> 选项3 </el-checkbox>
      <el-checkbox> ... </el-checkbox>
    </el-checkbox-group>
    <span v-if="data.tip" class="tip-text"> {{ data.tip }}</span>
  </div>
</template>

<script>
export default {
  components: { },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: ''
    };
  },
  computed: {},
  watch: {},
  async mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.tip-text {
  font-size: 14px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
</style>
