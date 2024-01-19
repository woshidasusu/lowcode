<template>
  <el-popover v-model="isVisible" trigger="click" width="300">
    <div class="content-container">
      <div class="content">
        <el-input v-model="id" style="margin-right: 10px" size="medium"></el-input>
      </div>
      <div class="footer-btns">
        <el-button size="medium" style="margin-right: 10px" @click="handlePopCancel">取消</el-button>
        <el-button size="medium" type="primary" @click="handleOk">确认</el-button>
      </div>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
<script>
import dynamicStore from '@src/store/dynamic-store';
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      id: 0,
      isVisible: false
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed(['edit.metadata'])
  },
  watch: {
    value: {
      handler: function(newV) {
        this.id = newV;
      },
      immediate: true
    }
  },
  beforeCreate() {},
  async created() {},
  async mounted() {},
  methods: {
    handlePopCancel() {
      this.id = '';
      this.isVisible = false;
    },
    handleOk() {
      // 校验 id 唯一性
      const metadata = JSON.stringify(this.metadata);
      const ids = metadata.match(/_id":\s*"?(.+?)"?,/g);
      const used = {};
      ids.forEach(v => {
        const id = v.match(/_id":\s*"?(.+?)"?,/)[1];
        used[id] = 1;
      });
      if (used[this.id]) {
        this.$message.error('id 重复，请修改 id');
        return;
      }
      this.$emit('change', this.id);
      this.handlePopCancel();
    }
  }
};
</script>
<style lang="scss" scoped>
.content-container {
  padding-top: 10px;
  color: #333333;

  .content {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    > span {
      color: #999999;
      flex-shrink: 0;
      margin-right: 18px;
    }
  }

  .footer-btns {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
}
</style>
