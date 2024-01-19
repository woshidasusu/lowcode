<template>
  <div v-if="data">
    <el-form-item label="设置列数">
      <el-input-number
        :value="data.components.length"
        :min="2"
        placeholder="设置列数"
        @change="onColumnChange(data, $event)"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="设置每列宽度">
      <br />
      <div style="display: flex">
        <el-input
          v-for="i in data.components.length"
          :key="i"
          :value="data.itemWidth && data.itemWidth[i - 1]"
          style="margin-right: 4px"
          :placeholder="'calc(' + 100 / data.components.length + '% - 30px)'"
          @input="onItemWidthChange(i - 1, $event)"
        ></el-input>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    onColumnChange(item, column) {
      if (item.components.length < column) {
        for (let i = 0; i < column - item.components.length; i++) {
          item.components.push([]);
        }
      } else if (item.components.length > column) {
        const count = item.components.length - column;
        item.components.splice(column, count);
      }
    },
    onItemWidthChange(i, width) {
      if (!this.data.itemWidth) {
        this.$set(this.data, 'itemWidth', []);
      }
      this.$set(this.data.itemWidth, i, width);
    }
  }
};
</script>

<style lang="scss" scoped></style>
