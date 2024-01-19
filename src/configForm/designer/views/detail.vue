<template>
  <div class="layout-container">
    <div style="margin-bottom: 20px">
      <span class="title">{{ title || '元数据' }}</span>
      <div style="margin-left: 20px">
        <el-button type="text" @click="getCode">生成前端元数据代码</el-button>
        <el-button type="text" @click="doCopy">复制</el-button>
        <el-button v-if="type === 'local'" type="text" @click="doTransform"
          >格式转换成 JSON 字符串（提供给后端去写 sql 更新服务端元数据）</el-button
        >
      </div>
    </div>
    <div class="code">{{ metadata }}</div>
  </div>
</template>

<script>
import { copyAtClipboard } from '@src/utils/tools';
export default {
  components: {},
  props: {},
  data() {
    return {
      type: 'local',
      title: '',
      metadata: ''
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    const type = this.$route.query?.type;
    this.type = type;
    let data = localStorage.getItem('__metadata');
    data = JSON.parse(data);
    if (type === 'local') {
      this.title = '本地元数据';
      this.metadata = JSON.stringify(data?.metadata, ' ', 2);
    } else if (type === 'remote') {
      this.title = '服务器元数据';
      this.metadata = JSON.stringify(JSON.parse(data?.standard), ' ', 2);
    }
  },
  destroyed() {},
  methods: {
    getCode() {
      let text = '/**\n* 可以通过运行 npm run dev-config-form，在配置化平台上可视化拖拽，也可手动维护';
      text += '\n* 提供给后端时，需先把数据转成标准 json，再序列化成字符串，不清楚可以直接在配置化平台上操作';
      text += '\n*/\n';
      text += 'export default ';
      copyAtClipboard(text + this.metadata);
      this.$message.success('代码生成并复制成功');
    },
    doCopy() {
      copyAtClipboard(JSON.stringify(JSON.parse(this.metadata)));
      this.$message.success('复制成功');
    },
    doTransform() {
      let data = JSON.stringify(JSON.stringify(JSON.parse(this.metadata)));
      data = `'${data.substring(1, data.length - 1)}'`;
      copyAtClipboard(data);
      this.$message.success('格式转换并复制成功');
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.layout-container {
  background: #fff;
  min-height: 100vh;
  padding: 20px 40px;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .code {
    white-space: pre-wrap;
  }
}
</style>
