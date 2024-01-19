<template>
  <el-dialog
    v-if="data"
    width="900px"
    class="dialog-container"
    :visible.sync="isShowDialog"
    title="配置值来源（valueFrom）"
    append-to-body
  >
    <el-form style="padding: 0 20px;height: 450px;overflow: auto;">
      <el-form-item label="类型(type)">
        <el-select v-model="data.type" style="width: 300px" placeholder="请选择">
          <el-option v-for="(value, key) in typeDescMap" :key="key" :value="key" :label="value"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="data.type === 'condition'" class="group">
        <config-conditions ref="conditionRef" tip="（不设置条件时，直接返回 true）" :data="data"></config-conditions>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">移除配置</el-button>
      <el-button type="primary" @click="ok">应用配置</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ConfigConditions, { removeInvalidConditionConfig } from '../configConditions';
export default {
  components: { ConfigConditions },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      typeDescMap: {
        condition: '返回条件执行结果(condition)'
      },
      isShowDialog: false,
      data: null
    };
  },

  computed: {},
  watch: {
    visible(newV) {
      if (newV) {
        this.showDialog();
      }
    },
    isShowDialog(newV) {
      this.$emit('update:visible', newV);
    }
  },
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    showDialog() {
      const data = this.value || {};
      this.data = Object.assign(this.getDefaultConfig(), JSON.parse(JSON.stringify(data)));
      this.isShowDialog = true;
    },
    getDefaultConfig() {
      return {
        type: 'condition',
        conditions: [],
        conditionType: 'every'
      };
    },
    cancel() {
      this.data = null;
      this.isShowDialog = false;
      this.$emit('change', null);
      console.log('cancel');
    },
    ok() {
      const o = this.data;
      if (!['condition'].includes(o.type)) {
        delete o.conditions;
        delete o.conditionType;
      }
      removeInvalidConditionConfig(o);
      this.$emit('change', o);
      this.isShowDialog = false;
      console.log('ok', o);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.dialog-container {
  >>> .el-form-item__label {
    max-width: 120px;
    line-height: 20px;
    word-break: break-word;
    text-align: left;
    padding-top: 7px;
  }
  >>> .el-form-item__content {
    margin-left: 120px;
    max-width: calc(100% - 160px);
  }
  .add {
    font-size: 14px;
    cursor: pointer;
    i {
      font-size: 16px;
      margin-right: 4px;
    }
  }
  .row-container {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 6px;

    > div {
      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }

  .del {
    position: relative;
    cursor: pointer;
    top: 6px;
    color: red;
    font-size: 22px;
  }
}
</style>
