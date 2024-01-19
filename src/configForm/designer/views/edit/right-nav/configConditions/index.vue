<template>
  <div>
    <el-form-item :label="label" :label-width="labelWidth">
      <el-select v-model="data.conditionType" placeholder="默认满足全部条件">
        <el-option label="满足全部条件" value="every"></el-option>
        <el-option label="满足任意条件" value="some"></el-option>
      </el-select>
      <a v-if="data.conditions" style="margin-left: 12px" class="add" @click.stop="onAdd">
        <i class=" el-icon-circle-plus-outline"></i>添加条件({{ data.conditions.length }})
      </a>
      <span style="margin-left: 12px" class="desc">{{ tip }}</span>
      <div v-for="(item, i) in data.conditions" :key="i" class="item-container item-space">
        <el-select v-model="item.type" style="width: 220px" placeholder="请选择">
          <el-option v-for="(value, key) in typeDescMap" :key="key" :value="key" :label="value"></el-option>
        </el-select>

        <template v-if="item.type === 'expression'">
          <el-select v-model="item.expression" placeholder="请选择">
            <el-option v-for="(value, key) in expressionTypeMap" :key="key" :value="key" :label="value"></el-option>
          </el-select>
          <el-button type="text" @click="showDataSourceDialog(item, 'leftDataSource')">
            配置左操作数
          </el-button>
          <el-button
            v-if="!['empty', 'notEmpty'].includes(item.expression)"
            type="text"
            @click="showDataSourceDialog(item, 'rightDataSource')"
          >
            配置右操作数
          </el-button>
        </template>
        <template v-if="item.type === 'execFunction'">
          <el-input
            v-model="item.functionBody"
            placeholder="请输入函数体代码，接收参数 args: { $event: eventData }"
          ></el-input>
        </template>
        <template v-if="item.type === 'grayPublish'">
          <el-input v-model="item.code" style="width: 200px" placeholder="灰度开关code"></el-input>
          <el-input v-model="item.value" style="width: 200px" placeholder="期望的灰度开关取值"></el-input>
        </template>
        <template v-if="item.type === 'dataService'">
          <el-input v-model="item.serviceName" style="width: 200px" placeholder="函数名"></el-input>
          <el-button type="text" @click="showParamDialog(item)">
            配置参数
            <span v-if="item.params && item.params.length">(已设置)</span>
          </el-button>
        </template>
        <i title="删除" class="del el-icon-remove" @click="onRemove(i)"></i>
      </div>
    </el-form-item>
    <config-params
      :visible.sync="isShowParamDialog"
      :value="curEditCondition && curEditCondition.params"
      @change="onParamConfiged"
    ></config-params>
    <config-data-source
      :visible.sync="isShowDataSourceDialog"
      :value="curEditCondition && curEditCondition[curDataSourceKey]"
      @change="onDataSourceConfiged"
    ></config-data-source>
  </div>
</template>

<script>
import ConfigParams from '../configParams';
import ConfigDataSource from '../configDataSource';

export function removeInvalidConditionConfig(o) {
  o.conditions = o.conditions.map(v => {
    const data = { ...v };
    if (!['grayPublish'].includes(v.type)) {
      delete data.code;
      delete data.value;
    }
    if (!['execFunction'].includes(v.type)) {
      delete data.functionBody;
    }
    if (!['expression'].includes(v.type)) {
      delete data.expression;
      delete data.leftDataSource;
      delete data.rightDataSource;
    }
    if (['empty', 'notEmpty'].includes(v.expression)) {
      delete data.rightDataSource;
    }
    if (!['dataService'].includes(v.type)) {
      delete data.serviceName;
      delete data.params;
    }
    return data;
  });
  console.log('removeInvalidConfig', o);
}

export default {
  components: { ConfigParams, ConfigDataSource },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          conditions: [],
          conditionType: 'every'
        };
      }
    },
    tip: {
      type: String,
      default: '（不设置条件时，直接执行初始化行为）'
    },
    label: {
      type: String,
      default: '满足条件规则'
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      typeDescMap: {
        expression: '执行表达式(expression)',
        grayPublish: '灰度开关控制(grayPublish)',
        execFunction: '执行函数体代码(execFunction)',
        dataService: '调用自定义函数(dataService)'
      },
      expressionTypeMap: {
        '==': '等于(==)',
        '===': '严格等于(===)',
        '!=': '不等于(!=)',
        '!==': '严格不等于(!==)',
        empty: '判空',
        notEmpty: '非空判断'
      },
      isShowParamDialog: false,
      isShowDataSourceDialog: false,
      curEditCondition: null,
      curDataSourceKey: ''
    };
  },

  computed: {},
  watch: {},
  created() {},
  async mounted() {},
  destroyed() {},
  methods: {
    onAdd() {
      this.data.conditions.push(this.getDefaultConfig());
    },
    onRemove(i) {
      this.data.conditions.splice(i, 1);
    },
    getDefaultConfig() {
      return {
        type: 'expression',
        expression: '',
        leftDataSource: {
          type: 'formModel'
        },
        rightDataSource: {
          type: 'constant',
          value: ''
        },
        functionBody: '',
        serviceName: '',
        params: [],
        code: '',
        value: ''
      };
    },
    showParamDialog(data) {
      this.curEditCondition = data;
      this.isShowParamDialog = true;
    },
    onParamConfiged(params) {
      this.curEditCondition.params = params;
    },
    showDataSourceDialog(data, key) {
      this.curEditCondition = data;
      this.curDataSourceKey = key;
      this.isShowDataSourceDialog = true;
    },
    onDataSourceConfiged(data) {
      this.curEditCondition[this.curDataSourceKey] = data;
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

  .group {
    padding: 6px 10px;
    border: 1px dashed #dcdfe6;
    margin-bottom: 14px;
    position: relative;
    .del {
      position: absolute;
      cursor: pointer;
      color: red;
      top: 0px;
      right: 0px;
      font-size: 22px;
    }
  }

  .item-container {
    position: relative;
    margin-top: 10px;
    padding-right: 24px;
    display: flex;
    .del {
      top: 5px;
    }

    &:hover {
      background: #f0f0f0;
    }
    >>> .el-select {
      max-width: 240px7;
    }
  }
}
.item-space {
  > div,
  > a,
  > span {
    &:not(:last-child) {
      margin-right: 12px;
    }
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
