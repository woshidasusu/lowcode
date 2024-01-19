<template>
  <div class="layout-container">
    <div class="top-container">
      <span style="margin-right: 20px" class="title">{{ '编辑' }} - {{ code }} - {{ name }}</span>
      <el-button type="text" @click="showMetadata = true">查看元数据</el-button>
      <el-button type="text" @click="doPreview">预览</el-button>
      <el-button type="text" @click="showStaged = true">暂存</el-button>
    </div>
    <left-nav @quickAdd="onQuickAdd"></left-nav>
    <right-nav></right-nav>
    <div class="content-container">
      <draggable-container
        v-if="metadata"
        id="mainDraggableContainer"
        ref="draggableRef"
        style="flex-grow: 1"
        :data="metadata.components"
      ></draggable-container>
    </div>
    <el-drawer title="元数据" :visible.sync="showMetadata" size="60%">
      <div style="margin: 0 24px">
        <el-button type="text" @click="getCode">生成前端元数据代码</el-button>
        <el-button type="text" @click="doCopy">复制</el-button>
        <el-button type="text" @click="doTransform">
          格式转换成 JSON 字符串（提供给后端去写 sql 更新服务端元数据）
        </el-button>
      </div>
      <div class="code drawer-container">{{ metadata }}</div>
    </el-drawer>
    <el-drawer title="预览" :visible.sync="showPreview" :size="'95%'">
      <div class="preview-container">
        <m-config-form
          v-if="showPreview && metadata"
          ref="previewConfigFormRef"
          class="drawer-container"
          :metadata="metadata"
          :data-service-data="dataServiceData"
        ></m-config-form>
        <div class="model-container">
          <p>表单数据</p>
          {{ previewFormModel }}
        </div>
      </div>
    </el-drawer>

    <el-dialog class="dialog-container" :visible.sync="showStaged" title="暂存" append-to-body>
      <el-form style="padding: 0 20px;">
        <el-form-item label="name">
          <el-input
            v-model="stagedData.name"
            style="width: 80%"
            placeholder="暂存本地的 name，需唯一，会覆盖本地同 name 的数据"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showStaged = false">取消</el-button>
        <el-button type="primary" @click="onStaged">暂存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mConfigForm from '@src/configForm';
