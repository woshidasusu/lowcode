<template>
  <div v-if="data">
    <el-form-item v-if="data.name" label="分组类型">
      <el-select v-model="type" placeholder="请选择分组类型" @change="onTypeChange">
        <el-option label="对象" value="object"></el-option>
        <el-option label="数组" value="array"></el-option>
      </el-select>
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
    return {
      type: 'object'
    };
  },
  computed: {},
  watch: {
    data: {
      handler: function(newV) {
        if (Array.isArray(newV.value)) {
          this.type = 'array';
        }
      },
      immediate: true
    }
  },
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    onTypeChange(type) {
      if (this.data.name) {
        // 有设置表单字段时，分组数据类型才有意义，才需要去设置上
        this.data.value = {
          object: {},
          array: []
        }[type];
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
