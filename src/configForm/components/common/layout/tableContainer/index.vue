<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    :total="total"
    :page="page"
    :page-size="pageSize"
    :default-columns="formTemplate.defaultColumns || ['index']"
    v-bind="formTemplate.$props"
    @pageChange="loadDataByPage"
    v-on="onEvents"
  >
    <template v-if="formTemplate.operateBtnSlot && formTemplate.operateBtnSlot.slotName" #operateBtn="data">
      <slot
        :name="formTemplate.operateBtnSlot.slotName"
        :metadata="formTemplate.operateBtnSlot"
        :form-model="formModel"
        :table-data="data"
      ></slot>
    </template>
    <template v-for="(item, i) in tableColumns">
      <el-table-column
        v-if="item.slotName || (item.headerSlot && item.headerSlot.slotName)"
        :key="item.prop || item.slotName || i"
        v-bind="item"
      >
        <template v-if="item.headerSlot && item.headerSlot.slotName" #header>
          <slot :name="item.headerSlot.slotName" :metadata="item.headerSlot" :form-model="formModel"></slot>
        </template>
        <template v-if="item.slotName" slot-scope="scope">
          <slot :name="item.slotName" :metadata="item" :row="scope.row" :form-model="formModel"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else :key="item.prop || i" :prop="item.prop" v-bind="item"></el-table-column>
    </template>
  </el-table>
</template>

<script>
/**
 * 表格容器
 */
export default {
  components: {},
  inject: ["getStore"],
  props: {
    metadata: {
      type: Object,
      require: true
    },
    formModel: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    },
    // 在 formModel 中，父级的字段名
    parentModelName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      page: 1,
      updateColumnStatus: 1
    };
  },
  computed: {
    formTemplate() {
      return this.metadata || {};
    },
    onEvents() {
      const events = {};
      if (this.metadata?._id) {
        this.metadata?.$on?.forEach(v => {
          events[v] = this.handleEvent.bind(this, v, this.metadata._id);
        });
      }
      return events;
    },
    coreProcessor() {
      return this.getStore()?.state()?.coreProcessor;
    },
    pageSize() {
      return this.formTemplate.pageSize || 10;
    },
    grayPublish() {
      return this.$store.state.app.grayPublish || {};
    },
    tableColumns() {
      const columns = (this.formTemplate.components || [])
        .filter(column => !+column.deleted)
        .map(column => {
          // 处理显示逻辑
          let hidden = column.hidden;
          if (column.showWhen) {
            hidden = !Object.keys(column.showWhen).every(key => {
              if (Array.isArray(column.showWhen[key])) {
                // 解析数组
                const [expression, value, ...orValues] = column.showWhen[key];
                switch (expression) {
                  case ">":
                    return this.formModel[key] > value || orValues.some(v => this.formModel[key] > v);
                  case ">=":
                    return this.formModel[key] >= value || orValues.some(v => this.formModel[key] >= v);
                  case "<":
                    return this.formModel[key] < value || orValues.some(v => this.formModel[key] < v);
                  case "<=":
                    return this.formModel[key] <= value || orValues.some(v => this.formModel[key] <= v);
                  case "==":
                    return this.formModel[key] == value || orValues.some(v => this.formModel[key] == v);
                  case "===":
                    return this.formModel[key] === value || orValues.some(v => this.formModel[key] === v);
                  case "!=":
                    return this.formModel[key] != value || orValues.some(v => this.formModel[key] != v);
                  case "!==":
                    return this.formModel[key] !== value || orValues.some(v => this.formModel[key] !== v);
                  case "grayPublish":
                    return this.grayPublish[key] === value || orValues.some(v => this.grayPublish[key] === v);
                  default:
                    return true;
                }
              } else {
                return this.formModel[key] === column.showWhen[key];
              }
            });
          }

          return {
            ...column,
            hidden
          };
        })
        .filter(v => !+v.hidden);
      return this.updateColumnStatus && columns;
    }
  },
  watch: {
    "formTemplate.refreshEvent": {
      handler: function (newV) {
        this.loadDataByPage();
      }
    },
    "formTemplate.updateCloumnsEvent": {
      handler: function (newV) {
        this.updateColumnStatus++;
      }
    }
  },
  mounted() {
    this.loadDataByPage();
  },
  methods: {
    // 处理子组件上抛的事件，参数包括：事件类型，表单项_id，回传的数据
    handleComponentEvent(...args) {
      this.$emit("event", ...args);
    },
    handleEvent(event, _id, eventData) {
      this.$emit("event", event, _id, eventData);
    },
    async loadDataByPage(page = 1) {
      if (this.formTemplate._id) {
        this.handleEvent("pageChange", this.formTemplate._id, page);
      }
      if (!this.formTemplate.dataSource) {
        console.error("[tableContainer] 未配置 dataSource");
        return;
      }
      const isAsyncFetchTotal = this.formTemplate.asyncTotalDataSource?.type != null;
      if (isAsyncFetchTotal) {
        this.asyncFetchTotaL();
      }
      this.loading = true;
      this.page = page;
      let res = {};
      try {
        const { dataSource } = this.formTemplate;
        dataSource.params = dataSource.params || [];
        dataSource.params.push(
          ...[
            {
              type: "constant",
              key: "page",
              value: page
            },
            {
              type: "constant",
              key: "pageSize",
              value: this.pageSize
            }
          ]
        );
        res = await this.coreProcessor.parseDataSource(dataSource);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
      if (res.errcode === 0 && res.data) {
        this.tableData = res.data.items || res.data.item || [];
        if (!isAsyncFetchTotal) {
          this.total = res.data.total;
        }
      } else {
        if (!isAsyncFetchTotal) {
          this.total = 0;
        }
        this.tableData = [];
      }
      if (this.formTemplate._id) {
        this.handleEvent("dataChange", this.formTemplate._id, res.data);
      }
      if (!isAsyncFetchTotal) {
        if (this.formTemplate._id) {
          this.handleEvent("totalChange", this.formTemplate._id, res.data);
        }
      }
    },
    async asyncFetchTotaL() {
      let res = {};
      try {
        const { asyncTotalDataSource } = this.formTemplate;
        res = await this.coreProcessor.parseDataSource(asyncTotalDataSource);
      } catch (error) {
        console.error(error);
      }
      if (res.errcode === 0 && res.data) {
        this.total = res.data.total;
      } else {
        this.total = 0;
      }
      if (this.formTemplate._id) {
        this.handleEvent("totalChange", this.formTemplate._id, res.data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
</style>