import dataServiceDataList from '../../config/data-service-data-list';
import leftNav from './left-nav/index.vue';
import rightNav from './right-nav/index.vue';
import dynamicStore from '@src/store/dynamic-store';
import DraggableContainer from './components/draggable-container.vue';
import moment from 'moment';
import { copyAtClipboard } from '@src/utils/tools';
export default {
  components: {
    mConfigForm,
    leftNav,
    rightNav,
    DraggableContainer
  },
  props: {},
  data() {
    return {
      dataServiceData: null,
      showMetadata: false,
      showPreview: false,
      originMetadata: null,
      showStaged: false,
      stagedData: {
        name: ''
      },
      update: 1
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed([
      'edit.uid',
      'edit.pageType',
      'edit.code',
      'edit.name',
      'edit.metadata',
      'edit.curDragComponent',
      'edit.curEditComponent'
    ]),
    previewFormModel() {
      if (this.update) {
        const formModel = this.$refs.previewConfigFormRef?.getStore()?.state()?.formModel;
        return formModel;
      }
      return '';
    }
  },
  watch: {},
  async mounted() {
    this.uid = 1;
    const type = this.$route.query?.type;
    this.pageType = type || 'formPage';
    let data = localStorage.getItem('__metadata');
    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }
    if (data.isLocal) {
      this.stagedData = data;
    }
    this.dataServiceData = dataServiceDataList[data.dataServicePath] || {};
    this.code = data.code;
    this.name = data.name;
    this.originMetadata = data.metadata || {};
    this.adjustUid(this.originMetadata.components);
    if (type === 'listPage') {
      this.metadata = {
        type: 'listPage',
        store: {
          state: {}
        },
        dataSource: [],
        components: []
      };
    } else {
      this.metadata = {
        type: 'formPage',
        labelWidth: '130px',
        store: {
          state: {}
        },
        initFormMode: '',
        disableAll: '',
        dataSource: [],
        components: []
      };
    }
    Object.assign(this.metadata, this.originMetadata);
    if (['add_task'].includes(this.code)) {
      window.$kfApiSite = 'https://kf-api.test.myyscm.com';
      window.$useKfApiSite = 1;
    }
  },
  destroyed() {
    console.log('destroyed');
  },
  methods: {
    adjustUid(components = []) {
      let uid = this.uid;
      const stack = [...components];
      while (stack.length) {
        const cur = stack.pop();
        if (!Number.isNaN(+cur._id)) {
          uid = Math.max(uid, +cur._id);
        }
        if (cur.components?.length) {
          stack.push(...cur.components);
        }
      }
      this.uid = uid + 1;
      console.log('adjustUid() - uid：', this.uid);
    },
    onQuickAdd() {
      console.log('onQuickAdd', this.curDragComponent.type);
      this.$refs.draggableRef.onQuickAdd();
    },
    onStaged() {
      let data = localStorage.getItem('customer_metadata_list');
      if (data) {
        data = JSON.parse(data);
      } else {
        data = [];
      }
      const find = data.find(v => v.name === this.stagedData.name);
      const stagedData = {
        isLocal: 1,
        name: this.stagedData.name,
        last_modify: moment().format('YYYY-MM-DD HH:mm'),
        metadata: this.metadata,
        type: this.metadata.type
      };
      if (find) {
        Object.assign(find, stagedData);
      } else {
        data.push(stagedData);
      }
      localStorage.setItem('customer_metadata_list', JSON.stringify(data));
      localStorage.setItem('__metadata', JSON.stringify(stagedData));
      this.showStaged = false;
      this.$message.success('暂存成功');
    },
    getCode() {
      let text = '/**\n* 可以通过运行 npm run dev-config-form，在配置化平台上可视化拖拽，也可手动维护';
      text += '\n* 提供给后端时，需先把数据转成标准 json，再序列化成字符串，不清楚可以直接在配置化平台上操作';
      text += '\n*/\n';
      text += 'export default ';
      copyAtClipboard(text + JSON.stringify(this.metadata, ' ', 2));
      this.$message.success('代码生成并复制成功');
    },
    doCopy() {
      copyAtClipboard(JSON.stringify(this.metadata));
      this.$message.success('复制成功');
    },
    doTransform() {
      let data = JSON.stringify(JSON.stringify(this.metadata));
      data = `'${data.substring(1, data.length - 1)}'`;
      copyAtClipboard(data);
      this.$message.success('格式转换并复制成功');
    },
    async doPreview() {
      this.showPreview = true;
      await this.$nextTick();
      this.update++;
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
  user-select: none;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .top-container {
    position: fixed;
    width: 100%;
    height: 70px;
    top: 0;
    padding-top: 20px;
    background: #fff;
    z-index: 999;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    margin: 0 350px;
    margin-top: 55px;
    padding: 20px;
    box-shadow: 0 2px 13px 0 #ebeef5;
    min-height: calc(100vh - 100px);
  }
}
.border-bottom {
  &::after {
    content: '';
    display: block;
    margin: 10px 0;
    border-bottom: 1px solid #ebeef5;
  }
}
.code {
  white-space: pre-wrap;
  max-height: 100%;
  overflow: auto;
}
.group-container {
  border-top: 1px solid #ebeef5;
  padding: 15px 0;
  font-size: 15px;
  font-weight: bold;
  color: #333333;
}
.drawer-container {
  padding: 24px;
  overflow: auto;
  max-height: calc(100vh - 120px);
  user-select: text;
}
.preview-container {
  display: flex;

  .drawer-container {
    max-width: 60%;
    min-width: 50%;
    flex-shrink: 0;
    flex-grow: 1;
  }

  .model-container {
    border-left: 1px solid #dcdcdc;
    margin-left: 24px;
    padding: 0 24px;
    max-width: 30%;
    overflow: auto;
    word-break: break-all;
    white-space: pre-wrap;
    max-height: calc(100vh - 120px);
    user-select: text;
  }
}
</style>
