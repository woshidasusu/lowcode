<template>
  <div v-if="data">
    <el-form-item label="最多上传数量">
      <el-input-number v-model="data.maxNum" placeholder="最多上传数量"></el-input-number>
    </el-form-item>
    <el-form-item label="最大上传大小(MB)">
      <el-input-number v-model="data.maxSize" placeholder="单位 MB"></el-input-number>
    </el-form-item>
    <el-form-item label="上传到oss的存储目录，以模块命名区分">
      <el-input v-model="data.ossFolder" placeholder="建议以模块命名"></el-input>
    </el-form-item>
    <el-form-item label="字段映射(original)">
      <el-input v-model="data.fieldConfig.original" placeholder="original"></el-input>
    </el-form-item>
    <el-form-item label="字段映射(preview)">
      <el-input v-model="data.fieldConfig.preview" placeholder="preview"></el-input>
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
