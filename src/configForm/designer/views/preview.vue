<template>
  <div class="layout-container">
    <div style="margin-bottom: 20px">
      <span class="title">{{ title || '预览' }} - {{ code }} - {{ name }}</span>
    </div>
    <div>
      <m-config-form v-if="metadata" :metadata="metadata" :data-service-data="dataServiceData"></m-config-form>
    </div>
  </div>
</template>

<script>
import mConfigForm from '@src/configForm';
import dataServiceDataList from '../config/data-service-data-list';
export default {
  components: {
    mConfigForm
  },
  props: {},
  data() {
    return {
      type: 'local',
      title: '',
      metadata: null,
      dataServiceData: null,
      code: '',
      name: ''
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    const type = this.$route.query?.type;
    this.type = type;
    let data = localStorage.getItem('__metadata');
    data = JSON.parse(data);
    this.dataServiceData = dataServiceDataList[data.dataServicePath] || {};
    this.code = data.code;
    this.name = data.name;
    if (type === 'local') {
      this.title = '预览本地';
      this.metadata = data?.metadata;
    } else if (type === 'remote') {
      this.title = '预览服务器';
      this.metadata = JSON.parse(data?.standard);
    }
  },
  destroyed() {},
  methods: {}
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
