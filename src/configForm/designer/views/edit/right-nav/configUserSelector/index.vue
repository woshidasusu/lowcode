<template>
  <div v-if="data">
    <el-form-item label="字段映射(id)">
      <el-input v-model="data.fieldConfig.id" placeholder="id"></el-input>
    </el-form-item>
    <el-form-item label="字段映射(name)">
      <el-input v-model="data.fieldConfig.name" placeholder="name"></el-input>
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
  methods: {}
};
</script>

<style lang="scss" scoped></style>
